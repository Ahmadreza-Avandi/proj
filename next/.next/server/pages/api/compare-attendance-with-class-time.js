"use strict";(()=>{var e={};e.id=3311,e.ids=[3311],e.modules={62418:e=>{e.exports=require("mysql2/promise")},20145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},56249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},99045:(e,t,a)=>{a.r(t),a.d(t,{config:()=>m,default:()=>d,routeModule:()=>E});var n={};a.r(n),a.d(n,{default:()=>l});var r=a(71802),s=a(47153),i=a(56249),o=a(62418),u=a.n(o);let c={connectionString:process.env.DATABASE_URL||"mysql://root:@localhost:3306/proj"};async function l(e,t){if("GET"!==e.method)return t.setHeader("Allow","GET"),t.status(405).json({message:"Method not allowed"});let{classId:a,subjectId:n,jalaliDate:r}=e.query;if(!a||!n||!r)return t.status(400).json({message:"کلاس، درس و تاریخ الزامی هستند"});try{let e=await u().createConnection(c.connectionString),s=`
      SELECT 
        id,
        name,
        TIME_FORMAT(startTime, '%H:%i:%s') as startTime,
        TIME_FORMAT(endTime, '%H:%i:%s') as endTime
      FROM subject 
      WHERE id = ?
    `,[i]=await e.execute(s,[n]);if(0===i.length)return await e.end(),t.status(404).json({message:"درس یافت نشد"});let o=i[0],l=`
      SELECT 
        a.id,
        a.nationalCode,
        a.fullName,
        a.checkin_time,
        a.status,
        a.subjectId,
        CASE 
          WHEN TIME(a.checkin_time) BETWEEN TIME(?) AND TIME(?) THEN 'در زمان'
          WHEN TIME(a.checkin_time) < TIME(?) THEN 'زودتر'
          ELSE 'دیرتر'
        END as time_status
      FROM attendance a
      WHERE a.jalali_date = ? 
      AND a.classId = ?
      AND (a.subjectId = ? OR a.subjectId IS NULL)
      AND a.status = 'present'
      ORDER BY a.checkin_time
    `,[d]=await e.execute(l,[o.startTime,o.endTime,o.startTime,r,a,n]),m={subjectInfo:o,totalStudents:d.length,onTime:d.filter(e=>"در زمان"===e.time_status).length,early:d.filter(e=>"زودتر"===e.time_status).length,late:d.filter(e=>"دیرتر"===e.time_status).length};return await e.end(),t.status(200).json({subject:o,attendance:d,stats:m})}catch(e){return console.error("Error comparing attendance with class time:",e),t.status(500).json({message:"Internal server error",error:e instanceof Error?e.message:"Unknown error"})}}let d=(0,i.l)(n,"default"),m=(0,i.l)(n,"config"),E=new r.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/compare-attendance-with-class-time",pathname:"/api/compare-attendance-with-class-time",bundlePath:"",filename:""},userland:n})},47153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},71802:(e,t,a)=>{e.exports=a(20145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var a=t(t.s=99045);module.exports=a})();