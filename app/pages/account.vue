<script lang="ts" setup>
const { loggedIn } = useUserSession()
const { fetch: fetchSession } = useUserSession()

useHead({ title: 'Account :: TaskFlow' })

onMounted(() => { if (!loggedIn.value) navigateTo('/login') })
watch(loggedIn, (v) => { if (!v) navigateTo('/login') })

const { data: profile, refresh } = useFetch<any>('/api/auth/me')
const { data: allUsers } = useFetch<any[]>('/api/users')
const { data: tasks } = useFetch<any[]>('/api/tasks')

const editUsername = ref('')
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)

watch(profile, (p) => { if (p) editUsername.value = p.username }, { immediate: true })

const taskStats = computed(() => ({
  total: tasks.value?.length ?? 0,
  todo: tasks.value?.filter(t => t.status === 'todo').length ?? 0,
  inProgress: tasks.value?.filter(t => t.status === 'in_progress').length ?? 0,
  done: tasks.value?.filter(t => t.status === 'done').length ?? 0,
}))

async function updateProfile() {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = false
  try {
    await $fetch('/api/users/me', { method: 'PUT', body: { username: editUsername.value } })
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
  if (!confirm('Are you sure? This will permanently delete your account and all your tasks.')) return
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

      <!-- Profile -->
      <div class="card shadow-sm mb-4">
        <div class="card-header fw-semibold">
          <i class="fa-solid fa-circle-user me-2 text-primary"></i>My Profile
        </div>
        <div class="card-body" v-if="profile">
          <div class="row g-3">
            <div class="col-sm-6">
              <p class="text-muted small mb-0">Username</p>
              <p class="fw-semibold mb-0">{{ profile.username }}</p>
            </div>
            <div class="col-sm-6">
              <p class="text-muted small mb-0">Email</p>
              <p class="fw-semibold mb-0">{{ profile.email }}</p>
            </div>
            <div class="col-sm-6">
              <p class="text-muted small mb-0">Member since</p>
              <p class="mb-0">{{ formatDate(profile.createdAt) }}</p>
            </div>
            <div class="col-sm-6">
              <p class="text-muted small mb-0">Last login</p>
              <p class="mb-0">{{ formatDate(profile.lastLoginAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Stats -->
      <div class="card shadow-sm mb-4">
        <div class="card-header fw-semibold">
          <i class="fa-solid fa-chart-bar me-2 text-success"></i>Task Summary
        </div>
        <div class="card-body">
          <div class="row g-3 text-center">
            <div class="col-3">
              <div class="fs-3 fw-bold">{{ taskStats.total }}</div>
              <div class="text-muted small">Total</div>
            </div>
            <div class="col-3">
              <div class="fs-3 fw-bold text-secondary">{{ taskStats.todo }}</div>
              <div class="text-muted small">To Do</div>
            </div>
            <div class="col-3">
              <div class="fs-3 fw-bold text-primary">{{ taskStats.inProgress }}</div>
              <div class="text-muted small">In Progress</div>
            </div>
            <div class="col-3">
              <div class="fs-3 fw-bold text-success">{{ taskStats.done }}</div>
              <div class="text-muted small">Done</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Username -->
      <div class="card shadow-sm mb-4">
        <div class="card-header fw-semibold">
          <i class="fa-solid fa-pen me-2 text-info"></i>Edit Username
        </div>
        <div class="card-body">
          <div class="alert alert-success py-2" v-if="saveSuccess">Username updated successfully!</div>
          <div class="alert alert-danger py-2" v-if="saveError">{{ saveError }}</div>
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
        <div class="card-header fw-semibold">
          <i class="fa-solid fa-users me-2 text-warning"></i>All Users
        </div>
        <div class="table-responsive">
          <table class="table table-sm table-hover mb-0" v-if="allUsers?.length">
            <thead class="table-dark">
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in allUsers" :key="u.userId">
                <td class="text-muted">{{ u.userId }}</td>
                <td>{{ u.username }}</td>
                <td class="text-muted">{{ u.email }}</td>
                <td class="text-muted">{{ formatDate(u.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card shadow-sm border-danger">
        <div class="card-header text-danger fw-semibold border-danger">
          <i class="fa-solid fa-triangle-exclamation me-2"></i>Danger Zone
        </div>
        <div class="card-body">
          <p class="text-muted small mb-3">Permanently delete your account and all associated tasks. This cannot be undone.</p>
          <button class="btn btn-danger" @click="deleteAccount">
            <i class="fa-solid fa-trash me-2"></i>Delete My Account
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
