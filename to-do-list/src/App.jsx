import { useState, useEffect } from "react";
import todoService from "./services/todoService";
import "./App.css";
import SideBar from "./components/SideBar";
import Today from "./Pages/Today";
import AddTask from "./components/AddTask";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import UpComing from "./Pages/UpComing";
import CalendarPage from "./Pages/CalendarPage";
import StickyWall from "./Pages/StickyWall";
import ListPage from "./Pages/ListPage";
import Settings from "./Pages/Settings";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { currentUser, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light"); // light, dark, blue
  const [userLists, setUserLists] = useState(JSON.parse(localStorage.getItem('userLists')) || []);

  const defaultLists = ["Personal", "Work", "List1"];
  const allAvailableLists = [...new Set([...defaultLists, ...userLists])];

  function addUserList(name) {
    if (name && !allAvailableLists.includes(name)) {
      const newLists = [...userLists, name];
      setUserLists(newLists);
      localStorage.setItem('userLists', JSON.stringify(newLists));
    }
  }

  const fetchTasks = async () => {
    try {
      const data = await todoService.getTodos(currentUser.email);
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const getLocalDateString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getLocalDateString(new Date());
  const todaysTaskCount = tasks.filter((item) => item.Date === todayDate).length;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomarrowDate = getLocalDateString(tomorrow);
  const upcomingTaskCount = tasks.filter((item) => item.Date >= tomarrowDate).length;

  const [clsForSideBar, setClsForSideBar] = useState("col-3 p-0 sidebar");
  const [isTrue, setIsTrue] = useState(true);
  const [clsForMain, setClsForMain] = useState("col-9");
  const [iconcls, setIconcls] = useState("fa-solid fa-angles-left");
  
  function sidebarHideShow() {
    if (isTrue) {
      setIconcls("fa-solid fa-angles-right");
      setClsForSideBar("col-0 d-none p-0 sidebar");
      setIsTrue(false);
      setClsForMain("col-12");
    } else {
      setIconcls("fa-solid fa-angles-left");
      setClsForSideBar("col-3 p-0 sidebar");
      setIsTrue(true);
      setClsForMain("col-9");
    }
  }

  const [editingTask, setEditingTask] = useState(null);
  const [clsForAddTask, setclsForAddTask] = useState("d-none");
  const [styles, setStyle] = useState({ filter: "blur(0px)" });

  function addTaskBtn(task = null) {
    setEditingTask(task);
    setStyle({ filter: "blur(15px)" });
    setclsForAddTask("d-block");
  }

  function closeAddTask() {
    setStyle({ filter: "blur(0px)" });
    setclsForAddTask("d-none");
    setEditingTask(null);
  }

  if (!currentUser) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className={`container-fluid theme-${theme}`}>
        <div className="row p-0 appMain" style={styles}>
          <div className={clsForSideBar}>
            <SideBar 
              todaysTaskCount={todaysTaskCount} 
              upcomingTaskCount={upcomingTaskCount}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setTheme={setTheme}
              theme={theme}
              tasks={tasks}
              allAvailableLists={allAvailableLists}
              addUserList={addUserList}
              logout={logout}
            />
          </div>
          <div className={clsForMain}>
            <Routes>
              <Route path="/" element={<Today closeOpen={sidebarHideShow} iconCLS={iconcls} setTask={addTaskBtn} tasks={tasks} fetchTasks={fetchTasks} searchQuery={searchQuery} />} />
              <Route path="/upComing" element={<UpComing closeOpen={sidebarHideShow} iconCLS={iconcls} setTask={addTaskBtn} tasks={tasks} fetchTasks={fetchTasks} searchQuery={searchQuery} />} />
              <Route path="/stickyWall" element={<StickyWall closeOpen={sidebarHideShow} iconCLS={iconcls} setTask={addTaskBtn} tasks={tasks} fetchTasks={fetchTasks} />} />
              <Route path="/calendar" element={<CalendarPage closeOpen={sidebarHideShow} iconCLS={iconcls} setTask={addTaskBtn} tasks={tasks} fetchTasks={fetchTasks} />} />
              <Route path="/list/:listName" element={<ListPage closeOpen={sidebarHideShow} iconCLS={iconcls} setTask={addTaskBtn} tasks={tasks} fetchTasks={fetchTasks} searchQuery={searchQuery} />} />
              <Route path="/settings" element={<Settings closeOpen={sidebarHideShow} iconCLS={iconcls} tasks={tasks} />} />
              <Route path="*" element={<Today closeOpen={sidebarHideShow} iconCLS={iconcls} setTask={addTaskBtn} tasks={tasks} fetchTasks={fetchTasks} searchQuery={searchQuery} />} />
            </Routes>
          </div>
        </div>
        <div className={clsForAddTask}>
          <AddTask closeAddTask={closeAddTask} allAvailableLists={allAvailableLists} editingTask={editingTask} fetchTasks={fetchTasks} />
        </div>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
