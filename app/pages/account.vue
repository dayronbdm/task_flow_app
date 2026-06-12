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

      <!-- account page title -->
      <div class="mb-4">
        <h2 class="fw-bold text-white mb-0">
          <i class="fa-solid fa-circle-user me-2" style="color:#64b5f6"></i>Account
        </h2>
        <div class="gradient-bar mt-1" style="width:50px"></div>
      </div>

      <!-- user profile info -->
      <div class="card mb-4">
        <div class="card-header d-flex align-items-center gap-2">
          <i class="fa-solid fa-id-card" style="color:#64b5f6"></i>
          <span class="fw-semibold">My Profile</span>
        </div>
        <div class="card-body p-4" v-if="profile">
          <div class="row g-3">
            <div class="col-sm-6">
              <p class="small mb-0" style="color:rgba(255,255,255,0.45)">Username</p>
              <p class="fw-semibold text-white mb-0">{{ profile.username }}</p>
            </div>
            <div class="col-sm-6">
              <p class="small mb-0" style="color:rgba(255,255,255,0.45)">Email</p>
              <p class="fw-semibold text-white mb-0">{{ profile.email }}</p>
            </div>
            <div class="col-sm-6">
              <p class="small mb-0" style="color:rgba(255,255,255,0.45)">Member since</p>
              <p class="mb-0" style="color:rgba(255,255,255,0.75)">{{ formatDate(profile.createdAt) }}</p>
            </div>
            <div class="col-sm-6">
              <p class="small mb-0" style="color:rgba(255,255,255,0.45)">Last login</p>
              <p class="mb-0" style="color:rgba(255,255,255,0.75)">{{ formatDate(profile.lastLoginAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- task count summary -->
      <div class="card mb-4">
        <div class="card-header d-flex align-items-center gap-2">
          <i class="fa-solid fa-chart-bar" style="color:#a5d6a7"></i>
          <span class="fw-semibold">Task Summary</span>
        </div>
        <div class="card-body p-4">
          <div class="row g-3 text-center">
            <div class="col-3">
              <div class="stat-number">{{ taskStats.total }}</div>
              <div class="stat-label">Total</div>
            </div>
            <div class="col-3">
              <div class="stat-number" style="color:rgba(255,255,255,0.55)">{{ taskStats.todo }}</div>
              <div class="stat-label">To Do</div>
            </div>
            <div class="col-3">
              <div class="stat-number" style="color:#64b5f6">{{ taskStats.inProgress }}</div>
              <div class="stat-label">In Progress</div>
            </div>
            <div class="col-3">
              <div class="stat-number" style="color:#a5d6a7">{{ taskStats.done }}</div>
              <div class="stat-label">Done</div>
            </div>
          </div>
        </div>
      </div>

      <!-- form to change username -->
      <div class="card mb-4">
        <div class="card-header d-flex align-items-center gap-2">
          <i class="fa-solid fa-pen" style="color:#80deea"></i>
          <span class="fw-semibold">Edit Username</span>
        </div>
        <div class="card-body p-4">
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

      <!-- table showing all registered users -->
      <div class="card mb-4">
        <div class="card-header d-flex align-items-center gap-2">
          <i class="fa-solid fa-users" style="color:#ffe082"></i>
          <span class="fw-semibold">All Users</span>
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
                <td style="color:rgba(255,255,255,0.4)">{{ u.userId }}</td>
                <td class="text-white">{{ u.username }}</td>
                <td style="color:rgba(255,255,255,0.5)">{{ u.email }}</td>
                <td style="color:rgba(255,255,255,0.5)">{{ formatDate(u.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- delete account section -->
      <div class="card border-danger">
        <div class="card-header d-flex align-items-center gap-2 border-danger">
          <i class="fa-solid fa-triangle-exclamation" style="color:#ef9a9a"></i>
          <span class="fw-semibold" style="color:#ef9a9a">Danger Zone</span>
        </div>
        <div class="card-body p-4">
          <p class="small mb-3" style="color:rgba(255,255,255,0.5)">
            Permanently delete your account and all associated tasks. This cannot be undone.
          </p>
          <button class="btn btn-danger" @click="deleteAccount">
            <i class="fa-solid fa-trash me-2"></i>Delete My Account
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}
.stat-label {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.4);
  margin-top: 4px;
}
</style>
