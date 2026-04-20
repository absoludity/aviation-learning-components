(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function t(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(e){if(e.ep)return;e.ep=!0;const r=t(e);fetch(e.href,r)}})();const a=[{slug:"four-forces",label:"FourForces",href:"/open-aviation-components/four-forces/"}];function c(i){const o=document.getElementById("sidebar");o.innerHTML=`
    <div class="sidebar-header">
      <a href="/open-aviation-components/" class="sidebar-title">Open Aviation<br>Components</a>
    </div>
    <ul>
      ${a.map(t=>`
        <li><a href="${t.href}" class="${t.slug===i?"active":""}">${t.label}</a></li>
      `).join("")}
    </ul>
    <div class="sidebar-footer">
      <a href="https://github.com/open-aviation-solutions/open-aviation-components" target="_blank" rel="noopener">GitHub</a>
    </div>
  `}export{c as r};
