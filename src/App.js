import Sidebar from "./Sidebar.js";
import React, {useState, useEffect} from "react";
import Main from "./Main.js"
import uuid from "react-uuid"

const App = () => {

  const [notes, setNotes] = useState(
    localStorage.notes ? JSON.parse(localStorage.notes) : []
  );

  const [currentNote, setCurrentNote] = useState(false);
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);
  const onAddNote = () => {
    const newNote = {
      id: uuid(),
      title:"Untitled",
      body:"",
      lastModified: '',
    };
    setNotes([newNote,...notes])
    setCurrentNote(newNote.id)
  }
  const onDeleteNote = (idToDel) => {
    setNotes(notes.filter((notes)=>notes.id !== idToDel))
  }
  const useToggle = (initialState) => {
    const [toggleValue, setToggleValue] = useState(initialState);

    const toggler = () => { setToggleValue(!toggleValue) };
    return [toggleValue, toggler]
  };
  const [toggle, setToggle] = useToggle();

  const getCurrentNote = () => {
    return notes.find((notes)=> notes.id === currentNote)
  }

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArray = notes.map((notes)=> {
      if (notes.id === currentNote){
        return updatedNote
      }
      return notes;
    });
    setNotes(updatedNotesArray);
  };

  const noteNumber = () => {
    return notes.filter((notes) => notes.id !== currentNote.id)
  }

  return (<>
  <hr></hr>
  <div className = "header">
    <h1>Lotion</h1>
    <button id = "sidebarbutton" onClick={setToggle}>&#9776;</button>
  </div>
  <p className = "notion">Like notion, but worse</p>
  <hr></hr>
  {toggle &&(
    <div><Main currentNote={getCurrentNote()} onUpdateNote={onUpdateNote} onDeleteNote = {onDeleteNote} noteNumber = {noteNumber()}/></div>
  )}
  {!toggle && (
    <div className="sidebar"><Sidebar notes ={notes} onAddNote = {onAddNote} currentNote = {currentNote} setCurrentNote = {setCurrentNote} />
    <Main currentNote={getCurrentNote()} onUpdateNote={onUpdateNote} onDeleteNote = {onDeleteNote} noteNumber = {noteNumber()}/></div>
      )}
  </>);
}

export default App;
