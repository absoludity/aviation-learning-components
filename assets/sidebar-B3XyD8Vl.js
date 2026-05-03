(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(e){if(e.ep)return;e.ep=!0;const o=t(e);fetch(e.href,o)}})();const a=[{slug:"four-forces",label:"Four Forces",href:"/open-aviation-components/four-forces/"},{slug:"climb-performance",label:"Climb Performance",href:"/open-aviation-components/climb-performance/"},{slug:"flight-path-overview",label:"Flight Path Overview",href:"/open-aviation-components/flight-path-overview/"}];function c(n){const r=document.getElementById("sidebar");r.innerHTML=`
    <div class="sidebar-header">
      <a href="/open-aviation-components/" class="sidebar-title">Open Aviation<br>Components</a>
    </div>
    <ul>
      ${a.map(t=>`
        <li><a href="${t.href}" class="${t.slug===n?"active":""}">${t.label}</a></li>
      `).join("")}
    </ul>
    <div class="sidebar-footer">
      <a href="https://github.com/open-aviation-solutions/open-aviation-components" target="_blank" rel="noopener">GitHub</a>
    </div>
  `}export{c as r};
