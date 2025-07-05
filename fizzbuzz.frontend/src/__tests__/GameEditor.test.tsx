import { GameEditor } from '@/components/game-editor';
import { gameService } from '@/services/gameService';
import { Game } from '@/types/game';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';

// Mock the game service
jest.mock('@/services/gameService', () => ({
    gameService: {
        createGame: jest.fn(),
        updateGame: jest.fn(),
    },
}));

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('GameEditor', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders create form with empty fields', () => {
        render(<GameEditor onGameSaved={jest.fn()} />);

        expect(screen.getByLabelText(/Game Name/i)).toHaveValue('');
        expect(screen.getByLabelText(/Author/i)).toHaveValue('');
        expect(screen.getByLabelText(/Min Value/i)).toHaveValue(1);
        expect(screen.getByLabelText(/Max Value/i)).toHaveValue(100);
        expect(
            screen.getByText(/Create new FizzBuzz game/i)
        ).toBeInTheDocument();
    });

    it('renders update form with existing game data', async () => {
        const mockGame: Game = {
            id: '1',
            name: 'FizzBuzz',
            author: 'Alice',
            minValue: 1,
            maxValue: 100,
            rules: [{ divisor: 3, word: 'Fizz' }],
            createdAt: new Date().toISOString(),
        };
        const onGameSaved = jest.fn();
        (gameService.createGame as jest.Mock).mockResolvedValue({});

        render(<GameEditor baseGame={mockGame} onGameSaved={onGameSaved} />);

        expect(screen.getByLabelText(/Game Name/i)).toHaveValue('FizzBuzz');
        expect(screen.getByLabelText(/Author/i)).toHaveValue('Alice');

        fireEvent.change(screen.getByLabelText(/Game Name/i), {
            target: { value: 'FizzBuzz2' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Update Game/i }));

        await waitFor(() => {
            expect(gameService.updateGame).toHaveBeenCalledWith('1', {
                name: 'FizzBuzz2',
                author: 'Alice',
                minValue: 1,
                maxValue: 100,
                rules: [{ divisor: 3, word: 'Fizz' }],
            });
        });
        expect(onGameSaved).toHaveBeenCalled();
    });

    it('adds a new rule', () => {
        render(<GameEditor onGameSaved={jest.fn()} />);

        // There should be one rule input by default
        expect(screen.getAllByLabelText(/Divisible by/i).length).toBe(1);
        expect(screen.getAllByLabelText(/Replace with/i)[0]).toHaveValue(
            'Fizz'
        );

        fireEvent.click(screen.getByText(/Add Rule/i));

        expect(screen.getAllByLabelText(/Divisible by/i).length).toBe(2);
        expect(screen.getAllByLabelText(/Divisible by/i)[1]).toHaveValue(1);
    });

    it('shows error if rule logic fails', async () => {
        const mockGame: Game = {
            id: '1',
            name: 'FizzBuzz',
            author: 'Alice',
            minValue: 1,
            maxValue: 100,
            rules: [
                { divisor: 3, word: 'Fizz' },
                { divisor: 5, word: 'Buzz' },
            ],
            createdAt: new Date().toISOString(),
        };

        render(<GameEditor baseGame={mockGame} onGameSaved={jest.fn()} />);

        fireEvent.change(screen.getAllByLabelText(/Replace with/i)[0], {
            target: { value: '' },
        });

        fireEvent.change(screen.getAllByLabelText(/Divisible by/i)[1], {
            target: { value: 3 },
        });

        fireEvent.click(screen.getByRole('button', { name: /Update Game/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                expect.stringMatching(/positive divisor.*non-empty word/i)
            );
        });
    });
});
