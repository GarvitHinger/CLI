const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const program = new Command();

const tasksFilePath = path.join(__dirname, 'tasks.json');
// const program = new Command();

// const tasksFilePath = path.join(__dirname, "tasks.json");

const loadTasks = () => {
        if (!fs.existsSync(tasksFilePath)) {
            return [];
        }
        const data = fs.readFileSync(tasksFilePath, 'utf-8');
        
        // If the file is empty, return an empty array
        if (data.trim() === "") {
            return [];
        }

        try {
            return JSON.parse(data);
        } catch (error) {
            console.error("Error parsing JSON data:", error.message);
            return [];
        }
};    

const saveTasks = (tasks) => {
        fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf-8');
};

program
        .command('add <description>')
        .description('Add a new task')
        .action((description) => {
                const tasks = loadTasks();
                const newTask = {
                        id: tasks.length + 1,
                        description,
                        status: "pending"
                }
                tasks.push(newTask);
                saveTasks(tasks);
                console.log("Task Added.");
        });

program
        .command('list')
        .description('Show all tasks')
        .action(() => {
                const tasks = loadTasks();
                if (tasks) {
                        console.log(`\n Your tasks:`)
                        tasks.forEach(t => {
                                console.log(`${t.id} ${t.description} ${t.status}`);
                        });
                }
                else {
                        console.log("No task exist.")
                }
        });

program
        .command('update <id> <newDescription>')
        .description('Update the task')
        .action((id, newDescription) => {
                const tasks = loadTasks();
                const task = tasks.find(t => t.id == id);
                if (task) {
                        task.description = newDescription;
                        saveTasks(tasks);
                        console.log(`Update on ID ${id} completed: ${newDescription}`);
                }
                else {
                        console.log(`No task with ID ${id} exist.`);
                }                
        });

program
        .command('complete <id>')
        .description('Mark a task as complete')
        .action((id) => {
                const tasks = loadTasks();
                const task = tasks.find(t => t.id == id);
                if (task) {
                        task.status = 'completed';
                        saveTasks(tasks);
                        console.log(`Task ID ${id} completed.`)
                }
                else {
                        console.log(`No task with ID ${id} exist.`);
                }
        });

program
        .command('delete <id>')
        .description('Delete a task')
        .action((id) => {
                let tasks = loadTasks();
                const initialLength = tasks.length;
                tasks = tasks.filter(t => t.id != id)
                if (tasks.length < initialLength) {
                        saveTasks(tasks);
                        console.log(`ID ${id} deleted successfully`);
                }
                else {
                        console.log(`ID ${id} doesn't exist.`);
                }
        });

program
        .command('clear')
        .description('Clear all completed tasks')
        .action(() => {
                let tasks = loadTasks();
                const initialLength = tasks.length;
                tasks = tasks.filter(t => t.status != "completed");
                saveTasks(tasks);
                console.log("Clear all completed tasks");
        });

program.parse(process.argv);