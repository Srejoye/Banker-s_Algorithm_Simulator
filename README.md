# ⚙️ Banker's Algorithm Simulator

> A browser-based interactive simulator for the Banker's Algorithm in Operating Systems — featuring real-time safe state detection, deadlock analysis and resource allocation graph visualization.

🔗 **[Live Demo](https://srejoye.github.io/Banker-s_Algorithm_Simulator/)** &nbsp;|&nbsp; Built with HTML · CSS · Vanilla JavaScript

---

## 📌 Overview

The **Banker's Algorithm Simulator** is an educational tool that models an operating system's resource allocation environment. Users can configure any number of processes and resource types, input allocation and maximum matrices and execute Dijkstra's Banker's Algorithm interactively — observing each step of the safety check, detecting deadlocks and recovering from them, all in real-time and within the browser with no setup required.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Dynamic Matrix Input** | Configure Allocation, Maximum, Need and Available matrices for any n × m system |
| **Auto-computed Need Matrix** | `Need = Maximum − Allocation`, recalculated live on every keystroke |
| **Step-by-step Safety Algorithm** | Animated execution with adjustable playback speed (0.2s – 2.0s per step) |
| **Resource Request Handling** | Submit a request vector for any process; instantly granted or denied based on safety |
| **Deadlock Detection** | Identifies deadlocked vs. completable processes with blocked process analysis |
| **Deadlock Recovery** | Terminates the first deadlocked process, releases its resources and re-evaluates state |
| **RAG Visualization** | Canvas-rendered Resource Allocation Graph with colour-coded allocation and request edges |
| **Visual Diff Panel** | Before/after state comparison displayed after every request or recovery action |
| **Input Validation** | Cells are flagged in real time when Allocation exceeds Maximum; Run is disabled until resolved |
| **Reset Controls** | Clear simulation output independently of matrix data for iterative testing |

---

## 🚀 How to Run

No build tools, package managers or dependencies are required.

```bash
# Clone the repository
git clone https://github.com/Srejoye/Banker-s_Algorithm_Simulator.git
cd Banker-s_Algorithm_Simulator

# Open index.html in browser
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

Alternatively, you can simply drag and drop `index.html` into any modern web browser.

---

## 🖥️ Usage

### Step 1 — Configure the System
Enter the number of **processes (n)** and **resource types (m)** in the sidebar, then click **Generate Tables** to create the input matrices.

### Step 2 — Fill in the Matrices
| Matrix | Description |
|---|---|
| **Allocation** | Resources currently held by each process |
| **Maximum** | Maximum resources each process may request |
| **Need** | Auto-computed: `Maximum − Allocation` |
| **Available** | Total unallocated resources in the system |

> ⚠️ Invalid cells (Allocation > Maximum) are highlighted red. The simulator prevents execution until all values are valid.

### Step 3 — Run the Safety Algorithm
Click **Run Safety Algorithm**. The simulator animates each step of the Banker's safety check and outputs either:
- ✅ **Safe state** — a valid safe sequence (e.g. `P1 → P3 → P0 → P2 → P4`)
- ❌ **Unsafe state** — a list of deadlocked processes

### Step 4 — Explore Additional Actions
- **Detect Deadlock** — runs deadlock detection independently at any time, even before executing the full simulation
- **Submit Request** — request resources for a specific process; the system applies it only if the resulting state remains safe
- **Recover** — terminates a deadlocked process and frees its resources for re-evaluation
- **Reset** — clears all simulation output while preserving matrix inputs

---

## 🗂️ Project Structure

```
Banker-s_Algorithm_Simulator/
├── index.html    # Application shell — layout, markup, UI controls
├── style.css     # Design system — component styles, animations, responsive layout
└── script.js     # Core logic — algorithm implementations, RAG rendering, DOM handling
```

---

## 🎨 Tech Stack

| Technology | Role |
|---|---|
| **HTML5** | Semantic structure and Canvas API for RAG rendering |
| **CSS3** | Custom properties, CSS Grid/Flexbox and keyframe animations |
| **Vanilla JavaScript** | Simulator logic, algorithm execution and real-time DOM updates |

---

## 📊 Resource Allocation Graph (RAG)

The Resource Allocation Graph (RAG) is rendered on an HTML5 `<canvas>` after each algorithm run or resource request.

| Symbol | Meaning |
|---|---|
| 🔵 Circle | Process node (P0, P1, …) |
| 🟫 Square | Resource type node (R0, R1, …) |
| 🟢 Green arrow (R → P) | Allocation edge — resource assigned to a process |
| 🔴 Red arrow (P → R) | Request edge — process waiting for a resource |

A cycle in the RAG indicates a potential deadlock condition.

---

## 📚 Concepts Covered

- **Banker's Algorithm** — Dijkstra's resource allocation and deadlock avoidance strategy
- **Safe State & Safe Sequence** — conditions under which all processes can complete
- **Deadlock Detection** — identification of circular wait among processes
- **Deadlock Recovery** — process termination as a recovery strategy
- **Resource Allocation Graph** — graphical representation of system resource state
- **Need Matrix** — representation of remaining resource requirements (`Maximum − Allocation`)

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
