class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.initEventListeners();
        this.renderTasks();
        this.updateStats();
    }

    initEventListeners() {
        document.getElementById('task-form').addEventListener('submit', this.addTask.bind(this));
        document.getElementById('search-bar').addEventListener('input', this.filterTasks.bind(this));
        document.getElementById('sort-select').addEventListener('change', this.sortTasks.bind(this));
    }

    addTask(event) {
        event.preventDefault();
        
        const taskName = document.getElementById('task-name').value;
        const taskDate = document.getElementById('task-date').value;
        const taskPriority = document.getElementById('task-priority').value;

        const newTask = {
            id: Date.now(),
            name: taskName,
            date: taskDate,
            priority: taskPriority,
            completed: false
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        // Reset form
        event.target.reset();
    }

    renderTasks(tasksToRender = this.tasks) {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        tasksToRender.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item', `${task.priority}-priority`);
            
            // Check if task is overdue
            const today = new Date();
            const taskDate = new Date(task.date);
            if (taskDate < today && !task.completed) {
                taskElement.classList.add('overdue');
            }

            taskElement.innerHTML = `
                <span>${task.name} - ${task.date}</span>
                <div>
                    <button onclick="todoApp.toggleComplete(${task.id})">
                        ${task.completed ? '✓' : '○'}
                    </button>
                    <button onclick="todoApp.deleteTask(${task.id})">🗑️</button>
                </div>
            `;

            taskList.appendChild(taskElement);
        });
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    toggleComplete(id) {
        const task = this.tasks.find(task => task.id === id);
        task.completed = !task.completed;
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    filterTasks() {
        const searchTerm = document.getElementById('search-bar').value.toLowerCase();
        const filteredTasks = this.tasks.filter(task => 
            task.name.toLowerCase().includes(searchTerm)
        );
        this.renderTasks(filteredTasks);
    }

    sortTasks() {
        const sortMethod = document.getElementById('sort-select').value;
        let sortedTasks = [...this.tasks];

        switch(sortMethod) {
            case 'date':
                sortedTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                sortedTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
                break;
            case 'name':
                sortedTasks.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        this.renderTasks(sortedTasks);
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const overdueTasks = this.tasks.filter(task => {
            const today = new Date();
            const taskDate = new Date(task.date);
            return taskDate < today && !task.completed;
        }).length;

        document.getElementById('total-tasks').textContent = totalTasks;
        document.getElementById('completed-tasks').textContent = completedTasks;
        document.getElementById('overdue-tasks').textContent = overdueTasks;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

const todoApp = new TodoApp();