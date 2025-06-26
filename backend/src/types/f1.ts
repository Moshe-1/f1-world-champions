export interface ErgastRace {
    round: string;
    raceName: string;
    date: string;
    Circuit: {
        circuitId: string;
        circuitName: string;
        Location: {
            lat: string;
            long: string;
            locality: string;
            country: string;
        };
    };
    Results: {
        position: string;
        points: string;
        Driver: {
            driverId: string;
            givenName: string;
            familyName: string;
            dateOfBirth: string;
            nationality: string;
            permanentNumber?: string;
            code?: string;
        };
        Constructor: {
            constructorId: string;
            name: string;
            nationality: string;
        };
    }[];
}