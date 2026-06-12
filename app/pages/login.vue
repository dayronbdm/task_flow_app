<script lang="ts" setup>
const { fetch: fetchSession } = useUserSession()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

useHead({ title: 'Login :: iNotes' })

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    await fetchSession()
    await navigateTo('/notes')
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
          <h4 class="card-title mb-4 text-center">
            <i class="fa-solid fa-arrow-right-to-bracket me-2 text-warning"></i>Login
          </h4>
          <div class="alert alert-danger" v-if="error">{{ error }}</div>
          <form @submit.prevent="submit">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" placeholder="you@example.com" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" placeholder="••••••••" required />
            </div>
            <button type="submit" class="btn btn-warning w-100" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Login
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
