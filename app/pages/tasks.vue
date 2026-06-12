<script lang="ts" setup>
const { loggedIn } = useUserSession()

useHead({ title: 'My Tasks :: TaskFlow' })

onMounted(() => { if (!loggedIn.value) navigateTo('/login') })
watch(loggedIn, (v) => { if (!v) navigateTo('/login') })

const { data: tasks, refresh } = useFetch<any[]>('/api/tasks')

const activeFilter = ref<string>('all')
const showForm = ref(false)
const editing = ref<any>(null)
const saving = ref(false)
const formError = ref('')

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  status: 'todo'
})

const filtered = computed(() => {
  if (!tasks.value) return []
  if (activeFilter.value === 'all') return tasks.value
  return tasks.value.filter(t => t.status === activeFilter.value)
})

const counts = computed(() => ({
  all: tasks.value?.length ?? 0,
  todo: tasks.value?.filter(t => t.status === 'todo').length ?? 0,
  in_progress: tasks.value?.filter(t => t.status === 'in_progress').length ?? 0,
  done: tasks.value?.filter(t => t.status === 'done').length ?? 0,
}))

function openNew() {
  editing.value = null
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  form.dueDate = ''
  form.status = 'todo'
  formError.value = ''
  showForm.value = true
}

function openEdit(task: any) {
  editing.value = task
  form.title = task.title
  form.description = task.description || ''
  form.priority = task.priority
  form.dueDate = task.dueDate || ''
  form.status = task.status
  formError.value = ''
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editing.value = null
}

async function saveTask() {
  if (!form.title.trim()) { formError.value = 'Title is required'; return }
  saving.value = true
  formError.value = ''
  try {
    if (editing.value) {
      await $fetch(`/api/tasks/${editing.value.taskId}`, {
        method: 'PUT',
        body: { ...form }
      })
    } else {
      await $fetch('/api/tasks', { method: 'POST', body: { ...form } })
    }
    await refresh()
    showForm.value = false
    editing.value = null
  } catch (e: any) {
    formError.value = e?.data?.message || 'Failed to save'
  } finally {
    saving.value = false
  }
}

async function quickStatus(task: any, status: string) {
  await $fetch(`/api/tasks/${task.taskId}`, {
    method: 'PUT',
    body: { title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate, status }
  })
  await refresh()
}

async function deleteTask(task: any) {
  if (!confirm(`Delete "${task.title}"?`)) return
  await $fetch(`/api/tasks/${task.taskId}`, { method: 'DELETE' })
  await refresh()
}

function priorityBadge(p: string) {
  return { low: 'bg-info', medium: 'bg-warning text-dark', high: 'bg-danger' }[p] ?? 'bg-secondary'
}

function statusBadge(s: string) {
  return { todo: 'bg-secondary', in_progress: 'bg-primary', done: 'bg-success' }[s] ?? 'bg-secondary'
}

function statusLabel(s: string) {
  return { todo: 'To Do', in_progress: 'In Progress', done: 'Done' }[s] ?? s
}

function isOverdue(dueDate: string | null) {
  if (!dueDate) return false
  return new Date(dueDate) < new Date(new Date().toDateString())
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h2 class="mb-0 fw-bold">
          <i class="fa-solid fa-list-check me-2 text-primary"></i>My Tasks
        </h2>
        <p class="text-muted small mb-0">{{ counts.all }} total &mdash; {{ counts.done }} completed</p>
      </div>
      <button class="btn btn-primary" @click="openNew">
        <i class="fa-solid fa-plus me-1"></i>New Task
      </button>
    </div>

    <!-- New / Edit Form -->
    <div class="card mb-4 border-primary" v-if="showForm">
      <div class="card-header bg-primary bg-opacity-10 fw-semibold">
        <i class="fa-solid fa-pen me-2"></i>{{ editing ? 'Edit Task' : 'New Task' }}
      </div>
      <div class="card-body">
        <div class="alert alert-danger py-2" v-if="formError">{{ formError }}</div>
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label">Title <span class="text-danger">*</span></label>
            <input v-model="form.title" type="text" class="form-control" placeholder="What needs to be done?" />
          </div>
          <div class="col-12">
            <label class="form-label">Description</label>
            <textarea v-model="form.description" class="form-control" rows="3" placeholder="Optional details..."></textarea>
          </div>
          <div class="col-md-4">
            <label class="form-label">Priority</label>
            <select v-model="form.priority" class="form-select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Status</label>
            <select v-model="form.status" class="form-select">
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Due Date</label>
            <input v-model="form.dueDate" type="date" class="form-control" />
          </div>
        </div>
        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-primary" @click="saveTask" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="fa-solid fa-floppy-disk me-1"></i>Save Task
          </button>
          <button class="btn btn-outline-secondary" @click="cancelForm">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <ul class="nav nav-pills mb-4 gap-1">
      <li class="nav-item" v-for="f in ['all','todo','in_progress','done']" :key="f">
        <button
          class="nav-link"
          :class="{ active: activeFilter === f }"
          @click="activeFilter = f"
        >
          {{ f === 'all' ? 'All' : statusLabel(f) }}
          <span class="badge ms-1" :class="activeFilter === f ? 'bg-light text-dark' : 'bg-secondary'">
            {{ counts[f as keyof typeof counts] }}
          </span>
        </button>
      </li>
    </ul>

    <!-- Task List -->
    <div v-if="filtered.length > 0" class="d-flex flex-column gap-3">
      <div
        v-for="task in filtered"
        :key="task.taskId"
        class="card"
        :class="{ 'opacity-75': task.status === 'done' }"
      >
        <div class="card-body">
          <div class="d-flex align-items-start justify-content-between gap-3">
            <div class="flex-grow-1">
              <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h6 class="mb-0 fw-semibold" :class="{ 'text-decoration-line-through text-muted': task.status === 'done' }">
                  {{ task.title }}
                </h6>
                <span class="badge" :class="statusBadge(task.status)">{{ statusLabel(task.status) }}</span>
                <span class="badge" :class="priorityBadge(task.priority)">{{ task.priority }}</span>
                <span v-if="task.dueDate && isOverdue(task.dueDate) && task.status !== 'done'" class="badge bg-danger">
                  <i class="fa-solid fa-clock me-1"></i>Overdue
                </span>
              </div>
              <p v-if="task.description" class="text-muted small mb-1">{{ task.description }}</p>
              <div class="d-flex gap-3 flex-wrap">
                <small v-if="task.dueDate" class="text-muted">
                  <i class="fa-regular fa-calendar me-1"></i>Due {{ task.dueDate }}
                </small>
                <small class="text-muted">
                  <i class="fa-solid fa-clock me-1"></i>Created {{ new Date(task.createdAt).toLocaleDateString() }}
                </small>
              </div>
            </div>

            <!-- Actions -->
            <div class="d-flex gap-2 flex-shrink-0">
              <!-- Quick status -->
              <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                  <i class="fa-solid fa-arrow-right-arrow-left"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><button class="dropdown-item" @click="quickStatus(task,'todo')"><span class="badge bg-secondary me-2">To Do</span></button></li>
                  <li><button class="dropdown-item" @click="quickStatus(task,'in_progress')"><span class="badge bg-primary me-2">In Progress</span></button></li>
                  <li><button class="dropdown-item" @click="quickStatus(task,'done')"><span class="badge bg-success me-2">Done</span></button></li>
                </ul>
              </div>
              <button class="btn btn-sm btn-outline-primary" @click="openEdit(task)" title="Edit">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteTask(task)" title="Delete">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!showForm" class="text-center py-5 text-muted">
      <i class="fa-solid fa-inbox fa-3x mb-3 d-block opacity-25"></i>
      <p v-if="activeFilter === 'all'">No tasks yet. Click <strong>New Task</strong> to get started.</p>
      <p v-else>No tasks with status <strong>{{ statusLabel(activeFilter) }}</strong>.</p>
    </div>
  </div>
</template>
