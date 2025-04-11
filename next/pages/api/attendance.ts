import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import gregorian from 'react-date-object/calendars/gregorian';

const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/proj',
};

// Persian weekday names
const persianWeekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

// Function to get Persian day of week from jalali date
function getPersianDayOfWeek(jalaliDateStr: string): string {
  try {
    // Parse the jalali date
    const dateParts = jalaliDateStr.split('/');
    const persianDate = new DateObject({
      calendar: persian,
      year: parseInt(dateParts[0]),
      month: parseInt(dateParts[1]),
      day: parseInt(dateParts[2]),
    });
    
    // Convert to gregorian to get day of week (0-6, with 0 being Sunday in JS)
    const gregorianDate = persianDate.convert(gregorian).toDate();
    
    // Adjust for Persian calendar where week starts on Saturday (6 in JS becomes 0 in Persian)
    const dayIndex = (gregorianDate.getDay() + 1) % 7;
    
    return persianWeekDays[dayIndex];
  } catch (error) {
    console.error('Error calculating Persian day of week:', error);
    return '';
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { classId, date, mode, attendanceFilter, subjectId } = req.query;
    
    try {
      const connection = await mysql.createConnection(dbConfig.connectionString);
      
      // حالت نمایش بر اساس تاریخ و کلاس
      if (classId && date) {
        console.log("Received date from frontend:", date);
        console.log("Received class ID:", classId);
        console.log("Received subject ID:", subjectId);
        console.log("Attendance filter:", attendanceFilter);
        
        const jalaliDateFormat = date as string;
        const calculatedDayOfWeek = getPersianDayOfWeek(jalaliDateFormat);
        
        // کوئری برای دریافت دروس مربوط به روز هفته و کلاس انتخاب شده
        const subjectsQuery = `
          SELECT 
            s.id, 
            s.name,
            TIME_FORMAT(s.startTime, '%H:%i:%s') as startTime,
            TIME_FORMAT(s.endTime, '%H:%i:%s') as endTime,
            s.dayOfWeek
          FROM subject s
          WHERE s.classId = ? AND s.dayOfWeek = ?
          ORDER BY s.startTime ASC
        `;
        
        const [subjects] = await connection.execute(subjectsQuery, [classId, calculatedDayOfWeek]);
        console.log("Found subjects:", subjects);
        
        // متغیرهای مورد نیاز برای کوئری - مقداردهی اولیه
        let studentsQuery = '';
        let queryParams: any[] = [];
        
        try {
          if (subjectId) {
            // کوئری برای حالتی که درس خاصی انتخاب شده است
            studentsQuery = `
              SELECT 
                u.id as userId,
                u.nationalCode,
                u.fullName,
                c.name as className,
                u.classId,
                COALESCE(
                  a.id, 
                  (
                    SELECT att.id 
                    FROM attendance att 
                    JOIN subject sbj ON sbj.id = ?
                    WHERE att.nationalCode = u.nationalCode 
                      AND att.jalali_date = ? 
                      AND att.subjectId IS NULL
                      AND TIME(att.checkin_time) BETWEEN TIME(sbj.startTime) AND TIME(sbj.endTime)
                    LIMIT 1
                  )
                ) as id,
                COALESCE(
                  TIME_FORMAT(a.checkin_time, '%H:%i:%s'),
                  (
                    SELECT TIME_FORMAT(att.checkin_time, '%H:%i:%s')
                    FROM attendance att
                    JOIN subject sbj ON sbj.id = ?
                    WHERE att.nationalCode = u.nationalCode 
                      AND att.jalali_date = ? 
                      AND att.subjectId IS NULL
                      AND TIME(att.checkin_time) BETWEEN TIME(sbj.startTime) AND TIME(sbj.endTime)
                    LIMIT 1
                  ),
                  ''
                ) as checkin_time,
                ? as jalali_date,
                COALESCE(
                  a.status,
                  CASE WHEN (
                    SELECT COUNT(*) 
                    FROM attendance att 
                    JOIN subject sbj ON sbj.id = ?
                    WHERE att.nationalCode = u.nationalCode 
                      AND att.jalali_date = ? 
                      AND att.subjectId IS NULL
                      AND TIME(att.checkin_time) BETWEEN TIME(sbj.startTime) AND TIME(sbj.endTime)
                      AND att.status = 'present'
                  ) > 0 THEN 'present' ELSE 'absent' END
                ) as status,
                s.id as subjectId,
                s.name as subjectName,
                0 as present_count, 
                0 as total_subjects
              FROM user u
              JOIN class c ON u.classId = c.id
              JOIN subject s ON s.id = ?
              LEFT JOIN attendance a ON a.nationalCode = u.nationalCode 
                AND a.jalali_date = ? 
                AND a.subjectId = s.id
              WHERE u.classId = ? 
                AND u.roleId = 3
            `;
            
            queryParams = [
              subjectId, jalaliDateFormat, 
              subjectId, jalaliDateFormat, 
              jalaliDateFormat,
              subjectId, jalaliDateFormat, 
              subjectId, jalaliDateFormat, 
              classId
            ];
            
            if (attendanceFilter === 'present') {
              studentsQuery += ` HAVING status = 'present'`;
            } else if (attendanceFilter === 'absent') {
              studentsQuery += ` HAVING status = 'absent'`;
            }
          } else {
            // کوئری برای نمایش همه دروس
            studentsQuery = `
              SELECT 
                u.id as userId,
                u.nationalCode,
                u.fullName,
                c.name as className,
                u.classId,
                (
                  SELECT id 
                  FROM attendance 
                  WHERE nationalCode = u.nationalCode 
                  AND jalali_date = ? 
                  AND subjectId IS NULL
                  LIMIT 1
                ) as id,
                (
                  SELECT MAX(TIME_FORMAT(checkin_time, '%H:%i:%s'))
                  FROM attendance
                  WHERE nationalCode = u.nationalCode 
                  AND jalali_date = ?
                ) as checkin_time,
                ? as jalali_date,
                'not_applicable' as status,
                (
                  SELECT GROUP_CONCAT(
                    CONCAT(
                      s.name, 
                      ' (', 
                      TIME_FORMAT(s.startTime, '%H:%i'),
                      '-',
                      TIME_FORMAT(s.endTime, '%H:%i'),
                      ') ',
                      CASE 
                        WHEN a.id IS NOT NULL THEN 
                          IF(a.status = 'present', '✓', '✗')
                        WHEN (
                          SELECT COUNT(*) 
                          FROM attendance att
                          WHERE att.nationalCode = u.nationalCode 
                            AND att.jalali_date = ? 
                            AND att.subjectId IS NULL
                            AND TIME(att.checkin_time) BETWEEN TIME(s.startTime) AND TIME(s.endTime)
                            AND att.status = 'present'
                        ) > 0 THEN '✓'
                        ELSE '❓'
                      END
                    )
                    ORDER BY s.startTime
                    SEPARATOR ' | '
                  )
                  FROM subject s
                  LEFT JOIN attendance a ON a.nationalCode = u.nationalCode 
                    AND a.jalali_date = ? 
                    AND a.subjectId = s.id
                  WHERE s.classId = ? 
                    AND s.dayOfWeek = ?
                ) as subjects_attended,
                (
                  SELECT COUNT(*)
                  FROM subject s
                  LEFT JOIN attendance a ON a.nationalCode = u.nationalCode 
                    AND a.jalali_date = ? 
                    AND a.subjectId = s.id
                    AND a.status = 'present'
                  WHERE s.classId = ? 
                    AND s.dayOfWeek = ?
                    AND (
                      a.id IS NOT NULL
                      OR 
                      EXISTS (
                        SELECT 1 
                        FROM attendance att
                        WHERE att.nationalCode = u.nationalCode 
                          AND att.jalali_date = ? 
                          AND att.subjectId IS NULL
                          AND TIME(att.checkin_time) BETWEEN TIME(s.startTime) AND TIME(s.endTime)
                          AND att.status = 'present'
                      )
                    )
                ) as present_count,
                (
                  SELECT COUNT(*)
                  FROM subject s
                  WHERE s.classId = ? 
                    AND s.dayOfWeek = ?
                ) as total_subjects
              FROM user u
              JOIN class c ON u.classId = c.id
              WHERE u.classId = ? AND u.roleId = 3
            `;
            
            queryParams = [
              jalaliDateFormat,
              jalaliDateFormat,
              jalaliDateFormat,
              jalaliDateFormat,
              jalaliDateFormat,
              classId,
              calculatedDayOfWeek,
              jalaliDateFormat,
              classId,
              calculatedDayOfWeek,
              jalaliDateFormat,
              classId,
              calculatedDayOfWeek,
              classId
            ];
            
            if (attendanceFilter === 'present') {
              studentsQuery = `
                SELECT * FROM (${studentsQuery}) AS filtered_students
                WHERE present_count = total_subjects AND total_subjects > 0
              `;
            } else if (attendanceFilter === 'absent') {
              studentsQuery = `
                SELECT * FROM (${studentsQuery}) AS filtered_students
                WHERE present_count < total_subjects OR total_subjects = 0
              `;
            }
          }
          
          studentsQuery += ` ORDER BY fullName ASC`;
          
          console.log("Executing student query:", studentsQuery);
          console.log("Executing student query with params:", queryParams);
          
          const [students] = await connection.execute(studentsQuery, queryParams);
          console.log(`Found ${(students as any[]).length} students`);
          
          // لاگ کردن کاربران موجود در دیتابیس با classId مشابه
          const debugUsersQuery = `
            SELECT u.id, u.fullName, u.nationalCode, u.roleId, r.name as roleName, u.classId, c.name as className
            FROM user u
            JOIN class c ON u.classId = c.id
            LEFT JOIN role r ON u.roleId = r.id
            WHERE u.classId = ?
          `;
          
          const [debugUsers] = await connection.execute(debugUsersQuery, [classId]);
          console.log("All users in this class:", debugUsers);
          
          await connection.end();
          
          return res.status(200).json({
            students,
            subjects,
            dayOfWeek: calculatedDayOfWeek
          });
        } catch (queryError) {
          console.error("SQL Query execution error:", queryError);
          return res.status(500).json({ 
            message: 'خطا در اجرای کوئری SQL', 
            error: queryError instanceof Error ? queryError.message : 'خطای نامشخص',
            query: typeof studentsQuery === 'string' ? studentsQuery : 'کوئری موجود نیست',
            params: typeof queryParams !== 'undefined' ? queryParams : []
          });
        }
      }

      return res.status(400).json({ message: 'پارامترهای لازم ارسال نشده است' });
    } catch (error: unknown) {
      console.error('Error fetching attendance data:', error);
      return res.status(500).json({ 
        message: 'Internal server error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else if (req.method === 'PATCH') {
    const { id, status, userId, nationalCode, fullName, classId, className, jalali_date, dayOfWeek, subjectId } = req.body;
    
    console.log("PATCH request received:", {
      id, status, nationalCode, jalali_date, dayOfWeek, subjectId
    });
    
    if (!status) {
      return res.status(400).json({ message: 'وضعیت الزامی است' });
    }
    
    try {
      const connection = await mysql.createConnection(dbConfig.connectionString);
      
      // استفاده از تاریخ ارسالی یا تاریخ امروز
      const today = new Date();
      const useJalaliDate = jalali_date || new DateObject({
        calendar: persian,
        date: today
      }).format('YYYY/MM/DD');
      
      // تبدیل تاریخ شمسی به میلادی برای ذخیره در دیتابیس
      const persianDate = new DateObject({
        calendar: persian,
        date: useJalaliDate,
        format: 'YYYY/MM/DD'
      });
      
      const gregorianDate = persianDate.convert(gregorian);
      const formattedGregorianDate = gregorianDate.format('YYYY-MM-DD');
      
      // تبدیل فرمت زمان از فرمت JavaScript به فرمت SQL TIME
      const currentTime = new Date().toTimeString().split(' ')[0];
      
      // محاسبه روز هفته اگر ارسال نشده باشد
      const useDayOfWeek = dayOfWeek || getPersianDayOfWeek(useJalaliDate);
      
      // ابتدا اطلاعات کاربر را دریافت می‌کنیم اگر در body نباشد
      let userNationalCode = nationalCode;
      let userFullName = fullName;
      let userClassId = classId;
      let userClassName = className;
      
      if (!userNationalCode || !userFullName) {
        const getUserQuery = `
          SELECT u.nationalCode, u.fullName, u.classId, c.name as className
          FROM user u
          LEFT JOIN class c ON u.classId = c.id
          WHERE u.id = ?
        `;
        const [userRows]: any = await connection.execute(getUserQuery, [userId]);
        
        if (userRows.length > 0) {
          userNationalCode = userRows[0].nationalCode;
          userFullName = userRows[0].fullName;
          userClassId = userRows[0].classId;
          userClassName = userRows[0].className;
        } else {
          await connection.end();
          return res.status(404).json({ message: 'کاربر یافت نشد' });
        }
      }
      
      console.log("User info:", {
        userNationalCode, userFullName, userClassId, userClassName
      });
      
      // اگر رکورد حضور وجود نداشت، ایجاد کنیم
      if (id === 0) {
        // بررسی وجود رکورد برای این روز
        let checkQuery = `
          SELECT id FROM attendance 
          WHERE nationalCode = ? AND jalali_date = ?
        `;
        
        let checkParams = [userNationalCode, useJalaliDate];
        
        if (subjectId) {
          checkQuery += ` AND subjectId = ?`;
          checkParams.push(subjectId);
        } else {
          // اگر درس انتخاب نشده، باید بررسی کنیم که آیا رکوردی بدون درس وجود دارد
          checkQuery += ` AND (subjectId IS NULL)`;
        }
        
        console.log("Check query:", checkQuery);
        console.log("Check params:", checkParams);
        
        const [existingRows]: any = await connection.execute(checkQuery, checkParams);
        console.log("Existing rows:", existingRows);
        
        if (existingRows.length > 0) {
          // آپدیت رکورد موجود
          const updateQuery = `
            UPDATE attendance 
            SET status = ? 
            WHERE id = ?
          `;
          await connection.execute(updateQuery, [status, existingRows[0].id]);
          
          // اگر درس خاصی انتخاب شده، فقط همان درس را بروزرسانی میکنیم
          if (subjectId) {
            console.log(`وضعیت حضور برای درس با آیدی ${subjectId} بروز شد`);
          }
          
          await connection.end();
          return res.status(200).json({ 
            message: 'وضعیت با موفقیت به‌روزرسانی شد',
            id: existingRows[0].id 
          });
        } else {
          // ایجاد رکورد جدید
          let insertQuery = `
            INSERT INTO attendance 
            (nationalCode, fullName, classId, className, jalali_date, gregorian_date, checkin_time, location, dayOfWeek, status
          `;
          
          if (subjectId) {
            insertQuery += `, subjectId`;
          }
          
          insertQuery += `) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?`;
          
          if (subjectId) {
            insertQuery += `, ?`;
          }
          
          insertQuery += `)`;
          
          const insertParams = [
            userNationalCode,
            userFullName,
            userClassId || null,
            userClassName || null,
            useJalaliDate,
            formattedGregorianDate,
            currentTime,
            'سیستم مدیریت',
            useDayOfWeek,
            status
          ];
          
          if (subjectId) {
            insertParams.push(subjectId);
            console.log(`ایجاد رکورد حضور برای درس با آیدی ${subjectId}`);
          }
          
          console.log("Insert query:", insertQuery);
          console.log("Insert params:", insertParams);
          
          const [result]: any = await connection.execute(insertQuery, insertParams);
          let insertedId = result.insertId;
          
          await connection.end();
          return res.status(201).json({ 
            message: 'رکورد حضور ایجاد شد',
            id: insertedId
          });
        }
      } else {
        // آپدیت رکورد موجود
        const updateQuery = `UPDATE attendance SET status = ? WHERE id = ?`;
        await connection.execute(updateQuery, [status, id]);
        
        // اگر درس انتخاب شده، فقط همان درس را بروزرسانی میکنیم
        if (subjectId) {
          console.log(`بروزرسانی رکورد حضور برای درس با آیدی ${subjectId}`);
        }
        
        await connection.end();
        return res.status(200).json({ 
          message: 'وضعیت با موفقیت به‌روزرسانی شد',
          id
        });
      }
    } catch (error: unknown) {
      console.error('Error updating attendance status:', error);
      return res.status(500).json({ 
        message: 'Internal server error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PATCH']);
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
