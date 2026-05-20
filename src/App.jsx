import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  LayoutDashboard,
  LogOut,
  Sun,
  Moon,
  Bell,
  MapPin,
  Menu,
  X,
  Compass,
  Briefcase
} from "lucide-react";
import { initDB, createTask, updateTask, addComment, deleteTask } from "./utils/data";
import Login from "./components/Login";
import LocationSelection from "./components/LocationSelection";
import DepartmentSelection from "./components/DepartmentSelection";
import Dashboard from "./components/Dashboard";
import MembersPage from "./components/MembersPage";
import TaskModal from "./components/TaskModal";

export default function App() {
  // Global States
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [screen, setScreen] = useState("login"); // login, location-select, department-select, dashboard, members
  
  const [activeLocation, setActiveLocation] = useState("");
  const [activeDepartment, setActiveDepartment] = useState(""); // empty string means "all"
  
  const [theme, setTheme] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [preselectedAssignee, setPreselectedAssignee] = useState(null);

  // Notifications feed state
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to Diwya Spices Portal", time: "Just now", unread: true },
    { id: 2, text: "ISO 22000 Food Safety Audit in progress", time: "1 hour ago", unread: true },
    { id: 3, text: "Database cloud migration dry run at 10 PM", time: "3 hours ago", unread: false }
  ]);

  // Seed local database on start
  useEffect(() => {
    initDB();
    const storedTheme = localStorage.getItem("ceo_task_theme") || "dark";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);

    // Auto-login if session token resides in local storage
    const storedUser = localStorage.getItem("ceo_task_active_user");
    const storedToken = localStorage.getItem("ceo_task_active_token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setScreen("location-select");
    }
  }, []);

  const handleLoginSuccess = (userProfile, sessionToken) => {
    setUser(userProfile);
    setToken(sessionToken);
    localStorage.setItem("ceo_task_active_user", JSON.stringify(userProfile));
    localStorage.setItem("ceo_task_active_token", sessionToken);
    
    // Redirect staff/managers straight to their assigned workplace location
    if (userProfile.role !== "CEO") {
      setActiveLocation(userProfile.location);
      setActiveDepartment(userProfile.department);
      setScreen("dashboard");
    } else {
      setScreen("location-select");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("ceo_task_active_user");
    localStorage.removeItem("ceo_task_active_token");
    setScreen("login");
    setActiveLocation("");
    setActiveDepartment("");
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("ceo_task_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  // Location and department selectors
  const handleSelectLocation = (loc) => {
    setActiveLocation(loc);
    setActiveDepartment(""); // default: All
    setScreen("department-select");
  };

  const handleSelectDepartment = (dept) => {
    setActiveDepartment(dept);
    setScreen("dashboard");
  };

  // Quick sandbox tester to swap roles
  const handleSandboxRoleSwap = (role) => {
    let mockUserObj = {};
    if (role === "CEO") {
      mockUserObj = {
        username: "ceo",
        email: "ceo@diwyaspices.com",
        name: "Sarah Alwis",
        role: "CEO",
        position: "Chief Executive Officer",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
        location: "Head Office",
        department: "Executive"
      };
      setUser(mockUserObj);
      setScreen("location-select");
      setActiveLocation("");
      setActiveDepartment("");
    } else if (role === "Manager") {
      mockUserObj = {
        username: "roshan.ops",
        email: "roshan.perera@diwyaspices.com",
        name: "Roshan Perera",
        role: "Manager",
        position: "Head of Operations",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
        location: "Head Office",
        department: "Operations"
      };
      setUser(mockUserObj);
      setActiveLocation("Head Office");
      setActiveDepartment("Operations");
      setScreen("dashboard");
    } else if (role === "Staff") {
      mockUserObj = {
        username: "nuwan.it",
        email: "nuwan.fernando@diwyaspices.com",
        name: "Nuwan Fernando",
        role: "Staff",
        position: "Senior Systems Engineer",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
        location: "Head Office",
        department: "IT"
      };
      setUser(mockUserObj);
      setActiveLocation("Head Office");
      setActiveDepartment("IT");
      setScreen("dashboard");
    }
    // Update active storage
    localStorage.setItem("ceo_task_active_user", JSON.stringify(mockUserObj));
  };

  // CRUD handlers linked to TaskModal
  const handleSaveTask = (taskId, fields) => {
    if (taskId) {
      // Modify existing
      if (fields.commentToAdd) {
        addComment(taskId, fields.commentToAdd, user.name, user.role);
        
        // Append dynamic notification
        setNotifications((prev) => [
          {
            id: Date.now(),
            text: `${user.name} commented on directive #${taskId}`,
            time: "Just now",
            unread: true
          },
          ...prev
        ]);
      } else {
        updateTask(taskId, fields, user.name, user.role);
      }
    } else {
      // Create new
      createTask(fields, user.name, user.role);
      
      setNotifications((prev) => [
        {
          id: Date.now(),
          text: `New task assigned: "${fields.title}"`,
          time: "Just now",
          unread: true
        },
        ...prev
      ]);
    }
    
    // Refresh modal states
    setSelectedTask(null);
    setIsAssigning(false);
    setPreselectedAssignee(null);
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId, user.name, user.role);
    setSelectedTask(null);
  };

  const handleOpenAssignToUser = (staff) => {
    setPreselectedAssignee(staff);
    setIsAssigning(true);
  };

  const handleViewTaskDetail = (task) => {
    setSelectedTask(task);
  };

  // Read notification badge helper
  const unreadNotificationsCount = notifications.filter((n) => n.unread).length;
  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Render Login page if no active user session
  if (screen === "login" || !user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Render Workplace Location cards if CEO selects site
  if (screen === "location-select" && user.role === "CEO") {
    return (
      <LocationSelection
        user={user}
        onSelectLocation={handleSelectLocation}
        onLogout={handleLogout}
      />
    );
  }

  // Render Department card grid if CEO selects site
  if (screen === "department-select" && user.role === "CEO") {
    return (
      <DepartmentSelection
        location={activeLocation}
        onSelectDepartment={handleSelectDepartment}
        onBackToLocations={() => setScreen("location-select")}
      />
    );
  }

  return (
    <div className="portal-layout animate-fade">
      {/* Side Navigation panel */}
      <aside className={`glass-card portal-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Building2 className="brand-ico" />
            <span>DIWYA SPICES</span>
          </div>
          <button className="sidebar-close-mobile" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-location-pill">
          <MapPin size={14} className="pill-pin-ico" />
          <span className="pill-loc-txt">{activeLocation}</span>
          {activeDepartment && <span className="pill-dept-txt">/{activeDepartment}</span>}
        </div>

        {/* Sidebar Nav Items */}
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${screen === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setScreen("dashboard");
              setSidebarOpen(false);
            }}
          >
            <LayoutDashboard size={18} />
            <span>General Dashboard</span>
          </button>

          <button
            className={`nav-item ${screen === "members" ? "active" : ""}`}
            onClick={() => {
              setScreen("members");
              setSidebarOpen(false);
            }}
          >
            <Users size={18} />
            <span>Department Roster</span>
          </button>

          {user.role === "CEO" && (
            <button
              className="nav-item"
              onClick={() => {
                setScreen("location-select");
                setSidebarOpen(false);
              }}
            >
              <Compass size={18} />
              <span>Locations Hub</span>
            </button>
          )}

          {user.role === "CEO" && (
            <button
              className="nav-item"
              onClick={() => {
                setScreen("department-select");
                setSidebarOpen(false);
              }}
            >
              <Briefcase size={18} />
              <span>Departments Hub</span>
            </button>
          )}
        </nav>

        {/* Sandbox Role Swapper at Sidebar Footer */}
        <div className="sandbox-panel glass-card">
          <div className="sandbox-title">Sandbox Tester Roles</div>
          <div className="sandbox-buttons">
            <button
              className={`sandbox-btn ${user.role === "CEO" ? "active" : ""}`}
              onClick={() => handleSandboxRoleSwap("CEO")}
            >
              CEO Profile
            </button>
            <button
              className={`sandbox-btn ${user.role === "Manager" ? "active" : ""}`}
              onClick={() => handleSandboxRoleSwap("Manager")}
            >
              Manager View
            </button>
            <button
              className={`sandbox-btn ${user.role === "Staff" ? "active" : ""}`}
              onClick={() => handleSandboxRoleSwap("Staff")}
            >
              Staff View
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="sidebar-user-footer">
          <div className="user-mini-card">
            <img src={user.avatar} alt={user.name} className="user-mini-avatar" />
            <div className="user-mini-meta">
              <span className="user-mini-name">{user.name}</span>
              <span className="user-mini-role">{user.position}</span>
            </div>
          </div>
          <button className="logout-mini-btn" onClick={handleLogout} title="Logout Portal">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="portal-main-frame">
        {/* Navigation Navbar */}
        <header className="portal-navbar glass-card">
          <div className="navbar-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="navbar-breadcrumbs">
              <span className="crumb">{activeLocation}</span>
              {activeDepartment ? (
                <>
                  <span className="divider">/</span>
                  <span className="crumb active">{activeDepartment}</span>
                </>
              ) : (
                <>
                  <span className="divider">/</span>
                  <span className="crumb active">All Divisions</span>
                </>
              )}
            </div>
          </div>

          <div className="navbar-right">
            {/* Dark Mode Switch */}
            <button className="navbar-action-btn" onClick={toggleTheme} title="Switch Theme">
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notification Badge */}
            <div className="notifications-wrapper">
              <button
                className="navbar-action-btn relative"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) handleMarkNotificationsRead();
                }}
              >
                <Bell size={18} />
                {unreadNotificationsCount > 0 && (
                  <span className="unread-dot-badge">{unreadNotificationsCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notifications-dropdown glass-card animate-fade">
                  <div className="notif-header">
                    <h4>Notifications</h4>
                    <button className="notif-close" onClick={() => setShowNotifications(false)}>
                      <X size={14} />
                    </button>
                  </div>
                  <div className="notif-list">
                    {notifications.map((n) => (
                      <div key={n.id} className={`notif-item ${n.unread ? "unread" : ""}`}>
                        <p className="notif-text">{n.text}</p>
                        <span className="notif-time">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* View Switcher Container */}
        <main className="portal-viewport">
          {screen === "dashboard" ? (
            <Dashboard
              location={activeLocation}
              department={activeDepartment}
              user={user}
              onAssignNewTask={() => setIsAssigning(true)}
              onSelectTask={handleViewTaskDetail}
              onGoToMembers={() => setScreen("members")}
            />
          ) : (
            <MembersPage
              location={activeLocation}
              department={activeDepartment}
              onAssignTaskToUser={handleOpenAssignToUser}
              onViewTaskDetails={handleViewTaskDetail}
            />
          )}
        </main>
      </div>

      {/* Task Creation / Audit Inspector Modal */}
      {(isAssigning || selectedTask) && (
        <TaskModal
          task={selectedTask}
          user={user}
          location={activeLocation}
          department={activeDepartment}
          preselectedStaff={preselectedAssignee}
          onClose={() => {
            setSelectedTask(null);
            setIsAssigning(false);
            setPreselectedAssignee(null);
          }}
          onSaveTask={handleSaveTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* Layout Styles */}
      <style>{`
        .portal-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg-gradient);
        }

        .portal-sidebar {
          width: 260px;
          display: flex;
          flex-direction: column;
          border-radius: 0;
          border: none;
          border-right: 1px solid var(--sidebar-border);
          background: var(--sidebar-bg);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          padding: 24px;
          transition: transform var(--transition-speed) var(--transition-ease);
        }

        @media (max-width: 1024px) {
          .portal-sidebar {
            transform: translateX(-100%);
          }
          .portal-sidebar.open {
            transform: translateX(0);
          }
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        .brand-ico {
          color: var(--primary);
          width: 20px;
          height: 20px;
        }

        .sidebar-close-mobile {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .sidebar-close-mobile {
            display: block;
          }
        }

        .sidebar-location-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid var(--card-border);
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        [data-theme='dark'] .sidebar-location-pill {
          background: rgba(0, 0, 0, 0.2);
        }

        .pill-pin-ico {
          color: var(--primary);
        }

        .pill-loc-txt {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .pill-dept-txt {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.2);
          color: var(--text-primary);
          transform: translateX(4px);
        }

        [data-theme='dark'] .nav-item:hover {
          background: rgba(0, 0, 0, 0.15);
        }

        .nav-item.active {
          background: var(--primary-glow);
          color: var(--primary);
        }

        .sandbox-panel {
          padding: 12px;
          margin-bottom: 20px;
          border: 1px dashed var(--card-border);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sandbox-title {
          font-size: 0.65rem;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          text-align: center;
        }

        .sandbox-buttons {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sandbox-btn {
          padding: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          border-radius: 6px;
          border: 1px solid var(--card-border);
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        [data-theme='dark'] .sandbox-btn {
          background: rgba(0, 0, 0, 0.1);
        }

        .sandbox-btn:hover {
          background: var(--primary-glow);
          color: var(--primary);
        }

        .sandbox-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .sidebar-user-footer {
          border-top: 1px solid var(--card-border);
          padding-top: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .user-mini-card {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0; /* truncate text fix */
        }

        .user-mini-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--primary);
        }

        .user-mini-meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
          line-height: 1.2;
        }

        .user-mini-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-mini-role {
          font-size: 0.65rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-mini-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logout-mini-btn:hover {
          color: var(--danger);
        }

        .portal-main-frame {
          flex-grow: 1;
          margin-left: 260px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding: 24px;
        }

        @media (max-width: 1024px) {
          .portal-main-frame {
            margin-left: 0;
            padding: 16px;
          }
        }

        .portal-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          margin-bottom: 24px;
        }

        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .mobile-menu-btn {
            display: block;
          }
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .navbar-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .crumb {
          color: var(--text-muted);
        }

        .crumb.active {
          color: var(--text-primary);
        }

        .divider {
          color: var(--text-muted);
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .navbar-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid var(--card-border);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        [data-theme='dark'] .navbar-action-btn {
          background: rgba(0, 0, 0, 0.15);
        }

        .navbar-action-btn:hover {
          background: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }

        .relative {
          position: relative;
        }

        .unread-dot-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: var(--danger);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 5px;
          border-radius: 50%;
        }

        .notifications-wrapper {
          position: relative;
        }

        .notifications-dropdown {
          position: absolute;
          right: 0;
          top: 44px;
          width: 320px;
          padding: 16px;
          z-index: 200;
          border-radius: 12px;
        }

        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 8px;
          margin-bottom: 12px;
        }

        .notif-header h4 {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .notif-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .notif-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 200px;
          overflow-y: auto;
        }

        .notif-item {
          padding: 8px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid var(--card-border);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        [data-theme='dark'] .notif-item {
          background: rgba(0, 0, 0, 0.1);
        }

        .notif-item.unread {
          border-color: var(--primary);
          background: var(--primary-glow);
        }

        .notif-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .notif-time {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .portal-viewport {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
}
