<template>
  <div class="layout">
    <nav class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title">Aviation Learning<br>Components</span>
      </div>
      <ul>
        <li v-for="item in nav" :key="item.path">
          <RouterLink :to="item.path" active-class="active">{{ item.label }}</RouterLink>
        </li>
      </ul>
      <div class="sidebar-footer">
        <a href="https://github.com/open-aviation-solutions/open-aviation-components" target="_blank" rel="noopener">
          GitHub
        </a>
      </div>
    </nav>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
const nav = [
  { path: '/four-forces', label: 'FourForces' },
]
</script>

<style>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: #1e293b;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #334155;
}

.sidebar-header {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid #334155;
}

.sidebar-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.4;
}

.sidebar ul {
  list-style: none;
  padding: 0.5rem 0;
  flex: 1;
}

.sidebar ul li a {
  display: block;
  padding: 0.6rem 1rem;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.9rem;
  border-left: 3px solid transparent;
  transition: background 0.15s, color 0.15s;
}

.sidebar ul li a:hover {
  background: #334155;
  color: #f1f5f9;
}

.sidebar ul li a.active {
  border-left-color: #38bdf8;
  color: #38bdf8;
  background: #0f172a;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #334155;
  font-size: 0.8rem;
}

.sidebar-footer a {
  color: #64748b;
  text-decoration: none;
}

.sidebar-footer a:hover {
  color: #94a3b8;
}

.content {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 2rem;
}
</style>
