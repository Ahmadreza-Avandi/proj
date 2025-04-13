"use strict";(()=>{var e={};e.id=2969,e.ids=[2969],e.modules={62418:e=>{e.exports=require("mysql2/promise")},20145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},56249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},54543:(e,t,r)=>{r.r(t),r.d(t,{config:()=>f,default:()=>d,routeModule:()=>m});var s={};r.r(s),r.d(s,{default:()=>l});var n=r(71802),a=r(47153),o=r(56249),i=r(62418),u=r.n(i);let c={connectionString:process.env.DATABASE_URL||"mysql://root:@localhost:3306/proj"};async function l(e,t){if("GET"!==e.method)return t.setHeader("Allow","GET"),t.status(405).json({message:"Method not allowed"});let{classId:r,dayOfWeek:s}=e.query;try{let e=await u().createConnection(c.connectionString),n=`
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
      WHERE 1=1
    `,a=[];r&&(n+=" AND s.classId = ?",a.push(r)),s&&(n+=" AND s.dayOfWeek = ?",a.push(s)),n+=" ORDER BY s.name ASC";let[o]=await e.execute(n,a);return await e.end(),t.status(200).json(o)}catch(e){return console.error("Error fetching subjects:",e),t.status(500).json({message:"Internal server error",error:e instanceof Error?e.message:"Unknown error"})}}let d=(0,o.l)(s,"default"),f=(0,o.l)(s,"config"),m=new n.PagesAPIRouteModule({definition:{kind:a.x.PAGES_API,page:"/api/subjects",pathname:"/api/subjects",bundlePath:"",filename:""},userland:s})},47153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},71802:(e,t,r)=>{e.exports=r(20145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var r=t(t.s=54543);module.exports=r})();