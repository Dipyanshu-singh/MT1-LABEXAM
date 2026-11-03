import express from 'express';

const app = express();

app.use(express.json());

let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },
    {
        id: 2,
        taskName: "Create Database Design",
        assignedTo: "Amit Kumar",
        status: "Completed",
        priority: "Medium"
    },
    {
        id: 3,
        taskName: "Develop Dashboard",
        assignedTo: "Priya Singh",
        status: "In Progress",
        priority: "High"
    }
];

// GET all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// GET task by ID
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === Number(req.params.id));

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
});

// POST new task
app.post('/tasks', (req, res) => {
    const { id, taskName, assignedTo, status, priority } = req.body;

    if (id === undefined || !taskName || !assignedTo || !status || !priority) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (tasks.some(t => t.id === Number(id))) {
        return res.status(409).json({ message: "Duplicate task ID" });
    }

    const newTask = {
        id: Number(id),
        taskName,
        assignedTo,
        status,
        priority
    };

    tasks.push(newTask);

    res.status(201).json({
        message: "Task added successfully",
        task: newTask
    });
});

// PUT update task
app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    const { taskName, assignedTo, status, priority } = req.body;

    if (!taskName || !assignedTo || !status || !priority) {
        return res.status(400).json({ message: "All fields are required" });
    }

    tasks[index] = { id, taskName, assignedTo, status, priority };

    res.status(200).json({
        message: "Task updated successfully",
        task: tasks[index]
    });
});

// DELETE task
app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    const deleted = tasks.splice(index, 1);

    res.status(200).json({
        message: "Task deleted successfully",
        task: deleted[0]
    });
});

// Invalid routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Invalid JSON and server errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: "Invalid JSON" });
    }

    res.status(500).json({ message: "Internal Server Error" });
});

// Start server
app.listen(4000, () => {
    console.log("Express Server running at http://localhost:4000");
});