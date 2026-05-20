// CEO Task Management System Mock Database Simulator

const DEFAULT_USERS = [
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
    username: "dilhan.it",
    email: "dilhan.silva@diwyaspices.com",
    password: "password123",
    name: "Dilhan Silva",
    role: "Manager",
    position: "IT Director",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "IT"
  },
  {
    username: "priyantha.hr",
    email: "priyantha.hr@diwyaspices.com",
    password: "password123",
    name: "Priyantha Kumara",
    role: "Manager",
    position: "HR Manager",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "HR"
  },
  {
    username: "ishara.fin",
    email: "ishara.finance@diwyaspices.com",
    password: "password123",
    name: "Ishara Madushani",
    role: "Manager",
    position: "Chief Financial Officer",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "Finance"
  },
  // Operations Staff
  {
    username: "anura.ops",
    email: "anura.bandara@diwyaspices.com",
    password: "password123",
    name: "Anura Bandara",
    role: "Staff",
    position: "Senior Operations Coordinator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "Operations"
  },
  {
    username: "sanduni.ops",
    email: "sanduni@diwyaspices.com",
    password: "password123",
    name: "Sanduni Perera",
    role: "Staff",
    position: "Logistics Specialist",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "Operations"
  },
  // IT Staff
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
    username: "kavindi.it",
    email: "kavindi@diwyaspices.com",
    password: "password123",
    name: "Kavindi Jayasekara",
    role: "Staff",
    position: "Full Stack Developer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "IT"
  },
  // HR Staff
  {
    username: "charith.hr",
    email: "charith@diwyaspices.com",
    password: "password123",
    name: "Charith Silva",
    role: "Staff",
    position: "Talent Acquisition Lead",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "HR"
  },
  // Finance Staff
  {
    username: "lasantha.fin",
    email: "lasantha@diwyaspices.com",
    password: "password123",
    name: "Lasantha Perera",
    role: "Staff",
    position: "Senior Tax Accountant",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "Finance"
  },
  // Factory Production Staff
  {
    username: "kasun.factory",
    email: "kasun@diwyaspices.com",
    password: "password123",
    name: "Kasun Rajapaksha",
    role: "Manager",
    position: "Factory Plant Manager",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    location: "Diwya Spice Factory",
    department: "Production"
  },
  {
    username: "milinda.factory",
    email: "milinda@diwyaspices.com",
    password: "password123",
    name: "Milinda Jayawardene",
    role: "Staff",
    position: "Production Supervisor",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200",
    location: "Diwya Spice Factory",
    department: "Production"
  },
  {
    username: "sachini.factory",
    email: "sachini@diwyaspices.com",
    password: "password123",
    name: "Sachini Wijesinghe",
    role: "Staff",
    position: "Quality Control Lead",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=200",
    location: "Diwya Spice Factory",
    department: "Quality Control"
  },
  {
    username: "nimal.factory",
    email: "nimal@diwyaspices.com",
    password: "password123",
    name: "Nimal Wickramasinghe",
    role: "Staff",
    position: "Logistics Coordinator",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    location: "Diwya Spice Factory",
    department: "Logistics"
  }
];

const DEFAULT_TASKS = [
  {
    id: "task-101",
    title: "Implement ISO 22000 Food Safety Audit Compliance",
    description: "Verify that all processing lines in Diwya Spice Factory comply with ISO safety guidelines. Focus on hygienic sorting, drying chambers, and packaging lines.",
    priority: "High",
    deadline: "2026-06-15",
    status: "In Progress",
    assignedTo: "kasun.factory",
    assignedBy: "Sarah Alwis",
    location: "Diwya Spice Factory",
    department: "Production",
    attachments: [
      { name: "iso_audit_checklists.pdf", size: "2.4 MB", type: "pdf" }
    ],
    comments: [
      {
        id: "c1",
        user: "Sarah Alwis",
        role: "CEO",
        content: "Kasun, this is a critical audit. Make sure quality control guidelines are thoroughly audited before the external inspectors arrive.",
        timestamp: "2026-05-18T10:15:00Z"
      },
      {
        id: "c2",
        user: "Kasun Rajapaksha",
        role: "Manager",
        content: "Understood, Sarah. We have initiated the physical plant checks. Processing line B drying chambers have been successfully updated.",
        timestamp: "2026-05-19T14:30:00Z"
      }
    ],
    history: [
      { action: "Task created and assigned to Kasun Rajapaksha", user: "Sarah Alwis", timestamp: "2026-05-18T09:00:00Z" },
      { action: "Status updated to In Progress", user: "Kasun Rajapaksha", timestamp: "2026-05-18T11:20:00Z" },
      { action: "Added Comment", user: "Kasun Rajapaksha", timestamp: "2026-05-19T14:30:00Z" }
    ]
  },
  {
    id: "task-102",
    title: "Migrate Core ERP Database to Secured Cloud Instance",
    description: "Upgrade and transfer the main company resource planning database from local servers to a high-availability cloud database instance. Complete structural testing, schema integrity, and validation of active employee logs.",
    priority: "High",
    deadline: "2026-05-28",
    status: "In Progress",
    assignedTo: "nuwan.it",
    assignedBy: "Sarah Alwis",
    location: "Head Office",
    department: "IT",
    attachments: [
      { name: "cloud_migration_schema.png", size: "840 KB", type: "image" }
    ],
    comments: [
      {
        id: "c3",
        user: "Sarah Alwis",
        role: "CEO",
        content: "Nuwan, is the cloud migration timeline on track? We need minimal downtime during the transition.",
        timestamp: "2026-05-19T08:00:00Z"
      },
      {
        id: "c4",
        user: "Nuwan Fernando",
        role: "Staff",
        content: "Hi Sarah. Yes, we are planning the dry run database transfer tonight at 10 PM. Active sync will take less than 15 minutes of downtime.",
        timestamp: "2026-05-19T16:45:00Z"
      }
    ],
    history: [
      { action: "Task created and assigned to Nuwan Fernando", user: "Sarah Alwis", timestamp: "2026-05-15T09:30:00Z" },
      { action: "Status updated to In Progress", user: "Nuwan Fernando", timestamp: "2026-05-16T08:20:00Z" }
    ]
  },
  {
    id: "task-103",
    title: "Diwya Export Quality Control Test Optimization",
    description: "Formulate updated testing procedures for high-grade Ceylon Cinnamon and Black Pepper batches. Establish strict caps on moisture criteria.",
    priority: "High",
    deadline: "2026-05-22",
    status: "Under Review",
    assignedTo: "sachini.factory",
    assignedBy: "Sarah Alwis",
    location: "Diwya Spice Factory",
    department: "Quality Control",
    attachments: [],
    comments: [
      {
        id: "c5",
        user: "Sachini Wijesinghe",
        role: "Staff",
        content: "The moisture thresholds have been successfully configured inside testing kits. Documents are ready for review.",
        timestamp: "2026-05-20T09:00:00Z"
      }
    ],
    history: [
      { action: "Task created and assigned to Sachini Wijesinghe", user: "Sarah Alwis", timestamp: "2026-05-16T11:00:00Z" },
      { action: "Status updated to In Progress", user: "Sachini Wijesinghe", timestamp: "2026-05-17T09:15:00Z" },
      { action: "Status updated to Under Review", user: "Sachini Wijesinghe", timestamp: "2026-05-20T09:00:00Z" }
    ]
  },
  {
    id: "task-104",
    title: "Q2 Financial Statements & Audit Compilation",
    description: "Consolidate global spice exports revenues, factory overhead cost allocations, and head office administrative expenses to generate Q2 cash flow reports.",
    priority: "High",
    deadline: "2026-05-30",
    status: "Pending",
    assignedTo: "ishara.fin",
    assignedBy: "Sarah Alwis",
    location: "Head Office",
    department: "Finance",
    attachments: [],
    comments: [],
    history: [
      { action: "Task created and assigned to Ishara Madushani", user: "Sarah Alwis", timestamp: "2026-05-19T15:20:00Z" }
    ]
  },
  {
    id: "task-105",
    title: "Implement Head Office Performance Appraisal Scheme",
    description: "Launch the annual professional growth evaluation worksheets. Organize individual feedback discussions for departments.",
    priority: "Medium",
    deadline: "2026-06-10",
    status: "Pending",
    assignedTo: "priyantha.hr",
    assignedBy: "Sarah Alwis",
    location: "Head Office",
    department: "HR",
    attachments: [],
    comments: [],
    history: [
      { action: "Task created and assigned to Priyantha Kumara", user: "Sarah Alwis", timestamp: "2026-05-20T08:10:00Z" }
    ]
  },
  {
    id: "task-106",
    title: "Operations Logistics Optimization Project",
    description: "Optimize shipping routes from the Galle and Matara farming clusters to the Central Spice Processing Facility in Diwya Factory.",
    priority: "Medium",
    deadline: "2026-05-18",
    status: "Completed",
    assignedTo: "sanduni.ops",
    assignedBy: "Sarah Alwis",
    location: "Head Office",
    department: "Operations",
    attachments: [
      { name: "logistics_route_optimizations.xlsx", size: "1.2 MB", type: "excel" }
    ],
    comments: [
      {
        id: "c6",
        user: "Sanduni Perera",
        role: "Staff",
        content: "New route networks reduce delivery times by 22% and fuel consumption by 15%. Document attached.",
        timestamp: "2026-05-18T15:30:00Z"
      }
    ],
    history: [
      { action: "Task created and assigned to Sanduni Perera", user: "Sarah Alwis", timestamp: "2026-05-12T09:00:00Z" },
      { action: "Status updated to In Progress", user: "Sanduni Perera", timestamp: "2026-05-12T14:00:00Z" },
      { action: "Status updated to Completed", user: "Sanduni Perera", timestamp: "2026-05-18T15:30:00Z" }
    ]
  },
  {
    id: "task-107",
    title: "Audit and Revise Corporate Server Security Credentials",
    description: "Conduct double-factor authorization audits across critical operational panels.",
    priority: "Low",
    deadline: "2026-06-25",
    status: "Pending",
    assignedTo: "kavindi.it",
    assignedBy: "Sarah Alwis",
    location: "Head Office",
    department: "IT",
    attachments: [],
    comments: [],
    history: [
      { action: "Task created and assigned to Kavindi Jayasekara", user: "Sarah Alwis", timestamp: "2026-05-20T09:40:00Z" }
    ]
  }
];

const DEFAULT_ACTIVITIES = [
  {
    id: "act-1",
    user: "Sarah Alwis",
    role: "CEO",
    action: "assigned 'Implement ISO 22000 Food Safety Audit Compliance' to Kasun Rajapaksha",
    timestamp: "2026-05-18T09:00:00Z"
  },
  {
    id: "act-2",
    user: "Kasun Rajapaksha",
    role: "Manager",
    action: "updated status to 'In Progress' on 'Implement ISO 22000 Food Safety Audit Compliance'",
    timestamp: "2026-05-18T11:20:00Z"
  },
  {
    id: "act-3",
    user: "Sanduni Perera",
    role: "Staff",
    action: "completed task 'Operations Logistics Optimization Project'",
    timestamp: "2026-05-18T15:30:00Z"
  },
  {
    id: "act-4",
    user: "Nuwan Fernando",
    role: "Staff",
    action: "added a comment on ERP database migration: 'planning the dry run database transfer tonight'",
    timestamp: "2026-05-19T16:45:00Z"
  },
  {
    id: "act-5",
    user: "Sachini Wijesinghe",
    role: "Staff",
    action: "marked 'Diwya Export Quality Control Test Optimization' as 'Under Review'",
    timestamp: "2026-05-20T09:00:00Z"
  }
];

// Database Initialization helper
export const initDB = () => {
  if (!localStorage.getItem("ceo_task_users")) {
    localStorage.setItem("ceo_task_users", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("ceo_task_tasks")) {
    localStorage.setItem("ceo_task_tasks", JSON.stringify(DEFAULT_TASKS));
  }
  if (!localStorage.getItem("ceo_task_activities")) {
    localStorage.setItem("ceo_task_activities", JSON.stringify(DEFAULT_ACTIVITIES));
  }
};

// Database Getters
export const getUsers = () => {
  initDB();
  return JSON.parse(localStorage.getItem("ceo_task_users"));
};

export const getTasks = () => {
  initDB();
  return JSON.parse(localStorage.getItem("ceo_task_tasks"));
};

export const getActivities = () => {
  initDB();
  return JSON.parse(localStorage.getItem("ceo_task_activities"));
};

// Authentication Simulator
export const loginUser = (usernameOrEmail, password) => {
  const users = getUsers();
  const foundUser = users.find(
    (u) =>
      (u.username === usernameOrEmail.toLowerCase() || u.email === usernameOrEmail.toLowerCase()) &&
      u.password === password
  );
  if (foundUser) {
    // Return a session bundle (simulates a decoded JWT token)
    return {
      success: true,
      user: {
        username: foundUser.username,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        position: foundUser.position,
        avatar: foundUser.avatar,
        location: foundUser.location,
        department: foundUser.department
      },
      token: "simulated-jwt-header." + btoa(JSON.stringify(foundUser)) + ".signature"
    };
  }
  return { success: false, error: "Invalid username, email, or password." };
};

// Activity logger helper
const logActivity = (user, role, actionText) => {
  const activities = getActivities();
  const newActivity = {
    id: "act-" + Date.now(),
    user,
    role,
    action: actionText,
    timestamp: new Date().toISOString()
  };
  activities.unshift(newActivity);
  // Cap history at 50 records
  if (activities.length > 50) activities.pop();
  localStorage.setItem("ceo_task_activities", JSON.stringify(activities));
};

// Task Operations
export const createTask = (taskData, actorName, actorRole) => {
  const tasks = getTasks();
  const newId = "task-" + Date.now();
  const timestamp = new Date().toISOString();

  const newTask = {
    id: newId,
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority,
    deadline: taskData.deadline,
    status: taskData.status || "Pending",
    assignedTo: taskData.assignedTo,
    assignedBy: actorName,
    location: taskData.location,
    department: taskData.department,
    attachments: taskData.attachments || [],
    comments: [],
    history: [
      {
        action: `Task created and assigned to ${taskData.assignedToName}`,
        user: actorName,
        timestamp
      }
    ]
  };

  tasks.unshift(newTask);
  localStorage.setItem("ceo_task_tasks", JSON.stringify(tasks));
  logActivity(actorName, actorRole, `assigned '${taskData.title}' to ${taskData.assignedToName}`);
  return newTask;
};

export const updateTask = (taskId, updatedFields, actorName, actorRole) => {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return null;

  const originalTask = tasks[index];
  const timestamp = new Date().toISOString();
  let changesList = [];

  // Track field differences for history log
  if (updatedFields.status && updatedFields.status !== originalTask.status) {
    changesList.push(`Status updated from '${originalTask.status}' to '${updatedFields.status}'`);
  }
  if (updatedFields.title && updatedFields.title !== originalTask.title) {
    changesList.push(`Title updated`);
  }
  if (updatedFields.priority && updatedFields.priority !== originalTask.priority) {
    changesList.push(`Priority adjusted to ${updatedFields.priority}`);
  }
  if (updatedFields.deadline && updatedFields.deadline !== originalTask.deadline) {
    changesList.push(`Deadline shifted to ${updatedFields.deadline}`);
  }
  if (updatedFields.assignedTo && updatedFields.assignedTo !== originalTask.assignedTo) {
    changesList.push(`Reassigned task`);
  }

  // Fallback if no specific field is mapped but task gets updated
  if (changesList.length === 0) changesList.push(`Task details modified`);

  const updatedHistory = [
    ...originalTask.history,
    ...changesList.map((ch) => ({ action: ch, user: actorName, timestamp }))
  ];

  const updatedTask = {
    ...originalTask,
    ...updatedFields,
    history: updatedHistory
  };

  tasks[index] = updatedTask;
  localStorage.setItem("ceo_task_tasks", JSON.stringify(tasks));

  // Log to dashboard activity log
  let mainChange = changesList[0];
  if (updatedFields.status && updatedFields.status !== originalTask.status) {
    logActivity(actorName, actorRole, `updated status to '${updatedFields.status}' on '${updatedTask.title}'`);
  } else {
    logActivity(actorName, actorRole, `modified task '${updatedTask.title}'`);
  }

  return updatedTask;
};

export const addComment = (taskId, commentContent, actorName, actorRole) => {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return null;

  const originalTask = tasks[index];
  const timestamp = new Date().toISOString();

  const newComment = {
    id: "c-" + Date.now(),
    user: actorName,
    role: actorRole,
    content: commentContent,
    timestamp
  };

  const updatedTask = {
    ...originalTask,
    comments: [...originalTask.comments, newComment],
    history: [
      ...originalTask.history,
      { action: "Added Comment", user: actorName, timestamp }
    ]
  };

  tasks[index] = updatedTask;
  localStorage.setItem("ceo_task_tasks", JSON.stringify(tasks));

  logActivity(actorName, actorRole, `commented on '${updatedTask.title}': "${commentContent.substring(0, 30)}${commentContent.length > 30 ? "..." : ""}"`);
  return updatedTask;
};

export const deleteTask = (taskId, actorName, actorRole) => {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return false;

  const taskTitle = tasks[index].title;
  tasks.splice(index, 1);
  localStorage.setItem("ceo_task_tasks", JSON.stringify(tasks));

  logActivity(actorName, actorRole, `deleted task '${taskTitle}'`);
  return true;
};
