# Tod-Lists

A simple and efficient Todo List application built with the MERN stack. This app allows users to create, read, update, and delete tasks seamlessly.


## Screenshots





## Features

- **User Authentication**: Secure registration and login system with JWT (JSON Web Tokens) for session management.
- **Task Management**: Create, read, update, and delete tasks easily.
- **Task Status Tracking**: Pin tasks as completed or pending and filter them accordingly.
- **Due Dates**: Assign due dates to tasks and sort them based on urgency.


## Installation

Install my-project with npm

- Before you begin,ensure you have following Installationin your system.

- Node js
- PostMan
- MangoDb Compass / Connect VS code extension [ MangoDB ]

**Clone the repository**
   
```bash
  git clone https://github.com/Pavandollar/Todos-App-Hatio-.git
```

    
## Navigate to the project directory:


- **Frontend**

```bash
  cd frontend
  cd notes-app
```
- **Backend**

```bash
  cd backend
```
- **Install server dependencies**

```bash
   npm install express mongoose cors dotenv jsonwebtoken nodemon
```

- **Install client dependencies**

```bash
   npm install axios react-router-dom react-modal react-icons react -dom
```
## Environment Variables

- To run this project, you will need to add the following environment variables to your .env file


- Create a .env file in the server directory and add your MongoDB connection string

```bash
  ACCESS_TOKEN_SECRET=Your_Secret_Key_Here
```
```bash
  connectionString : Your mango db url
```
## Run Application

- Start the server:

```bash
 npm start
```

-Start the client:
```bash
 npm run dev
```
-Open your browser and go to http://localhost:8000.
## API Endpoints

### Authentication
- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Log in an existing user.

### Tasks
- **GET /api/tasks**: Retrieve all tasks for the authenticated user.
- **POST /api/tasks**: Create a new task.
- **PUT /api/tasks/:id**: Update an existing task.
- **DELETE /api/tasks/:id**: Delete a task.
- **PUT /api/tasks/:id**: To Pin a task.
- **PUT /api/tasks/:id**: Search an task.
## Tech Stack


- **MongoDB**: A NoSQL database to store user and task data.
- **Express**: A minimal and flexible Node.js web application framework for building APIs.
- **React**: A JavaScript library for building user interfaces, handling dynamic content effortlessly.
- **Node.js**: A JavaScript runtime built on Chrome's V8 engine for server-side programming.
- **JWT**: For secure user authentication.
- **Axios**: For making HTTP requests from the client side.
- **PostMan**: Used this tool for developing HTTP requests and for Documenting APIs
## Usage

### Registration
- **Sign Up**: Create a new account by filling in the registration form with your details. This will allow you to manage your tasks securely.

### Login
- **User Authentication**: Log in using your registered credentials to access your personal task list.

### Manage Tasks
- **Add New Tasks**: Use the input field on the main interface to add new tasks. Enter the task description and click "Add" to save it.
- **Edit or Delete Tasks**: Each task will have buttons to edit or delete. Click the "Edit" button to modify the task details, or click "Delete" to remove the task from your list.
- **Filter Tasks**: Use the filter options to view tasks based on their completion status. You can choose to see:
  - **All Tasks**: Displays all tasks, regardless of their status.
  - **Completed Tasks**: Shows only tasks that have been marked as completed.
  - **Pending Tasks**: Displays tasks that are still pending.

### Due Dates
- **Assign Due Dates**: When adding or editing a task, you can assign a due date to help manage deadlines. 
- **View Due Dates**: Due dates will be visible alongside each task, making it easier to prioritize your workload.


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Acknowledgements

 
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 
```bash
  Feel free to modify any section to better fit your project. If you provide more details about the app's functionality or specific technologies, I can help you refine it further!
