import React from "react";
import {
  Sliders,
  Cpu,
  HeartHandshake,
  DollarSign,
  Settings,
  ShieldCheck,
  Truck,
  ArrowLeft,
  ArrowRight,
  Users
} from "lucide-react";
import { getTasks, getUsers } from "../utils/mockData";

export default function DepartmentSelection({
  location,
  onSelectDepartment,
  onBackToLocations
}) {
  const allTasks = getTasks();
  const allUsers = getUsers();

  // Define department details based on selected location
  const departmentConfig =
    location === "Head Office"
      ? [
          {
            id: "Operations",
            name: "Operations",
            icon: Sliders,
            description: "Supervising central workflows, standard routines, and logistics networks.",
            color: "--primary"
          },
          {
            id: "IT",
            name: "IT & Systems",
            icon: Cpu,
            description: "Managing ERP databases, secure local networks, and IT audit checks.",
            color: "--secondary"
          },
          {
            id: "HR",
            name: "Human Resources",
            icon: HeartHandshake,
            description: "Managing personnel evaluations, growth audits, and corporate appraisers.",
            color: "--warning"
          },
          {
            id: "Finance",
            name: "Finance & Audits",
            icon: DollarSign,
            description: "Analyzing cash flow ledgers, export tax allocations, and audit balance sheets.",
            color: "--danger"
          }
        ]
      : [
          {
            id: "Production",
            name: "Plant Production",
            icon: Settings,
            description: "Controlling spice grinders, sorting lines, and batch refinement operations.",
            color: "--primary"
          },
          {
            id: "Quality Control",
            name: "Quality Control",
            icon: ShieldCheck,
            description: "Auditing Ceylon moisture values, batch health standards, and chemical seals.",
            color: "--success"
          },
          {
            id: "Logistics",
            name: "Factory Logistics",
            icon: Truck,
            description: "Coordinating farming harvest clusters, storage, and global shipments.",
            color: "--warning"
          }
        ];

  return (
    <div className="dept-screen animate-fade">
      <div className="dept-container">
        <div className="dept-header">
          <button className="back-link" onClick={onBackToLocations}>
            <ArrowLeft className="back-arrow" />
            <span>Return to Locations</span>
          </button>
          <h1 className="dept-title">
            Department Hub <span className="site-highlight">@{location}</span>
          </h1>
          <p className="dept-subtitle">
            Audit operational divisions, check pending workloads, or browse department staff rosters.
          </p>
        </div>

        <div className="dept-grid">
          {departmentConfig.map((dept) => {
            const DeptIcon = dept.icon;

            // Fetch live statistics
            const deptPersonnel = allUsers.filter(
              (u) => u.location === location && u.department === dept.id
            ).length;

            const deptPendingTasks = allTasks.filter(
              (t) =>
                t.location === location &&
                t.department === dept.id &&
                t.status !== "Completed"
            ).length;

            return (
              <div
                key={dept.id}
                className="glass-card glass-card-interactive dept-card"
                onClick={() => onSelectDepartment(dept.id)}
              >
                <div
                  className="dept-top-bar"
                  style={{ background: `var(${dept.color})` }}
                ></div>
                
                <div className="dept-card-header">
                  <div className="dept-icon-box" style={{ color: `var(${dept.color})`, background: `var(${dept.color}-glow)` }}>
                    <DeptIcon className="dept-icon" />
                  </div>
                  <div className="dept-meta">
                    <h3>{dept.name}</h3>
                    <span className="dept-staff-count">
                      <Users size={12} style={{ marginRight: 4 }} />
                      {deptPersonnel} Staff
                    </span>
                  </div>
                </div>

                <p className="dept-desc">{dept.description}</p>

                <div className="dept-workload-bar">
                  <span className="workload-label">Workload:</span>
                  <span className={`workload-value ${deptPendingTasks > 0 ? "active" : ""}`}>
                    {deptPendingTasks === 0 ? "Zero Pending Tasks" : `${deptPendingTasks} Pending Tasks`}
                  </span>
                </div>

                <div className="dept-enter-action">
                  <span>View Department</span>
                  <ArrowRight className="enter-arrow" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .dept-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background: var(--bg-gradient);
        }

        .dept-container {
          width: 100%;
          max-width: 1000px;
        }

        .dept-header {
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .back-link {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 16px;
          transition: all 0.2s ease;
          padding: 0;
        }

        .back-link:hover {
          color: var(--primary);
        }

        .back-arrow {
          width: 16px;
          height: 16px;
          transition: transform 0.2s ease;
        }

        .back-link:hover .back-arrow {
          transform: translateX(-4px);
        }

        .dept-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .site-highlight {
          color: var(--primary);
          font-size: 1.6rem;
          font-weight: 600;
          display: inline-block;
          margin-left: 8px;
        }

        .dept-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 600px;
          line-height: 1.5;
        }

        .dept-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        @media (max-width: 768px) {
          .dept-grid {
            grid-template-columns: 1fr;
          }
        }

        .dept-card {
          position: relative;
          padding: 24px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 240px;
        }

        .dept-top-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .dept-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .dept-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dept-icon {
          width: 22px;
          height: 22px;
        }

        .dept-meta h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .dept-staff-count {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
          display: inline-flex;
          align-items: center;
        }

        .dept-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 20px;
          flex-grow: 1;
        }

        .dept-workload-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid var(--card-border);
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        [data-theme='dark'] .dept-workload-bar {
          background: rgba(0, 0, 0, 0.15);
        }

        .workload-label {
          color: var(--text-muted);
          font-weight: 500;
        }

        .workload-value {
          color: var(--text-muted);
          font-weight: 600;
        }

        .workload-value.active {
          color: var(--primary);
        }

        .dept-enter-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-top: 1px solid var(--card-border);
          padding-top: 12px;
          transition: all 0.2s ease;
        }

        .dept-card:hover .dept-enter-action {
          color: var(--primary);
        }

        .enter-arrow {
          width: 16px;
          height: 16px;
          transition: transform 0.2s ease;
        }

        .dept-card:hover .enter-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
