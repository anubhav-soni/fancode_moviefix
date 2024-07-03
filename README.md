# Fancode Moviefix Assignment React Project Setup Instructions

## Introduction

This guide will help you set up the React project on your local machine. Follow the steps below to clone the repository, install dependencies, and run the project.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: Download and install from [nodejs.org](https://nodejs.org/)
- **npm** (Node Package Manager): Comes with Node.js installation
- **Git**: Download and install from [git-scm.com](https://git-scm.com/)
- **Visual Studio Code (VS Code)**: Download and install from [code.visualstudio.com](https://code.visualstudio.com/)

## Getting Started

### 1. Create a Folder

Create a new folder on your desktop. For example, name it `Fancode11`.

### 2. Open the Folder in VS Code

Right-click on the newly created folder (`Fancode11`) and select `Open with Code` to open the folder in Visual Studio Code.

### 3. Open the Terminal in VS Code

- **For Windows:** Press Ctrl + Shift + ` (backtick).
- **Alternatively:** Click on the three dots in the menu bar and select `Terminal -> New Terminal`.

### 4. Clone the Repository

Once the terminal opens, run the following command to clone the project:

git clone https://github.com/anubhav-soni/fancode_moviefix.git

### 5. Navigate to the Project Folder

After cloning the repository, navigate inside the project folder by running the following command:

cd fancode_moviefix

### 6. Install React Dependencies:

Run the following command in the terminal to install all necessary dependencies:

npm install

### 7. Start the Project:

Once the installation is complete, start the project with the command:

npm start

This will launch the project and open it in your default web browser at:

http://localhost:3000/



### Additional Information about the Assignment

# Movie List App - Assignment Overview


This application fetches and displays a list of movies with various features for sorting, filtering, and searching.

### Features

1. **Fetch and Display Movies:**
   - Retrieve a list of movies from the API.
   - Display the movies sorted in descending order of popularity.
   - Each movie information card includes:
     - Title
     - Image
     - Genre
     - Cast
     - Director
     - Short description of max 100 letters

2. **Year-Based Loading:**
   - Load a total of 20 movies for each year.

3. **Default Behavior:**
   - On page load, automatically scroll to display a list of movies starting from the year 2012 (for the first time only after page loads)

4. **Genre Filtering:**
   - Fetch genres from the API.
   - Show genres as multi-select filters.
   - When a user selects a genre, fetch a fresh list of movies for that particular genre.

5. **Search Functionality:**
   - Implement a search bar to search for movies based on a search string.