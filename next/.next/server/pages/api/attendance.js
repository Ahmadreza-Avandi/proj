"use strict";(()=>{var e={};e.id=7015,e.ids=[7015],e.modules={62418:e=>{e.exports=require("mysql2/promise")},20145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},56249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},99593:(e,t,a)=>{a.r(t),a.d(t,{config:()=>j,default:()=>O,routeModule:()=>C});var s={};a.r(s),a.d(s,{default:()=>m});var n=a(71802),o=a(47153),r=a(56249),i=a(62418),l=a.n(i);let c=require("react-multi-date-picker"),d=require("react-date-object/calendars/persian");var u=a.n(d);let E=require("react-date-object/calendars/gregorian");var N=a.n(E);let T={connectionString:process.env.DATABASE_URL||"mysql://user:userpassword@mysql:3306/mydatabase"},I=["شنبه","یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنج‌شنبه","جمعه"];function A(e){try{let t=e.split("/");return I[(new c.DateObject({calendar:u(),year:parseInt(t[0]),month:parseInt(t[1]),day:parseInt(t[2])}).convert(N()).toDate().getDay()+1)%7]}catch(e){return console.error("Error calculating Persian day of week:",e),""}}async function m(e,t){if("GET"===e.method){let{classId:a,date:s,mode:n,attendanceFilter:o,subjectId:r}=e.query;try{let e=await l().createConnection(T.connectionString);if(a&&s){console.log("Received date from frontend:",s),console.log("Received class ID:",a),console.log("Received subject ID:",r),console.log("Attendance filter:",o);let n=A(s),i=`
          SELECT 
            s.id, 
            s.name,
            TIME_FORMAT(s.startTime, '%H:%i:%s') as startTime,
            TIME_FORMAT(s.endTime, '%H:%i:%s') as endTime,
            s.dayOfWeek
          FROM subject s
          WHERE s.classId = ? AND s.dayOfWeek = ?
          ORDER BY s.startTime ASC
        `,[l]=await e.execute(i,[a,n]);console.log("Found subjects:",l);let c="",d=[];try{r?(c=`
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
            `,d=[r,s,r,s,s,r,s,r,s,a],"present"===o?c+=" HAVING status = 'present'":"absent"===o&&(c+=" HAVING status = 'absent'")):(c=`
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
            `,d=[s,s,s,s,s,a,n,s,a,n,s,a,n,a],"present"===o?c=`
                SELECT * FROM (${c}) AS filtered_students
                WHERE present_count = total_subjects AND total_subjects > 0
              `:"absent"===o&&(c=`
                SELECT * FROM (${c}) AS filtered_students
                WHERE present_count < total_subjects OR total_subjects = 0
              `)),c+=" ORDER BY fullName ASC",console.log("Executing student query:",c),console.log("Executing student query with params:",d);let[i]=await e.execute(c,d);console.log(`Found ${i.length} students`);let u=`
            SELECT u.id, u.fullName, u.nationalCode, u.roleId, r.name as roleName, u.classId, c.name as className
            FROM user u
            JOIN class c ON u.classId = c.id
            LEFT JOIN role r ON u.roleId = r.id
            WHERE u.classId = ?
          `,[E]=await e.execute(u,[a]);return console.log("All users in this class:",E),await e.end(),t.status(200).json({students:i,subjects:l,dayOfWeek:n})}catch(e){return console.error("SQL Query execution error:",e),t.status(500).json({message:"خطا در اجرای کوئری SQL",error:e instanceof Error?e.message:"خطای نامشخص",query:"string"==typeof c?c:"کوئری موجود نیست",params:void 0!==d?d:[]})}}return t.status(400).json({message:"پارامترهای لازم ارسال نشده است"})}catch(e){return console.error("Error fetching attendance data:",e),t.status(500).json({message:"Internal server error",error:e instanceof Error?e.message:"Unknown error"})}}else{if("PATCH"!==e.method)return t.setHeader("Allow",["GET","PATCH"]),t.status(405).json({message:"Method not allowed"});let{id:a,status:s,userId:n,nationalCode:o,fullName:r,classId:i,className:d,jalali_date:E,dayOfWeek:I,subjectId:m}=e.body;if(console.log("PATCH request received:",{id:a,status:s,nationalCode:o,jalali_date:E,dayOfWeek:I,subjectId:m}),!s)return t.status(400).json({message:"وضعیت الزامی است"});try{let e=await l().createConnection(T.connectionString),O=new Date,j=E||new c.DateObject({calendar:u(),date:O}).format("YYYY/MM/DD"),C=new c.DateObject({calendar:u(),date:j,format:"YYYY/MM/DD"}).convert(N()).format("YYYY-MM-DD"),D=new Date().toTimeString().split(" ")[0],R=I||A(j),b=o,M=r,g=i,f=d;if(!b||!M){let a=`
          SELECT u.nationalCode, u.fullName, u.classId, c.name as className
          FROM user u
          LEFT JOIN class c ON u.classId = c.id
          WHERE u.id = ?
        `,[s]=await e.execute(a,[n]);if(!(s.length>0))return await e.end(),t.status(404).json({message:"کاربر یافت نشد"});b=s[0].nationalCode,M=s[0].fullName,g=s[0].classId,f=s[0].className}if(console.log("User info:",{userNationalCode:b,userFullName:M,userClassId:g,userClassName:f}),0!==a)return await e.execute("UPDATE attendance SET status = ? WHERE id = ?",[s,a]),m&&console.log(`بروزرسانی رکورد حضور برای درس با آیدی ${m}`),await e.end(),t.status(200).json({message:"وضعیت با موفقیت به‌روزرسانی شد",id:a});{let a=`
          SELECT id FROM attendance 
          WHERE nationalCode = ? AND jalali_date = ?
        `,n=[b,j];m?(a+=" AND subjectId = ?",n.push(m)):a+=" AND (subjectId IS NULL)",console.log("Check query:",a),console.log("Check params:",n);let[o]=await e.execute(a,n);if(console.log("Existing rows:",o),o.length>0){let a=`
            UPDATE attendance 
            SET status = ? 
            WHERE id = ?
          `;return await e.execute(a,[s,o[0].id]),m&&console.log(`وضعیت حضور برای درس با آیدی ${m} بروز شد`),await e.end(),t.status(200).json({message:"وضعیت با موفقیت به‌روزرسانی شد",id:o[0].id})}{let a=`
            INSERT INTO attendance 
            (nationalCode, fullName, classId, className, jalali_date, gregorian_date, checkin_time, location, dayOfWeek, status
          `;m&&(a+=", subjectId"),a+=") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?",m&&(a+=", ?"),a+=")";let n=[b,M,g||null,f||null,j,C,D,"سیستم مدیریت",R,s];m&&(n.push(m),console.log(`ایجاد رکورد حضور برای درس با آیدی ${m}`)),console.log("Insert query:",a),console.log("Insert params:",n);let[o]=await e.execute(a,n),r=o.insertId;return await e.end(),t.status(201).json({message:"رکورد حضور ایجاد شد",id:r})}}}catch(e){return console.error("Error updating attendance status:",e),t.status(500).json({message:"Internal server error",error:e instanceof Error?e.message:"Unknown error"})}}}let O=(0,r.l)(s,"default"),j=(0,r.l)(s,"config"),C=new n.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/attendance",pathname:"/api/attendance",bundlePath:"",filename:""},userland:s})},47153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},71802:(e,t,a)=>{e.exports=a(20145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var a=t(t.s=99593);module.exports=a})();