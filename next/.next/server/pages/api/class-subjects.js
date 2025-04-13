"use strict";(()=>{var e={};e.id=6709,e.ids=[6709],e.modules={62418:e=>{e.exports=require("mysql2/promise")},20145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},56249:(e,s)=>{Object.defineProperty(s,"l",{enumerable:!0,get:function(){return function e(s,t){return t in s?s[t]:"then"in s&&"function"==typeof s.then?s.then(s=>e(s,t)):"function"==typeof s&&"default"===t?s:void 0}}})},7358:(e,s,t)=>{t.r(s),t.d(s,{config:()=>m,default:()=>l,routeModule:()=>f});var r={};t.r(r),t.d(r,{default:()=>d});var n=t(71802),a=t(47153),o=t(56249),i=t(62418),u=t.n(i);let c={connectionString:process.env.DATABASE_URL||"mysql://user:userpassword@mysql:3306/mydatabase"};async function d(e,s){if("GET"!==e.method)return s.setHeader("Allow","GET"),s.status(405).json({message:"Method not allowed"});let{classId:t,dayOfWeek:r}=e.query;if(!t||!r)return s.status(400).json({message:"کلاس و روز هفته الزامی هستند"});try{let e=await u().createConnection(c.connectionString),n=`
      SELECT 
        s.id,
        s.name,
        s.classId,
        s.teacherId,
        s.dayOfWeek,
        s.startTime,
        s.endTime,
        c.name as className,
        u.fullName as teacherName
      FROM subject s
      LEFT JOIN class c ON s.classId = c.id
      LEFT JOIN user u ON s.teacherId = u.id
      WHERE s.classId = ? AND s.dayOfWeek = ?
      ORDER BY s.startTime ASC
    `,[a]=await e.execute(n,[t,r]);return await e.end(),s.status(200).json(a)}catch(e){return console.error("Error fetching class subjects:",e),s.status(500).json({message:"Internal server error",error:e instanceof Error?e.message:"Unknown error"})}}let l=(0,o.l)(r,"default"),m=(0,o.l)(r,"config"),f=new n.PagesAPIRouteModule({definition:{kind:a.x.PAGES_API,page:"/api/class-subjects",pathname:"/api/class-subjects",bundlePath:"",filename:""},userland:r})},47153:(e,s)=>{var t;Object.defineProperty(s,"x",{enumerable:!0,get:function(){return t}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(t||(t={}))},71802:(e,s,t)=>{e.exports=t(20145)}};var s=require("../../webpack-api-runtime.js");s.C(e);var t=s(s.s=7358);module.exports=t})();