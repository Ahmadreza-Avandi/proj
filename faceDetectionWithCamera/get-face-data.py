#!/usr/bin/env python3
import os
import base64
import json
import logging
import numpy as np
import cv2
import redis
from flask import Flask, request, jsonify
from flask_cors import CORS
from persiantools.jdatetime import JalaliDateTime
import boto3
from botocore.exceptions import NoCredentialsError

# --------------------- تنظیمات اولیه ---------------------
# ایجاد پوشه‌های مورد نیاز برای ذخیره مدل و لیبل‌ها
os.makedirs("trainer", exist_ok=True)
os.makedirs("labels", exist_ok=True)

# پیکربندی لاگ
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
try:
    redis_client = redis.StrictRedis(host=REDIS_HOST, port=6379, db=0, decode_responses=True)
    redis_client.ping()
    logging.info("اتصال به Redis با موفقیت برقرار شد.")
except Exception as e:
    logging.error("خطا در اتصال به Redis: %s", e)
    exit(1)

# تنظیم Flask و CORS
app = Flask(__name__)
CORS(app)

# مسیرهای Haar Cascade برای تشخیص چهره و چشم
HAAR_CASCADE_PATHS = {
    "face": "assets/face_detection/haarcascade_frontalface_default.xml",
    "eye": "assets/face_detection/haarcascade_eye.xml"
}
for key, path in HAAR_CASCADE_PATHS.items():
    if not os.path.exists(path):
        raise FileNotFoundError(f"فایل Haar Cascade برای {key} در مسیر {path} یافت نشد.")

face_cascade = cv2.CascadeClassifier(HAAR_CASCADE_PATHS["face"])
eye_cascade = cv2.CascadeClassifier(HAAR_CASCADE_PATHS["eye"])

# --------------------- تنظیمات فضای ابری لیارا ---------------------
LIARA_ACCESS_KEY = 'u2cgc3ev1i29tmeg'
LIARA_SECRET_KEY = '46c86213-2684-4421-9c1d-7d96cb22ac14'
LIARA_BUCKET_NAME = 'photo-attendance-system'
LIARA_ENDPOINT_URL = 'https://storage.c2.liara.space'

s3_client = boto3.client('s3',
                         aws_access_key_id=LIARA_ACCESS_KEY,
                         aws_secret_access_key=LIARA_SECRET_KEY,
                         endpoint_url=LIARA_ENDPOINT_URL)


# --------------------- توابع کمکی ---------------------
def upload_to_liara(national_code, color_image_data):
    """آپلود تصویر رنگی به فضای ابری لیارا"""
    try:
        folder_name = "user_register"
        file_name = f"{folder_name}/{national_code}.jpg"
        s3_client.put_object(Bucket=LIARA_BUCKET_NAME, Key=file_name, Body=color_image_data, ContentType='image/jpeg')
        logging.info(f"تصویر رنگی برای کد ملی {national_code} در پوشه {folder_name} در لیارا ذخیره شد.")
    except NoCredentialsError:
        logging.error("مشکل در احراز هویت با لیارا.")
        raise ValueError("احراز هویت با لیارا انجام نشد.")
    except Exception as e:
        logging.error(f"خطا در آپلود به لیارا: {e}")
        raise ValueError("خطا در آپلود به فضای ابری.")


def base64_to_cv2_image(base64_str):
    """
    تبدیل رشته Base64 به تصویر OpenCV.
    در صورت وجود پیشوند Data URI آن را حذف می‌کند.
    """
    try:
        if ',' in base64_str:
            base64_str = base64_str.split(',')[1]
        img_data = base64.b64decode(base64_str)
        np_arr = np.frombuffer(img_data, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("تصویر نامعتبر است.")
        return image
    except Exception as e:
        logging.error("خطا در تبدیل Base64 به تصویر: %s", e)
        raise ValueError("عدم توانایی در تبدیل رشته Base64 به تصویر.")


def detect_and_validate_face(image):
    """
    تشخیص چهره در تصویر و اعتبارسنجی آن (حداقل دو چشم).
    بازگشت تصویر خاکستری و رنگی صورت تشخیص داده شده
    """
    try:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

        if len(faces) == 0:
            logging.warning("هیچ چهره‌ای در تصویر شناسایی نشد.")
            return None, None, None

        for (x, y, w, h) in faces:
            face_gray = gray[y:y + h, x:x + w]
            face_color = image[y:y + h, x:x + w]

            # تغییر اندازه به ابعاد ثابت
            resized_gray = cv2.resize(face_gray, (200, 200))
            resized_color = cv2.resize(face_color, (200, 200))

            # اعتبارسنجی چشم‌ها
            eyes = eye_cascade.detectMultiScale(resized_gray)
            if len(eyes) < 2:
                logging.warning("چهره شناسایی شده چشم‌های کافی ندارد.")
                continue

            return resized_gray, resized_color, (x, y, w, h)

        return None, None, None
    except Exception as e:
        logging.error("خطا در پردازش تصویر: %s", e)
        raise


def save_to_redis(national_code, full_name, face_image_gray):
    """
    ذخیره اطلاعات کاربر در Redis.
    """
    try:
        success, buffer = cv2.imencode('.jpg', face_image_gray)
        if not success:
            raise ValueError("خطا در رمزگذاری تصویر به JPEG.")

        face_base64 = base64.b64encode(buffer).decode('utf-8')
        data = {
            "nationalCode": national_code,
            "fullName": full_name,
            "faceImage": face_base64,
            "detectionTime": JalaliDateTime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        redis_client.set(national_code, json.dumps(data))
        logging.info("اطلاعات کاربر با کد ملی %s در Redis ذخیره شد.", national_code)
    except Exception as e:
        logging.error("خطا در ذخیره اطلاعات در Redis: %s", e)
        raise ValueError("ذخیره اطلاعات در Redis با خطا مواجه شد.")


def train_model():
    """
    آموزش مدل تشخیص چهره با استفاده از داده‌های ذخیره‌شده در Redis.
    """
    faces = []
    labels = []
    labels_to_name = {}

    for key in redis_client.scan_iter():
        try:
            value = redis_client.get(key)
            if not value:
                continue
            data = json.loads(value)
            face_base64 = data.get('faceImage')
            if not face_base64:
                continue

            img_data = base64.b64decode(face_base64)
            np_arr = np.frombuffer(img_data, np.uint8)
            face_img = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)

            if face_img is None:
                continue

            resized_face = cv2.resize(face_img, (100, 100))
            try:
                label_int = int(key)
            except ValueError:
                label_int = abs(hash(key)) % 100000

            faces.append(resized_face)
            labels.append(label_int)
            labels_to_name[label_int] = {
                "nationalCode": data.get("nationalCode"),
                "fullName": data.get("fullName")
            }
        except Exception as e:
            logging.error("خطا در پردازش داده‌های ذخیره‌شده برای کلید %s: %s", key, e)
            continue

    if faces and labels:
        try:
            model = cv2.face.LBPHFaceRecognizer_create()
            model.train(np.array(faces), np.array(labels))
            model_path = os.path.join("trainer", "model.xml")
            model.write(model_path)
            logging.info("مدل تشخیص چهره در %s ذخیره شد.", model_path)

            labels_path = os.path.join("labels", "labels_to_name.json")
            with open(labels_path, 'w', encoding='utf-8') as f:
                json.dump(labels_to_name, f, ensure_ascii=False, indent=4)
            logging.info("لیبل‌ها در %s ذخیره شدند.", labels_path)
        except Exception as e:
            logging.error("خطا در آموزش مدل: %s", e)
            raise
    else:
        logging.warning("داده‌ای جهت آموزش مدل یافت نشد.")


def validate_inputs(data):
    """
    اعتبارسنجی ورودی دریافتی از کلاینت.
    """
    required_fields = ["nationalCode", "image"]
    for field in required_fields:
        if field not in data or not data[field]:
            raise ValueError(f"فیلد {field} الزامی است.")
    return True


# --------------------- روت‌های API ---------------------
@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "success", "message": "سرور در حال اجراست."})


@app.route('/upload', methods=['POST'])
def upload_image():
    """
    دریافت تصویر و کد ملی از کلاینت
    """
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("داده‌های ورودی نامعتبر هستند.")
        validate_inputs(data)

        national_code = data["nationalCode"]
        full_name = data.get("fullName", "")
        image_data = data["image"]

        image = base64_to_cv2_image(image_data)
        face_gray, face_color, bbox = detect_and_validate_face(image)

        if face_gray is None:
            return jsonify({"status": "error", "message": "چهره معتبر در تصویر شناسایی نشد."}), 400

        # ذخیره تصویر خاکستری در Redis
        save_to_redis(national_code, full_name, face_gray)

        # ذخیره تصویر رنگی در لیارا
        _, buffer = cv2.imencode('.jpg', face_color)
        upload_to_liara(national_code, buffer.tobytes())

        # آموزش مدل
        train_model()

        return jsonify({"status": "success", "message": "تصویر پردازش شد، اطلاعات ذخیره و مدل به‌روز شد."})

    except ValueError as ve:
        logging.error("خطای ورودی: %s", ve)
        return jsonify({"status": "error", "message": str(ve)}), 400
    except Exception as e:
        logging.error("خطا در پردازش آپلود تصویر: %s", e)
        return jsonify({"status": "error", "message": "خطای سرور داخلی."}), 500


@app.route('/labels', methods=['GET'])
def get_labels():
    """
    دریافت لیبل‌های ذخیره‌شده
    """
    try:
        labels_path = os.path.join("labels", "labels_to_name.json")
        if not os.path.exists(labels_path):
            return jsonify({"status": "error", "message": "فایل لیبل یافت نشد."}), 404

        with open(labels_path, 'r', encoding='utf-8') as f:
            labels_data = json.load(f)

        return jsonify({"status": "success", "labels": labels_data})
    except Exception as e:
        logging.error("خطا در دریافت لیبل‌ها: %s", e)
        return jsonify({"status": "error", "message": "خطا در دریافت لیبل‌ها."}), 500


# --------------------- اجرای سرور ---------------------
if __name__ == '__main__':
    app.run(debug=True)