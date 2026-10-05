import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  // ==========================
  // GET TASKS
  // ==========================

  const loadTasks = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error loading tasks:", error);
      });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // ==========================
  // CREATE TASK
  // ==========================

  const createTask = () => {
    if (title.trim() === "") {
      alert("Please enter a task title");
      return;
    }

    fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: title,
        details: details,
      }),
    })
      .then((response) => response.json())
      .then((newTask) => {
        setTasks([...tasks, newTask]);

        setTitle("");
        setDetails("");

        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error creating task:", error);
      });
  };

  // ==========================
  // COMPLETE / UNCOMPLETE
  // ==========================

  const toggleTask = (task) => {
    fetch(`${API_URL}/${task.id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        completed: !task.completed,
      }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks(
          tasks.map((item) =>
            item.id === updatedTask.id ? updatedTask : item,
          ),
        );
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  // ==========================
  // DELETE TASK
  // ==========================

  const deleteTask = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  // ==========================
  // FILTER
  // ==========================

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    return true;
  });

  const totalTasks = tasks.length;

  const activeTasks = tasks.filter((task) => !task.completed).length;

  const completedTasks = tasks.filter((task) => task.completed).length;

  // ==========================
  // UI
  // ==========================

  return (
    <div className="app">
      {/* Navbar */}

      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">✓</div>

          <div>
            <h2>TaskFlow</h2>
            <span>Plan • Build • Ship</span>
          </div>
        </div>

        <div className="nav-right">
          <span className="devops-badge">DEVOPS PRACTICE</span>

          <button
            className="new-task-btn"
            onClick={() => setShowForm(!showForm)}
          >
            + New Task
          </button>
        </div>
      </header>

      {/* Main */}

      <main className="main-container">
        {/* Welcome */}

        <section className="welcome">
          <div>
            <p className="small-title">YOUR WORKSPACE</p>

            <h1>
              Build something
              <span> great today.</span>
            </h1>

            <p className="subtitle">
              Track your learning, projects and DevOps practice in one place.
            </p>
          </div>

          <div className="status-box">
            <span className="status-dot"></span>
            API Connected
          </div>
        </section>

        {/* Create Form */}

        {showForm && (
          <section className="create-form">
            <h2>Create New Task</h2>

            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <textarea
              placeholder="Task details"
              value={details}
              onChange={(event) => setDetails(event.target.value)}
            />

            <div className="form-buttons">
              <button className="create-button" onClick={createTask}>
                CREATE TASK
              </button>

              <button
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                CANCEL
              </button>
            </div>
          </section>
        )}

        {/* Statistics */}

        <section className="stats">
          <div className="stat-card">
            <span className="stat-icon">📋</span>

            <div>
              <p>Total Tasks</p>
              <strong>{totalTasks}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">⚡</span>

            <div>
              <p>Active</p>
              <strong>{activeTasks}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✓</span>

            <div>
              <p>Completed</p>
              <strong>{completedTasks}</strong>
            </div>
          </div>
        </section>

        {/* Task Section */}

        <section className="tasks-section">
          <div className="section-header">
            <div>
              <p className="small-title">WORK QUEUE</p>

              <h2>My Tasks</h2>
            </div>

            <div className="filters">
              <button
                className={filter === "all" ? "active" : ""}
                onClick={() => setFilter("all")}
              >
                All
              </button>

              <button
                className={filter === "active" ? "active" : ""}
                onClick={() => setFilter("active")}
              >
                Active
              </button>

              <button
                className={filter === "completed" ? "active" : ""}
                onClick={() => setFilter("completed")}
              >
                Done
              </button>
            </div>
          </div>

          {/* Task List */}

          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div>✓</div>

                <h3>No tasks here</h3>

                <p>Your workspace is clear.</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  className={task.completed ? "task completed" : "task"}
                  key={task.id}
                >
                  <button
                    className="check-btn"
                    onClick={() => toggleTask(task)}
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="task-info">
                    <h3>{task.title}</h3>

                    <p>{task.details || "No description added"}</p>

                    <div className="task-meta">
                      <span className="tag">DevOps</span>

                      <span>• Task</span>
                    </div>
                  </div>

                  <div className="task-actions">
                    <span
                      className={task.completed ? "priority done" : "priority"}
                    >
                      {task.completed ? "DONE" : "ACTIVE"}
                    </span>

                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Footer */}

        <section className="devops-info">
          <div>
            <strong>TaskFlow</strong>

            <span>Local Development Environment</span>
          </div>

          <div className="tech-stack">
            React <b>•</b>
            Node.js <b>•</b>
            MySQL <b>•</b>
            Docker
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
