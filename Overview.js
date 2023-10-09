import React, { useState } from "react";
import axios from 'axios';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { InputTextarea } from 'primereact/inputtextarea';
import './styles.css';

export default function Register() {
  const location = useLocation();
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const username = location.state.user;
  const [selectedNote, setSelectedNote] = useState("");
  const [deletingNote, setDeletingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [newContents, setNewContents] = useState("");
  const [oldContents, setOldContents] = useState("");
  const [notesPresent, setNotesPresent] = useState(false);


  const startAdd = () => {
    setIsAddingNote(true); 
  }

  const startDelete = () => {
    setDeletingNote(true);
  }

  const deletedSuccessfully = () => {
    setDeletingNote(false);
    alert("Deleted successfully");
  }

  const deletedUnsuccessfully = () => {
    setDeletingNote(false);
    alert("Deleted unsuccessfully");
  }
  
  const addedSuccessfully = () => {
    alert("Added successfully!");
    fetchNotes();
    setIsAddingNote(false);
    setNoteText(""); 
  }
  const addedUnsuccessfully = () => {
    alert("Added unsuccessfully");
  }

  const emptyNote = () => {
    alert("Cannot add empty note");
  }

  const handleTextChange = (e) => {
    setNoteText(e.target.value);
  }

  const handleNoteSelection = (contents) => {
    setSelectedNote(contents);
  }
  
  const setNewEditContent = (e) => {
    setNewContents(e.target.value);
  }

  const setOldEditContents = (oldContents) => {
    setOldContents(oldContents);
  }

  const editNoteTrue = (contents) => {
    setEditingNote(true);
    setOldEditContents(contents);
  }

  const editedSuccessfully = () => {
    alert("Edited successfully!");
    setEditingNote(false);
  }

  const confirmEdit = async () => {
    try { 
      const body = {
        newNote : newContents,
        oldNote: oldContents}
      const response = await axios.put(`http://localhost:8080/Note/editNote/${username}`, body)
      if(response.data) {
        editedSuccessfully();
        fetchNotes();
      } else {
        addedUnsuccessfully();
      }
    } catch(error) {
      console.log(error);
    }
  }
  
  const cancelEdit = () => {
    setEditingNote(false);
  }

  const deleteAll = async () => {
    try { 
      const response = await axios.delete(`http://localhost:8080/Note/delete/${username}`)
      if(response.data) {
        deletedSuccessfully();
        fetchNotes();
      } else {
        deletedUnsuccessfully();
      }
    } catch(error) {
      console.log(error);
    }
  }

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/Note/deleteNote/${username}/${selectedNote}`)
      if(response.data) {
        deletedSuccessfully();
        fetchNotes();
      } else {
        deletedUnsuccessfully();
      }
    } catch(error) {
      console.log(error);
    }
  }

  const confirmAdd = async () => {
    try {
      if(noteText.length === 0) {
        emptyNote();
        return;
      }
      const body = { note: noteText };
      const response = await axios.post(`http://localhost:8080/Note/addNote/${username}`, body)
      if(response.data) {
        addedSuccessfully();
        fetchNotes();
      } else {
        addedUnsuccessfully();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const cancelAdd = () => {
    setIsAddingNote(false);
  }

  const cancelDelete = () => {
    setDeletingNote(false);
  }

  const fetchNotes = async () => {
    try {
    const response = await axios.get(`http://localhost:8080/Note/getNotesUsername/${username}`)
    const data = response.data;
    if(data.length === 0) {
      setNotesPresent(false);
      return;
    } else setNotesPresent(true);
    setNotes(data);
    } catch (error) {
    console.error("Error fetching notes:", error);
    }
  }

  useEffect(() => {fetchNotes()}, []);
  

  return (
    <div>
      <div style={{ position: "relative" }}>
        <h1 style={{ display: "inline-block" }}>Hi {location.state.user}, good to see you!</h1>
        <Link to="/login" style={{ position: "absolute", top: 0, right: 0 }}>
          <Button className="button" label="Logout" severity="secondary" />
        </Link>
      </div>
      {isAddingNote ? (
        <div>
          <InputTextarea className="textarea" onChange={handleTextChange} placeholder="Enter note:" maxLength={200} />
          <div>
          <button onClick={confirmAdd}>Save Note</button>
          <button onClick={cancelAdd}>Cancel adding</button>
          </div>
        </div>
      ) : deletingNote ? (
        <div>
          <h2>Notes:</h2>
          <ul style={{ listStyleType: "none" }}>
            {notes.map((note) => (
              <li className="note-container" key={note.contents}>
                <input type="radio" name="selectedNote" checked={selectedNote === note.contents} onChange={() => handleNoteSelection(note.contents)}/>
                {note.contents}
              </li>
            ))}
          </ul>
          <button onClick={confirmDelete}> Delete Selected Note</button>
          <button onClick={cancelDelete}>Cancel</button>
        </div>
      ) : editingNote ? (
        <div> 
          <div>
            <InputTextarea className="textarea" defaultValue={oldContents} onChange={ setNewEditContent } maxLength={200} />
          <div>
            <button onClick={confirmEdit}>Save Note</button>
            <button onClick={cancelEdit}>Cancel edit</button>
          </div>
        </div>
        </div>
      ) : ( notesPresent ? (
        <div>
          <h2>Notes:</h2>
          <ul style={{ listStyleType: "none" }}>
            {notes.map((note) => (
                <div key={note.contents} className="note-container">
                <li className="note-content">{note.contents}</li>
                <button onClick={() => editNoteTrue(note.contents)}>Edit Note</button>
                </div>
            ))}
          </ul>
          <button onClick={startAdd}>Add Note</button>
          <button onClick={startDelete}>Delete a Note</button>
          <button onClick={deleteAll}>Delete All</button>
        </div>
      ) : (
        <div>
          <h2>Notes:</h2>
          <h3> You have no notes yet. Get started by adding one below!</h3>
          <button onClick={startAdd}>Add Note</button>
        </div>
      )
        
      )}
    </div>
  );
}

