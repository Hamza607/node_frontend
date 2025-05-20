import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import RichTextEditor from "../MyEditor/MyEditor";
import axios from "axios";

export default function Notes() {
  const API_URL = "http://localhost:3000/api/v1";

  const [notes, setNotes] = useState([]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    date: new Date(),
  });

  const handleAddNote = () => {
    setIsAdding(true);
    setEditingNoteId(null); // Make sure it's not in edit mode
    setNewNote({
      title: "",
      description: "",
      date: new Date(),
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewNote({
      title: "",
      description: "",
      date: new Date(),
      color: "bg-gradient-to-r from-gray-50 to-blue-50",
    });
  };

  const handleSave = async () => {
    if (newNote.title.trim() === "") return;

    const noteToSend = {
      title: newNote.title,
      description: newNote.description,
      date: new Date(),
      color: newNote.color,
    };

    try {
      if (editingNoteId) {
        // Update existing note
        const response = await axios.put(
          `${API_URL}/updateNotes/${editingNoteId}`,
          noteToSend
        );
        const updatedNote = response.data.note;

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === editingNoteId ? updatedNote : note
          )
        );
      } else {
        // Create new note
        const response = await axios.post(`${API_URL}/createNotes`, noteToSend);
        const savedNote = response.data;
        setNotes([savedNote, ...notes]);
      }

      // Reset form
      setIsAdding(false);
      setEditingNoteId(null);
      setNewNote({
        title: "",
        description: "",
        date: new Date(),
        color: "bg-gradient-to-r from-gray-50 to-blue-50",
      });
    } catch (error) {
      console.error("Error saving/updating note:", error);
      alert("Failed to save/update note. Please try again.");
    }

    setIsAdding(false);
  };

  const handleEditNote = (note) => {
    setIsAdding(true);
    setEditingNoteId(note._id);
    setNewNote({
      title: note.title,
      description: note.description,
      date: new Date(note.date),
    });
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/getNotes`);
      setNotes(response.data); // Assuming the response is an array of notes
    } catch (error) {
      console.error("Error fetching notes:", error);
      alert("Failed to fetch notes. Please try again.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/delteNotes/${id}`); // Adjust endpoint if needed
      setNotes(notes.filter((note) => note.id !== id)); // Remove the note from UI
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete the note. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              My Notebook
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Capture your thoughts and ideas beautifully
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleAddNote}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Create New Note</span>
          </button>
        </div>

        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transition-all duration-300 ease-in-out">
            <div className={`p-1 ${newNote.color}`}>
              <div className="bg-white bg-opacity-90 rounded-lg p-6">
                <input
                  type="text"
                  name="title"
                  placeholder="Note Title"
                  value={newNote.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 mb-4 text-xl font-semibold border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-transparent placeholder-gray-400 focus:outline-none"
                  autoFocus
                />
                {/* <textarea
                  name="description"
                  placeholder="Start writing your note here..."
                  value={newNote.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 mb-4 text-gray-700 border-0 focus:ring-0 bg-transparent placeholder-gray-400 focus:outline-none min-h-[150px] resize-none"
                /> */}
                <RichTextEditor
                  value={newNote.description}
                  setValue={(val) =>
                    setNewNote((prev) => ({ ...prev, description: val }))
                  }
                />

                {/* <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500 mb-2">Choose Note Color:</p>
                  <div className="flex space-x-2">
                    {colorOptions.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => selectColor(color)}
                        className={`w-8 h-8 rounded-full ${color} border-2 ${newNote.color === color ? 'border-blue-500' : 'border-transparent'} transition-all`}
                      />
                    ))}
                  </div>
                </div>
                 */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium rounded-lg shadow-md transition duration-200"
                  >
                    <span>{editingNoteId ? "Update Note" : "Save Note"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.length > 0 &&
            notes.map((note) => (
              <div
                key={note.id}
                className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 ${note.color}`}
              >
                <div className="bg-white bg-opacity-90 p-6 h-full">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {note.title}
                  </h3>

                  <div
                    className="text-gray-600 mb-4 leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: note.description }}
                  />
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-500">
                      {format(note.date, "MMMM d, yyyy")}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
