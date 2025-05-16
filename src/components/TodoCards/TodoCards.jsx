import React, { useEffect, useState } from "react";
import axios from "axios";
export default function TodoCards() {
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("useremail");
  const [todos, setTodos] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/deleteList/${id}`,
        {
          data: {
            email: userEmail,
          },
        }
      );

      setTodos(todos.filter((todo) => todo._id !== id));
      return response;
    } catch (error) {
      console.error("Error adding new todo:", error);
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditBody(todo.body);
  };

  const handleUpdate = async () => {
    setTodos(
      todos.map((todo) =>
        todo._id === editingId
          ? { ...todo, title: editTitle, body: editBody }
          : todo
      )
    );
    setEditingId(null);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/updateList/${editingId}`,
        {
          title: editTitle,
          body: editBody,
          email: userEmail,
        }
      );

      return response;
    } catch (error) {
      console.error("Error adding new todo:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleAddNew = async () => {
    if (newTitle.trim() === "") return;

    const newTodo = {
      //   id: todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1,
      title: newTitle,
      body: newBody,
      email: userEmail,
    };

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/addList`,
        newTodo
      );

      const createdTodo = response.data.newList;
      console.log("🚀 ~ handleAddNew ~ createdTodo:", createdTodo);

      setTodos([...todos, createdTodo]);
      setNewTitle("");
      setNewBody("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding new todo:", error);
    }
  };

  const fetchUserTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/getList/${token}`
      );
      console.log("🚀 ~ fetchUserTasks ~ response:", response);
      setTodos(response.data.list);
    } catch (error) {
      console.error("Failed to fetch tasks:", error.response.data.message);
    }
  };
  useEffect(() => {
    if (token) {
      fetchUserTasks();
    }
  }, [token]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center">
          My Todo List
        </h1>

        {/* Add New Todo Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Todo
          </button>
        </div>

        {/* Add New Todo Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 animate-fade-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Add New Todo
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="Todo title"
                />
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 min-h-[120px]"
                  placeholder="Todo description"
                />
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNew}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                    disabled={!newTitle.trim()}
                  >
                    Add Todo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Todo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todos.map((todo,index) => {
            return (
              <div
                key={todo.index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out"
              >
                <div className="p-6">
                  {editingId === todo._id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        placeholder="Todo title"
                      />
                      <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 min-h-[120px]"
                        placeholder="Todo description"
                      />
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdate}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {todo.title}
                        </h3>
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                          #{todo._id}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-6">{todo.body}</p>
                      <div className="flex justify-end space-x-3 border-t border-gray-100 pt-4">
                        <button
                          onClick={() => handleEdit(todo)}
                          className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(todo._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {todos.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No todos found
            </h3>
            <p className="text-gray-500">
              Click "Add New Todo" to create your first todo
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
