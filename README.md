#Architecture Overview

##Components
Frontend: Angular 19 with Material UI components

Backend: Node.js/Express with Prisma ORM

Database: PostgreSQL with Prisma migrations

CI/CD: GitHub Actions pipeline

##Key Features
1. Season list - Display each season’s World Champion (2005 to present).
2. Race winners - Clicking a season reveals all grand‑prix winners for that year.
3. Highlight champions - In the race list, visually highlight the rows where the winner
   is also that season’s champion.
4. Persist winners - On first request, fetch data from the public Ergast Developer API
   (https://api.jolpi.ca/ergast/), then store or update it in your own database.
   Subsequent requests must be served from your backend.
5. Graceful errors & loading states - Handle slow networks, API errors, and empty
   states.
6. Automated testing pipeline

#Prerequisites
Docker 20.10+

Docker Compose 2.0+

Node.js 18+

npm 9+


bash
# Build and start all services
Getting started with Docker (Recommended)

cd into infrastructure and run the below

docker-compose up --build

# Running Frontend 
cd frontend/f1-frontend

npm install

npm start

http://localhost:4200

# Running Backend without Docker

cd backend

npm install

npm run dev

http://localhost:3000



Development

#Backend Structure

backend/src/routes/       # API endpoints

backend/src/services/     # Business logic

backend/src/index.ts      # App entry point
prisma/           # Database schema

#Frontend Structure
frontend/src/app/components/   # UI components

frontend/src/app/services/     # API clients

frontend/src/app/models/       # Data models


#Useful Commands
## Run Prisma Studio (database GUI)
npx prisma studio

## Generate Prisma client
npx prisma generate

## Apply migrations
npx prisma migrate dev

##Testing
##Backend Tests

cd backend

npm test 

npm run test:watch  # Watch mode

##Frontend Tests
cd frontend/f1-frontend

npm test        # Run all tests

npm run test:coverage  # With coverage

##Linting

cd frontend/f1-frontend

ng lint

#CI/CD Pipeline

The GitHub Actions workflow (ci.yml) performs:

Backend tests with PostgreSQL service

Frontend linting and tests

Production builds for both frontend and backend

Triggered on:

Push to main branch

Pull requests targeting main

#API Documentation

Base URL

http://localhost:3000/api

Endpoints
GET /seasons
List all seasons (2005-2025)

Response:

json
[
{
"year": 2005,
"champion": "Alonso"
}
]
GET /seasons/{year}
Get detailed season data

Parameters:

year: Integer (2005-2025)

Response:

json
{
"year": 2005,
"champion": "Alonso",
"races": [
{
"round": 1,
"name": "Australian GP",
"circuit": {
"name": "Albert Park",
"location": {
"locality": "Melbourne",
"country": "Australia"
}
},
"results": [
{
"driver": {
"firstName": "Fernando",
"lastName": "Alonso"
},
"constructor": {
"name": "Renault"
}
}
]
}
]
}
Database Schema
![Database Schema]