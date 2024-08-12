# Bike Rental Service

This project is a CRUD application focused on providing bike rent service and managing bike bookings by admin only. Built using Express.js and TypeScript, it leverages the robustness of Mongoose, a MongoDB object modeling tool designed to work in an asynchronous environment. used the power of JWT to secure the application.

## Technology stack and package

1. Express.js
2. TypeScript
3. MongoDB
4. Mongoose
5. JWT
6. Zod for validation
7. ESLint for code linting
8. Prettier for code formatting
9. bcrypt for hashing the password
10. http-status for http status code
11. dotenv for environment variables

### Prerequisites

Before running this project locally, ensure you have installed following:

- Node.js
- npm

### Installation

First, clone the repo :

```
git clone https://github.com/Samychowdhury01/bike-rental-service.git

```

Second, Navigate to the project directory:

```
cd bike-rental-service

```

Now Install dependencies:

```
npm install

```

## How to Run the Application

To run the application locally, you need to follow these steps:

**there are two run script :**

1. **For Production:** Run application in production mode.

```
npm run start:prod

```

2. **For Development:** Run application in development mode.

```
npm run start:dev

```

### Other Scripts:

- **Build the project:** Builds the application. (it will convert ts file to js)

```
npm run build

```

- **Check Errors using EsLint:** Lints the TypeScript files using ESLint.

```
npm run lint

```

- **Fix Errors using EsLint:** Lints and fixes the TypeScript files.

```
npm run lint:fix

```

- **Check the code formatting using Prettier:** Formats the source code using Prettier.

```
npm run prettier:format

```

- **Fix the Formatting using Prettier:** Formats and fixes the source code using Prettier.

```
npm run prettier:fix

```

# API Documentation

## API Endpoints

### Auth Endpoints

#### POST /auth/signup

- **Create a new user**: Creates a new user with the provided details.
- **Request Body**: `name`, `email`, `password`, `phone`, `address`, `role`
- **Response**: `200 OK` with the created user details.

#### POST /auth/login

- **login user**: login user with the provided details.
- **Request Body**: `email`, `password`,
- **Response**: `200 OK` with token and other user details.

### User Endpoints

#### GET users/me

- **Request Headers**: Authorization: Bearer jwt_token.
- **Response**: `200 OK` with the user details.

#### PUT users/me

- **login user**: login user with the provided details.
- **Request Body**: user data which need to update.
- **Response**: `200 OK` with updated user details.

### Bike Endpoints

#### POST /bikes(Admin only)

- **Create a new bike**: Creates a new bike with the provided details.
- **Request Body**: `name`, `description`, `pricePerHour`, `cc`, `year`, `model`, `brand`
- **Response**: `200 OK` with the created bike details.

#### GET /bikes

- **Response**: `200 OK` with the list of bikes.

#### PUT /bikes/:id

- **Request Headers**: Authorization: Bearer jwt_token.
- **Request Body**: bike data which need to update.
- **Response**: `200 OK` with updated bike details.

#### DELETE /bikes/:id

- **Request Headers**: Authorization: Bearer jwt_token.
- **Response**: `200 OK` with deleted bike details.

### Rental Endpoints

#### POST /rentals

- **Create a new booking**: Creates a new booking with the provided details.
- **Request Body**: `bikeId`, `startTime`
- **Request Headers**: User information has been extracted from the token
- **Response**: `200 OK` with the provided data and some other info.

#### PUT /bikes/rentals/:id/return (admin only)

- **Request Headers**: Authorization: Bearer jwt_token.
- **Request Body**: Not needed.
- **Response**: `200 OK` will update the `isReturn` property and calculate the total cost based on `startTime` and `returnTime`.

#### GET /rentals (of a specific user)

- **Request Headers**: Authorization: Bearer jwt_token.
- **Response**: `200 OK` with bike list that the user rented so far.

# Additional Information

Keep in mind that you need to create an `.env` file. And you have to provide `PORT`, and your `DATABASE_URL` in your `.env` file.

# Live Link

[click here](https://bike-rental-service-eta.vercel.app/)
