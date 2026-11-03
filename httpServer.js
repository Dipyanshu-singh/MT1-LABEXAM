import http from 'http';
import fs from 'fs';

let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Create Database Design",
        assignedTo: "Amit Kumar",
        status: "Completed"
    }
];

const server = http.createServer((req, res) => {

    const url = req.url;
    const method = req.method;

    // A1 and A2: Home route
    if (url === "/" && method === "GET") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Welcome to Employee Task Management System</h1>");
    }

    // A2 and A3: GET all tasks
    else if (url === "/tasks" && method === "GET") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(tasks));
    }

    // A2: About route
    else if (url === "/about" && method === "GET") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h2>Employee Task Management Application</h2><p>Manage employee tasks and assignments.</p>");
    }

    // A4: Serve HTML using FS module
    else if (url === "/home" && method === "GET") {

        fs.readFile("./public/index.html", "utf8", (err, data) => {

            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                res.end("Error reading HTML file");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });
    }

    // A3: POST a new task
    else if (url === "/add-task" && method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            try {
                const newTask = JSON.parse(body);

                if (
                    newTask.id === undefined ||
                    !newTask.taskName ||
                    !newTask.assignedTo ||
                    !newTask.status
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "All required fields are necessary"
                    }));

                    return;
                }

                if (tasks.some(task => task.id === newTask.id)) {
                    res.writeHead(409, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "Task ID already exists"
                    }));

                    return;
                }

                tasks.push(newTask);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Task added successfully",
                    task: newTask
                }));

            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON data"
                }));
            }
        });
    }

    // A5: Invalid route
    else {
        res.writeHead(404, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "404 - Route Not Found"
        }));
    }

});

// A1: Start server
server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});