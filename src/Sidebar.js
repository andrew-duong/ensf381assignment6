import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Sidebar({ notes, onAddNote, currentNote, setCurrentNote }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const noteIndex = Number(location.pathname.split("/")[2]) - 1;
    if (noteIndex >= 0 && noteIndex < notes.length) {
      setCurrentNote(notes[noteIndex].id);
    }
  }, [location.pathname, setCurrentNote, notes]);

  const handleNoteClick = (noteId) => {
    setCurrentNote(noteId);
  };

  const handleAddNote = () => {
    onAddNote();
    navigate("/note/1/edit");
  };

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

  return (
    <>
      <div className="sidebarApp">
        <div className="sidebarHeader">
          <h1>Notes</h1>
          <button onClick={handleAddNote}>Add</button>
        </div>
        <div className="noteList">
          {notes.length === 0 ? (
            <div className="noNotes">No notes found.</div>
          ) : (
            notes.map((note, index) => (
              <Link to={`/note/${index + 1}`} key={note.id}>
                <div
                  className={`notes ${note.id === currentNote && "active"}`}
                  onClick={() => handleNoteClick(note.id)}
                >
                  <div className="noteTitle">
                    <strong>{note.title}</strong>
                  </div>
                  <small className="noteDate">
                    {formatDate(note.lastModified)}
                  </small>
                  <div className="sidebarText" dangerouslySetInnerHTML={{ __html: note.body.substr(0, 100) + "..."}}></div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;