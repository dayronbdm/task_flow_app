<script lang="ts" setup>
const { fetch: fetchSession } = useUserSession()

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

useHead({ title: 'Register :: TaskFlow' })

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { username: username.value, email: email.value, password: password.value }
    })
    await fetchSession()
    await navigateTo('/tasks')
  } catch (e: any) {
    error.value = e?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-5 col-lg-4">
      <div class="card">
        <!-- Gradient header bar -->
        <div class="auth-card-header">
          <div class="auth-icon-wrap">
            <i class="fa-solid fa-user-plus"></i>
          </div>
          <h4 class="mb-0 fw-bold text-white">Create your account</h4>
          <p class="mb-0 mt-1" style="color:rgba(255,255,255,0.6);font-size:.875rem">Start tracking your tasks today</p>
        </div>

        <div class="card-body p-4">
          <div class="alert alert-danger py-2" v-if="error">{{ error }}</div>
          <form @submit.prevent="submit">
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input v-model="username" type="text" class="form-control" placeholder="johndoe" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" placeholder="you@example.com" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" placeholder="••••••••" minlength="6" required />
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fa-solid fa-user-plus me-2"></i>Create Account
            </button>
          </form>
          <p class="mt-3 text-center small" style="color:rgba(255,255,255,0.45)">
            Already have an account?
            <RouterLink to="/login" style="color:#64b5f6">Login</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-card-header {
  background: linear-gradient(135deg, #0d2d6e, #1565c0);
  border-radius: 0.375rem 0.375rem 0 0;
  padding: 1.75rem 1.5rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.auth-icon-wrap {
  width: 48px; height: 48px;
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: white;
  font-size: 1.2rem;
  margin: 0 auto 0.75rem;
  border: 1px solid rgba(255,255,255,0.2);
}
</style>
