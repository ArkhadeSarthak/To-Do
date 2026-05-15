import { useNavigate } from "react-router-dom";
import React from "react";
import "../styles/components.css";

function SideBar({ todaysTaskCount, upcomingTaskCount, searchQuery, setSearchQuery, setTheme, theme, tasks, allAvailableLists, addUserList, logout }) {
  const navigate = useNavigate();

  function handleAddNewList() {
    const newListName = prompt("Enter new list name:");
    if (newListName && newListName.trim()) {
      addUserList(newListName.trim());
    }
  }

  // Calculate dynamic list counts
  const listCounts = {};
  if (tasks && tasks.length > 0) {
    tasks.forEach(task => {
      if (task.List) {
        listCounts[task.List] = (listCounts[task.List] || 0) + 1;
      }
    });
  }

  function toUpComing() {
    navigate("/upComing");
  }

  // Task counts passed as props

  return (
    <div className={"sidebarMain d-block"}>
      <div className="sidebarHeading">
        <h2 className="PrimaryBlack Heading">Menu</h2>
      </div>
      <div className="search">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          type="search"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
      </div>

      <h3 className="PrimaryBlack listHead">Tasks</h3>

      <div className="List">
        <div
          className="ListItem"
          onClick={() => navigate("/")}
          // style={{ backgroundColor: "#dad6fc" }}
        >
          <i className="fa-solid fa-list-ul"></i>
          <h5 className="PrimaryBlack">Today</h5>
          <div className="countCircle">
            <p className="count">{todaysTaskCount}</p>
          </div>
        </div>
        <div
          className="ListItem"
          onClick={toUpComing}
          // style={{ backgroundColor: "#dad6fc" }}
        >
          <i className="fa-solid fa-angles-right"></i>
          <h5 className="PrimaryBlack">Upcoming</h5>
          <div className="countCircle">
            <p className="count">{upcomingTaskCount}</p>
          </div>
        </div>
        <div className="ListItem" onClick={() => navigate("/calendar")}>
          <i className="fa-solid fa-calendar-days"></i>
          <h5 className="PrimaryBlack">Calender</h5>
          <div className="countCircle">
            <p className="count">{tasks ? tasks.length : 0}</p>
          </div>
        </div>
        <div className="ListItem" onClick={() => navigate("/stickyWall")}>
          <i className="fa-solid fa-note-sticky"></i>
          <h5 className="PrimaryBlack">Sticky Wall</h5>
          <div className="countCircle">
            <p className="count">{tasks ? tasks.length : 0}</p>
          </div>
        </div>
      </div>

      <h3 className="PrimaryBlack listHead">Lists</h3>
      <div className="List">
        {Object.keys(listCounts).map((listName) => (
          <div 
            className="ListItem" 
            key={listName}
            onClick={() => navigate(`/list/${listName}`)}
            style={{ cursor: 'pointer' }}
          >
            <div 
              className="listSquare" 
              style={{ backgroundColor: 'var(--accent-color)', width: '12px', height: '12px', borderRadius: '3px' }}
            ></div>
            <h5 className="PrimaryBlack">{listName}</h5>
            <div className="countCircle">
              <p className="count">{listCounts[listName]}</p>
            </div>
          </div>
        ))}
        <div className="ListItem" onClick={handleAddNewList}>
          <i className="fa-solid fa-plus"></i>
          <h5 className="PrimaryBlack" style={{ width: "80%" }}>
            Add New List
          </h5>
        </div>
      </div>

      <div className="sideBarFooter">
        <div onClick={() => navigate("/settings")} style={{ cursor: 'pointer' }}>
          <i className="fa-solid fa-sliders"></i>
          <h4 className="PrimaryBlack">Settings</h4>
        </div>
        <div className="themeOption">
          <i className={theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun"}></i>
          <h4 className="PrimaryBlack" style={{marginRight: '15px'}}>Theme</h4>
          <div className="themeCircles">
            <span className="themeCircle light" onClick={() => setTheme('light')} title="Light Theme"></span>
            <span className="themeCircle dark" onClick={() => setTheme('dark')} title="Dark Theme"></span>
            <span className="themeCircle blue" onClick={() => setTheme('blue')} title="Blue Theme"></span>
          </div>
        </div>
        <div onClick={logout} style={{ cursor: 'pointer' }}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <h4 className="PrimaryBlack">LogOut</h4>
        </div>
      </div>
    </div>
  )
}

export default SideBar;
