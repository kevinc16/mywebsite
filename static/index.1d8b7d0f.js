import{S as N,C as q,P as V,R as K,W as X,s as Y,A as _,F as I,L as J,D as A,M as Q,a as U,b as Z,O as C,B as $,c as j,G as ee,d as ne,e as te,E as oe,f as ie,g as se,V as ae,h as re,i as w}from"./vendor.cc9491ff.js";const ce=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function a(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(e){if(e.ep)return;e.ep=!0;const o=a(e);fetch(e.href,o)}};ce();function F(n,t,a,s,e){e=e===void 0?!1:e,e&&n.parent.localToWorld(n.position),n.position.sub(t),n.position.applyAxisAngle(a,s),n.position.add(t),e&&n.parent.worldToLocal(n.position),n.rotateOnAxis(a,s)}const O=.0015,g=new N;g.background=new q(15658734);const h=new V(80,window.innerWidth/window.innerHeight,.1,2e3),de=new K,d=new X({antialias:!0});d.setSize(window.innerWidth,window.innerHeight);d.domElement.className="container-fluid";document.body.appendChild(d.domElement);function z(){h.aspect=window.innerWidth/window.innerHeight,h.updateProjectionMatrix(),d.setSize(window.innerWidth,window.innerHeight)}function le(n){n.target.remove()}const b=new ae;function ue(n){b.x=n.clientX/window.innerWidth*2-1,b.y=-(n.clientY/window.innerHeight)*2+1}function fe(){d.outputEncoding=Y;const n=new _("white");g.add(n);let t,a,s,e;new I().load("fonts/helvetiker_regular.typeface.json",function(i){const L=26265,E=new J({color:L,side:A}),T=new Q({color:L,transparent:!0,opacity:.4,side:A}),W=`This is Kevin's 
Website`,r=i.generateShapes(W,1),f=new U(r);f.computeBoundingBox();const S=-.5*(f.boundingBox.max.x-f.boundingBox.min.x),H=0;f.translate(S,H,0),a=new Z(f,T),a.position.z=-.3;const k=[];for(let c=0;c<r.length;c++){const m=r[c];if(m.holes&&m.holes.length>0)for(let p=0;p<m.holes.length;p++){const v=m.holes[p];k.push(v)}}r.push.apply(r,k),s=new C;for(let c=0;c<r.length;c++){const p=r[c].getPoints(),v=new $().setFromPoints(p);v.translate(S,0,0);const D=new j(v,E);s.add(D)}t=new ee,t.add(a),t.add(s),t.position.z=-5,g.add(t),e=t.clone(),e.position.z=5,e.rotation.y=Math.PI,g.add(e)});const u=new re(()=>{const i=document.getElementById("loading-screen");i.classList.add("fade-out"),i.addEventListener("transitionend",le)}),G=new ne(u);let x=new C,l;G.load("assets/sunrise/scene.gltf",function(i){l=i.scene,l.scale.multiplyScalar(1/10);let L=new te().setFromObject(l),E=new w;return L.getCenter(E),l.position.sub(E),x.add(l),x.position.set(0,0,0),l},function(i){console.log(i.loaded/i.total*100+"% loaded")},function(i){console.error(i)});const P=new oe(d),R=new ie(g,h);P.addPass(R);const y=document.getElementById("hint"),M=new se(h,d.domElement);document.body.addEventListener("click",function(){M.lock()}),M.addEventListener("lock",function(){y.animate([{opacity:1},{opacity:0}],{duration:500}),y.style.opacity="0"}),M.addEventListener("unlock",function(){y.animate([{opacity:0},{opacity:1}],{duration:1e3}),y.style.opacity="1"});function B(){requestAnimationFrame(B),t&&F(t,new w(0,0,0),new w(0,1,0),-O,!0),e&&F(e,new w(0,0,0),new w(0,1,0),-O,!0),de.setFromCamera(b,h),z(),P.render()}window.addEventListener("mousemove",ue,!1),window.addEventListener("resize",z,!1),B()}fe();