#Architecture Overview Backend: 
Node.js/Express with PrismaClient 

Database: PostgreSQL


# Running Backend without Docker

cd backend

npm install

npm run dev

http://localhost:3000



#Backend Structure

backend/src/routes/       # API endpoints

backend/src/services/     # Business logic

backend/src/index.ts      # App entry point
prisma/           # Database schema


#Useful Commands
## Run Prisma Studio (database GUI)
npx prisma studio

## Generate Prisma client
npx prisma generate

## Apply migrations
npx prisma migrate dev

##Testing

npm run test

npm run test:watch  # Watch mode

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
