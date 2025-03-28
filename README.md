# Text Analyzer

Text Analyzer is a web application that allows users to analyze text for various metrics, including word count, character count, sentence count, paragraph count, and longest words. It features OAuth authentication, a user-friendly dashboard, and a secure backend API.

## Features

- **Text Management**: Create, edit, and organize your texts.
- **Detailed Analysis**: Analyze texts for word count, character count, sentence count, paragraph count, and longest words.
- **Secure Authentication**: OAuth-based Google login.
- **Performance Optimizations**: Caching and rate limiting for API requests.
- **Modern UI**: Built with Next.js and Ant Design.

## Project Structure

```
text-analyzer/
├── client/       # Frontend (Next.js)
├── server/       # Backend (Node.js, Express)
├── mongo-docker-compose.yaml  # MongoDB Docker setup
├── redis-docker-compose.yaml  # Redis Docker setup
├── LICENSE       # License file
└── README.md     # Project documentation
```

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v22.14.0 as specified in `.nvmrc`)
- [Docker](https://www.docker.com/) (for MongoDB and Redis)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [nvm](https://github.com/nvm-sh/nvm) (optional, for managing Node.js versions)

## Getting Started

Follow these steps to set up and run the project on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/text-analyzer.git
cd text-analyzer
```

### 2. Set Up the Backend

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the `.env.example` file to `.env` and update the environment variables as needed:

   ```bash
   cp .env.example .env
   ```

4. Start MongoDB and Redis using Docker:

   ```bash
   docker-compose -f ../mongo-docker-compose.yaml up -d
   docker-compose -f ../redis-docker-compose.yaml up -d
   ```

5. Seed the database (optional):

   ```bash
   npm run seed
   ```

6. Start the backend server:

   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:3000`.

### 3. Set Up the Frontend

1. Navigate to the `client` directory:

   ```bash
   cd ../client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`.

### 4. Access the Application

- Open your browser and navigate to `http://localhost:3000`.
- Log in using Google OAuth to access the dashboard and start analyzing texts.

## Scripts

### Backend (Server)

- `npm run dev`: Start the backend in development mode.
- `npm run start`: Start the backend in production mode.
- `npm run seed`: Seed the database with sample data.
- `npm run test`: Run tests for the backend.

### Frontend (Client)

- `npm run dev`: Start the frontend in development mode.
- `npm run build`: Build the frontend for production.
- `npm run start`: Start the frontend in production mode.
- `npm run lint`: Lint the frontend code.

## Technologies Used

### Frontend

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Ant Design](https://ant.design/)

### Backend

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)
- [Passport.js](http://www.passportjs.org/) (Google OAuth)

### DevOps

- [Docker](https://www.docker.com/)

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## Troubleshooting

- Ensure MongoDB and Redis are running via Docker.
- Check `.env` files for correct configuration.
- Use `npm run dev` for development mode to see detailed logs.

## Contact

For any issues or questions, please contact the project maintainer at `your-email@example.com`.
