import React from "react";
import { Building2, Factory, ArrowRight, User } from "lucide-react";
import { getTasks } from "../utils/mockData";

export default function LocationSelection({ user, onSelectLocation, onLogout }) {
  const tasks = getTasks();

  // Aggregate stats per location
  const headOfficeTasks = tasks.filter((t) => t.location === "Head Office").length;
  const factoryTasks = tasks.filter((t) => t.location === "Diwya Spice Factory").length;

  return (
    <div className="location-screen animate-fade">
      <div className="location-container">
        <div className="location-header">
          <div className="user-profile-badge glass-card">
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <div className="user-info">
              <span className="user-welcome">Active Session</span>
              <span className="user-name">{user.name}</span>
              <span className="user-role-badge">{user.role}</span>
            </div>
          </div>
          <h1 className="location-title">Select Operational Site</h1>
          <p className="location-subtitle">
            Choose a workplace to manage staff operations, track deliverables, and audit real-time analytics.
          </p>
        </div>

        <div className="location-grid">
          {/* Card 1: Head Office */}
          <div
            className="glass-card glass-card-interactive location-card location-ho"
            onClick={() => onSelectLocation("Head Office")}
          >
            <div className="location-card-decor"></div>
            <div className="location-icon-container ho-icon">
              <Building2 className="location-icon" />
            </div>
            <div className="location-card-content">
              <h3>Head Office</h3>
              <p>Corporate management center overseeing Operations, IT Infrastructure, Human Resources, and Corporate Finance.</p>
              <div className="location-stats">
                <span className="stat-label">Active Tasks:</span>
                <span className="stat-value">{headOfficeTasks} assigned</span>
              </div>
            </div>
            <div className="location-action-bar">
              <span>Enter Workspace</span>
              <ArrowRight className="action-arrow" />
            </div>
          </div>

          {/* Card 2: Spice Factory */}
          <div
            className="glass-card glass-card-interactive location-card location-factory"
            onClick={() => onSelectLocation("Diwya Spice Factory")}
          >
            <div className="location-card-decor"></div>
            <div className="location-icon-container factory-icon">
              <Factory className="location-icon" />
            </div>
            <div className="location-card-content">
              <h3>Diwya Spice Factory</h3>
              <p>Industrial spice refinery handling organic sorting, processing, packaging, logistics, and quality assurance audits.</p>
              <div className="location-stats">
                <span className="stat-label">Active Tasks:</span>
                <span className="stat-value">{factoryTasks} assigned</span>
              </div>
            </div>
            <div className="location-action-bar">
              <span>Enter Workspace</span>
              <ArrowRight className="action-arrow" />
            </div>
          </div>
        </div>

        <div className="location-footer">
          <button className="btn btn-secondary logout-btn" onClick={onLogout}>
            Sign Out of Portal
          </button>
        </div>
      </div>

      <style>{`
        .location-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: var(--bg-gradient);
        }

        .location-container {
          width: 100%;
          max-width: 900px;
        }

        .location-header {
          text-align: center;
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .user-profile-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border-radius: 50px;
          margin-bottom: 24px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 0.75rem;
          line-height: 1.2;
        }

        .user-welcome {
          color: var(--text-muted);
          font-weight: 500;
        }

        .user-name {
          font-weight: 700;
          color: var(--text-primary);
        }

        .user-role-badge {
          font-size: 0.65rem;
          background: var(--primary-glow);
          color: var(--primary);
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 2px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .location-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .location-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
          max-width: 600px;
          line-height: 1.5;
        }

        .location-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .location-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        .location-card {
          position: relative;
          padding: 30px;
          display: flex;
          flex-direction: column;
          min-height: 320px;
          overflow: hidden;
        }

        .location-card-decor {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          opacity: 0.8;
        }

        .location-icon-container {
          width: 54px;
          height: 54px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .ho-icon {
          background: var(--primary-glow);
          color: var(--primary);
        }

        .factory-icon {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
        }

        [data-theme='dark'] .ho-icon {
          background: var(--primary-glow);
        }

        [data-theme='dark'] .factory-icon {
          background: rgba(52, 211, 153, 0.2);
        }

        .location-icon {
          width: 26px;
          height: 26px;
        }

        .location-card-content {
          flex-grow: 1;
        }

        .location-card-content h3 {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .location-card-content p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .location-stats {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          background: rgba(255, 255, 255, 0.3);
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--card-border);
          display: inline-flex;
        }

        [data-theme='dark'] .location-stats {
          background: rgba(0, 0, 0, 0.2);
        }

        .stat-label {
          color: var(--text-muted);
          font-weight: 500;
        }

        .stat-value {
          color: var(--text-primary);
          font-weight: 600;
        }

        .location-action-bar {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--primary);
          border-top: 1px solid var(--card-border);
          padding-top: 16px;
          transition: all 0.2s ease;
        }

        .location-card:hover .location-action-bar {
          color: var(--primary-hover);
        }

        .action-arrow {
          width: 18px;
          height: 18px;
          transition: transform 0.3s ease;
        }

        .location-card:hover .action-arrow {
          transform: translateX(6px);
        }

        .location-footer {
          text-align: center;
        }

        .logout-btn {
          font-size: 0.85rem;
          padding: 10px 20px;
        }
      `}</style>
    </div>
  );
}
