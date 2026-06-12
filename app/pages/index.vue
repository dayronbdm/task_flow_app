<script lang="ts" setup>
const { loggedIn } = useUserSession()
useHead({ title: 'TaskFlow — Manage your tasks' })
</script>

<template>
  <div>
    <!-- Hero -->
    <div class="text-center py-5 mb-5">
      <div class="mb-4">
        <i class="fa-solid fa-list-check fa-4x text-primary"></i>
      </div>
      <h1 class="display-4 fw-bold">Stay on top of your work</h1>
      <p class="lead text-muted col-md-6 mx-auto">
        TaskFlow helps you create, organize, and track your tasks by priority and status — all in one place.
      </p>
      <div class="mt-4 d-flex gap-3 justify-content-center">
        <RouterLink v-if="loggedIn" to="/tasks" class="btn btn-primary btn-lg px-4">
          <i class="fa-solid fa-list-check me-2"></i>Go to My Tasks
        </RouterLink>
        <template v-else>
          <RouterLink to="/register" class="btn btn-primary btn-lg px-4">
            <i class="fa-solid fa-rocket me-2"></i>Get Started Free
          </RouterLink>
          <RouterLink to="/login" class="btn btn-outline-light btn-lg px-4">
            <i class="fa-solid fa-arrow-right-to-bracket me-2"></i>Login
          </RouterLink>
        </template>
      </div>
    </div>

    <!-- Features -->
    <div class="row g-4 mb-5">
      <div class="col-md-4">
        <div class="card h-100 border-0 bg-body-secondary">
          <div class="card-body p-4">
            <div class="mb-3">
              <span class="badge bg-primary fs-6 p-2">
                <i class="fa-solid fa-arrow-up-wide-short"></i>
              </span>
            </div>
            <h5 class="fw-bold">Priority Levels</h5>
            <p class="text-muted">Mark tasks as Low, Medium, or High priority to focus on what matters most.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 bg-body-secondary">
          <div class="card-body p-4">
            <div class="mb-3">
              <span class="badge bg-success fs-6 p-2">
                <i class="fa-solid fa-circle-check"></i>
              </span>
            </div>
            <h5 class="fw-bold">Status Tracking</h5>
            <p class="text-muted">Move tasks from To Do → In Progress → Done as you work through them.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 bg-body-secondary">
          <div class="card-body p-4">
            <div class="mb-3">
              <span class="badge bg-warning fs-6 p-2">
                <i class="fa-solid fa-lock"></i>
              </span>
            </div>
            <h5 class="fw-bold">Secure & Private</h5>
            <p class="text-muted">JWT authentication with bcrypt passwords. Your tasks are private to your account only.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Status legend -->
    <div class="card border-0 bg-body-secondary">
      <div class="card-body p-4">
        <h5 class="fw-bold mb-3">How it works</h5>
        <div class="d-flex flex-wrap gap-3">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-secondary">To Do</span>
            <span class="text-muted small">Tasks waiting to be started</span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-primary">In Progress</span>
            <span class="text-muted small">Tasks currently being worked on</span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-success">Done</span>
            <span class="text-muted small">Completed tasks</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
