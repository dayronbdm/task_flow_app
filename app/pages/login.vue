<script lang="ts" setup>
const { fetch: fetchSession } = useUserSession()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

useHead({ title: 'Login :: TaskFlow' })

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    await fetchSession()
    await navigateTo('/tasks')
  } catch (e: any) {
    error.value = e?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card shadow">
        <div class="card-body p-4">
          <div class="text-center mb-4">
            <i class="fa-solid fa-list-check fa-2x text-primary mb-2"></i>
            <h4 class="card-title mb-0">Welcome back</h4>
            <p class="text-muted small">Log in to your TaskFlow account</p>
          </div>
          <div class="alert alert-danger py-2" v-if="error">{{ error }}</div>
          <form @submit.prevent="submit">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" placeholder="you@example.com" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" placeholder="••••••••" required />
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fa-solid fa-arrow-right-to-bracket me-2"></i>Login
            </button>
          </form>
          <p class="mt-3 text-center text-muted small">
            Don't have an account? <RouterLink to="/register">Register</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
