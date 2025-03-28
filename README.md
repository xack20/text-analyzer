# Text Analyzer Project

The Text Analyzer is a web application that allows users to create, analyze, and manage text documents. With features like word count, sentence count, and more, users can gain insights into their text data. The application supports Google OAuth for secure authentication and uses Redis for session management.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Docker Integration](#docker-integration)
- [Google Cloud Console Configuration](#google-cloud-console-configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication via Google OAuth
- Create, update, and delete text documents
- Analyze text for word count, sentence count, and more
- Redis integration for session management
- Rate limiting and caching for optimized performance

## Tech Stack

- **Frontend**: Next.js, Ant Design
- **Backend**: Node.js, Express.js, MongoDB, Redis
- **Authentication**: Passport.js (Google OAuth)
- **Deployment**: Docker

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or newer)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Backend Setup

1. **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd text-analyzer/server
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Environment Configuration**:

    Create a `.env` file in the `server` directory based on the `.env.example` provided:

    ```plaintext
    PORT=4000
    MONGODB_URI=mongodb://admin:password@localhost:27017/text-analyzer?authSource=admin
    SESSION_SECRET=your-session-secret
    JWT_SECRET=your-jwt-secret
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    CALLBACK_URL=http://localhost:4000/auth/google/callback
    REDIS_URL=redis://localhost:6379
    NODE_ENV=development
    ```

    Replace placeholders with your actual Google OAuth credentials.

4. **Run Docker for Redis and MongoDB**:
    Ensure Docker is running, then use the provided `docker-compose.yml` file in your repository:

    ```bash
    docker-compose up -d
    ```

    **Note**: Ensure a MongoDB database named `text-analyzer` is created.

5. **Start the Backend Server**:
    ```bash
    npm run dev
    ```

### Frontend Setup

1. **Navigate to the Frontend Directory**:
    ```bash
    cd ../client
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Environment Configuration**:

    Create a `.env.local` file in the `client` directory:

    ```plaintext
    NEXT_PUBLIC_API_URL=http://localhost:4000
    NEXT_PUBLIC_GOOGLE_AUTH_URL=http://localhost:4000/auth/google
    ```

4. **Start the Frontend Server**:
    ```bash
    npm run dev
    ```

### Docker Integration

- **Ensure Docker is running**: Both Redis and MongoDB services are set up via Docker for easy management and consistency across environments.

### Google Cloud Console Configuration

1. **Create a Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Click on the project dropdown and select "New Project".
   - Name your project and click "Create".

2. **Enable APIs**:
   - Navigate to "APIs & Services" > "Library".
   - Enable the "Google+ API" and "Google People API".

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials".
   - Click "Create Credentials" and select "OAuth client ID".
   - Configure the consent screen (set application name and authorized domains).
   - Select "Web application" for application type.
   - Set "Authorized JavaScript origins" to `http://localhost:3000`.
   - Set "Authorized redirect URIs" to `http://localhost:4000/auth/google/callback`.
   - Click "Create" and note the Client ID and Client Secret.

### Usage

- **Access the Application**: Once both servers are running, open your browser and navigate to `http://localhost:3000`.
- **Sign in with Google**: Use the Google OAuth feature to log in securely.
- **Create and Analyze Texts**: Start creating and analyzing your text documents.

### Contributing

We welcome contributions! Please submit pull requests for any enhancements or bug fixes you might have.

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-branch-name`.
5. Submit a pull request.

### License

This project is licensed under the MIT License. See the LICENSE file for details.
