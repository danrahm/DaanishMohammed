# Daanish Abdul Raheem Mohammed Portfolio  

Welcome to my portfolio! I'm Daanish Mohammed, a student at Weber State University, passionate about software development, web applications, and data engineering. This repository showcases my work on various assignments and projects throughout my coursework. Each project is detailed with descriptions, technologies used, challenges faced, and my contributions. Explore the projects below, and feel free to reach out if you have any questions.


[Go to full repository](https://github.com/danrahm/DaanishMohammed)

## CS Assignments

- [Banking App Frontend](https://github.com/danrahm/DaanishMohammed/tree/main/BankingApp)  
- [Hangman Game](https://github.com/danrahm/DaanishMohammed/tree/main/HangmanGame)  
- [Mern Hello World](https://github.com/danrahm/DaanishMohammed/tree/main/MernHelloWorld)
- [mern-web](https://github.com/danrahm/DaanishMohammed/tree/main/mern-web)
- [myExpressApp](https://github.com/danrahm/DaanishMohammed/tree/main/myExpressApp)


## Project Descriptions

#### Banking App Frontend

![Screenshot of Login Page](/Assests/images/CreateAccount.png)  
![Screenshot of Dashboard](/Assests/images/EmployeeDashboard.png)

This project involved creating a front-end interface for a banking application using React. The app features a secure login system, role-based access controls for administrators, employees, and customers, and a clean, user-friendly UI.

**Key Features:**

- **Login System:** The app requires users to log in with a username and password, verifying credentials securely.
- **Role-Based Access:** Depending on the user’s role (administrator, employee, or customer), different features and permissions are granted.
  - Administrators can manage user roles and have full access to the system.
  - Employees can view and manage customer accounts.
  - Customers can manage their savings, checking, and investment accounts.
- **Clean UI:** The interface is designed with Bootstrap to ensure a consistent, polished look across all pages.

**Technologies Used:**
- **React:** For building the interactive UI components.
- **Bootstrap:** To create a responsive and clean layout.

**Technical Challenges:**
One challenge was implementing role-based access controls that allow different users to perform distinct actions depending on their role. Ensuring a secure login system that hashes passwords using SHA-256 was also critical.

**My Contributions:**
I was responsible for developing the entire front-end interface, including implementing the login system, creating the role-based access controls, and ensuring the UI was responsive and user-friendly.

[Go to repository](https://github.com/danrahm/DaanishMohammed/tree/main/BankingApp)

---

#### Hangman Game

![Screenshot of Hangman Game](/Assests/images/Hangman.png)  
![Screenshot of High Scores Table](/Assests/images/HighScoreTable.png)

This project was to develop a traditional hangman game with a focus on implementing both the game logic and a high scores feature. The game was built with a React frontend, an Express backend, and a MongoDB data store.

**Key Features:**

- **Gameplay:** The user guesses letters to complete a word, with incorrect guesses leading to the hangman's progress.
- **High Scores:** After each game, the player's performance is saved in a high scores table, showing the top 10 scores for words of similar length.
- **Random Word Selection:** Words are randomly selected from a database of over 1,000 words.

**Technologies Used:**
- **React:** For rendering the game interface.
- **Express:** To handle the backend logic, including session management and interaction with MongoDB.
- **MongoDB:** For storing words and high scores.

**Technical Challenges:**
One significant challenge was ensuring that the word to be guessed is never sent to the client, preventing users from inspecting the DOM to find the solution early. Implementing the high scores table to show the best performances based on word length was also complex.

**My Contributions:**
I developed both the game logic and the high scores feature, ensuring the game was engaging and secure. I also handled the integration of the backend with the MongoDB data store.

[Go to repository](https://github.com/danrahm/DaanishMohammed/tree/main/HangmanGame)

---

#### Mern Hello World

The Mern Hello World project is a basic stack application designed to demonstrate a simple "Hello World" functionality using the MERN stack (MongoDB, Express, React, Node.js). The application reads a value from a database/data store and displays it in a React frontend.

**Technologies Used:** MongoDB, Express, React, Node.js


[Go to repository](https://github.com/danrahm/DaanishMohammed/tree/main/MernHelloWorld)

---

### mern-web

![Screenshot 1](/Assests/images/MernBank1.png)
![Screenshot 2](/Assests/images/MernBank.png)

The MERN Web project is a more advanced implementation of the MERN stack, designed to demonstrate full CRUD operations with session management. This project simulates a simple banking application where users can register, log in, view their account details, and manage their finances.

**Key Features:**
- **Account Registration and Login:** Allows users to register with their details and log in using their email and password.
- **Session Management:** Tracks user sessions across different pages using session cookies stored in MongoDB.
- **Account Summary and Management:** Users can view their personal details and account balances, and perform transactions like deposits and withdrawals.
- **Logout Functionality:** Users can securely log out, ending their session.

**Technologies Used**

- **MongoDB** for storing user data and session information.
- **Express** and **Node.js** for the backend server and routing.
- **React** for the front-end interface.
- **Sessions** for tracking user sessions across different pages.

**My Contributions**

I was responsible for implementing both the front-end and back-end, focusing on session management and ensuring the application adheres to RESTful principles.

[Go to repository](https://github.com/danrahm/DaanishMohammed/tree/main/mern-web)

---

## myExpressApp

![Screenshot 1](/Assests/images/MyExpressApp.png)
![Screenshot 2](/Assests/images/MyExpressApp1.png)

This project serves as an introduction to MongoDB and RESTful APIs using Node.js and Express. It forms the backend for a banking system that handles user accounts and tracks balances for checking and savings accounts. Although no front-end is provided, the backend is fully functional and ready for integration with a React front-end.

**Key Features:**
- **User Account Management:** Supports creating accounts, logging in, and managing account details.
- **Account Operations:** Users can deposit, withdraw, and transfer money between checking and savings accounts.
- **RESTful API:** All routes accept and return JSON, adhering to RESTful principles for easy integration with a front-end.

**Technologies Used**

- **MongoDB** for storing user data and account balances.
- **Express** and **Node.js** for server-side logic and routing.
- **RESTful API** principles for clean and efficient data handling.

**My Contributions**

I implemented the entire backend, focusing on building a RESTful API and integrating MongoDB for persistent data storage. This project is a foundation for later work involving a React frontend and session management.

[Go to repository](https://github.com/danrahm/DaanishMohammed/tree/main/myExpressApp)

---

Thank you for visiting my portfolio.
