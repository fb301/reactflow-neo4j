# ReactFlow Neo4j Integration

The purpose of this project is to transfer data between [ReactFlow](https://reactflow.dev/) and [Neo4j](https://neo4j.com/) using [FastAPI](https://fastapi.tiangolo.com/) with [Strawberry-GraphQL](https://strawberry.rocks/) as an API.

This is solely made for experiment and development purposes as an starting point to be further built upon.

## Project Structure

```
ReactFlow-Neo4j/
├── Client/              # Frontend React application
│   ├── src/            # React source code with modular components
│   ├── public/         # Static assets
│   ├── package.json    # Frontend dependencies
│   └── ...config files # Vite, TypeScript, ESLint configurations
├── Server/              # Backend API server
│   ├── gql/            # GraphQL schemas and resolvers
│   ├── main.py         # Main FastAPI application
│   └── pyproject.toml  # Backend dependencies
└── README.md           # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.13 or higher)
- Neo4j Database (This was done with Neo4j Deskstop 2 running an 2025.08 instance, check if it compatible with your version)

### Frontend Setup (Client)

```bash
cd Client
npm install
npm run dev
```

### Backend Setup (Server)

```bash
cd Server
# Install dependencies
uv sync
# Run the server
uv run fastapi dev main.py
```

### Environment Configuration

Create a `.env` file in the root directory with your Neo4j connection details:

```
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
NEO4J_VERSION=your_version
NEO4J_DATABASE=name_of_your_database
```

## Features

- **Modular React Components**: Clean component architecture with single responsibility principle
- **Bidirectional ReactFlow**: Nodes with handles supporting connections in any direction
- **GraphQL API**: Modular backend with separated schemas, resolvers, and setup
- **Neo4j Integration**: Efficient batch operations using APOC procedures
- **TypeScript**: Full type safety throughout the frontend application
