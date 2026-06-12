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
      await $fetch(`/api/tasks/${editing.value.taskId}`, { method: 'PUT', body: { ...form } })
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
    <!-- page title and new task button -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h2 class="mb-0 fw-bold text-white">
          <i class="fa-solid fa-list-check me-2" style="color:#64b5f6"></i>My Tasks
        </h2>
        <div class="gradient-bar mt-1" style="width:50px"></div>
        <p class="mb-0 small" style="color:rgba(255,255,255,0.45)">
          {{ counts.all }} total &mdash; {{ counts.done }} completed
        </p>
      </div>
      <button class="btn btn-primary" @click="openNew">
        <i class="fa-solid fa-plus me-1"></i>New Task
      </button>
    </div>

    <!-- form to create or edit a task -->
    <div class="card mb-4 task-form-card" v-if="showForm">
      <div class="card-header d-flex align-items-center gap-2">
        <i class="fa-solid fa-pen" style="color:#64b5f6"></i>
        <span class="fw-semibold">{{ editing ? 'Edit Task' : 'New Task' }}</span>
      </div>
      <div class="card-body p-4">
        <div class="alert alert-danger py-2" v-if="formError">{{ formError }}</div>
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label">Title <span style="color:#ef9a9a">*</span></label>
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
        <div class="d-flex gap-2 mt-4">
          <button class="btn btn-primary" @click="saveTask" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="fa-solid fa-floppy-disk me-1"></i>Save Task
          </button>
          <button class="btn btn-outline-secondary" @click="cancelForm">Cancel</button>
        </div>
      </div>
    </div>

    <!-- filter buttons by status -->
    <ul class="nav nav-pills mb-4 gap-1 flex-wrap">
      <li class="nav-item" v-for="f in ['all','todo','in_progress','done']" :key="f">
        <button
          class="nav-link"
          :class="{ active: activeFilter === f }"
          @click="activeFilter = f"
        >
          {{ f === 'all' ? 'All' : statusLabel(f) }}
          <span class="badge ms-1" :class="activeFilter === f ? 'bg-white text-dark' : 'bg-secondary'">
            {{ counts[f as keyof typeof counts] }}
          </span>
        </button>
      </li>
    </ul>

    <!-- list of tasks -->
    <div v-if="filtered.length > 0" class="d-flex flex-column gap-3">
      <div
        v-for="task in filtered"
        :key="task.taskId"
        class="card task-card"
        :class="{ 'task-done': task.status === 'done' }"
      >
        <div class="card-body p-3">
          <div class="d-flex align-items-start justify-content-between gap-3">
            <div class="flex-grow-1">
              <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h6
                  class="mb-0 fw-semibold"
                  :class="task.status === 'done' ? 'text-decoration-line-through' : 'text-white'"
                  :style="task.status === 'done' ? 'color:rgba(255,255,255,0.4)!important' : ''"
                >
                  {{ task.title }}
                </h6>
                <span class="badge" :class="statusBadge(task.status)">{{ statusLabel(task.status) }}</span>
                <span class="badge" :class="priorityBadge(task.priority)">{{ task.priority }}</span>
                <span v-if="task.dueDate && isOverdue(task.dueDate) && task.status !== 'done'" class="badge bg-danger">
                  <i class="fa-solid fa-clock me-1"></i>Overdue
                </span>
              </div>
              <p v-if="task.description" class="small mb-1" style="color:rgba(255,255,255,0.5)">
                {{ task.description }}
              </p>
              <div class="d-flex gap-3 flex-wrap mt-1">
                <small v-if="task.dueDate" style="color:rgba(255,255,255,0.38)">
                  <i class="fa-regular fa-calendar me-1"></i>Due {{ task.dueDate }}
                </small>
                <small style="color:rgba(255,255,255,0.38)">
                  <i class="fa-solid fa-clock me-1"></i>{{ new Date(task.createdAt).toLocaleDateString() }}
                </small>
              </div>
            </div>

            <!-- edit and delete buttons -->
            <div class="d-flex gap-2 flex-shrink-0">
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

    <div v-else-if="!showForm" class="text-center py-5">
      <i class="fa-solid fa-inbox fa-3x mb-3 d-block" style="color:rgba(255,255,255,0.15)"></i>
      <p style="color:rgba(255,255,255,0.4)">
        <template v-if="activeFilter === 'all'">No tasks yet. Click <strong class="text-white">New Task</strong> to get started.</template>
        <template v-else>No tasks with status <strong class="text-white">{{ statusLabel(activeFilter) }}</strong>.</template>
      </p>
    </div>
  </div>
</template>

<style scoped>
.task-form-card {
  border-color: rgba(66, 165, 245, 0.3) !important;
}
.task-card {
  transition: transform 0.15s, box-shadow 0.15s;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.38) !important;
}
.task-done {
  opacity: 0.65;
}
</style>
