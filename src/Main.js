import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';


function Main({ currentNote, onUpdateNote, onDeleteNote, noteNumber }) {
  const [editedText, setEditedText] = useState(currentNote?.body || '');
  const [editedTitle, setEditedTitle] = useState(currentNote?.title || '');
  const [textButton, setTextButton] = useState("Edit");
  const [isEditMode, setIsEditMode] = useState(false);
  const [when, setWhen] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const now = new Date();
  const year = now.getFullYear();
  const month = ('0' + (now.getMonth() + 1)).slice(-2);
  const day = ('0' + now.getDate()).slice(-2);
  const hours = ('0' + now.getHours()).slice(-2);
  const minutes = ('0' + now.getMinutes()).slice(-2);

  const formattedDateNow = `${year}-${month}-${day}T${hours}:${minutes}`;

  const formattedWhen = typeof when === "string" ? `${when.replace('T', ' ')}:00` : formattedDateNow;

  useEffect(() => {
    setEditedText(currentNote?.body || '');
    setEditedTitle(currentNote?.title || '');
    setIsEditMode(location.pathname.includes("/edit"));
    setTextButton(location.pathname.includes("/edit") ? "Save" : "Edit");
    if (currentNote?.lastModified) {
      setWhen(currentNote.lastModified);
    } else {
      setWhen(new Date());
    }
  }, [currentNote, location.pathname]);


  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  
  const formatDate = (when) => {
    const formatted = new Date(when).toLocaleString("en-US", options);
    if (formatted === "Invalid Date") {
      return "";
    }
    return formatted;
  };

  const onEditField = (key, value) => {
    if (key === "title") {
      setEditedTitle(value);
    } else {
      setEditedText(value);
    }
  };

  const handleSave = () => {
    onUpdateNote({
      ...currentNote,
      title: editedTitle,
      body: editedText,
      lastModified: when,
    });
    setIsEditMode(false);
    setTextButton("Edit");
  };

  const { id } = useParams();

  const handleTextButton = () => {
    if (textButton === "Edit") {
      setTextButton("Save");
      setIsEditMode(true);
      navigate(`/note/${id}/edit`);
    } else {
      handleSave();
      navigate(`/note/${id}`);
    }
  };
  
  const answer = () =>{
     window.confirm("Are you sure?");
      if (answer) {
      handleDeleteNote();
      }
  }

  const handleDeleteNote = () => {
    onDeleteNote(currentNote.id);
    if (noteNumber.length > 1) {
      navigate(`/note/1`);
    } else {
      navigate("/note");
    }
  };
  if (currentNote === undefined) {
    return (<div className="noCurNote">Select a note, or create one</div>)
  }

  return (
    <>
      <div className="main">
        <div className="mainNoteEdit">
          <div className = "mainHeader">
          <input type="text" id="title" value={editedTitle} onChange={(e) => onEditField("title", e.target.value) } readOnly={!isEditMode} autoFocus />
          <button onClick={handleTextButton}>{textButton}</button>
          <button className="deleteButton" onClick={() => answer()}>
            Delete
          </button>
          </div>
          </div>
          <div className="date">
          {!isEditMode && <div>{formatDate(when)}</div>}
          </div>
          {!isEditMode && (<div className="textarea" dangerouslySetInnerHTML={{__html: editedText}}></div>)}
          <div className="date">
          {isEditMode && <input type="datetime-local" value ={formattedWhen} onChange={(e) => setWhen(e.target.value)} readOnly={!isEditMode}/>}
          </div>
          {isEditMode && <ReactQuill
            theme="snow"
            className="textareaQuill"
            id="body"
            value={editedText}
            placeholder="Write your note here..."
            onChange={(value) => onEditField("body", value)}
            readOnly={!isEditMode}
            modules={{
            clipboard: {
            matchVisual: false
            }
             }}
              />
            }
          </div>
      
    </>
  )
}

export default Main;