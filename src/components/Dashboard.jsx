import React, { useState } from "react";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  ArrowRight,
  UserCheck,
  FileText,
  FileSpreadsheet,
  Calendar,
  MessageSquare
} from "lucide-react";
import { getTasks, getUsers, getActivities } from "../utils/mockData";
import { exportToCSV, exportToPDF } from "../utils/pdfExcelExport";

export default function Dashboard({
  location,
  department,
  user,
  onAssignNewTask,
  onSelectTask,
  onGoToMembers
}) {
  const allTasks = getTasks();
  const allUsers = getUsers();
  const allActivities = getActivities();

  const [taskSearch, setTaskSearch] = useState("");
  const [statusTab, setStatusTab] = useState("all"); // all, pending, in-progress, under-review, completed

  // Current date for overdue calculations: 2026-05-20
  const CURRENT_DATE_STR = "2026-05-20";

  // Filter tasks relative to active workspace/department configuration
  const siteTasks = allTasks.filter((t) => {
    const matchLocation = t.location === location;
    const matchDept = department ? t.department === department : true;
    return matchLocation && matchDept;
  });

  // Filter staff members relative to active configuration
  const siteStaff = allUsers.filter((u) => {
    const matchLocation = u.location === location;
    const matchDept = department ? u.department === department : true;
    return matchLocation && matchDept && u.role !== "CEO";
  });

  // Task aggregates
  const totalTasks = siteTasks.length;
  const pendingCount = siteTasks.filter((t) => t.status === "Pending").length;
  const inProgressCount = siteTasks.filter((t) => t.status === "In Progress").length;
  const reviewCount = siteTasks.filter((t) => t.status === "Under Review").length;
  const completedCount = siteTasks.filter((t) => t.status === "Completed").length;

  // Overdue calculation (Deadline passed and status not completed)
  const overdueTasks = siteTasks.filter((t) => {
    const isPastDue = t.deadline < CURRENT_DATE_STR;
    const isNotDone = t.status !== "Completed";
    return isPastDue && isNotDone;
  });
  const overdueCount = overdueTasks.length;

  // Filter active tasks lists based on search input and active tab selection
  const filteredTasksList = siteTasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(taskSearch.toLowerCase());

    const matchesStatus =
      statusTab === "all" ||
      t.status.replace(" ", "-").toLowerCase() === statusTab;

    return matchesSearch && matchesStatus;
  });

  // Compile performance rankings (Completion ratio per staff member)
  const performanceOverview = siteStaff.map((staff) => {
    const staffTasks = allTasks.filter((t) => t.assignedTo === staff.username);
    const completed = staffTasks.filter((t) => t.status === "Completed").length;
    const ratio = staffTasks.length > 0 ? Math.round((completed / staffTasks.length) * 100) : 0;
    return { ...staff, total: staffTasks.length, completed, ratio };
  });

  // Handle exports
  const handleExportExcel = () => {
    const reportTitle = `${location.replace(/ /g, "_")}${department ? `_${department}` : ""}_Task_Report`;
    exportToCSV(siteTasks, reportTitle);
  };

  const handleExportPDF = () => {
    exportToPDF(siteTasks, {
      activeLocation: location,
      activeDepartment: department || "All Departments",
      generatedBy: user.name
    });
  };

  return (
    <div className="dashboard-content animate-fade">
      {/* Upper Analytics Bar */}
      <div className="analytics-grid">
        <div className="glass-card stat-tile animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="stat-tile-header">
            <span className="stat-tile-label">Total Assigned</span>
            <div className="stat-icon-wrapper blue">
              <TrendingUp className="stat-icon" />
            </div>
          </div>
          <div className="stat-tile-value">{totalTasks}</div>
          <div className="stat-tile-footer">
            <span className="stat-trend positive">Active operations</span>
          </div>
        </div>

        <div className="glass-card stat-tile animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="stat-tile-header">
            <span className="stat-tile-label">Pending / In Progress</span>
            <div className="stat-icon-wrapper amber">
              <Clock className="stat-icon" />
            </div>
          </div>
          <div className="stat-tile-value">{pendingCount + inProgressCount + reviewCount}</div>
          <div className="stat-tile-footer">
            <span className="stat-trend warning">{reviewCount} in validation review</span>
          </div>
        </div>

        <div className="glass-card stat-tile animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <div className="stat-tile-header">
            <span className="stat-tile-label">Completed Tasks</span>
            <div className="stat-icon-wrapper green">
              <CheckCircle2 className="stat-icon" />
            </div>
          </div>
          <div className="stat-tile-value">{completedCount}</div>
          <div className="stat-tile-footer">
            <span className="stat-trend positive">
              {totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0}% success rate
            </span>
          </div>
        </div>

        <div className="glass-card stat-tile animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="stat-tile-header">
            <span className="stat-tile-label">Overdue Deliverables</span>
            <div className="stat-icon-wrapper red">
              <AlertTriangle className="stat-icon" />
            </div>
          </div>
          <div className="stat-tile-value urgent">{overdueCount}</div>
          <div className="stat-tile-footer">
            <span className={`stat-trend ${overdueCount > 0 ? "negative" : "positive"}`}>
              {overdueCount > 0 ? "Requires urgent attention" : "All deadlines clear"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Analytics Layout */}
      <div className="dashboard-double-layout">
        {/* Left Side: Custom Responsive Line Graph */}
        <div className="glass-card main-chart-card animate-slide-up" style={{ animationDelay: "0.25s" }}>
          <div className="chart-header">
            <div>
              <h3>Task Delivery Trends</h3>
              <p className="chart-subtitle">Quarterly productivity patterns and verification counts</p>
            </div>
            <div className="chart-legend">
              <span className="legend-dot completed"></span>
              <span className="legend-label">Target Completion</span>
            </div>
          </div>
          
          <div className="chart-canvas-wrapper">
            {/* Pure SVG Vector Line Chart */}
            <svg viewBox="0 0 500 200" className="svg-chart-render">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="1" />
              <line x1="40" y1="65" x2="480" y2="65" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="1" />
              <line x1="40" y1="110" x2="480" y2="110" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="1" />
              <line x1="40" y1="155" x2="480" y2="155" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="1" />
              
              {/* Glow Area Under Curve */}
              <path
                d="M 40 155 Q 120 120, 160 130 T 280 80 T 400 90 L 480 40 L 480 155 Z"
                fill="url(#chartGlow)"
              />
              
              {/* Line Curve */}
              <path
                d="M 40 155 Q 120 120, 160 130 T 280 80 T 400 90 L 480 40"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              
              {/* Graph Nodes */}
              <circle cx="40" cy="155" r="4.5" fill="var(--sidebar-bg)" stroke="var(--primary)" strokeWidth="3" />
              <circle cx="140" cy="125" r="4.5" fill="var(--sidebar-bg)" stroke="var(--primary)" strokeWidth="3" />
              <circle cx="250" cy="90" r="4.5" fill="var(--sidebar-bg)" stroke="var(--primary)" strokeWidth="3" />
              <circle cx="360" cy="85" r="4.5" fill="var(--sidebar-bg)" stroke="var(--primary)" strokeWidth="3" />
              <circle cx="480" cy="40" r="5.5" fill="var(--sidebar-bg)" stroke="var(--secondary)" strokeWidth="3" />
              
              {/* Month Labels */}
              <text x="40" y="180" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Jan</text>
              <text x="140" y="180" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Feb</text>
              <text x="250" y="180" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Mar</text>
              <text x="360" y="180" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Apr</text>
              <text x="480" y="180" fill="var(--text-muted)" fontSize="9" textAnchor="end">May (Q2)</text>
            </svg>
          </div>
        </div>

        {/* Right Side: Employee Performance Rankings */}
        <div className="glass-card leader-board-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="leader-header">
            <h3>Staff Completion Analytics</h3>
            <button className="leader-link-btn" onClick={onGoToMembers}>
              <span>Manage Roster</span>
              <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="leader-list scrollable-panel">
            {performanceOverview.length === 0 ? (
              <div className="no-leaders-alert">No assigned personnel.</div>
            ) : (
              performanceOverview.map((item) => (
                <div key={item.username} className="leader-item">
                  <img src={item.avatar} alt={item.name} className="leader-avatar" />
                  <div className="leader-info-block">
                    <div className="leader-name-row">
                      <span className="leader-name">{item.name}</span>
                      <span className="leader-percentage">{item.ratio}%</span>
                    </div>
                    <div className="leader-progress-wrapper">
                      <div
                        className="leader-progress-fill"
                        style={{
                          width: `${item.ratio}%`,
                          background: `linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)`
                        }}
                      ></div>
                    </div>
                    <span className="leader-count-txt">
                      {item.completed} of {item.total} deliverables audited
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Roster Controls and Tasks Board */}
      <div className="tasks-board-layout animate-slide-up" style={{ animationDelay: "0.35s" }}>
        <div className="glass-card board-main-card">
          <div className="board-header">
            <div className="board-title-block">
              <h3>Active Deliverables</h3>
              <p>Operational checklists tracked and assigned for resolution</p>
            </div>
            
            <div className="board-actions">
              {/* Search */}
              <div className="board-search">
                <Search size={16} className="board-search-icon" />
                <input
                  type="text"
                  placeholder="Query tasks, staff..."
                  className="board-search-input"
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                />
              </div>

              {/* Exports */}
              <div className="export-buttons-group">
                <button className="btn btn-secondary btn-icon" onClick={handleExportExcel} title="Export to Excel">
                  <FileSpreadsheet size={16} />
                  <span className="btn-label-desktop">Excel Export</span>
                </button>
                <button className="btn btn-secondary btn-icon" onClick={handleExportPDF} title="Export to PDF">
                  <FileText size={16} />
                  <span className="btn-label-desktop">PDF Audit</span>
                </button>
              </div>

              {/* CEO Direct Action */}
              {(user.role === "CEO" || user.role === "Manager") && (
                <button className="btn btn-primary direct-add-btn" onClick={() => onAssignNewTask(null)}>
                  <Plus size={16} />
                  <span>Assign Task</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Filters */}
          <div className="board-tabs-strip">
            <button className={`tab-btn ${statusTab === "all" ? "active" : ""}`} onClick={() => setStatusTab("all")}>
              All ({siteTasks.length})
            </button>
            <button className={`tab-btn ${statusTab === "pending" ? "active" : ""}`} onClick={() => setStatusTab("pending")}>
              Pending ({siteTasks.filter((t) => t.status === "Pending").length})
            </button>
            <button className={`tab-btn ${statusTab === "in-progress" ? "active" : ""}`} onClick={() => setStatusTab("in-progress")}>
              In Progress ({siteTasks.filter((t) => t.status === "In Progress").length})
            </button>
            <button className={`tab-btn ${statusTab === "under-review" ? "active" : ""}`} onClick={() => setStatusTab("under-review")}>
              Under Review ({siteTasks.filter((t) => t.status === "Under Review").length})
            </button>
            <button className={`tab-btn ${statusTab === "completed" ? "active" : ""}`} onClick={() => setStatusTab("completed")}>
              Completed ({siteTasks.filter((t) => t.status === "Completed").length})
            </button>
          </div>

          {/* Tasks Grid */}
          <div className="board-tasks-grid">
            {filteredTasksList.length === 0 ? (
              <div className="no-tasks-state">
                <Clock size={32} className="no-tasks-icon" />
                <p>No active tasks matching filter criteria.</p>
              </div>
            ) : (
              filteredTasksList.map((task) => {
                const assigneeProfile = allUsers.find((u) => u.username === task.assignedTo);
                const isOverdue = task.deadline < CURRENT_DATE_STR && task.status !== "Completed";

                return (
                  <div key={task.id} className="board-task-row" onClick={() => onSelectTask(task)}>
                    <div className="row-main-meta">
                      <span className="row-id">{task.id}</span>
                      <div className="row-title-block">
                        <h4 className="row-title">{task.title}</h4>
                        <p className="row-desc-trunc">{task.description}</p>
                      </div>
                    </div>

                    <div className="row-stats-block">
                      {/* Priority */}
                      <span className={`badge badge-${task.priority.toLowerCase()} row-badge`}>
                        {task.priority}
                      </span>

                      {/* Status */}
                      <span className={`badge badge-${task.status.replace(" ", "-").toLowerCase()} row-badge`}>
                        {task.status}
                      </span>

                      {/* Deadline */}
                      <div className={`row-deadline ${isOverdue ? "overdue-warn" : ""}`}>
                        <Calendar size={12} style={{ marginRight: 4 }} />
                        <span>{task.deadline}</span>
                        {isOverdue && <AlertTriangle size={12} className="overdue-warn-icon" />}
                      </div>

                      {/* Assignee Card */}
                      {assigneeProfile && (
                        <div className="row-assignee-card" title={`Assigned to ${assigneeProfile.name}`}>
                          <img src={assigneeProfile.avatar} alt={assigneeProfile.name} className="assignee-avatar-mini" />
                          <span className="assignee-name-mini">{assigneeProfile.name.split(" ")[0]}</span>
                        </div>
                      )}

                      {/* Feedbacks count */}
                      <div className="row-feedback-indicator" title={`${task.comments?.length || 0} feedback comments`}>
                        <MessageSquare size={12} />
                        <span>{task.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Action Logs Timeline */}
        <div className="glass-card timeline-card">
          <div className="timeline-header">
            <h3>Recent Audit Activities</h3>
            <p>Live stream of updates across the operational network</p>
          </div>
          
          <div className="timeline-panel scrollable-panel">
            {allActivities.length === 0 ? (
              <div className="timeline-empty">No updates logged.</div>
            ) : (
              allActivities.map((act) => (
                <div key={act.id} className="timeline-item">
                  <div className="timeline-node"></div>
                  <div className="timeline-content">
                    <span className="timeline-actor">{act.user}</span>
                    <span className="timeline-actor-role"> ({act.role})</span>
                    <span className="timeline-action"> {act.action}</span>
                    <span className="timeline-time">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .analytics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }

        .stat-tile {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat-tile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-tile-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.03em;
        }

        .stat-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon-wrapper.blue { background: var(--primary-glow); color: var(--primary); }
        .stat-icon-wrapper.amber { background: var(--warning-glow); color: var(--warning); }
        .stat-icon-wrapper.green { background: var(--success-bg); color: var(--success); }
        .stat-icon-wrapper.red { background: var(--danger-bg); color: var(--danger); }

        .stat-icon {
          width: 18px;
          height: 18px;
        }

        .stat-tile-value {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }

        .stat-tile-value.urgent {
          color: var(--danger);
        }

        .stat-tile-footer {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .stat-trend {
          font-weight: 500;
        }

        .stat-trend.positive { color: var(--success); }
        .stat-trend.warning { color: var(--warning); }
        .stat-trend.negative { color: var(--danger); }

        .dashboard-double-layout {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .dashboard-double-layout {
            grid-template-columns: 1fr;
          }
        }

        .main-chart-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .chart-subtitle {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .chart-legend {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-dot.completed {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
        }

        .legend-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .chart-canvas-wrapper {
          position: relative;
          width: 100%;
          min-height: 180px;
        }

        .svg-chart-render {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .leader-board-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 290px;
        }

        .leader-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .leader-link-btn {
          background: transparent;
          border: none;
          color: var(--primary);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .leader-link-btn:hover {
          color: var(--primary-hover);
        }

        .scrollable-panel {
          overflow-y: auto;
          flex-grow: 1;
          padding-right: 4px;
        }

        .leader-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .leader-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .leader-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--card-border);
        }

        .leader-info-block {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .leader-name-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .leader-name {
          color: var(--text-primary);
        }

        .leader-percentage {
          color: var(--primary);
        }

        .leader-progress-wrapper {
          height: 4px;
          width: 100%;
          background: rgba(148, 163, 184, 0.1);
          border-radius: 10px;
        }

        .leader-progress-fill {
          height: 100%;
          border-radius: 10px;
        }

        .leader-count-txt {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .tasks-board-layout {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .tasks-board-layout {
            grid-template-columns: 1fr;
          }
        }

        .board-main-card {
          padding: 24px;
        }

        .board-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .board-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .board-search {
          position: relative;
        }

        .board-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .board-search-input {
          padding: 8px 12px 8px 36px;
          font-size: 0.85rem;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          color: var(--text-primary);
          width: 180px;
          transition: all 0.2s ease;
        }

        [data-theme='dark'] .board-search-input {
          background: rgba(0, 0, 0, 0.15);
        }

        .board-search-input:focus {
          outline: none;
          width: 220px;
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.25);
        }

        .export-buttons-group {
          display: flex;
          gap: 6px;
        }

        .btn-icon {
          padding: 8px 12px;
          font-size: 0.8rem;
          border-radius: 8px;
        }

        .btn-label-desktop {
          display: inline;
        }

        @media (max-width: 768px) {
          .btn-label-desktop {
            display: none;
          }
          .board-search-input {
            width: 100%;
          }
          .board-search-input:focus {
            width: 100%;
          }
        }

        .direct-add-btn {
          padding: 8px 16px;
          font-size: 0.8rem;
          border-radius: 8px;
        }

        .board-tabs-strip {
          display: flex;
          gap: 6px;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 10px;
          margin-bottom: 20px;
          overflow-x: auto;
        }

        .tab-btn {
          background: transparent;
          border: none;
          padding: 6px 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: var(--text-primary);
        }

        [data-theme='dark'] .tab-btn:hover {
          background: rgba(0, 0, 0, 0.15);
        }

        .tab-btn.active {
          background: var(--primary-glow);
          color: var(--primary);
        }

        .board-tasks-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .board-task-row {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        [data-theme='dark'] .board-task-row {
          background: rgba(0, 0, 0, 0.1);
        }

        .board-task-row:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);
        }

        .row-main-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-grow: 1;
          min-width: 0; /* truncate fix */
        }

        .row-id {
          font-family: monospace;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          background: rgba(148, 163, 184, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
        }

        .row-title-block {
          min-width: 0; /* truncate fix */
        }

        .row-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .row-desc-trunc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .row-stats-block {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .board-task-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .row-stats-block {
            width: 100%;
            justify-content: flex-start;
            flex-wrap: wrap;
            gap: 10px;
          }
        }

        .row-badge {
          font-size: 0.65rem;
          padding: 2px 8px;
        }

        .row-deadline {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .row-deadline.overdue-warn {
          color: var(--danger);
          font-weight: 600;
        }

        .overdue-warn-icon {
          color: var(--danger);
          margin-left: 4px;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .row-assignee-card {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid var(--card-border);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
        }

        [data-theme='dark'] .row-assignee-card {
          background: rgba(0, 0, 0, 0.15);
        }

        .assignee-avatar-mini {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          object-fit: cover;
        }

        .assignee-name-mini {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .row-feedback-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .no-tasks-state {
          padding: 40px;
          text-align: center;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .no-tasks-icon {
          color: var(--text-muted);
        }

        .timeline-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 480px;
        }

        @media (max-width: 1024px) {
          .timeline-card {
            height: 350px;
          }
        }

        .timeline-header h3 {
          margin-bottom: 2px;
        }

        .timeline-header p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .timeline-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
          padding-left: 12px;
          border-left: 2px solid var(--card-border);
        }

        .timeline-item {
          position: relative;
        }

        .timeline-node {
          position: absolute;
          left: -18px;
          top: 4px;
          width: 10px;
          height: 10px;
          background: var(--primary);
          border-radius: 50%;
          border: 2px solid var(--sidebar-bg);
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .timeline-content {
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .timeline-actor {
          font-weight: 700;
          color: var(--text-primary);
        }

        .timeline-actor-role {
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        .timeline-action {
          color: var(--text-secondary);
        }

        .timeline-time {
          display: block;
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .timeline-empty {
          text-align: center;
          color: var(--text-muted);
          padding: 20px;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
