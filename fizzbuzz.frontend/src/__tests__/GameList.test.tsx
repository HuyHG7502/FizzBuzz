import { Game } from '@/types/game';
import { GameCard } from '@/components/game-card';
import { fireEvent, render, screen } from '@testing-library/react';
import { gameService } from '@/services/gameService';
import { GameList } from '@/components/game-list';

// Mock game service
jest.mock('@/services/gameService', () => ({
    gameService: {
        getAll: jest.fn(),
    },
}));

// Mock game data
const mockGames: Game[] = [
    {
        id: '1',
        name: 'FizzBuzz',
        author: 'Alice',
        minValue: 1,
        maxValue: 100,
        rules: [
            {
                divisor: 3,
                word: 'Fizz',
            },
            {
                divisor: 5,
                word: 'Buzz',
            },
        ],
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'FooBooLoo',
        author: 'Bob',
        minValue: 1,
        maxValue: 200,
        rules: [
            {
                divisor: 7,
                word: 'Foo',
            },
            {
                divisor: 11,
                word: 'Boo',
            },
            {
                divisor: 103,
                word: 'Loo',
            },
        ],
        createdAt: new Date().toISOString(),
    },
];

describe('GameList and GameCart', () => {
    beforeEach(() => {
        (gameService.getAll as jest.Mock).mockResolvedValue([...mockGames]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders skeletons while loading', async () => {
        // Simulate loading state
        (gameService.getAll as jest.Mock).mockImplementation(
            () => new Promise(() => {})
        );

        render(
            <GameList
                onGameStart={() => {}}
                onGameUpdate={() => {}}
                onGameDelete={() => {}}
            />
        );

        expect(screen.getAllByTestId('game-card-skeleton')).toHaveLength(6);
    });

    it('renders game cards after loading', async () => {
        render(
            <GameList
                onGameStart={() => {}}
                onGameUpdate={() => {}}
                onGameDelete={() => {}}
            />
        );

        expect(await screen.findByText('FizzBuzz')).toBeInTheDocument();
        expect(screen.getByText('FooBooLoo')).toBeInTheDocument();
    });

    it('calls onGameStart when Play is clicked', async () => {
        const onGameStart = jest.fn();
        render(
            <GameList
                onGameStart={onGameStart}
                onGameUpdate={() => {}}
                onGameDelete={() => {}}
            />
        );

        // Wait for games loading
        expect(await screen.findByText('FizzBuzz')).toBeInTheDocument();

        // Find the Play button for the first game
        const playButtons = screen.getAllByRole('button', { name: /Play/i });
        fireEvent.click(playButtons[0]);

        expect(onGameStart).toHaveBeenCalledWith(mockGames[0]);
    });

    it('renders a single GameCard with correct info', () => {
        render(
            <GameCard
                game={mockGames[0]}
                onGameStart={() => {}}
                onGameUpdate={() => {}}
                onGameDelete={() => {}}
            />
        );

        expect(screen.getByText('FizzBuzz')).toBeInTheDocument();
        expect(screen.getByText(/by Alice/i)).toBeInTheDocument();
        expect(screen.getByText(/100 numbers/i)).toBeInTheDocument();
    });
});
