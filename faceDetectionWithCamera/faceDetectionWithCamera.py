#!/usr/bin/env python3
# faceDetectionWithCamera.py

import cv2
import numpy as np
import mysql.connector
import redis
from datetime import datetime
from persiantools.jdatetime import JalaliDateTime
import schedule
import logging

# تنظیمات لاگینگ
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# --------------------- کلاس مدیریت دوربین‌ها ---------------------
class CameraManager:
    def __init__(self):
        self.cameras = []  # لیست دوربین‌ها
        self.grid_size = (2, 2)  # تعداد ردیف و ستون در نمایش گرید
        self.active_cam = -1     # -1 یعنی نمایش گرید، غیر از -1 یعنی نمایش تمام صفحه یک دوربین
        self.window_name = "Face Recognition System"
        self.last_click = 0
        self.click_delay = 500   # میلی‌ثانیه

        # دیکشنری روزهای هفته فارسی
        self.persian_days = {
            0: "شنبه",
            1: "یکشنبه",
            2: "دوشنبه",
            3: "سه‌شنبه",
            4: "چهارشنبه",
            5: "پنج‌شنبه",
            6: "جمعه"
        }

        # بارگذاری Haar Cascade جهت تشخیص چهره
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )

        # بارگذاری مدل تشخیص چهره – استفاده از LBPH
        try:
            if not hasattr(cv2, 'face'):
                raise AttributeError("ماژول cv2.face موجود نیست. لطفاً opencv-contrib-python را نصب کنید.")
            self.face_recognizer = cv2.face.LBPHFaceRecognizer_create()
            model_path = "trainer/model.xml"
            self.face_recognizer.read(model_path)
            logger.info("مدل تشخیص چهره از %s بارگذاری شد.", model_path)
        except Exception as e:
            logger.error("خطا در بارگذاری مدل تشخیص چهره: %s", e)
            self.face_recognizer = None

        # اتصال به دیتابیس MySQL (پایگاه داده: test)
        try:
            self.db = mysql.connector.connect(
                host='localhost',
                database='proj',
                user='root',
                password=''
            )
            logger.info("اتصال به دیتابیس MySQL برقرار شد.")
        except mysql.connector.Error as err:
            logger.error("خطا در اتصال به دیتابیس: %s", err)
            self.db = None

        # اتصال به Redis (اختیاری)
        try:
            self.redis_db = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
            logger.info("اتصال به Redis برقرار شد.")
        except Exception as e:
            logger.error("خطا در اتصال به Redis: %s", e)
            self.redis_db = None

        # دیکشنری جهت جلوگیری از ثبت مکرر حضور (به مدت 2 ساعت)
        self.last_checkin = {}

    def add_camera(self, name, source, location):
        """
        اضافه کردن دوربین به سیستم.
        پارامتر source می‌تواند عدد (مثلاً 0 برای وبکم) یا آدرس استریم (RTSP) باشد.
        """
        cap = cv2.VideoCapture(source)
        if cap.isOpened():
            # تشخیص اینکه آیا منبع، دوربین داخلی است یا خارجی
            is_external = not (isinstance(source, int) and source == 0)
            self.cameras.append({
                'cap': cap,
                'name': name,
                'location': location,
                'frame': None,
                'is_external': is_external
            })
            logger.info("دوربین '%s' در '%s' فعال شد.", name, location)
        else:
            logger.error("خطا در باز کردن دوربین '%s'.", name)
            cap.release()

    def adjust_focal_distance(self, frame, zoom_factor=1.5):
        """
        شبیه‌سازی زوم دیجیتال برای دوربین‌های خارجی با بریدن مرکز تصویر.
        """
        h, w = frame.shape[:2]
        new_w = int(w / zoom_factor)
        new_h = int(h / zoom_factor)
        x1 = (w - new_w) // 2
        y1 = (h - new_h) // 2
        cropped = frame[y1:y1+new_h, x1:x1+new_w]
        adjusted = cv2.resize(cropped, (640, 480))
        return adjusted

    def process_faces(self, frame, location):
        """
        پردازش فریم:
          - تبدیل به تصویر خاکستری.
          - تشخیص چهره‌ها.
          - در صورت کوچک بودن چهره (به علت فاصله از لنز) تصویر چهره بزرگ‌نمایی می‌شود.
          - پیش‌بینی برچسب با استفاده از مدل آموزش‌دیده.
          - ثبت حضور در صورت تشخیص با اطمینان کافی.
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # استفاده از minSize کوچکتر جهت تشخیص چهره‌های دور
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(20, 20))
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            face_roi = gray[y:y+h, x:x+w]

            # اگر چهره کوچک باشد، بزرگ‌نمایی می‌شود
            if w < 100 or h < 100:
                try:
                    face_roi = cv2.resize(face_roi, (w*2, h*2), interpolation=cv2.INTER_CUBIC)
                except Exception as e:
                    logger.error("خطا در بزرگنمایی تصویر چهره: %s", e)

            if self.face_recognizer is not None:
                try:
                    label, confidence = self.face_recognizer.predict(face_roi)
                    # تنظیم آستانه دقت (مثلاً confidence کمتر از 100)
                    if confidence < 100:
                        national_code = str(label)
                        self.log_attendance(national_code, location)
                    else:
                        logger.debug("چهره با دقت کافی شناسایی نشد (confidence: %s).", confidence)
                except Exception as e:
                    logger.error("خطا در پیش‌بینی چهره: %s", e)
        return cv2.resize(frame, (640, 480))

    def log_attendance(self, national_code, location):
        """ثبت حضور دانش آموز در دیتابیس"""
        if self.db is None:
            logger.error("اتصال به دیتابیس برقرار نیست")
            return
        
        now = datetime.now()
        jalali_date = JalaliDateTime.now()
        
        try:
            with self.db.cursor() as cursor:
                # دریافت اطلاعات کاربر و کلاس
                cursor.execute("""
                    SELECT u.fullName, u.classId, c.name as className 
                    FROM user u 
                    LEFT JOIN class c ON u.classId = c.id 
                    WHERE u.nationalCode = %s
                """, (national_code,))
                
                user_info = cursor.fetchone()
                if not user_info:
                    logger.error(f"کاربر با کد ملی {national_code} یافت نشد")
                    return
                    
                full_name, class_id, class_name = user_info
                
                # تعیین روز هفته به فارسی
                day_of_week = self.persian_days[jalali_date.weekday()]
                
                # تبدیل تاریخ جلالی به فرمت مورد نیاز
                jalali_date_str = jalali_date.strftime("%Y/%m/%d")  # مثال: 1402/01/15
                
                # بررسی تکراری نبودن حضور در روز جاری
                cursor.execute("""
                    SELECT id FROM attendance 
                    WHERE nationalCode = %s 
                    AND gregorian_date = CURDATE()
                """, (national_code,))
                
                attendance_record = cursor.fetchone()
                if attendance_record:
                    # آپدیت رکورد موجود
                    cursor.execute("""
                        UPDATE attendance 
                        SET checkin_time = %s, 
                            location = %s,
                            status = 'present'
                        WHERE id = %s
                    """, (
                        now.strftime('%H:%M:%S'),
                        class_name or location,
                        attendance_record[0]
                    ))
                    self.db.commit()
                    logger.info(f"رکورد حضور برای {full_name} به‌روزرسانی شد")
                else:
                    # استفاده از نام کلاس به عنوان لوکیشن اگر موجود باشد
                    actual_location = class_name if class_name else location
                        
                    # ثبت حضور جدید
                    cursor.execute("""
                        INSERT INTO attendance (
                            nationalCode, 
                            fullName,
                            classId,
                            className, 
                            jalali_date,           -- تاریخ جلالی
                            gregorian_date,        -- تاریخ میلادی
                            checkin_time,
                            location,
                            dayOfWeek,
                            status
                        ) VALUES (%s, %s, %s, %s, %s, CURDATE(), %s, %s, %s, 'present')
                    """, (
                        national_code,
                        full_name,
                        class_id,
                        class_name,
                        jalali_date_str,          # تاریخ جلالی
                        now.strftime('%H:%M:%S'), # زمان ورود
                        actual_location,
                        day_of_week
                    ))
                    
                    self.db.commit()
                    logger.info(f"حضور برای {full_name} در کلاس {class_name} ثبت شد")
                
                # آپدیت last_seen
                self.update_last_seen(national_code, full_name, now, class_name or location)
                
        except mysql.connector.Error as err:
            logger.error(f"خطای دیتابیس: {err}")
            self.db.rollback()

    def update_last_seen(self, national_code, full_name, timestamp, location):
        """به‌روزرسانی آخرین وضعیت مشاهده کاربر"""
        try:
            jalali_datetime = JalaliDateTime.now().strftime("%Y/%m/%d %H:%M:%S")
            
            with self.db.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO last_seen 
                    (nationalCode, fullName, checkin_time, location)
                    VALUES (%s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                    fullName = VALUES(fullName),
                    checkin_time = VALUES(checkin_time),
                    location = VALUES(location)
                """, (
                    national_code,
                    full_name,
                    jalali_datetime,
                    location
                ))
                self.db.commit()
                logger.info(f"last_seen برای {full_name} به‌روزرسانی شد")
        except mysql.connector.Error as err:
            logger.error(f"خطا در به‌روزرسانی last_seen: {err}")
            self.db.rollback()

    def update_frames(self):
        """
        به‌روز رسانی فریم‌های هر دوربین:
          - دریافت فریم از دوربین.
          - اعمال تنظیم فاصله کانونی برای دوربین‌های خارجی.
          - پردازش فریم جهت تشخیص چهره.
          - در صورت عدم دریافت فریم، استفاده از یک فریم سیاه.
        """
        for cam in self.cameras:
            ret, frame = cam['cap'].read()
            if ret:
                if cam.get('is_external', False):
                    frame = self.adjust_focal_distance(frame, zoom_factor=1.5)
                cam['frame'] = self.process_faces(frame, cam['location'])
            else:
                cam['frame'] = np.zeros((480, 640, 3), dtype=np.uint8)

    def toggle_fullscreen(self, x, y):
        """
        تغییر حالت نمایش از گرید به تمام صفحه و بالعکس با دابل کلیک ماوس.
        """
        current_time = cv2.getTickCount()
        if (current_time - self.last_click) * 1000 / cv2.getTickFrequency() < self.click_delay:
            return

        if self.active_cam == -1:
            # تعیین دوربین کلیک‌شده بر اساس مختصات (با فرض ابعاد ثابت هر فریم 640x480 و فاصله 10 پیکسل)
            col = x // (640 + 10)
            row = y // (480 + 10)
            idx = row * self.grid_size[1] + col
            if idx < len(self.cameras):
                self.active_cam = idx
        else:
            self.active_cam = -1
        self.last_click = current_time

    def show_interface(self):
        """
        نمایش رابط کاربری:
          - در حالت تمام صفحه، فریم یک دوربین نمایش داده می‌شود.
          - در حالت گرید، فریم‌های تمام دوربین‌ها به صورت شبکه‌ای نمایش داده می‌شود.
        """
        if self.active_cam != -1:
            frame = self.cameras[self.active_cam]['frame']
            cv2.imshow(self.window_name, frame)
        else:
            if not self.cameras:
                black_frame = np.zeros((480, 640, 3), dtype=np.uint8)
                cv2.imshow(self.window_name, black_frame)
                return

            grid_frames = []
            for i in range(0, len(self.cameras), self.grid_size[1]):
                row_frames = [cam['frame'] if cam['frame'] is not None
                              else np.zeros((480, 640, 3), dtype=np.uint8)
                              for cam in self.cameras[i:i+self.grid_size[1]]]
                while len(row_frames) < self.grid_size[1]:
                    row_frames.append(np.zeros((480, 640, 3), dtype=np.uint8))
                grid_frames.append(np.hstack(row_frames))
            final_grid = np.vstack(grid_frames[:self.grid_size[0]])
            cv2.imshow(self.window_name, final_grid)

# --------------------- تابع اصلی ---------------------
def main():
    manager = CameraManager()

    # اضافه کردن دوربین‌ها:
    manager.add_camera("دوربین لپتاپ", 0, "لپتاپ")
    # مثال اضافه کردن دوربین خارجی (در صورت وجود):
    #manager.add_camera(" 12 مکا", "rtsp://admin:@192.168.1.168:80/ch0_0.264", "12 مکا")

    # زمان‌بندی پاکسازی دیکشنری حضور (هر 2 ساعت) جهت جلوگیری از ثبت مکرر
    schedule.every(2).hours.do(manager.last_checkin.clear)

    # تنظیم رویداد ماوس برای تغییر حالت نمایش (دابل کلیک)
    def mouse_handler(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDBLCLK:
            manager.toggle_fullscreen(x, y)

    cv2.namedWindow(manager.window_name, cv2.WINDOW_NORMAL)
    cv2.setMouseCallback(manager.window_name, mouse_handler)

    try:
        while True:
            manager.update_frames()
            manager.show_interface()
            schedule.run_pending()
            if cv2.waitKey(1) == 27:  # خروج با کلید ESC
                break
    finally:
        for cam in manager.cameras:
            cam['cap'].release()
        cv2.destroyAllWindows()
        if manager.db:
            manager.db.close()

if __name__ == '__main__':
    main()
