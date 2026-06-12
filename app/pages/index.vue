<script lang="ts" setup>
const { loggedIn } = useUserSession()

useHead({ title: 'Home :: iNotes' })
</script>

<template>
  <div class="text-center py-5">
    <i class="fa-solid fa-note-sticky fa-4x text-warning mb-4"></i>
    <h1 class="display-5 fw-bold">Welcome to iNotes</h1>
    <p class="lead text-muted">A simple, secure note-taking app built with Nuxt, TypeORM, and JWT authentication.</p>
    <div class="mt-4 d-flex gap-3 justify-content-center">
      <RouterLink v-if="loggedIn" to="/notes" class="btn btn-warning btn-lg">
        <i class="fa-solid fa-list me-2"></i>View My Notes
      </RouterLink>
      <template v-else>
        <RouterLink to="/register" class="btn btn-warning btn-lg">
          <i class="fa-solid fa-user-plus me-2"></i>Get Started
        </RouterLink>
        <RouterLink to="/login" class="btn btn-outline-light btn-lg">
          <i class="fa-solid fa-arrow-right-to-bracket me-2"></i>Login
        </RouterLink>
      </template>
    </div>

    <div class="row mt-5 g-4 justify-content-center">
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body text-start">
            <h5 class="card-title"><i class="fa-solid fa-lock text-success me-2"></i>JWT Authentication</h5>
            <p class="card-text text-muted">Secure login with HS256 JWT tokens. Passwords hashed with bcrypt.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body text-start">
            <h5 class="card-title"><i class="fa-solid fa-database text-info me-2"></i>MySQL + TypeORM</h5>
            <p class="card-text text-muted">Notes linked to users via foreign key. Full CRUD on both tables.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body text-start">
            <h5 class="card-title"><i class="fa-solid fa-shield-halved text-warning me-2"></i>HTTPS / TLS</h5>
            <p class="card-text text-muted">App served over HTTPS with locally trusted SSL certificates.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
