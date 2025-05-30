"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSeasonsCache = initializeSeasonsCache;
exports.getAllSeasons = getAllSeasons;
exports.getSeasonWinners = getSeasonWinners;
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
const ERGAST_API = 'https://api.jolpi.ca/ergast/api/f1';
// Initialize seasons cache on startup
async function initializeSeasonsCache() {
    try {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: currentYear - 2005 + 1 }, (_, i) => 2005 + i);
        console.log('Initializing seasons cache...');
        for (const year of years) {
            // Check if season exists in DB
            const existingSeason = await prisma.season.findUnique({
                where: { year }
            });
            if (!existingSeason) {
                console.log(`Fetching season ${year} from Ergast API...`);
                await getSeasonWinners(year);
            }
        }
        console.log('Seasons cache initialized successfully');
    }
    catch (error) {
        console.error('Error initializing seasons cache:', error);
    }
}
async function getAllSeasons() {
    const seasons = await prisma.season.findMany({
        select: { year: true, champion: true },
        orderBy: { year: 'desc' }
    });
    // Fill in any missing years with 'Unknown'
    const currentYear = new Date().getFullYear();
    const allYears = Array.from({ length: currentYear - 2005 + 1 }, (_, i) => 2005 + i);
    const seasonMap = new Map(seasons.map(s => [s.year, s]));
    return allYears.map(year => ({
        year,
        champion: seasonMap.get(year)?.champion || 'Unknown'
    }));
}
async function getSeasonWinners(year) {
    // Validate year
    if (year < 2005 || year > new Date().getFullYear()) {
        throw new Error(`Year must be between 2005 and ${new Date().getFullYear()}`);
    }
    // Check cache
    const cached = await prisma.season.findUnique({
        where: { year },
        include: {
            races: {
                include: {
                    circuit: { include: { location: true } },
                    results: {
                        include: { driver: true, constructor: true }
                    }
                }
            }
        }
    });
    if (cached)
        return cached;
    // Fetch from Ergast API
    const { data } = await axios_1.default.get(`${ERGAST_API}/${year}/results/1.json?limit=1000`);
    const races = data.MRData.RaceTable.Races;
    if (!races.length)
        throw new Error('No races found');
    const champion = races[races.length - 1].Results[0].Driver.familyName;
    return await prisma.$transaction(async (tx) => {
        const season = await tx.season.upsert({
            where: { year },
            update: { champion },
            create: { year, champion }
        });
        for (const race of races) {
            const [result] = race.Results;
            // Process location
            const location = await tx.location.upsert({
                where: {
                    locality_country: {
                        locality: race.Circuit.Location.locality,
                        country: race.Circuit.Location.country
                    }
                },
                update: {},
                create: {
                    lat: parseFloat(race.Circuit.Location.lat),
                    long: parseFloat(race.Circuit.Location.long),
                    locality: race.Circuit.Location.locality,
                    country: race.Circuit.Location.country
                }
            });
            // Process circuit
            const circuit = await tx.circuit.upsert({
                where: { circuitId: race.Circuit.circuitId },
                update: {},
                create: {
                    circuitId: race.Circuit.circuitId,
                    name: race.Circuit.circuitName,
                    locationId: location.id
                }
            });
            // Process driver
            const driver = await tx.driver.upsert({
                where: { driverId: result.Driver.driverId },
                update: {},
                create: {
                    driverId: result.Driver.driverId,
                    firstName: result.Driver.givenName,
                    lastName: result.Driver.familyName,
                    dateOfBirth: new Date(result.Driver.dateOfBirth),
                    nationality: result.Driver.nationality,
                    number: result.Driver.permanentNumber ? parseInt(result.Driver.permanentNumber) : null,
                    code: result.Driver.code || null
                }
            });
            // Process constructor
            const constructor = await tx.constructor.upsert({
                where: { constructorId: result.Constructor.constructorId },
                update: {},
                create: {
                    constructorId: result.Constructor.constructorId,
                    name: result.Constructor.name,
                    nationality: result.Constructor.nationality
                }
            });
            // Create race
            const dbRace = await tx.race.create({
                data: {
                    round: parseInt(race.round),
                    name: race.raceName,
                    date: new Date(race.date),
                    seasonId: season.id,
                    circuitId: circuit.id
                }
            });
            // Create result
            await tx.result.create({
                data: {
                    raceId: dbRace.id,
                    driverId: driver.id,
                    constructorId: constructor.id,
                    position: parseInt(result.position),
                    points: parseFloat(result.points)
                }
            });
        }
        return tx.season.findUnique({
            where: { id: season.id },
            include: {
                races: {
                    include: {
                        circuit: { include: { location: true } },
                        results: {
                            include: { driver: true, constructor: true }
                        }
                    }
                }
            }
        });
    });
}
