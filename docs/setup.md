## Tribell — Project Setup Documentation

### Project Overview

Tribell is a movie application currently under development.

The project is being built as a hands-on project to strengthen my practical experience with software development, Linux, networking, Git, and DevOps practices.

This documentation records the development process, including the setup steps, challenges encountered, troubleshooting, and solutions implemented throughout the project.

### Steps

### 1. Project Repository

The first step was creating a dedicated GitHub repository for the Tribell project.

The repository will be used to:

- Store the project source code
- Track changes using Git
- Maintain project documentation
- Create checkpoints throughout development
- Eventually support the project's CI/CD workflow

### 2. Installing Node.js and npm

Node.js and npm were installed as prerequisites for developing the React frontend.

Node.js provides the JavaScript runtime required to run development tools and applications.

npm is the package manager used to install and manage the project's JavaScript dependencies.

The installations were verified from the terminal before proceeding with the project setup.


### 3. Creating the Project Directory

A dedicated directory was created for the Tribell project.

The project directory provides a central location for the application source code, configuration files, dependencies, and documentation.

The project was developed within an Ubuntu Linux environment running through VirtualBox.


### 4. Creating the Tribell Frontend with Vite

The frontend was created using Vite with React.

Vite was selected as the frontend build tool and development server for the project.

The initial project setup generated the standard Vite/React project structure, including:

```tribell/
├── node_modules/
├── public/
├── src/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

### 5. Vite Setup Challenges

During the Vite setup, several issues were encountered.

The Vite project creation process did not complete smoothly at first, with the command taking a long time and eventually producing an error.

Network connectivity was investigated because the project creation process depended on downloading packages.

The Linux environment was tested to determine whether the issue was related to internet connectivity.

After troubleshooting, the required project files and dependencies were successfully created.

---

### 6. Starting the Vite Development Server

After successfully creating the project, the Vite development server was started using:

```npm run dev```

Vite normally uses port "5173" for the development server.

However, the port changed to "5174" and later "5175" when "5173" was already being used by another Node process.

The process using port "5173" was investigated using:

lsof -i :5173

A Node process was identified as listening on the port.

The process was stopped so that the Vite server could use the required port.

---

### 7. Testing the Application Locally

The application was tested from inside Ubuntu using:

```curl http://localhost:5173/```

The command returned the application's HTML.

This confirmed that:

- The Vite development server was running.
- The React application was being served.
- The application was functioning correctly inside the Ubuntu environment.

However, the application could not initially be accessed from Chrome outside the virtual machine.

---

### 8. Configuring Vite for Network Access

The Vite server was initially listening on:

127.0.0.1:5173

This meant the development server could only be accessed from within Ubuntu.

Vite was then started with:

```npm run dev -- --host 0.0.0.0 --port 5173```

This configured Vite to listen on all network interfaces.

The configuration was verified using:

```ss -ltnp | grep 5173```

The output showed:

0.0.0.0:5173

This meant Vite was now accepting connections through the Ubuntu VM's network interface.

---



### 9. Ubuntu Firewall Configuration

Ubuntu's firewall was checked using:

```sudo ufw status```

The firewall was active.

Because the Vite development server was running on TCP port "5173", the port was allowed through the firewall:

```sudo ufw allow 5173/tcp```

The firewall status was then checked again to verify the rule.

---

### 10. Testing Connectivity from Windows

The connection between the Windows host machine and the Ubuntu VM was tested using PowerShell.

The following command was used:

```Test-NetConnection <Ubuntu-IP> -Port 5173```

Initially, the test returned:

TcpTestSucceeded : False

This indicated that Windows could not reach the Vite development server.

After configuring the Ubuntu firewall to allow TCP traffic on port "5173", the connection test succeeded.

---

### 11. Successful Browser Access

After the networking and firewall configuration was completed, the application was successfully opened from Chrome outside the VirtualBox environment.

The default Vite/React starter page was displayed.

This confirmed that the development environment was successfully configured.

The current page is still the default Vite/React interface. The actual Tribell frontend development has not yet started.

---



### 12. Frontend Development in VS Code

After successfully accessing the application from Chrome, I moved into VS Code to begin developing the actual Tribell frontend.

The default Vite interface was gradually replaced with the Tribell movie-platform interface. I focused on building the frontend structure and creating an experience similar to a modern streaming platform.

### Frontend Features Implemented

So far, I have worked on:

- Tribell's main navigation and layout
- Hero section and movie presentation
- Movie sections and categories
- Movie selection and details
- **Watch Now** interaction
- **My List** functionality
- Search functionality
- Coming Soon section
- Interactive movie modal
- Added/selected movie states
- Removing movies from My List
- Frontend styling and responsive layout

The frontend is still under development, and additional features and improvements will be added before moving to the backend stage.

## 13. Frontend Testing and Improvements

As I developed the frontend, I tested the application directly in the browser and fixed issues as they appeared.

This included correcting JSX and React errors, checking button interactions, testing the search functionality, and making sure different sections of the application displayed correctly.

The focus at this stage is to build and test the user interface before connecting it to a backend and database.



### Current Status

The Tribell frontend is currently under active development in VS Code.

The application can be accessed successfully through Chrome, and the frontend now contains custom Tribell features instead of the original default Vite interface.

The next focus is to continue improving and completing the frontend before moving on to backend development and database integration.

### Next Stage

The next stage will focus on completing and refining the Tribell frontend.

After the frontend is sufficiently developed, the project will progress to:

- Backend development
- Database integration
- User authentication
- Connecting frontend features to backend services
- Testing
- CI/CD
- Deployment
- Monitoring

These stages will gradually turn the current frontend prototype into a more complete full-stack application.


### Troubleshooting Notes

This section will be updated throughout the project.

The purpose is to record problems encountered during development, how they were investigated, and how they were resolved.

## Browser Access

The application initially required network and firewall configuration before it could be accessed from Chrome outside the VirtualBox environment.

**Resolution:** Network configuration and firewall rules were adjusted, after which the application became accessible from Chrome.

## Frontend Development

During development, some React and JSX errors occurred while adding new features and modifying the application.

**Resolution:** The affected JSX and React code was corrected and tested again in the browser.

## Git and GitHub Repository

While preparing to push the updated project to GitHub, Git was initially operating from the wrong repository location and was detecting files outside the Tribell project.

**Resolution:** The Git repository setup was corrected so that the Tribell project folder is treated as the project repository, preventing unrelated personal computer files from being included.