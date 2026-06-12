<script lang="ts" setup>
const { loggedIn } = useUserSession()

useHead({ title: 'My Notes :: iNotes' })

onMounted(() => {
  if (!loggedIn.value) navigateTo('/login')
})
watch(loggedIn, (v) => { if (!v) navigateTo('/login') })

const { data: notes, refresh } = useFetch<any[]>('/api/notes')

const showForm = ref(false)
const editing = ref<any>(null)
const title = ref('')
const content = ref('')
const saving = ref(false)
const error = ref('')

function openNew() {
  editing.value = null
  title.value = ''
  content.value = ''
  error.value = ''
  showForm.value = true
}

function openEdit(note: any) {
  editing.value = note
  title.value = note.title
  content.value = note.content
  error.value = ''
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editing.value = null
}

async function saveNote() {
  if (!title.value.trim() || !content.value.trim()) {
    error.value = 'Title and content are required'
    return
  }
  saving.value = true
  error.value = ''
  try {
    if (editing.value) {
      await $fetch(`/api/notes/${editing.value.noteId}`, {
        method: 'PUT',
        body: { title: title.value, content: content.value }
      })
    } else {
      await $fetch('/api/notes', {
        method: 'POST',
        body: { title: title.value, content: content.value }
      })
    }
    await refresh()
    showForm.value = false
    editing.value = null
  } catch (e: any) {
    error.value = e?.data?.message || 'Failed to save note'
  } finally {
    saving.value = false
  }
}

async function deleteNote(note: any) {
  if (!confirm(`Delete "${note.title}"?`)) return
  await $fetch(`/api/notes/${note.noteId}`, { method: 'DELETE' })
  await refresh()
}

function formatDate(d: string) {
  return new Date(d).toLocaleString()
}
</script>

<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2 class="mb-0">
        <i class="fa-solid fa-list me-2 text-warning"></i>My Notes
      </h2>
      <button class="btn btn-warning" @click="openNew">
        <i class="fa-solid fa-plus me-1"></i>New Note
      </button>
    </div>

    <!-- Note Form -->
    <div class="card mb-4" v-if="showForm">
      <div class="card-body">
        <h5 class="card-title">{{ editing ? 'Edit Note' : 'New Note' }}</h5>
        <div class="alert alert-danger" v-if="error">{{ error }}</div>
        <div class="mb-3">
          <label class="form-label">Title</label>
          <input v-model="title" type="text" class="form-control" placeholder="Note title" />
        </div>
        <div class="mb-3">
          <label class="form-label">Content</label>
          <textarea v-model="content" class="form-control" rows="5" placeholder="Write your note here..."></textarea>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-warning" @click="saveNote" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="fa-solid fa-floppy-disk me-1"></i>Save
          </button>
          <button class="btn btn-outline-secondary" @click="cancelForm">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Notes List -->
    <div v-if="notes && notes.length > 0" class="row g-3">
      <div class="col-md-6 col-lg-4" v-for="note in notes" :key="note.noteId">
        <div class="card h-100">
          <div class="card-body">
            <h6 class="card-title fw-bold">{{ note.title }}</h6>
            <p class="card-text text-muted" style="white-space: pre-wrap; max-height: 100px; overflow: hidden;">{{ note.content }}</p>
          </div>
          <div class="card-footer d-flex align-items-center justify-content-between">
            <small class="text-muted">
              <i class="fa-solid fa-clock me-1"></i>{{ formatDate(note.updatedAt || note.createdAt) }}
            </small>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" @click="openEdit(note)" title="Edit">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn btn-outline-danger" @click="deleteNote(note)" title="Delete">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!showForm" class="text-center py-5 text-muted">
      <i class="fa-regular fa-note-sticky fa-3x mb-3 d-block"></i>
      <p>No notes yet. Click <strong>New Note</strong> to get started.</p>
    </div>
  </div>
</template>
