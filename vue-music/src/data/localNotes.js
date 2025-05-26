const STORAGE_KEY = 'local_notes_by_user'

// 获取当前用户 ID（从 localStorage）
function getCurrentUserId() {
  const raw = localStorage.getItem('current_user')
  if (!raw) return null
  try {
    return JSON.parse(raw).id
  } catch (e) {
    return null
  }
}

// 获取当前用户的所有笔记（返回 Promise）
export function getLocalNotes() {
  return new Promise((resolve) => {
    const userId = getCurrentUserId()
    if (!userId) return resolve([])

    const allNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    resolve(allNotes[userId] || [])
  })
}

// 保存一条笔记
export async function saveLocalNote(text) {
  const notes = await getLocalNotes()
  const userId = getCurrentUserId()
  if (!userId) return

  const newNote = {
    id: Date.now(),
    text,
    eventTime: Date.now()
  }

  notes.unshift(newNote)

  const allNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  allNotes[userId] = notes
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotes))
}

// 删除指定 ID 的笔记
export function deleteLocalNote(id) {
  return getLocalNotes().then(notes => {
    const userId = getCurrentUserId()
    if (!userId) return

    const filtered = notes.filter(note => note.id !== id)

    const allNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    allNotes[userId] = filtered

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotes))
  })
}

// 更新笔记内容
export function updateLocalNote(id, newText) {
  return getLocalNotes().then(notes => {
    const userId = getCurrentUserId()
    if (!userId) return

    const updated = notes.map(note =>
      note.id === id ? { ...note, text: newText } : note
    )

    const allNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    allNotes[userId] = updated

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotes))
  })
}
