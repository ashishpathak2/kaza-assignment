# User Authentication API

## Overview
This is a simple Node.js authentication API using Express, Sequelize, and MySQL. It includes user signup, signin, authentication middleware, profile update, and signout functionality.

## Prerequisites
- MySQL server must be installed and running locally.
- Node.js and npm installed.

## Installation
```sh
# Clone the repository
git clone https://github.com/your-repo.git
cd your-repo

# Install dependencies
npm install

# Create MySQL database
mysql -u root -p -e "CREATE DATABASE kaza;"

# Start the server
node index.js
```

## API Endpoints

### 1. User Signup
**Endpoint:** `POST /signup`
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. User Signin
**Endpoint:** `POST /signin`
```json
{
  "identifier": "test@example.com",  // or "testuser"
  "password": "password123"
}
```

### 3. Update Profile (Authenticated)
**Endpoint:** `PUT /profile`
```json
{
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```

### 4. User Signout
**Endpoint:** `POST /signout`

## Technologies Used
- Node.js
- Express.js
- Sequelize (ORM)
- MySQL
- bcryptjs (for password hashing)
- jsonwebtoken (for authentication)
- cookie-parser (for handling cookies)

## Notes
- The server runs on port `3000` by default.
- Secure cookies should be enabled in production.
- Modify database credentials in `index.js` if needed.

## License
This project is licensed under the MIT License.

