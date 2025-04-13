"use strict";(()=>{var e={};e.id=3138,e.ids=[3138],e.modules={62418:e=>{e.exports=require("mysql2/promise")},20145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},56249:(e,r)=>{Object.defineProperty(r,"l",{enumerable:!0,get:function(){return function e(r,a){return a in r?r[a]:"then"in r&&"function"==typeof r.then?r.then(r=>e(r,a)):"function"==typeof r&&"default"===a?r:void 0}}})},92220:(e,r,a)=>{a.r(r),a.d(r,{config:()=>c,default:()=>m,routeModule:()=>p});var n={};a.r(n),a.d(n,{default:()=>d});var o=a(71802),t=a(47153),s=a(56249),u=a(62418),i=a.n(u);let l={connectionString:process.env.DATABASE_URL||"mysql://root:@localhost:3306/proj"};async function d(e,r){if("GET"!==e.method)return r.setHeader("Allow","GET"),r.status(405).json({message:"Method not allowed"});try{let{classId:a,roleId:n}=e.query,o=await i().createConnection(l.connectionString),t=`
      SELECT 
        u.id,
        u.fullName,
        u.nationalCode,
        u.phoneNumber,
        u.roleId,
        r.name as roleName,
        r.permissions,
        c.name as className,
        m.name as majorName,
        g.name as gradeName
      FROM user u
      LEFT JOIN role r ON u.roleId = r.id
      LEFT JOIN class c ON u.classId = c.id
      LEFT JOIN major m ON u.majorId = m.id
      LEFT JOIN grade g ON u.gradeId = g.id
    `,s=[],u=[];a&&(u.push("u.classId = ?"),s.push(a)),n&&(u.push("u.roleId = ?"),s.push(n)),u.length>0&&(t+=" WHERE "+u.join(" AND "));let[d]=await o.execute(t,s);await o.end();let m=d.map(e=>({id:e.id,fullName:e.fullName,nationalCode:e.nationalCode,phoneNumber:e.phoneNumber,roleId:e.roleId,role:{id:e.roleId,name:e.roleName,permissions:e.permissions},className:e.className,majorName:e.majorName,gradeName:e.gradeName,classId:null}));return r.status(200).json(m)}catch(e){return console.error("Error fetching users:",e),r.status(500).json({message:"Internal server error"})}}let m=(0,s.l)(n,"default"),c=(0,s.l)(n,"config"),p=new o.PagesAPIRouteModule({definition:{kind:t.x.PAGES_API,page:"/api/user.view",pathname:"/api/user.view",bundlePath:"",filename:""},userland:n})},47153:(e,r)=>{var a;Object.defineProperty(r,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},71802:(e,r,a)=>{e.exports=a(20145)}};var r=require("../../webpack-api-runtime.js");r.C(e);var a=r(r.s=92220);module.exports=a})();