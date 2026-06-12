<script lang="ts" setup>
const { loggedIn, user, clear, fetch } = useUserSession()

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  await fetch()
  await navigateTo('/')
}

const year = new Date().getFullYear()
</script>

<template>
  <nav class="tf-navbar navbar navbar-expand-lg mb-4">
    <div class="container">
      <RouterLink class="navbar-brand d-flex align-items-center gap-2" to="/">
        <div class="brand-icon">
          <i class="fa-solid fa-list-check"></i>
        </div>
        <span class="brand-text">TaskFlow</span>
      </RouterLink>

      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarMain"
        aria-controls="navbarMain"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarMain">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link tf-link" to="/" active-class="tf-link-active">
              <i class="fa-solid fa-house me-1"></i>Home
            </RouterLink>
          </li>
          <template v-if="loggedIn">
            <li class="nav-item">
              <RouterLink class="nav-link tf-link" to="/tasks" active-class="tf-link-active">
                <i class="fa-solid fa-list-check me-1"></i>My Tasks
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link tf-link" to="/account" active-class="tf-link-active">
                <i class="fa-solid fa-circle-user me-1"></i>Account
              </RouterLink>
            </li>
            <li class="nav-item">
              <button class="nav-link tf-link btn btn-link" type="button" @click="logout">
                <i class="fa-solid fa-door-open me-1"></i>Logout
              </button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link tf-link" to="/login" active-class="tf-link-active">
                <i class="fa-solid fa-arrow-right-to-bracket me-1"></i>Login
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link tf-link" to="/register" active-class="tf-link-active">
                <i class="fa-solid fa-user-plus me-1"></i>Register
              </RouterLink>
            </li>
          </template>
        </ul>
        <div v-if="loggedIn" class="user-pill">
          <i class="fa-solid fa-user me-1"></i>{{ (user as any)?.username }}
        </div>
      </div>
    </div>
  </nav>

  <div class="container">
    <NuxtPage />
    <footer class="my-5 text-center small tf-footer pt-3">
      &copy; {{ year }} TaskFlow &mdash; Dayron Delgado
    </footer>
  </div>
</template>

<style>
/* page background */
html, body {
  min-height: 100vh;
}
body {
  background: linear-gradient(145deg, #060e1f 0%, #091a3d 35%, #0d2d6e 68%, #1250b0 100%) !important;
  background-attachment: fixed !important;
}

/* navbar styles */
.tf-navbar {
  background: rgba(5, 10, 28, 0.72) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.45);
}
.tf-navbar::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #1565c0 0%, #42a5f5 50%, #0288d1 100%);
}

.brand-icon {
  width: 34px; height: 34px;
  background: linear-gradient(135deg, #1565c0, #42a5f5);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  font-size: 14px;
  flex-shrink: 0;
  box-shadow: 0 2px 12px rgba(21, 101, 192, 0.5);
}
.brand-text {
  font-weight: 700;
  font-size: 1.2rem;
  background: linear-gradient(90deg, #90caf9, #e3f2fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tf-link {
  color: rgba(255, 255, 255, 0.65) !important;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem !important;
  border-radius: 6px;
  transition: all 0.2s;
  text-decoration: none !important;
}
.tf-link:hover {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.08) !important;
}
.tf-link-active {
  color: #90caf9 !important;
  background: rgba(21, 101, 192, 0.22) !important;
}

.user-pill {
  background: linear-gradient(90deg, rgba(21,101,192,0.3), rgba(66,165,245,0.2));
  border: 1px solid rgba(66, 165, 245, 0.3);
  color: #90caf9;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
}

/* glass card effect */
.card {
  background: rgba(255, 255, 255, 0.06) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
  color: #e3f2fd;
}
.card-header {
  background: rgba(255, 255, 255, 0.04) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: #90caf9 !important;
}

/* blue gradient bar */
.gradient-bar {
  height: 3px;
  background: linear-gradient(90deg, #1565c0, #42a5f5);
  border-radius: 2px;
  margin-bottom: 0.75rem;
}

/* button styles */
.btn-primary {
  background: linear-gradient(90deg, #1565c0, #42a5f5) !important;
  border: none !important;
  font-weight: 500;
  box-shadow: 0 2px 14px rgba(21, 101, 192, 0.4) !important;
  transition: all 0.2s !important;
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(90deg, #0d47a1, #1976d2) !important;
  box-shadow: 0 4px 20px rgba(21, 101, 192, 0.6) !important;
  transform: translateY(-1px);
}
.btn-primary:disabled { opacity: 0.55 !important; }

.btn-outline-secondary {
  border-color: rgba(255, 255, 255, 0.25) !important;
  color: rgba(255, 255, 255, 0.65) !important;
}
.btn-outline-secondary:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  color: #fff !important;
}
.btn-outline-primary {
  border-color: #42a5f5 !important;
  color: #42a5f5 !important;
}
.btn-outline-primary:hover {
  background: rgba(66, 165, 245, 0.12) !important;
  color: #90caf9 !important;
}
.btn-outline-light {
  border-color: rgba(255, 255, 255, 0.4) !important;
  color: rgba(255, 255, 255, 0.85) !important;
}
.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
}
.btn-outline-danger {
  border-color: rgba(239, 83, 80, 0.55) !important;
  color: #ef9a9a !important;
}
.btn-outline-danger:hover {
  background: rgba(239, 83, 80, 0.12) !important;
  color: #ef5350 !important;
}
.btn-info {
  background: linear-gradient(90deg, #0277bd, #29b6f6) !important;
  border: none !important;
  color: #fff !important;
}
.btn-danger {
  background: linear-gradient(90deg, #b71c1c, #ef5350) !important;
  border: none !important;
}

/* filter tabs */
.nav-pills .nav-link {
  color: rgba(255, 255, 255, 0.6) !important;
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.nav-pills .nav-link:hover {
  color: rgba(255, 255, 255, 0.9) !important;
  background: rgba(255, 255, 255, 0.1) !important;
}
.nav-pills .nav-link.active {
  background: linear-gradient(90deg, #1565c0, #42a5f5) !important;
  border-color: transparent !important;
  color: #fff !important;
  box-shadow: 0 2px 12px rgba(21, 101, 192, 0.45) !important;
}

/* form inputs */
.form-control, .form-select {
  background: rgba(255, 255, 255, 0.07) !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  color: #e3f2fd !important;
}
.form-control:focus, .form-select:focus {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: #42a5f5 !important;
  box-shadow: 0 0 0 3px rgba(66, 165, 245, 0.2) !important;
  color: #e3f2fd !important;
}
.form-control::placeholder { color: rgba(255, 255, 255, 0.28) !important; }
.form-label {
  color: rgba(255, 255, 255, 0.72) !important;
  font-size: 0.875rem;
  font-weight: 500;
}
.form-select option { background: #0d2347; color: #e3f2fd; }

/* table styles */
.table { color: #cce5ff !important; }
thead.table-dark th {
  background: linear-gradient(90deg, #0a1d3e, #0d2d6e) !important;
  color: #90caf9 !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}
.table > :not(caption) > * > * {
  background-color: transparent !important;
  border-bottom-color: rgba(255, 255, 255, 0.07) !important;
  color: #cce5ff !important;
}
.table-hover tbody tr:hover > * {
  background-color: rgba(255, 255, 255, 0.04) !important;
}

/* alerts */
.alert-danger {
  background: rgba(239, 83, 80, 0.14) !important;
  border: 1px solid rgba(239, 83, 80, 0.3) !important;
  color: #ef9a9a !important;
}
.alert-success {
  background: rgba(76, 175, 80, 0.14) !important;
  border: 1px solid rgba(76, 175, 80, 0.3) !important;
  color: #a5d6a7 !important;
}

/* dropdown menu */
.dropdown-menu {
  background: rgba(7, 16, 42, 0.93) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45) !important;
}
.dropdown-item { color: rgba(255, 255, 255, 0.72) !important; }
.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #fff !important;
}

/* misc utilities */
.text-muted { color: rgba(255, 255, 255, 0.48) !important; }
.border-primary { border-color: rgba(66, 165, 245, 0.4) !important; }
.border-danger { border-color: rgba(239, 83, 80, 0.35) !important; }
.text-danger { color: #ef9a9a !important; }
.text-success { color: #a5d6a7 !important; }
.text-info { color: #80deea !important; }
.text-warning { color: #ffe082 !important; }
.text-primary { color: #64b5f6 !important; }

.tf-footer {
  color: rgba(255, 255, 255, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.07) !important;
}
</style>
