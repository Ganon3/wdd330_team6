(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=o(r);fetch(r.href,n)}})();function l(t){return JSON.parse(localStorage.getItem(t))}function u(t,e){localStorage.setItem(t,JSON.stringify(e))}function f(t){const e=window.location.search;return new URLSearchParams(e).get(t)}function d(t,e,o,a="afterbegin",r=!0){r&&(e.innerHTML="");const n=o.map(t);e.insertAdjacentHTML(a,n.join(""))}async function i(t,e,o,a,r="afterbegin",n=!0){n&&(e.innerHTML="");const s=await t(o);e.insertAdjacentHTML(r,s),a&&a(o)}function c(t){return async function(){const e=await fetch(t);if(e.ok)return await e.text()}}async function m(){const t=c("/partials/header.html"),e=c("/partials/footer.html"),o=document.getElementById("main-header"),a=document.getElementById("main-footer");await i(t,o),await i(e,a)}function g(){const t=l("so-cart"),e=document.querySelector("#cart-count");if(!t||t.length===0){e.classList.add("hidden");return}const o=Array.isArray(t)?t:[t];e.textContent=o.length,e.classList.remove("hidden")}export{f as a,l as g,m as l,d as r,u as s,g as u};
