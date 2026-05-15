import React from "react";
import { FaTrash, FaPen, FaCheckCircle, FaRegCircle, FaCalendarAlt, FaTag, FaAlignLeft } from "react-icons/fa";
import todoService from "../services/todoService";
import "../styles/upcoming.css";

function UpComing({ closeOpen, iconCLS, setTask, tasks, fetchTasks, searchQuery }) {

  async function deleteTask(id) {
    try {
      await todoService.deleteTodo(id);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  }

  async function checkboxChange(task) {
    try {
      await todoService.updateTodo(task._id, { Checked: !task.Checked });
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  }

  const getLocalDateString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayDate = getLocalDateString(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomarrowDate = getLocalDateString(tomorrow);

  const q = (searchQuery || "").toLowerCase();
  const todaysTask    = tasks.filter((i) => i.Date === todayDate   && i.Title.toLowerCase().includes(q));
  const tomarrowTask  = tasks.filter((i) => i.Date === tomarrowDate && i.Title.toLowerCase().includes(q));
  const NextTask      = tasks.filter((i) => i.Date > tomarrowDate  && i.Title.toLowerCase().includes(q));

  const totalUpcoming = tomarrowTask.length + NextTask.length;

  function TaskCard({ e }) {
    return (
      <div className={`upCard${e.Checked ? " upCardDone" : ""}`}>
        <button className="upCheckBtn" onClick={() => checkboxChange(e)}>
          {e.Checked
            ? <FaCheckCircle style={{ color: "var(--accent-color)", fontSize: "1.05rem" }} />
            : <FaRegCircle   style={{ color: "var(--accent-color)", fontSize: "1.05rem", opacity: 0.4 }} />
          }
        </button>
        <div className="upCardContent">
          <h5 className={`upCardTitle${e.Checked ? " upCardTitleDone" : ""}`}>{e.Title}</h5>
          <div className="upCardMeta">
            {e.List && (
              <span className="upBadge">
                <FaTag style={{ marginRight: "3px", fontSize: "0.6rem" }} />{e.List}
              </span>
            )}
            {e.Date && (
              <span className="upDate">
                <FaCalendarAlt style={{ marginRight: "3px", fontSize: "0.65rem" }} />{e.Date}
              </span>
            )}
          </div>
          {e.Description && (
            <p className="upCardDesc">
              <FaAlignLeft style={{ marginRight: "4px", fontSize: "0.65rem", opacity: 0.6 }} />
              {e.Description}
            </p>
          )}
        </div>
        <div className="upCardActions">
          <button className="upActionBtn" title="Edit" onClick={() => setTask(e)}>
            <FaPen style={{ color: "var(--accent-color)" }} />
          </button>
          <button className="upActionBtn" title="Delete" onClick={() => deleteTask(e._id)}>
            <FaTrash style={{ color: "#e63946" }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="upPage">
      {/* ── Header ── */}
      <div className="upHeader">
        <button className="btnWhite CloseOpen" onClick={closeOpen}>
          <i className={iconCLS}></i>
        </button>
        <div className="upTitleGroup">
          <h1 className="upTitle">Upcoming</h1>
          <div className="upStats">
            <span className="upStatChip">{totalUpcoming} Upcoming</span>
            <span className="upStatChip today">{todaysTask.length} Today</span>
          </div>
        </div>
        <button className="upAddBtn" onClick={() => setTask()}>
          <i className="fa-solid fa-plus"></i> Add Task
        </button>
      </div>

      {/* ── Three columns ── */}
      <div className="upColumns">

        {/* Today column */}
        <div className="upCol">
          <div className="upColHeader upColHeaderToday">
            <h3 className="upColTitle">Today</h3>
            <span className="upColCount">{todaysTask.length}</span>
          </div>
          <div className="upColBody">
            {todaysTask.length === 0
              ? <div className="upEmpty"><i className="fa-solid fa-sun"></i><p>All clear!</p></div>
              : todaysTask.map((e) => <TaskCard key={e._id} e={e} />)
            }
          </div>
        </div>

        {/* Tomorrow column */}
        <div className="upCol">
          <div className="upColHeader upColHeaderTomorrow">
            <h3 className="upColTitle">Tomorrow</h3>
            <span className="upColCount">{tomarrowTask.length}</span>
          </div>
          <div className="upColBody">
            {tomarrowTask.length === 0
              ? <div className="upEmpty"><i className="fa-solid fa-moon"></i><p>Nothing yet</p></div>
              : tomarrowTask.map((e) => <TaskCard key={e._id} e={e} />)
            }
          </div>
        </div>

        {/* Next Tasks column */}
        <div className="upCol">
          <div className="upColHeader upColHeaderNext">
            <h3 className="upColTitle">Next Tasks</h3>
            <span className="upColCount">{NextTask.length}</span>
          </div>
          <div className="upColBody">
            {NextTask.length === 0
              ? <div className="upEmpty"><i className="fa-solid fa-calendar"></i><p>No future tasks</p></div>
              : NextTask.map((e) => <TaskCard key={e._id} e={e} />)
            }
          </div>
        </div>

      </div>
    </div>
  );
}

export default UpComing;
