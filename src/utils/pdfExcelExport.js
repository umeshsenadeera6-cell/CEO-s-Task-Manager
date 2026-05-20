// PDF and Excel Export Utilities for CEO Task Management System

/**
 * Exports data to Microsoft Excel-compatible CSV format
 * @param {Array} tasks - Array of task objects
 * @param {String} reportTitle - Optional title prefix
 */
export const exportToCSV = (tasks, reportTitle = "CEO_Task_Report") => {
  if (!tasks || tasks.length === 0) {
    alert("No task data available to export.");
    return;
  }

  // Define column headers
  const headers = [
    "Task ID",
    "Title",
    "Description",
    "Priority",
    "Status",
    "Deadline",
    "Assigned To",
    "Assigned By",
    "Location",
    "Department",
    "Comments Count",
    "History Actions Count"
  ];

  // Map rows
  const rows = tasks.map((task) => [
    task.id,
    task.title,
    task.description,
    task.priority,
    task.status,
    task.deadline,
    task.assignedTo,
    task.assignedBy,
    task.location,
    task.department,
    task.comments?.length || 0,
    task.history?.length || 0
  ]);

  // Combine into CSV format (with proper cell escaping)
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const stringCell = String(cell ?? "");
          // Escape quotes and wrap cell in quotes if it contains comma, quotes, or newlines
          if (stringCell.includes(",") || stringCell.includes('"') || stringCell.includes("\n")) {
            return `"${stringCell.replace(/"/g, '""').replace(/\n/g, " ")}"`;
          }
          return stringCell;
        })
        .join(",")
    )
  ].join("\n");

  // Create downloadable Blob
  const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
    type: "text/csv;charset=utf-8;"
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  const dateStr = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `${reportTitle}_${dateStr}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Creates a high-fidelity, corporate-styled HTML Print sheet for browser-to-PDF generation
 * @param {Array} tasks - Array of task objects to display in the PDF
 * @param {Object} metadata - Context details (e.g. activeLocation, activeDepartment, generatedBy)
 */
export const exportToPDF = (tasks, metadata = {}) => {
  if (!tasks || tasks.length === 0) {
    alert("No task data available to print.");
    return;
  }

  const printWindow = window.open("", "_blank");
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const locationFilter = metadata.activeLocation || "All Locations";
  const departmentFilter = metadata.activeDepartment || "All Departments";
  const generatedBy = metadata.generatedBy || "Sarah Alwis (CEO)";

  // Task Statistics
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const underReview = tasks.filter((t) => t.status === "Under Review").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Task Audit Report - Diwya Spices</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          color: #1e293b;
          background: #ffffff;
          padding: 40px;
          font-size: 11px;
          line-height: 1.5;
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #0f172a;
          padding-bottom: 20px;
          margin-bottom: 25px;
        }

        .company-logo {
          font-weight: 700;
          font-size: 20px;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .company-logo span {
          color: #3b82f6;
        }

        .report-title {
          font-size: 16px;
          font-weight: 600;
          color: #334155;
          text-align: right;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 12px 20px;
          margin-bottom: 25px;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
        }

        .meta-label {
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          margin-bottom: 3px;
        }

        .meta-value {
          font-size: 11px;
          font-weight: 500;
          color: #0f172a;
        }

        .stats-strip {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
        }

        .stat-card {
          flex: 1;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px;
          text-align: center;
        }

        .stat-num {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .stat-txt {
          font-size: 8px;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 500;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }

        th {
          background: #0f172a;
          color: #ffffff;
          font-weight: 600;
          text-align: left;
          padding: 8px 10px;
          font-size: 9px;
          text-transform: uppercase;
        }

        td {
          padding: 10px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: top;
        }

        tr:nth-child(even) td {
          background-color: #f8fafc;
        }

        .task-title {
          font-weight: 600;
          color: #0f172a;
          font-size: 11px;
          margin-bottom: 3px;
        }

        .task-desc {
          color: #64748b;
          font-size: 9px;
          line-height: 1.3;
        }

        .badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 8px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge-high { background: #fee2e2; color: #991b1b; }
        .badge-medium { background: #fef3c7; color: #92400e; }
        .badge-low { background: #e0f2fe; color: #075985; }

        .badge-pending { background: #f1f5f9; color: #475569; }
        .badge-progress { background: #dbeafe; color: #1e40af; }
        .badge-review { background: #f3e8ff; color: #6b21a8; }
        .badge-completed { background: #dcfce7; color: #166534; }

        .footer-signatures {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          padding-top: 50px;
        }

        .sig-block {
          width: 200px;
          text-align: center;
        }

        .sig-line {
          border-top: 1px solid #94a3b8;
          margin-bottom: 5px;
          padding-top: 5px;
        }

        .sig-title {
          font-size: 9px;
          color: #64748b;
        }

        @media print {
          body {
            padding: 20px;
          }
          button {
            display: none;
          }
          .no-print {
            display: none !important;
          }
        }

        .print-btn-bar {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          padding: 10px 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-bottom: 20px;
          border-radius: 6px;
        }

        .btn {
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 500;
          border-radius: 4px;
          cursor: pointer;
          border: none;
        }

        .btn-primary { background: #3b82f6; color: white; }
        .btn-secondary { background: #e2e8f0; color: #334155; }
      </style>
    </head>
    <body>
      <div class="print-btn-bar no-print">
        <button class="btn btn-secondary" onclick="window.close()">Close Window</button>
        <button class="btn btn-primary" onclick="window.print()">Print / Export PDF</button>
      </div>

      <div class="header-container">
        <div>
          <div class="company-logo">DIWYA <span>SPICES</span></div>
          <div style="font-size: 8px; color: #64748b; margin-top: 2px;">PREMIUM Ceylon Agri Exports</div>
        </div>
        <div class="report-title">
          <div>CEO Task Audit Report</div>
          <div style="font-size: 9px; font-weight: 400; color: #64748b; margin-top: 4px;">Generated: ${dateStr}</div>
        </div>
      </div>

      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Location</span>
          <span class="meta-value">${locationFilter}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Department</span>
          <span class="meta-value">${departmentFilter}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Authorized By</span>
          <span class="meta-value">${generatedBy}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Report Validity</span>
          <span class="meta-value">Internal Operations Only</span>
        </div>
      </div>

      <div class="stats-strip">
        <div class="stat-card">
          <div class="stat-num">${total}</div>
          <div class="stat-txt">Total Tasks</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${pending}</div>
          <div class="stat-txt">Pending</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${inProgress}</div>
          <div class="stat-txt">In Progress</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${underReview}</div>
          <div class="stat-txt">Under Review</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${completed}</div>
          <div class="stat-txt">Completed</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 8%">Task ID</th>
            <th style="width: 35%">Task Details</th>
            <th style="width: 12%">Department</th>
            <th style="width: 10%">Priority</th>
            <th style="width: 10%">Status</th>
            <th style="width: 12%">Deadline</th>
            <th style="width: 13%">Assignee</th>
          </tr>
        </thead>
        <tbody>
          ${tasks
            .map(
              (t) => `
            <tr>
              <td style="font-family: monospace; font-weight: 500;">${t.id}</td>
              <td>
                <div class="task-title">${t.title}</div>
                <div class="task-desc">${t.description}</div>
              </td>
              <td>
                <div style="font-weight: 500;">${t.location}</div>
                <div style="color: #64748b; font-size: 8px;">${t.department}</div>
              </td>
              <td>
                <span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span>
              </td>
              <td>
                <span class="badge badge-${t.status === "In Progress" ? "progress" : t.status === "Under Review" ? "review" : t.status.toLowerCase()}">${t.status}</span>
              </td>
              <td style="font-weight: 500;">${t.deadline}</td>
              <td>
                <div style="font-weight: 500;">${t.assignedTo}</div>
                <div style="color: #64748b; font-size: 8px; text-transform: capitalize;">by ${t.assignedBy}</div>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div class="footer-signatures">
        <div class="sig-block">
          <div class="sig-line">Sarah Alwis</div>
          <div class="sig-title">Chief Executive Officer</div>
        </div>
        <div class="sig-block">
          <div class="sig-line">&nbsp;</div>
          <div class="sig-title">Operations Auditor</div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlTemplate);
  printWindow.document.close();
};
