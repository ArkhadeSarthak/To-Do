import React, { useState } from "react";
import { FaTrash, FaPen, FaCheckCircle, FaRegCircle, FaCalendarAlt, FaTag, FaAlignLeft } from "react-icons/fa";
import todoService from "../services/todoService";
import "../styles/stickywall.css";

// Predefined palette for known + dynamic lists
const LIST_PALETTE = [
  { bg: "#ffd6e0", accent: "#c9184a", text: "#6b0027" },  // Pink/Rose
  { bg: "#d4f1f9", accent: "#0077b6", text: "#023e8a" },  // Sky Blue
  { bg: "#d8f3dc", accent: "#2d6a4f", text: "#1b4332" },  // Sage Green
  { bg: "#fff3b0", accent: "#e09f3e", text: "#7a4100" },  // Warm Yellow
  { bg: "#e8d5f5", accent: "#7b2d8b", text: "#4a0e72" },  // Purple
  { bg: "#ffe5cc", accent: "#e76f51", text: "#7c2d12" },  // Coral
  { bg: "#d6ffe8", accent: "#06d6a0", text: "#034d3a" },  // Mint
  { bg: "#f5e6d3", accent: "#a0522d", text: "#5c2e00" },  // Tan
];

const colorCache = {};
let colorIndex = 0;

function getListColor(listName) {
  if (!listName) return LIST_PALETTE[LIST_PALETTE.length - 1];
  if (colorCache[listName]) return colorCache[listName];
  const color = LIST_PALETTE[colorIndex % LIST_PALETTE.length];
  colorCache[listName] = color;
  colorIndex++;
  return color;
}

function StickyWall({ closeOpen, iconCLS, setTask, tasks, fetchTasks }) {
  const [filterList, setFilterList] = useState("All");

  // Get all unique lists
  const uniqueLists = ["All", ...new Set(tasks.map(t => t.List).filter(Boolean))];

  // Sort tasks by date ascending, tasks without date go last
  const sorted = [...tasks].sort((a, b) => {
    if (!a.Date && !b.Date) return 0;
    if (!a.Date) return 1;
    if (!b.Date) return -1;
    return a.Date.localeCompare(b.Date);
  });

  const filtered = filterList === "All" ? sorted : sorted.filter(t => t.List === filterList);

  async function deleteTask(id) {
    try {
      await todoService.deleteTodo(id);
      fetchTasks();
    } catch (e) {
      console.error("Failed to delete task", e);
    }
  }

  async function toggleCheck(task) {
    try {
      await todoService.updateTodo(task._id, { Checked: !task.Checked });
      fetchTasks();
    } catch (e) {
      console.error("Failed to update task", e);
    }
  }

  return (
    <div className="stickyWallPage">
      {/* Header */}
      <div className="stickyHeader">
        <button className="btnWhite CloseOpen" onClick={closeOpen}>
          <i className={iconCLS}></i>
        </button>
        <h1 className="Heading stickyTitle">
          <i className="fa-solid fa-note-sticky" style={{ marginRight: "10px", color: "var(--accent-color)" }}></i>
          Sticky Wall
        </h1>
        <button className="stickyAddBtn" onClick={() => setTask()}>
          <i className="fa-solid fa-plus"></i> Add Task
        </button>
      </div>

      {/* Stats bar */}
      <div className="stickyStats">
        <span className="statChip">{tasks.length} Total</span>
        <span className="statChip done">{tasks.filter(t => t.Checked).length} Done</span>
        <span className="statChip pending">{tasks.filter(t => !t.Checked).length} Pending</span>
      </div>

      {/* Filter by list */}
      <div className="stickyFilters">
        {uniqueLists.map(list => {
          const color = list === "All" ? null : getListColor(list);
          return (
            <button
              key={list}
              className={`filterChip${filterList === list ? " activeFilter" : ""}`}
              style={filterList === list && color ? {
                backgroundColor: color.accent,
                color: "#fff",
                borderColor: color.accent,
              } : {}}
              onClick={() => setFilterList(list)}
            >
              {list}
            </button>
          );
        })}
      </div>

      {/* Task Cards */}
      <div className="stickyCards">
        {filtered.length === 0 ? (
          <div className="stickyEmpty">
            <i className="fa-solid fa-inbox"></i>
            <p>No tasks found</p>
            <button className="stickyAddBtn" onClick={() => setTask()}>+ Add a Task</button>
          </div>
        ) : (
          filtered.map(task => {
            const color = getListColor(task.List);
            return (
              <div
                key={task._id}
                className={`stickyCard${task.Checked ? " stickyCardDone" : ""}`}
                style={{
                  backgroundColor: color.bg,
                  borderLeft: `5px solid ${color.accent}`,
                }}
              >
                {/* Checkbox */}
                <button className="stickyCheckBtn" onClick={() => toggleCheck(task)}>
                  {task.Checked
                    ? <FaCheckCircle style={{ color: color.accent, fontSize: "1.3rem" }} />
                    : <FaRegCircle style={{ color: color.accent, fontSize: "1.3rem", opacity: 0.5 }} />
                  }
                </button>

                {/* Main content */}
                <div className="stickyCardContent">
                  <div className="stickyCardTop">
                    <h4
                      className="stickyCardTitle"
                      style={{
                        color: color.text,
                        textDecoration: task.Checked ? "line-through" : "none",
                      }}
                    >
                      {task.Title}
                    </h4>
                    <div className="stickyCardMeta">
                      {task.List && (
                        <span className="stickyBadge" style={{ backgroundColor: color.accent, color: "#fff" }}>
                          <FaTag style={{ marginRight: "4px", fontSize: "0.65rem" }} />
                          {task.List}
                        </span>
                      )}
                      {task.Date && (
                        <span className="stickyDate" style={{ color: color.text }}>
                          <FaCalendarAlt style={{ marginRight: "4px", fontSize: "0.7rem" }} />
                          {task.Date}
                        </span>
                      )}
                    </div>
                  </div>
                  {task.Description && (
                    <p className="stickyCardDesc" style={{ color: color.text }}>
                      <FaAlignLeft style={{ marginRight: "5px", fontSize: "0.7rem", opacity: 0.6 }} />
                      {task.Description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="stickyCardActions">
                  <button
                    className="stickyActionBtn"
                    title="Edit"
                    onClick={() => setTask(task)}
                    style={{ color: color.accent }}
                  >
                    <FaPen />
                  </button>
                  <button
                    className="stickyActionBtn"
                    title="Delete"
                    onClick={() => deleteTask(task._id)}
                    style={{ color: "#e63946" }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default StickyWall;
