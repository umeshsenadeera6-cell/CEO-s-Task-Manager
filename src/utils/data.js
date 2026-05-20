// ─── Static Data Layer ───────────────────────────────────────────────────────
// Pure in-memory data. No database, no localStorage.
// Replace these arrays with real API calls when a backend is available.

// ── Users ────────────────────────────────────────────────────────────────────
const USERS = [
  {
    username: "ceo",
    email: "ceo@diwyaspices.com",
    password: "password123",
    name: "Sarah Alwis",
    role: "CEO",
    position: "Chief Executive Officer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "Executive"
  },
  {
    username: "roshan.ops",
    email: "roshan.perera@diwyaspices.com",
    password: "password123",
    name: "Roshan Perera",
    role: "Manager",
    position: "Head of Operations",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "Operations"
  },
  {
    username: "nuwan.it",
    email: "nuwan.fernando@diwyaspices.com",
    password: "password123",
    name: "Nuwan Fernando",
    role: "Staff",
    position: "Senior Systems Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "IT"
  },
  {
    username: "amali.hr",
    email: "amali.silva@diwyaspices.com",
    password: "password123",
    name: "Amali Silva",
    role: "Staff",
    position: "HR Business Partner",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "HR"
  },
  {
    username: "kasun.finance",
    email: "kasun.jayawardena@diwyaspices.com",
    password: "password123",
    name: "Kasun Jayawardena",
    role: "Staff",
    position: "Finance Analyst",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "Finance"
  },
  {
    username: "dilshan.ops",
    email: "dilshan.rathnayake@diwyaspices.com",
    password: "password123",
    name: "Dilshan Rathnayake",
    role: "Staff",
    position: "Operations Coordinator",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "Operations"
  },
  {
    username: "priya.factory",
    email: "priya.kumari@diwyaspices.com",
    password: "password123",
    name: "Priya Kumari",
    role: "Manager",
    position: "Factory Operations Manager",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    location: "Diwya Spice Factory",
    department: "Production"
  },
  {
    username: "sunil.qc",
    email: "sunil.bandara@diwyaspices.com",
    password: "password123",
    name: "Sunil Bandara",
    role: "Staff",
    position: "Quality Control Supervisor",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200",
    location: "Diwya Spice Factory",
    department: "Quality"
  }
];

// ── Tasks ────────────────────────────────────────────────────────────────────
let TASKS = [
  {
    id: "T-001",
    title: "Cloud Infrastructure Migration",
    description: "Migrate on-premise servers to AWS cloud platform with zero downtime.",
    priority: "High",
    status: "In Progress",
    deadline: "2026-05-25",
    assignedTo: "nuwan.it",
    assignedToName: "Nuwan Fernando",
    assignedBy: "Sarah Alwis",
    location: "Head Office",
    department: "IT",
    attachments: [{ name: "migration-plan.pdf", size: "1.2 MB", type: "pdf" }],
    comments: [
      { id: "c1", user: "Sarah Alwis", role: "CEO", content: "Please ensure the staging environment is validated first.", timestamp: "2026-05-18T09:00:00Z" },
      { id: "c2", user: "Nuwan Fernando", role: "Staff", content: "Staging tests completed successfully. Moving to production.", timestamp: "2026-05-19T11:30:00Z" }
    ],
    history: [
      { action: "Task created", user: "Sarah Alwis", timestamp: "2026-05-15T08:00:00Z" },
      { action: "Status changed to In Progress", user: "Nuwan Fernando", timestamp: "2026-05-16T09:00:00Z" }
    ]
  },
  {
    id: "T-002",
    title: "ISO 22000 Food Safety Audit Preparation",
    description: "Prepare all documentation and floor layouts required for the ISO 22000 compliance audit.",
    priority: "High",
    status: "Pending",
    deadline: "2026-05-30",
    assignedTo: "priya.factory",
    assignedToName: "Priya Kumari",
    assignedBy: "Sarah Alwis",
    location: "Diwya Spice Factory",
    department: "Production",
    attachments: [],
    comments: [],
    history: [
      { action: "Task created", user: "Sarah Alwis", timestamp: "2026-05-17T10:00:00Z" }
    ]
  },
  {
    id: "T-003",
    title: "Q2 Financial Reconciliation Report",
    description: "Compile and verify all departmental expense reports for the Q2 board presentation.",
    priority: "Medium",
    status: "Under Review",
    deadline: "2026-05-22",
    assignedTo: "kasun.finance",
    assignedToName: "Kasun Jayawardena",
    assignedBy: "Roshan Perera",
    location: "Head Office",
    department: "Finance",
    attachments: [{ name: "q2-draft.xlsx", size: "890 KB", type: "xlsx" }],
    comments: [
      { id: "c3", user: "Roshan Perera", role: "Manager", content: "Please double-check the CAPEX figures on page 4.", timestamp: "2026-05-20T08:15:00Z" }
    ],
    history: [
      { action: "Task created", user: "Roshan Perera", timestamp: "2026-05-10T09:00:00Z" },
      { action: "Status changed to Under Review", user: "Kasun Jayawardena", timestamp: "2026-05-19T16:00:00Z" }
    ]
  },
  {
    id: "T-004",
    title: "New Employee Onboarding Programme",
    description: "Design and roll out the updated onboarding curriculum for 5 new recruits joining next month.",
    priority: "Medium",
    status: "Completed",
    deadline: "2026-05-18",
    assignedTo: "amali.hr",
    assignedToName: "Amali Silva",
    assignedBy: "Sarah Alwis",
    location: "Head Office",
    department: "HR",
    attachments: [],
    comments: [],
    history: [
      { action: "Task created", user: "Sarah Alwis", timestamp: "2026-05-05T08:00:00Z" },
      { action: "Status changed to Completed", user: "Amali Silva", timestamp: "2026-05-18T14:00:00Z" }
    ]
  },
  {
    id: "T-005",
    title: "Logistics Partner Contract Review",
    description: "Review and renegotiate the annual freight and distribution contract with partner agencies.",
    priority: "Low",
    status: "Pending",
    deadline: "2026-06-05",
    assignedTo: "dilshan.ops",
    assignedToName: "Dilshan Rathnayake",
    assignedBy: "Roshan Perera",
    location: "Head Office",
    department: "Operations",
    attachments: [],
    comments: [],
    history: [
      { action: "Task created", user: "Roshan Perera", timestamp: "2026-05-19T10:00:00Z" }
    ]
  },
  {
    id: "T-006",
    title: "Spice Grinding Equipment Calibration",
    description: "Perform scheduled calibration and maintenance on all production-line grinding units.",
    priority: "High",
    status: "Completed",
    deadline: "2026-05-15",
    assignedTo: "sunil.qc",
    assignedToName: "Sunil Bandara",
    assignedBy: "Priya Kumari",
    location: "Diwya Spice Factory",
    department: "Quality",
    attachments: [],
    comments: [],
    history: [
      { action: "Task created", user: "Priya Kumari", timestamp: "2026-05-10T07:00:00Z" },
      { action: "Status changed to Completed", user: "Sunil Bandara", timestamp: "2026-05-15T12:00:00Z" }
    ]
  }
];

// ── Activity Feed ────────────────────────────────────────────────────────────
const ACTIVITIES = [
  { id: "a1", user: "Nuwan Fernando", role: "Staff", action: "updated Cloud Infrastructure Migration to In Progress", timestamp: "2026-05-20T09:00:00Z" },
  { id: "a2", user: "Kasun Jayawardena", role: "Staff", action: "submitted Q2 Financial Reconciliation Report for review", timestamp: "2026-05-20T08:30:00Z" },
  { id: "a3", user: "Amali Silva", role: "Staff", action: "marked New Employee Onboarding Programme as Completed", timestamp: "2026-05-20T08:00:00Z" },
  { id: "a4", user: "Sarah Alwis", role: "CEO", action: "assigned ISO 22000 Audit Preparation to Priya Kumari", timestamp: "2026-05-19T16:00:00Z" },
  { id: "a5", user: "Roshan Perera", role: "Manager", action: "left a comment on Q2 Financial Reconciliation Report", timestamp: "2026-05-19T15:00:00Z" }
];

// ── Public Getters ───────────────────────────────────────────────────────────
export const getUsers = () => [...USERS];
export const getTasks = () => [...TASKS];
export const getActivities = () => [...ACTIVITIES];

// ── Auth ─────────────────────────────────────────────────────────────────────
export const loginUser = (usernameOrEmail, password) => {
  const user = USERS.find(
    (u) =>
      (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
      u.password === password
  );
  if (!user) return { success: false, error: "Invalid username or password." };
  const { password: _pw, ...safeUser } = user;
  return { success: true, user: safeUser, token: "static-session-token" };
};

// ── CRUD Stubs ───────────────────────────────────────────────────────────────
// These mutate the in-memory array for the current session only.
// Wire to a real API to make changes persistent.

export const initDB = () => {}; // No-op — data is already initialised above.

export const createTask = (fields, createdBy) => {
  const newTask = {
    id: `T-${String(TASKS.length + 1).padStart(3, "0")}`,
    ...fields,
    comments: [],
    attachments: fields.attachments || [],
    history: [{ action: "Task created", user: createdBy, timestamp: new Date().toISOString() }]
  };
  TASKS = [newTask, ...TASKS];
  return newTask;
};

export const updateTask = (taskId, fields, updatedBy) => {
  TASKS = TASKS.map((t) => {
    if (t.id !== taskId) return t;
    return {
      ...t,
      ...fields,
      history: [
        ...(t.history || []),
        { action: `Task updated`, user: updatedBy, timestamp: new Date().toISOString() }
      ]
    };
  });
};

export const addComment = (taskId, content, userName, userRole) => {
  TASKS = TASKS.map((t) => {
    if (t.id !== taskId) return t;
    return {
      ...t,
      comments: [
        ...(t.comments || []),
        { id: `c-${Date.now()}`, user: userName, role: userRole, content, timestamp: new Date().toISOString() }
      ]
    };
  });
};

export const deleteTask = (taskId) => {
  TASKS = TASKS.filter((t) => t.id !== taskId);
};

// ── Export Stubs ─────────────────────────────────────────────────────────────
export const exportToCSV = (tasks, filename = "tasks") => {
  const headers = ["ID", "Title", "Priority", "Status", "Assigned To", "Deadline", "Department"];
  const rows = tasks.map((t) => [t.id, t.title, t.priority, t.status, t.assignedToName || t.assignedTo, t.deadline, t.department]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToPDF = (tasks, meta = {}) => {
  const content = tasks
    .map((t) => `${t.id} | ${t.title} | ${t.priority} | ${t.status} | Due: ${t.deadline}`)
    .join("\n");
  const blob = new Blob(
    [`DIWYA SPICES — Task Report\nGenerated by: ${meta.generatedBy || "System"}\nLocation: ${meta.activeLocation || ""} / ${meta.activeDepartment || ""}\n\n${content}`],
    { type: "text/plain" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "task-report.txt";
  a.click();
  URL.revokeObjectURL(url);
};
