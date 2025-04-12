# ReChat - Real-time Chat Application

ReChat is a modern real-time chat application built with a React frontend and Node.js backend. It allows users to register, login, chat with friends, and engage in random conversations with other online users.

## Features

- **User Authentication**: Secure signup and login functionality
- **Friend Management**: Add and remove friends from your contacts
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **Random Chat**: Connect with random online users for spontaneous conversations
- **Responsive Design**: Modern UI that works on both desktop and mobile devices

## Tech Stack

### Frontend

- React.js with Vite
- React Router for navigation
- Tailwind CSS for styling
- Socket.IO client for real-time communication
- Axios for API requests
- Lucide React for icons

### Backend

- Node.js with Express
- MongoDB with Mongoose for data storage
- Socket.IO for real-time communication
- JWT for authentication
- Bcrypt for password hashing

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Setup

1. Clone the repository

2. Install dependencies for both client and server:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Configure environment variables:
   - Create a `config.env` file in the server directory with the following variables:

## Running the Application

### Development Mode

1. Start the server:

```bash
cd server
npm run dev
```

2. Start the client:

```bash
cd client
npm run dev
```
