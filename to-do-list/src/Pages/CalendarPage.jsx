import React, { useState } from "react";
import { FaTrash, FaCheckCircle, FaRegCircle, FaPen } from "react-icons/fa";
import todoService from "../services/todoService";
import { useAuth } from "../context/AuthContext";
import "../styles/calendar.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function CalendarPage({ closeOpen, iconCLS, setTask, tasks, fetchTasks }) {
  const { currentUser } = useAuth();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Navigate months
  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  // Get YYYY-MM-DD string for a day number
  function dateStr(day) {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${viewYear}-${m}-${d}`;
  }

  // Today string
  const todayStr = (() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
  })();

  // Tasks for a given date string
  function tasksForDate(ds) {
    return tasks.filter(t => t.Date === ds);
  }

  // Tasks for the selected date
  const selectedTasks = selectedDate ? tasksForDate(selectedDate) : [];

  async function deleteTask(id) {
    try {
      await todoService.deleteTodo(id, currentUser.email);
      fetchTasks();
    } catch (e) {
      console.error("Failed to delete task", e);
    }
  }

  async function toggleCheck(task) {
    try {
      await todoService.updateTodo(task._id, { ...task, Checked: !task.Checked, userEmail: currentUser.email });
      fetchTasks();
    } catch (e) {
      console.error("Failed to update task", e);
    }
  }

  // Build grid cells: leading blanks + days
  const cells = [];
  for (let b = 0; b < firstDay; b++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="calendarPage">
      {/* Header */}
      <div className="calendarHeader">
        <button className="btnWhite CloseOpen" onClick={closeOpen}>
          <i className={iconCLS}></i>
        </button>
        <h1 className="Heading calendarTitle">Calendar</h1>
        <button className="addTaskCalBtn" onClick={() => setTask()}>
          <i className="fa-solid fa-plus"></i> Add Task
        </button>
      </div>

      {/* Month navigation */}
      <div className="calMonthNav">
        <button className="calNavBtn" onClick={prevMonth}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h2 className="calMonthTitle">{MONTHS[viewMonth]} {viewYear}</h2>
        <button className="calNavBtn" onClick={nextMonth}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      {/* Day-of-week header */}
      <div className="calDayHeaders">
        {DAYS.map(d => <div key={d} className="calDayLabel">{d}</div>)}
      </div>

      {/* Calendar grid */}
      <div className="calGrid">
        {cells.map((day, idx) => {
          if (!day) return <div key={`blank-${idx}`} className="calCell calCellBlank" />;
          const ds = dateStr(day);
          const dayTasks = tasksForDate(ds);
          const isToday = ds === todayStr;
          const isSelected = ds === selectedDate;
          return (
            <div
              key={ds}
              className={`calCell${isToday ? " calCellToday" : ""}${isSelected ? " calCellSelected" : ""}`}
              onClick={() => setSelectedDate(ds)}
            >
              <span className={`calDayNum${isToday ? " calDayNumToday" : ""}`}>{day}</span>
              <div className="calTaskChips">
                {dayTasks.slice(0, 2).map(t => (
                  <div key={t._id} className={`calChip${t.Checked ? " calChipDone" : ""}`}>
                    {t.Title.length > 14 ? t.Title.slice(0, 13) + "…" : t.Title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="calChipMore">+{dayTasks.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected date task detail */}
      {selectedDate && (
        <div className="calDetailSection">
          <div className="calDetailHeader">
            <h3 className="calDetailTitle">
              <i className="fa-solid fa-calendar-day"></i>&nbsp;
              Tasks for {selectedDate}
            </h3>
            <span className="calDetailCount">{selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""}</span>
          </div>

          {selectedTasks.length === 0 ? (
            <div className="calNoTasks">
              <i className="fa-solid fa-inbox"></i>
              <p>No tasks on this day</p>
              <button className="calAddEmptyBtn" onClick={() => setTask()}>+ Add a Task</button>
            </div>
          ) : (
            <div className="calTaskList">
              {selectedTasks.map(task => (
                <div key={task._id} className={`calTaskCard${task.Checked ? " calTaskCardDone" : ""}`}>
                  <button className="calCheckBtn" onClick={() => toggleCheck(task)}>
                    {task.Checked
                      ? <FaCheckCircle style={{ color: "var(--accent-color)" }} />
                      : <FaRegCircle style={{ color: "var(--accent-color)", opacity: 0.4 }} />
                    }
                  </button>
                  <div className="calTaskInfo">
                    <h5 className={`calTaskTitle${task.Checked ? " calTaskTitleDone" : ""}`}>{task.Title}</h5>
                    <div className="calTaskMeta">
                      {task.List && <span className="calTaskBadge">{task.List}</span>}
                      {task.Description && <p className="calTaskDesc">{task.Description}</p>}
                    </div>
                  </div>
                  <button className="calEditBtn btnWhite" onClick={() => setTask(task)} title="Edit">
                    <FaPen style={{ color: "var(--accent-color)" }} />
                  </button>
                  <button className="calDeleteBtn btnWhite" onClick={() => deleteTask(task._id)} title="Delete">
                    <FaTrash style={{ color: "red" }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
