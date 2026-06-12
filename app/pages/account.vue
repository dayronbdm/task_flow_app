<script lang="ts" setup>
const { loggedIn, user } = useUserSession()
const { fetch: fetchSession } = useUserSession()

useHead({ title: 'Account :: iNotes' })

onMounted(() => {
  if (!loggedIn.value) navigateTo('/login')
})
watch(loggedIn, (v) => { if (!v) navigateTo('/login') })

const { data: profile, refresh } = useFetch<any>('/api/auth/me')
const { data: allUsers } = useFetch<any[]>('/api/users')

const editUsername = ref('')
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)

watch(profile, (p) => {
  if (p) editUsername.value = p.username
}, { immediate: true })

async function updateProfile() {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = false
  try {
    await $fetch('/api/users/me', {
      method: 'PUT',
      body: { username: editUsername.value }
    })
    await refresh()
    await fetchSession()
    saveSuccess.value = true
  } catch (e: any) {
    saveError.value = e?.data?.message || 'Update failed'
  } finally {
    saving.value = false
  }
}

async function deleteAccount() {
  if (!confirm('Are you sure? This will permanently delete your account and all your notes.')) return
  await $fetch('/api/users/me', { method: 'DELETE' })
  await navigateTo('/')
}

function formatDate(d: string | null) {
  if (!d) return 'Never'
  return new Date(d).toLocaleString()
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">

      <!-- Profile Card -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h5 class="card-title mb-3">
            <i class="fa-solid fa-circle-user me-2 text-warning"></i>My Profile
          </h5>
          <div class="row g-3" v-if="profile">
            <div class="col-sm-6">
              <label class="form-label text-muted small">Email</label>
              <p class="mb-0 fw-semibold">{{ profile.email }}</p>
            </div>
            <div class="col-sm-6">
              <label class="form-label text-muted small">Member since</label>
              <p class="mb-0">{{ formatDate(profile.createdAt) }}</p>
            </div>
            <div class="col-sm-6">
              <label class="form-label text-muted small">Last login</label>
              <p class="mb-0">{{ formatDate(profile.lastLoginAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Username -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h5 class="card-title mb-3">
            <i class="fa-solid fa-pen me-2 text-info"></i>Edit Username
          </h5>
          <div class="alert alert-success" v-if="saveSuccess">Username updated!</div>
          <div class="alert alert-danger" v-if="saveError">{{ saveError }}</div>
          <div class="d-flex gap-2">
            <input v-model="editUsername" type="text" class="form-control" placeholder="New username" />
            <button class="btn btn-info" @click="updateProfile" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>Save
            </button>
          </div>
        </div>
      </div>

      <!-- All Users -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h5 class="card-title mb-3">
            <i class="fa-solid fa-users me-2 text-success"></i>All Users
          </h5>
          <div class="table-responsive">
            <table class="table table-sm table-hover" v-if="allUsers && allUsers.length">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in allUsers" :key="u.userId">
                  <td>{{ u.userId }}</td>
                  <td>{{ u.username }}</td>
                  <td>{{ u.email }}</td>
                  <td>{{ formatDate(u.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card shadow-sm border-danger">
        <div class="card-body">
          <h5 class="card-title text-danger mb-3">
            <i class="fa-solid fa-triangle-exclamation me-2"></i>Danger Zone
          </h5>
          <p class="text-muted small">Permanently delete your account and all associated notes. This cannot be undone.</p>
          <button class="btn btn-danger" @click="deleteAccount">
            <i class="fa-solid fa-trash me-2"></i>Delete My Account
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
