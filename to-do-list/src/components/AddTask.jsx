import React, { useState, useEffect } from "react";
import "../styles/components.css";
import todoService from "../services/todoService";

function AddTask({ closeAddTask, allAvailableLists, editingTask }) {
  const isEditing = !!editingTask;

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskList, setTaskList] = useState(allAvailableLists[0] || "");
  const [taskDescription, setTaskDescription] = useState("");
  const [errorClass, setErrorClass] = useState("d-none");
  const [serverErr, setServerErr] = useState("");

  // Pre-fill fields when editing a task
  useEffect(() => {
    if (editingTask) {
      setTaskTitle(editingTask.Title || "");
      setTaskDate(editingTask.Date || "");
      setTaskList(editingTask.List || allAvailableLists[0] || "");
      setTaskDescription(editingTask.Description || "");
    } else {
      setTaskTitle("");
      setTaskDate("");
      setTaskList(allAvailableLists[0] || "");
      setTaskDescription("");
    }
    setErrorClass("d-none");
    setServerErr("");
  }, [editingTask]);

  const taskAdded = async () => {
    const obj = {
      Title: taskTitle,
      Date: taskDate,
      List: taskList,
      Description: taskDescription,
    };

    if (
      taskTitle.length <= 0 ||
      taskList.length <= 0 ||
      taskDescription.length <= 0 ||
      taskDate.length <= 0
    ) {
      setErrorClass("d-block");
      setServerErr("");
      return;
    }

    try {
      if (isEditing) {
        await todoService.updateTodo(editingTask._id, obj);
      } else {
        await todoService.createTodo({ ...obj, Checked: false });
      }
      closeAddTask();
      setErrorClass("d-none");
      window.location.reload();
    } catch (error) {
      console.error("Failed to save task", error);
      setServerErr("Error connecting to Backend API. Is it running on port 5000?");
    }
  };

  return (
    <div className="row addTask">
      <h2 className="text-center">{isEditing ? "Edit Task" : "Add Task"}</h2>
      <div className="col-6">
        <div>
          <h6>Title</h6>
          <input
            type="text"
            name="Title"
            id="title"
            placeholder="Ex, Learn New Things"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </div>
        <div>
          <h6>Date</h6>
          <input
            type="date"
            name="Date"
            id="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
          />
        </div>
      </div>
      <div className="col-6">
        <div>
          <h6>List</h6>
          <select
            name="List"
            id="list"
            value={taskList}
            onChange={(e) => setTaskList(e.target.value)}
          >
            {allAvailableLists.map((listName, idx) => (
              <option key={idx} value={listName}>
                {listName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h6>Description</h6>
          <input
            type="text"
            name="Category"
            id="category"
            placeholder="Ex, Today need to find context ideas and many other things"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </div>
      </div>
      <p style={{ color: "red", fontSize: "13px", margin: "5px 0" }} className={errorClass}>
        Enter All Information
      </p>
      {serverErr && (
        <p style={{ color: "red", fontSize: "13px", margin: "5px 0", fontWeight: "bold" }}>
          {serverErr}
        </p>
      )}
      <div className="addTaskBtn">
        <button onClick={closeAddTask} className="me-1">
          Cancel
        </button>
        {isEditing ? (
          <button onClick={taskAdded} className="ms-1">
            Update
          </button>
        ) : (
          <button onClick={taskAdded} className="ms-1">
            Add
          </button>
        )}
      </div>
    </div>
  );
}

export default AddTask;
