import { Request, Response } from 'express';
import { getSeasonData } from './seasons';
import { getSeasonWinners } from '../services/ergast.service';

jest.mock('../services/ergast.service');

describe('getSeasonData Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockImplementation((result) => {
                responseObject = result;
                return mockResponse;
            }),
        };
        responseObject = {};
        jest.clearAllMocks();
    });

    it('should return 400 for invalid year format', async () => {
        mockRequest.params = { year: 'not-a-number' };

        await getSeasonData(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(responseObject).toEqual({ error: 'Invalid year format' });
    });

    it('should return season data for valid year', async () => {
        const mockData = {
            year: 2021,
            champion: 'Verstappen',
            races: []
        };
        (getSeasonWinners as jest.Mock<any>).mockResolvedValue(mockData);
        mockRequest.params = { year: '2021' };

        await getSeasonData(mockRequest as Request, mockResponse as Response);

        expect(getSeasonWinners).toHaveBeenCalledWith(2021);
        expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle service errors with 500 status', async () => {
        const errorMessage = 'Database connection failed';
        (getSeasonWinners as jest.Mock<any>).mockRejectedValue(new Error(errorMessage));
        mockRequest.params = { year: '2021' };

        await getSeasonData(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(responseObject).toEqual({
            error: 'Failed to fetch season data',
            details: errorMessage
        });
    });

    it('should handle non-Error thrown values', async () => {
        (getSeasonWinners as jest.Mock<any>).mockRejectedValue('Some string error');
        mockRequest.params = { year: '2021' };

        await getSeasonData(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(responseObject).toEqual({
            error: 'Failed to fetch season data',
            details: 'Some string error'
        });
    });


    it('should log errors to console', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const errorMessage = 'Test error';
        (getSeasonWinners as jest.Mock).mockRejectedValue(new Error(errorMessage));
        mockRequest.params = { year: '2021' };

        await getSeasonData(mockRequest as Request, mockResponse as Response);

        expect(consoleSpy).toHaveBeenCalledWith(
            `Error fetching season data: ${errorMessage}`
        );
        consoleSpy.mockRestore();
    });
});