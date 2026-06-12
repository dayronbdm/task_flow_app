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
    <div class="col-md-5">
      <div class="card shadow">
        <div class="card-body p-4">
          <div class="text-center mb-4">
            <i class="fa-solid fa-list-check fa-2x text-primary mb-2"></i>
            <h4 class="card-title mb-0">Create your account</h4>
            <p class="text-muted small">Start tracking your tasks today</p>
          </div>
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
          <p class="mt-3 text-center text-muted small">
            Already have an account? <RouterLink to="/login">Login</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
