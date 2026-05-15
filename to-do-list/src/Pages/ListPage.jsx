import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FaTrash, FaPen, FaCheckCircle, FaRegCircle, FaCalendarAlt, FaTag, FaAlignLeft } from "react-icons/fa";
import todoService from "../services/todoService";
import "../styles/today.css"; // Reuse Today's styling for consistency

function ListPage({ closeOpen, iconCLS, setTask, tasks, fetchTasks, searchQuery }) {
  const { listName } = useParams();

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

  const filteredTasks = tasks.filter(
    (item) =>
      item.List === listName &&
      item.Title.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  const [selected, setSelected] = useState(null);

  const doneCount = filteredTasks.filter((t) => t.Checked).length;
  const pendingCount = filteredTasks.length - doneCount;

  return (
    <div className="todayPage">
      {/* Header */}
      <div className="tpHeader">
        <button className="btnWhite CloseOpen" onClick={closeOpen}>
          <i className={iconCLS}></i>
        </button>
        <div className="tpTitleGroup">
          <h1 className="tpTitle">{listName}</h1>
          <div className="tpStats">
            <span className="tpStatChip">{filteredTasks.length} Total</span>
            <span className="tpStatChip done">{doneCount} Done</span>
            <span className="tpStatChip pending">{pendingCount} Pending</span>
          </div>
        </div>
        <button className="tpAddBtn" onClick={() => setTask()}>
          <i className="fa-solid fa-plus"></i> Add Task
        </button>
      </div>

      {/* Main layout */}
      <div className="tpBody">
        <div className="tpListCol">
          {filteredTasks.length === 0 ? (
            <div className="tpEmpty">
              <i className="fa-solid fa-list-check"></i>
              <p>No tasks in this list</p>
              <button className="tpAddBtn" onClick={() => setTask()}>+ Add Task</button>
            </div>
          ) : (
            filteredTasks.map((e) => (
              <div
                key={e._id}
                className={`tpCard${e.Checked ? " tpCardDone" : ""}${selected?._id === e._id ? " tpCardActive" : ""}`}
                onClick={() => setSelected(e)}
              >
                <button className="tpCheckBtn" onClick={(ev) => { ev.stopPropagation(); checkboxChange(e); }}>
                  {e.Checked
                    ? <FaCheckCircle style={{ color: "var(--accent-color)", fontSize: "1.1rem" }} />
                    : <FaRegCircle style={{ color: "var(--accent-color)", fontSize: "1.1rem", opacity: 0.4 }} />
                  }
                </button>

                <div className="tpCardContent">
                  <h5 className={`tpCardTitle${e.Checked ? " tpCardTitleDone" : ""}`}>{e.Title}</h5>
                  <div className="tpCardMeta">
                    {e.Date && (
                      <span className="tpDate">
                        <FaCalendarAlt style={{ marginRight: "3px", fontSize: "0.65rem" }} />{e.Date}
                      </span>
                    )}
                  </div>
                  {e.Description && (
                    <p className="tpCardDesc">
                      <FaAlignLeft style={{ marginRight: "4px", fontSize: "0.65rem", opacity: 0.6 }} />
                      {e.Description}
                    </p>
                  )}
                </div>

                <div className="tpCardActions" onClick={(ev) => ev.stopPropagation()}>
                  <button className="tpActionBtn" title="Edit" onClick={() => setTask(e)}>
                    <FaPen style={{ color: "var(--accent-color)" }} />
                  </button>
                  <button className="tpActionBtn" title="Delete" onClick={() => deleteTask(e._id)}>
                    <FaTrash style={{ color: "#e63946" }} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail panel */}
        <div className={`tpDetailPanel${selected ? " tpDetailPanelOpen" : ""}`}>
          {selected ? (
            <>
              <div className="tpDetailHeader">
                <h3 className="tpDetailTitle">Task Detail</h3>
                <button className="tpDetailClose btnWhite" onClick={() => setSelected(null)}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <h4 className={`tpDetailName${selected.Checked ? " tpCardTitleDone" : ""}`}>{selected.Title}</h4>
              <div className="tpDetailRow">
                <span className="tpDetailLabel"><FaCalendarAlt /> Date</span>
                <span className="tpDetailValue">{selected.Date || "—"}</span>
              </div>
              <div className="tpDetailRow">
                <span className="tpDetailLabel"><FaAlignLeft /> Description</span>
              </div>
              <p className="tpDetailDesc">{selected.Description || "—"}</p>
              <div className="tpDetailActions">
                <button className="tpDetailEditBtn" onClick={() => { setTask(selected); setSelected(null); }}>
                  <FaPen style={{ marginRight: "6px" }} /> Edit Task
                </button>
              </div>
            </>
          ) : (
            <div className="tpDetailEmpty">
              <i className="fa-solid fa-arrow-pointer"></i>
              <p>Click a task to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListPage;
