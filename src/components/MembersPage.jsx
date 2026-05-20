import React, { useState } from "react";
import { Search, Filter, Plus, Calendar, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { getTasks, getUsers } from "../utils/mockData";

export default function MembersPage({
  location,
  department,
  onAssignTaskToUser,
  onViewTaskDetails
}) {
  const allUsers = getUsers();
  const allTasks = getTasks();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, heavy, light, idle

  // Filter members belonging to this specific workspace and department
  const members = allUsers.filter(
    (u) =>
      u.location === location &&
      (department ? u.department === department : true) &&
      u.role !== "CEO"
  );

  // Map tasks to members and compile states
  const membersWithTasks = members.map((member) => {
    const memberTasks = allTasks.filter(
      (t) => t.assignedTo === member.username && t.status !== "Completed"
    );
    const completedTasks = allTasks.filter(
      (t) => t.assignedTo === member.username && t.status === "Completed"
    );
    
    // Active tasks details
    const activeTask = memberTasks[0] || null;

    return {
      ...member,
      tasks: memberTasks,
      completedCount: completedTasks.length,
      pendingCount: memberTasks.length,
      activeTask
    };
  });

  // Apply search query and select workload intensity filter
  const filteredMembers = membersWithTasks.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "heavy") return member.pendingCount >= 2;
    if (filterType === "light") return member.pendingCount === 1;
    if (filterType === "idle") return member.pendingCount === 0;
    return true; // all
  });

  return (
    <div className="members-page animate-fade">
      <div className="members-filter-bar glass-card">
        {/* Search */}
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search staff by name or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="filter-box">
          <Filter className="filter-icon" />
          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Staff Members</option>
            <option value="heavy">High Workload (2+ Tasks)</option>
            <option value="light">Normal Workload (1 Task)</option>
            <option value="idle">Idle / Available (0 Tasks)</option>
          </select>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="no-members glass-card animate-fade">
          <AlertCircle className="no-members-icon" />
          <h3>No Staff Members Found</h3>
          <p>Try adjusting your search criteria or filter options to discover active personnel.</p>
        </div>
      ) : (
        <div className="members-grid">
          {filteredMembers.map((member) => (
            <div key={member.username} className="glass-card member-card animate-slide-up">
              <div className="member-profile-section">
                <div className="member-avatar-wrapper">
                  <img src={member.avatar} alt={member.name} className="member-avatar-large" />
                  <span className={`status-indicator ${member.pendingCount > 0 ? "busy" : "available"}`}></span>
                </div>
                <div className="member-profile-details">
                  <h4 className="member-name-txt">{member.name}</h4>
                  <span className="member-position-txt">{member.position}</span>
                </div>
              </div>

              {/* Workload Metric */}
              <div className="workload-section">
                <div className="workload-stats-row">
                  <div className="workload-stat-item">
                    <span className="stat-label">Pending tasks</span>
                    <span className={`stat-number pending ${member.pendingCount > 1 ? "critical" : ""}`}>
                      {member.pendingCount}
                    </span>
                  </div>
                  <div className="workload-stat-item">
                    <span className="stat-label">Completed</span>
                    <span className="stat-number completed">{member.completedCount}</span>
                  </div>
                </div>

                <div className="workload-progress-bar">
                  <div
                    className="workload-progress-fill"
                    style={{
                      width: `${Math.min((member.pendingCount / 3) * 100, 100)}%`,
                      backgroundColor: member.pendingCount > 1 ? "var(--danger)" : "var(--primary)"
                    }}
                  ></div>
                </div>
              </div>

              {/* Current Focus Task */}
              <div className="member-tasks-section">
                <span className="section-label">Current Focus:</span>
                {member.activeTask ? (
                  <div
                    className="member-active-task-card"
                    onClick={() => onViewTaskDetails(member.activeTask)}
                  >
                    <div className="task-card-header">
                      <span className="task-title-trunc">{member.activeTask.title}</span>
                      <span className={`badge badge-${member.activeTask.priority.toLowerCase()} badge-mini`}>
                        {member.activeTask.priority}
                      </span>
                    </div>
                    <div className="task-card-meta">
                      <span className="task-meta-due">
                        <Clock size={10} style={{ marginRight: 3 }} />
                        Due {member.activeTask.deadline}
                      </span>
                      <span className={`task-status-dot ${member.activeTask.status.replace(" ", "-").toLowerCase()}`}>
                        {member.activeTask.status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="member-idle-alert">
                    <CheckCircle size={14} className="idle-check-icon" />
                    <span>No active tasks. Ready for assignment.</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="member-card-footer">
                <button
                  className="btn btn-primary btn-sm assign-task-btn"
                  onClick={() => onAssignTaskToUser(member)}
                >
                  <Plus size={14} />
                  <span>Assign Task</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .members-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .members-filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 16px 24px;
        }

        @media (max-width: 768px) {
          .members-filter-bar {
            flex-direction: column;
            align-items: stretch;
            padding: 16px;
          }
        }

        .search-box {
          position: relative;
          flex-grow: 1;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding: 10px 16px 10px 44px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          color: var(--text-primary);
          transition: all var(--transition-speed);
        }

        [data-theme='dark'] .search-input {
          background: rgba(0, 0, 0, 0.15);
        }

        .search-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.3);
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        [data-theme='dark'] .search-input:focus {
          background: rgba(0, 0, 0, 0.25);
        }

        .filter-box {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 240px;
        }

        .filter-icon {
          width: 16px;
          height: 16px;
          color: var(--text-muted);
        }

        .filter-select {
          width: 100%;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          color: var(--text-primary);
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        [data-theme='dark'] .filter-select {
          background: rgba(0, 0, 0, 0.15);
        }

        .filter-select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .no-members {
          padding: 60px 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .no-members-icon {
          width: 48px;
          height: 48px;
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .no-members h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .no-members p {
          color: var(--text-secondary);
          max-width: 400px;
          font-size: 0.9rem;
        }

        .members-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .members-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .members-grid {
            grid-template-columns: 1fr;
          }
        }

        .member-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .member-profile-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .member-avatar-wrapper {
          position: relative;
        }

        .member-avatar-large {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--card-border);
        }

        .status-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--sidebar-bg);
        }

        .status-indicator.available { background: var(--success); }
        .status-indicator.busy { background: var(--warning); }

        .member-profile-details {
          display: flex;
          flex-direction: column;
          line-height: 1.3;
        }

        .member-name-txt {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .member-position-txt {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .workload-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .workload-stats-row {
          display: flex;
          justify-content: space-between;
        }

        .workload-stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.03em;
        }

        .stat-number {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-number.pending.critical {
          color: var(--danger);
        }

        .workload-progress-bar {
          height: 5px;
          width: 100%;
          background: rgba(148, 163, 184, 0.15);
          border-radius: 10px;
          overflow: hidden;
        }

        .workload-progress-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.4s ease;
        }

        .member-tasks-section {
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        [data-theme='dark'] .member-tasks-section {
          background: rgba(0, 0, 0, 0.15);
        }

        .section-label {
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .member-active-task-card {
          cursor: pointer;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          padding: 10px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .member-active-task-card:hover {
          transform: scale(1.02);
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
        }

        .task-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .task-title-trunc {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-grow: 1;
        }

        .badge-mini {
          font-size: 0.6rem;
          padding: 1px 4px;
        }

        .task-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.7rem;
        }

        .task-meta-due {
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
        }

        .task-status-dot {
          display: inline-flex;
          align-items: center;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .task-status-dot::before {
          content: "";
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-right: 4px;
        }

        .task-status-dot.pending::before { background: var(--text-secondary); }
        .task-status-dot.in-progress::before { background: var(--primary); }
        .task-status-dot.under-review::before { background: var(--secondary); }

        .member-idle-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--success);
          font-weight: 500;
          padding: 8px 4px;
        }

        .idle-check-icon {
          color: var(--success);
        }

        .member-card-footer {
          border-top: 1px solid var(--card-border);
          padding-top: 16px;
        }

        .assign-task-btn {
          width: 100%;
          padding: 10px;
          font-size: 0.8rem;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
