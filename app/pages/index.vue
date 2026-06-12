<script lang="ts" setup>
const { loggedIn } = useUserSession()
useHead({ title: 'TaskFlow — Manage your tasks' })
</script>

<template>
  <div>
    <!-- hero section -->
    <div class="text-center py-5 mb-5">
      <div class="hero-icon-wrap mx-auto mb-4">
        <i class="fa-solid fa-list-check fa-2x"></i>
      </div>
      <h1 class="display-4 fw-bold text-white mb-2">Stay on top of your work</h1>
      <div class="gradient-bar mx-auto" style="width:80px"></div>
      <p class="lead col-md-6 mx-auto mt-2" style="color:rgba(255,255,255,0.6)">
        TaskFlow helps you create, organize, and track your tasks by priority and status — all in one place.
      </p>
      <div class="mt-4 d-flex gap-3 justify-content-center flex-wrap">
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

    <!-- feature cards -->
    <div class="row g-4 mb-5">
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body p-4">
            <div class="feature-badge mb-3" style="background:linear-gradient(135deg,#1565c0,#42a5f5)">
              <i class="fa-solid fa-arrow-up-wide-short"></i>
            </div>
            <h5 class="fw-bold text-white">Priority Levels</h5>
            <div class="gradient-bar" style="width:40px"></div>
            <p style="color:rgba(255,255,255,0.55)">Mark tasks as Low, Medium, or High priority to focus on what matters most.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body p-4">
            <div class="feature-badge mb-3" style="background:linear-gradient(135deg,#1b5e20,#43a047)">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <h5 class="fw-bold text-white">Status Tracking</h5>
            <div class="gradient-bar" style="width:40px"></div>
            <p style="color:rgba(255,255,255,0.55)">Move tasks from To Do → In Progress → Done as you work through them.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body p-4">
            <div class="feature-badge mb-3" style="background:linear-gradient(135deg,#e65100,#ffa726)">
              <i class="fa-solid fa-lock"></i>
            </div>
            <h5 class="fw-bold text-white">Secure & Private</h5>
            <div class="gradient-bar" style="width:40px"></div>
            <p style="color:rgba(255,255,255,0.55)">JWT authentication with bcrypt passwords. Your tasks are private to your account only.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- status legend -->
    <div class="card">
      <div class="card-body p-4">
        <h5 class="fw-bold text-white mb-1">How it works</h5>
        <div class="gradient-bar" style="width:50px"></div>
        <div class="d-flex flex-wrap gap-3 mt-2">
          <div class="status-chip">
            <span class="badge bg-secondary me-2">To Do</span>
            <span style="color:rgba(255,255,255,0.5);font-size:.85rem">Tasks waiting to be started</span>
          </div>
          <div class="status-chip">
            <span class="badge bg-primary me-2">In Progress</span>
            <span style="color:rgba(255,255,255,0.5);font-size:.85rem">Currently being worked on</span>
          </div>
          <div class="status-chip">
            <span class="badge bg-success me-2">Done</span>
            <span style="color:rgba(255,255,255,0.5);font-size:.85rem">Completed tasks</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-icon-wrap {
  width: 72px; height: 72px;
  background: linear-gradient(135deg, #1565c0, #42a5f5);
  border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  color: white;
  box-shadow: 0 4px 24px rgba(21, 101, 192, 0.55);
}
.feature-badge {
  width: 44px; height: 44px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: white;
  font-size: 1rem;
}
.status-chip {
  display: flex;
  align-items: center;
}
</style>
