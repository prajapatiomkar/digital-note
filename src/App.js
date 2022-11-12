import React, { useEffect, useState } from 'react'
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import { nanoid } from "nanoid"
import Split from "react-split"
import "react-mde/lib/styles/css/react-mde-all.css";

export default function App() {
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  )
  const [currentNoteId, setCurrentNoteId] = useState((notes[0] && notes[0].id) || "")


  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }

  function updateNote(text) {
    // Working Code 
    // setNotes(oldNotes => oldNotes.map(oldNote => {
    //   return oldNote.id === currentNoteId
    //     ?
    //     { ...oldNote, body: text }
    //     : oldNote
    // }))

    // Feature: recent edit note appear at the top
    setNotes(oldNotes => {
      const newArray = []
      oldNotes.map((item, index) => {
        const oldNote = oldNotes[index]
        if (oldNote.id === currentNoteId) {
          newArray.unshift({ ...oldNote, body: text })
        } else {
          newArray.push(oldNote)
        }
      })
      return newArray
    })
  }
  function deleteNote(event, noteId) {
    event.stopPropagation()
    setNotes(oldNotes => oldNotes.filter((note) => note.id !== noteId))

  }

  function findCurrentNote() {
    return notes.find(note => {
      return note.id === currentNoteId
    }) || notes[0]
  }
  return (
    <main>
      {
        notes.length > 0
          ?
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className='split'
          >
            <Sidebar
              notes={notes}
              currentNote={findCurrentNote()}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              deleteNote={deleteNote}
            />
            {
              currentNoteId && notes.length > 0 &&
              <Editor
                currentNote={findCurrentNote()}
                updateNote={updateNote}

              />
            }
          </Split>

          :
          <div className="no-notes">
            <h1>You have no Notes</h1>
            <button
              className="first-note"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>
      }
    </main>
  )
}
