"use strict";(()=>{var e={};e.id=3563,e.ids=[3563],e.modules={62418:e=>{e.exports=require("mysql2/promise")},20145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},56249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,n){return n in t?t[n]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,n)):"function"==typeof t&&"default"===n?t:void 0}}})},81093:(e,t,n)=>{n.r(t),n.d(t,{config:()=>f,default:()=>d,routeModule:()=>P});var r={};n.r(r),n.d(r,{default:()=>c});var s=n(71802),o=n(47153),a=n(56249),u=n(62418),i=n.n(u);let l={connectionString:process.env.DATABASE_URL||"mysql://root:@localhost:3306/proj"};async function c(e,t){if("GET"!==e.method)return t.setHeader("Allow","GET"),t.status(405).json({message:"Method not allowed"});let{classId:n}=e.query;if(!n)return t.status(400).json({message:"شناسه کلاس الزامی است"});try{let e=await i().createConnection(l.connectionString),r=`
      SELECT 
        u.id,
        u.nationalCode,
        u.fullName,
        c.name as className
      FROM user u
      JOIN class c ON u.classId = c.id
      WHERE u.classId = ? AND u.roleId = 3
      ORDER BY u.fullName ASC
    `,[s]=await e.execute(r,[n]);return await e.end(),t.status(200).json(s)}catch(e){return console.error("Error fetching students by class:",e),t.status(500).json({message:"Internal server error",error:e instanceof Error?e.message:"Unknown error"})}}let d=(0,a.l)(r,"default"),f=(0,a.l)(r,"config"),P=new s.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/students-by-class",pathname:"/api/students-by-class",bundlePath:"",filename:""},userland:r})},47153:(e,t)=>{var n;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return n}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(n||(n={}))},71802:(e,t,n)=>{e.exports=n(20145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var n=t(t.s=81093);module.exports=n})();