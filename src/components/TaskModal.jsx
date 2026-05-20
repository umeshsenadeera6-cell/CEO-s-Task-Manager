import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Paperclip,
  Trash2,
  Edit3,
  Clock,
  History,
  Send,
  Download,
  Plus
} from "lucide-react";
import { getUsers } from "../utils/mockData";

export default function TaskModal({
  task, // null for new task
  user, // logged in user profile
  location, // active location
  department, // active department (or undefined/null)
  preselectedStaff, // preselected staff object if assignment triggered from a member card
  onClose,
  onSaveTask, // (taskId, fields) or (null, taskData)
  onDeleteTask // (taskId)
}) {
  const allUsers = getUsers();

  const isEditingExisting = !!task;

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Pending");
  const [assignedTo, setAssignedTo] = useState("");
  
  // Attachments and comment state
  const [commentText, setCommentText] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null);

  // Active view tabs for existing task: 'details' vs 'history'
  const [activeSubTab, setActiveSubTab] = useState("details");

  // Load user choices for assignment
  // Only users of this location (and department, if filtering)
  const assignableUsers = allUsers.filter(
    (u) =>
      u.location === location &&
      (department ? u.department === department : true) &&
      u.role !== "CEO"
  );

  useEffect(() => {
    if (isEditingExisting && task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setDeadline(task.deadline);
      setStatus(task.status);
      setAssignedTo(task.assignedTo);
    } else {
      // Default initial states for brand new task
      setTitle("");
      setDescription("");
      setPriority("Medium");
      // Set tomorrow's date by default
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDeadline(tomorrow.toISOString().split("T")[0]);
      setStatus("Pending");
      
      if (preselectedStaff) {
        setAssignedTo(preselectedStaff.username);
      } else if (assignableUsers.length > 0) {
        setAssignedTo(assignableUsers[0].username);
      } else {
        setAssignedTo("");
      }
    }
  }, [task, isEditingExisting, preselectedStaff]);

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !assignedTo || !deadline) {
      alert("Please fill in all mandatory task fields.");
      return;
    }

    const assignedUserObj = allUsers.find((u) => u.username === assignedTo);
    const assignedToName = assignedUserObj ? assignedUserObj.name : assignedTo;
    
    // Attachments simulation
    let attachments = isEditingExisting ? task.attachments || [] : [];
    if (attachmentFile) {
      attachments.push({
        name: attachmentFile.name,
        size: `${Math.round(attachmentFile.size / 1024)} KB`,
        type: attachmentFile.type.split("/")[1] || "file"
      });
    }

    const taskPayload = {
      title,
      description,
      priority,
      deadline,
      status,
      assignedTo,
      assignedToName,
      location: isEditingExisting ? task.location : location,
      department: isEditingExisting ? task.department : (department || assignedUserObj?.department || "Operations"),
      attachments
    };

    onSaveTask(isEditingExisting ? task.id : null, taskPayload);
    setAttachmentFile(null);
  };

  const handleAddCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onSaveTask(task.id, { commentToAdd: commentText });
    setCommentText("");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentFile(e.target.files[0]);
    }
  };

  const isCeoOrManager = user.role === "CEO" || user.role === "Manager";

  return (
    <div className="modal-backdrop animate-fade">
      <div className="glass-card modal-window animate-slide-up">
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="title-gradient">
            {isEditingExisting ? `Deliverable Audit: ${task.id}` : "Assign Corporate Task"}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Existing Task Multi-tab */}
        {isEditingExisting && (
          <div className="modal-subtabs">
            <button
              className={`subtab-btn ${activeSubTab === "details" ? "active" : ""}`}
              onClick={() => setActiveSubTab("details")}
            >
              <Edit3 size={14} />
              <span>Audit Details & Discuss</span>
            </button>
            <button
              className={`subtab-btn ${activeSubTab === "history" ? "active" : ""}`}
              onClick={() => setActiveSubTab("history")}
            >
              <History size={14} />
              <span>Timeline Log ({task.history?.length || 0})</span>
            </button>
          </div>
        )}

        <div className="modal-body-wrapper scrollable-panel">
          {/* VIEW 1: TASK DETAIL EDITOR OR CREATION FORM */}
          {(!isEditingExisting || activeSubTab === "details") && (
            <div className="modal-layout-split">
              {/* Form Side */}
              <form onSubmit={handleSaveSubmit} className="modal-main-form">
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Provide a clear concise directive title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!isCeoOrManager}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Task Description</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="List detailed instructions, key milestones, and desired outputs..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!isCeoOrManager}
                    required
                  ></textarea>
                </div>

                <div className="form-row-grid">
                  <div className="form-group">
                    <label className="form-label">Priority Level</label>
                    <select
                      className="form-control"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      disabled={!isCeoOrManager}
                    >
                      <option value="High">🔴 High Priority</option>
                      <option value="Medium">🟡 Medium Priority</option>
                      <option value="Low">🔵 Low Priority</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input
                      type="date"
                      className="form-control"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      disabled={!isCeoOrManager}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-grid">
                  <div className="form-group">
                    <label className="form-label">Assignee</label>
                    <select
                      className="form-control"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      disabled={!isCeoOrManager}
                      required
                    >
                      {assignableUsers.length === 0 ? (
                        <option value="">No assignable staff in {department || "site"}</option>
                      ) : (
                        assignableUsers.map((u) => (
                          <option key={u.username} value={u.username}>
                            {u.name} ({u.position})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    {/* Status can be updated by Assignee OR CEO/Manager */}
                    <select
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Pending">⌛ Pending</option>
                      <option value="In Progress">⚙️ In Progress</option>
                      <option value="Under Review">🔎 Under Review</option>
                      <option value="Completed">✅ Completed</option>
                    </select>
                  </div>
                </div>

                {/* Attachments Section */}
                <div className="form-group">
                  <label className="form-label">Attachments</label>
                  {isEditingExisting && task.attachments?.length > 0 && (
                    <div className="attachments-list">
                      {task.attachments.map((file, i) => (
                        <div key={i} className="attachment-badge">
                          <Paperclip size={12} className="attach-icon" />
                          <span className="file-name">{file.name} ({file.size})</span>
                          <button
                            type="button"
                            className="download-mock-btn"
                            onClick={() => alert(`Downloading file: ${file.name}`)}
                          >
                            <Download size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Attachment */}
                  <div className="file-uploader-box">
                    <label className="file-upload-label">
                      <Paperclip size={14} />
                      <span>{attachmentFile ? attachmentFile.name : "Select audit document..."}</span>
                      <input type="file" className="file-hidden-input" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="form-actions-footer">
                  {isEditingExisting && isCeoOrManager && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        if (confirm("Are you absolutely sure you want to delete this directive?")) {
                          onDeleteTask(task.id);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  )}

                  <div className="right-btn-group">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {isEditingExisting ? "Save Changes" : "Assign Directive"}
                    </button>
                  </div>
                </div>
              </form>

              {/* Discussion / Feedback side (Only visible for existing tasks) */}
              {isEditingExisting && (
                <div className="modal-discussion-panel">
                  <div className="discussion-header">
                    <MessageSquare size={16} />
                    <h4>Discussion & Feedbacks</h4>
                  </div>

                  <div className="comment-feed scrollable-panel">
                    {task.comments?.length === 0 ? (
                      <div className="no-comments-prompt">
                        No messages logged yet. Begin the briefing by sending a comment.
                      </div>
                    ) : (
                      task.comments.map((comm) => (
                        <div key={comm.id} className={`comment-bubble ${comm.user === user.name ? "own" : ""}`}>
                          <div className="comment-meta-row">
                            <span className="comment-author">{comm.user}</span>
                            <span className="comment-author-role">({comm.role})</span>
                          </div>
                          <p className="comment-content">{comm.content}</p>
                          <span className="comment-time">
                            {new Date(comm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleAddCommentSubmit} className="comment-form-bar">
                    <input
                      type="text"
                      className="form-control comment-input"
                      placeholder="Add an update or feedback comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary btn-icon comment-submit-btn">
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: TASK SYSTEM LOGS (AUDITING HISTORY) */}
          {isEditingExisting && activeSubTab === "history" && (
            <div className="modal-history-tab animate-fade">
              <div className="history-intro">
                <Clock size={16} className="history-icon" />
                <p>Full blockchain-style chronological timeline record of modifications committed to this directive.</p>
              </div>

              <div className="history-timeline-track">
                {task.history?.map((h, i) => (
                  <div key={i} className="history-timeline-node">
                    <div className="history-dot"></div>
                    <div className="history-node-details">
                      <span className="history-node-action">{h.action}</span>
                      <div className="history-node-footer">
                        <span className="history-node-actor">by {h.user}</span>
                        <span className="history-node-time">
                          {new Date(h.timestamp).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-window {
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 24px;
          border-radius: 20px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .modal-close-btn:hover {
          color: var(--danger);
        }

        .modal-subtabs {
          display: flex;
          gap: 12px;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 10px;
          margin-bottom: 20px;
        }

        .subtab-btn {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .subtab-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: var(--text-primary);
        }

        [data-theme='dark'] .subtab-btn:hover {
          background: rgba(0, 0, 0, 0.15);
        }

        .subtab-btn.active {
          background: var(--primary-glow);
          color: var(--primary);
        }

        .modal-body-wrapper {
          flex-grow: 1;
          overflow-y: auto;
          padding-right: 4px;
        }

        .modal-layout-split {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .modal-layout-split {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        .modal-main-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 480px) {
          .form-row-grid {
            grid-template-columns: 1fr;
          }
        }

        .attachments-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 8px;
        }

        .attachment-badge {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid var(--card-border);
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 0.75rem;
        }

        [data-theme='dark'] .attachment-badge {
          background: rgba(0, 0, 0, 0.15);
        }

        .attach-icon {
          color: var(--text-muted);
          margin-right: 8px;
        }

        .file-name {
          flex-grow: 1;
          color: var(--text-secondary);
        }

        .download-mock-btn {
          background: transparent;
          border: none;
          color: var(--primary);
          cursor: pointer;
        }

        .download-mock-btn:hover {
          color: var(--primary-hover);
        }

        .file-uploader-box {
          border: 1px dashed var(--card-border);
          border-radius: 8px;
          padding: 10px;
          text-align: center;
          cursor: pointer;
        }

        .file-upload-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .file-hidden-input {
          display: none;
        }

        .form-actions-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--card-border);
        }

        .right-btn-group {
          display: flex;
          gap: 10px;
        }

        .modal-discussion-panel {
          border-left: 1px solid var(--card-border);
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          height: 480px;
        }

        @media (max-width: 768px) {
          .modal-discussion-panel {
            border-left: none;
            border-top: 1px dashed var(--card-border);
            padding-left: 0;
            padding-top: 20px;
            height: 350px;
          }
        }

        .discussion-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .discussion-header h4 {
          font-size: 1rem;
          font-weight: 700;
        }

        .comment-feed {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow-y: auto;
          margin-bottom: 16px;
          padding-right: 4px;
        }

        .no-comments-prompt {
          text-align: center;
          color: var(--text-muted);
          padding: 20px;
          font-size: 0.8rem;
          margin: auto;
        }

        .comment-bubble {
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid var(--card-border);
          border-radius: 12px 12px 12px 0px;
          padding: 10px 14px;
          font-size: 0.8rem;
          max-width: 85%;
          align-self: flex-start;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        [data-theme='dark'] .comment-bubble {
          background: rgba(0, 0, 0, 0.15);
        }

        .comment-bubble.own {
          background: var(--primary-glow);
          border-color: var(--primary);
          border-radius: 12px 12px 0px 12px;
          align-self: flex-end;
        }

        .comment-meta-row {
          display: flex;
          gap: 6px;
          font-size: 0.65rem;
          font-weight: 600;
        }

        .comment-author {
          color: var(--text-primary);
        }

        .comment-author-role {
          color: var(--text-muted);
        }

        .comment-content {
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .comment-time {
          font-size: 0.6rem;
          color: var(--text-muted);
          align-self: flex-end;
        }

        .comment-form-bar {
          display: flex;
          gap: 8px;
        }

        .comment-input {
          padding: 8px 12px;
          font-size: 0.8rem;
          border-radius: 8px;
        }

        .comment-submit-btn {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Timeline Tab */
        .modal-history-tab {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 10px;
        }

        .history-intro {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid var(--card-border);
          padding: 12px;
          border-radius: 8px;
        }

        [data-theme='dark'] .history-intro {
          background: rgba(0, 0, 0, 0.15);
        }

        .history-timeline-track {
          border-left: 2px solid var(--card-border);
          margin-left: 12px;
          padding-left: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .history-timeline-node {
          position: relative;
        }

        .history-dot {
          position: absolute;
          left: -22px;
          top: 6px;
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          border: 2px solid var(--sidebar-bg);
          box-shadow: 0 0 0 2px var(--primary-glow);
        }

        .history-node-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .history-node-action {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .history-node-footer {
          display: flex;
          gap: 12px;
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .history-node-actor {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
