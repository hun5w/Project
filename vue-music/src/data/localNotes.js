const LOCAL_NOTE_KEY = 'local_notes'

export function getLocalNotes() {
  return Promise.resolve(JSON.parse(localStorage.getItem('myEvents') || '[]'))
}

export function saveLocalNote(text) {
  const notes = getLocalNotes()
  const newNote = {
    id: Date.now(),
    text,
    eventTime: Date.now()
  }
  notes.unshift(newNote)
  localStorage.setItem(LOCAL_NOTE_KEY, JSON.stringify(notes))
}

export function deleteLocalNote(id) {
  const notes = getLocalNotes().filter(note => note.id !== id)
  localStorage.setItem(LOCAL_NOTE_KEY, JSON.stringify(notes))
}

export function updateLocalNote(id, newText) {
  const notes = getLocalNotes().map(note =>
    note.id === id ? { ...note, text: newText } : note
  )
  localStorage.setItem(LOCAL_NOTE_KEY, JSON.stringify(notes))
}
