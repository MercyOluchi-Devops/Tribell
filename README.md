# Tribell 🎬 

Tribell is a movie application currently under development.

This project is being built as a hands-on project to develop practical experience in software development, Linux, networking, Git, and DevOps practices.

### Project Status

Current Stage: Frontend development in progress.

The initial React/Vite application has been successfully created, configured, and accessed through a browser from outside the Ubuntu virtual machine.

Frontend cevelopment is now underway, with the default vite interface being replaced with the custom Tribell movie-platform experience.

### Technology Stack

- React
- Vite
- JavaScript
- Node.js
- npm
- Linux (Ubuntu)
- Git
- GitHub
- VirtualBox

Additional technologies will be added as the project progresses.

### Development Environment

Tribell is currently being developed inside an Ubuntu Linux virtual machine using VirtualBox.

The development environment currently uses:

- Ubuntu Linux
- VirtualBox
- Bridged Adapter networking
- UFW firewall
- Vite development server
- VS Code

### Setup Completed

The following steps have been completed:

- Created the Tribell GitHub repository
- Installed Node.js and npm
- Created the Tribell project directory
- Created the React frontend using Vite
- Installed the project dependencies
- Started and tested the Vite development server
- Troubleshot Vite and port-related issues
- Configured Vite to listen on network interfaces
- Configured VirtualBox with a Bridged Adapter
- Configured Ubuntu's UFW firewall
- Allowed TCP traffic on port "5173"
- Tested connectivity between Windows and the Ubuntu VM
- Successfully accessed the Vite application from Chrome outside the virtual machine
- Set up the project for frontend development in VS Code
- Replaced the default Vite interface with the developing - Tribell frontend
- Added the main Tribell layout and movie sections
- Added a hero section
- Added movie selection and details
- Added an interactive movie modal
- Added Watch Now interaction
- Added My List functionality
- Added search functionality
- Added a Coming Soon section
- Added movie added/selected states
- Added the ability to remove movies from My List
- Tested and corrected frontend React/JSX issues during development


### Project Structure
```tribell/
├── docs/
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

### Running the Development Server

From the Tribell project directory:

```npm run dev -- --host 0.0.0.0 --port 5173```

Vite will provide a local and network address that can be used to access the development application.

### Frontend Development

The frontend is currently being developed with React and JavaScript.

The focus at this stage is on building the user interface and interactive features before connecting the application to a backend.

Current frontend work includes:

- Navigation and page layout
- Hero section
- Movie sections
- Movie details
- Search
- Watch Now interaction
- My List
- Coming Soon
- Interactive movie modal
- Frontend styling and user interface improvements

The frontend is still under active development and will continue to be refined before the backend stage.

### Documentation

Detailed information about the project setup, troubleshooting, networking configuration, and development process can be found in the "docs/"  directory.

### Roadmap

The project will continue to develop through the following stages:

- Build the Tribell frontend
- Develop reusable React components
- Add movie browsing and discovery features
- Develop the backend
- Integrate a database
- Add authentication
- Implement testing
- Containerize the application
- Set up CI/CD
- Deploy the application
- Add monitoring and observability
- Improve application security

### Author

## Chijioke Mercy

Tribell is being developed as a practical project to strengthen hands-on software development, Linux, cloud, and DevOps skills.
