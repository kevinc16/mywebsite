import{S as g,P as L,R as v,W as E,s as b,a as M,M as O,b as A,A as C,G as S,O as P,V as z,c as w}from"./vendor.d91c309f.js";const F=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&c(d)}).observe(document,{childList:!0,subtree:!0});function n(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerpolicy&&(o.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?o.credentials="include":t.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(t){if(t.ep)return;t.ep=!0;const o=n(t);fetch(t.href,o)}};F();const p=3e-4,u=new g,a=new L(75,window.innerWidth/window.innerHeight,.1,1e3),m=new v,r=new E;r.setSize(window.innerWidth,window.innerHeight);r.domElement.className="container-fluid";document.body.appendChild(r.domElement);function G(){const e=document.getElementsByClassName("desc")[0];e.classList.contains("hidden")?e.classList.remove("hidden"):e.classList.add("hidden")}function N(){const e=r.domElement,s=e.clientWidth,n=e.clientHeight;(e.width!==s||e.height!==n)&&(r.setSize(s,n,!1),a.aspect=s/n,a.updateProjectionMatrix())}function R(e,s,n,c,t){t=t===void 0?!1:t,t&&e.parent.localToWorld(e.position),e.position.sub(s),e.position.applyAxisAngle(n,c),e.position.add(s),t&&e.parent.worldToLocal(e.position),e.rotateOnAxis(n,c)}const f=new z;function H(e){f.x=e.clientX/window.innerWidth*2-1,f.y=-(e.clientY/window.innerHeight)*2+1}function T(){r.outputEncoding=b,a.position.z=5;const e=new M(.03),s=new O({color:16777215}),n=new A(e,s);n.position.set(.2,1.45,1.4),n.addEventListener("onclick",()=>{n.scale.set(1.5,1.5,1.5)}),u.add(n);const c=new C("white");u.add(c);const t=new S;let o;t.load("../assets/a_windy_day/scene.gltf",function(i){return i.scene.scale.set(2,2,2),o=i.scene,u.add(o),console.log(i),i.scene},void 0,function(i){console.error(i)}),document.addEventListener("click",()=>{m.setFromCamera(f,a);const i=m.intersectObjects([n]),l=i.find(y=>y.object.uuid===n.uuid);console.log(i),l&&G()},!1);const d=new P(a,r.domElement);d.enableZoom=!1;function h(){requestAnimationFrame(h),o&&(o.rotation.y+=p),m.setFromCamera(f,a);const i=m.intersectObjects([n]);n.material.color.set("white");for(let l=0;l<i.length;l++)i[l].object.material.color.set(16711680);R(n,new w(0,0,0),new w(0,1,0),p,!0),d.update(),N(),r.render(u,a)}window.addEventListener("mousemove",H,!1),h()}T();