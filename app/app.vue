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
  <nav class="navbar navbar-expand-lg bg-body-tertiary mb-4 border-bottom border-secondary">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold fs-4" to="/">
        <i class="fa-solid fa-list-check me-2 text-primary"></i>TaskFlow
      </RouterLink>
      <button
        class="navbar-toggler"
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
            <RouterLink class="nav-link" to="/" active-class="active">
              <i class="fa-solid fa-house me-1"></i>Home
            </RouterLink>
          </li>
          <template v-if="loggedIn">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/tasks" active-class="active">
                <i class="fa-solid fa-list-check me-1"></i>My Tasks
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/account" active-class="active">
                <i class="fa-solid fa-circle-user me-1"></i>Account
              </RouterLink>
            </li>
            <li class="nav-item">
              <button class="nav-link btn btn-link" type="button" @click="logout">
                <i class="fa-solid fa-door-open me-1"></i>Logout
              </button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login" active-class="active">
                <i class="fa-solid fa-arrow-right-to-bracket me-1"></i>Login
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/register" active-class="active">
                <i class="fa-solid fa-user-plus me-1"></i>Register
              </RouterLink>
            </li>
          </template>
        </ul>
        <span class="navbar-text" v-if="loggedIn">
          <i class="fa-solid fa-user me-1 text-primary"></i>{{ (user as any)?.username }}
        </span>
      </div>
    </div>
  </nav>

  <div class="container">
    <NuxtPage />
    <footer class="my-5 text-center text-muted small border-top border-secondary pt-3">
      &copy; {{ year }} TaskFlow &mdash; Dayron Delgado
    </footer>
  </div>
</template>
