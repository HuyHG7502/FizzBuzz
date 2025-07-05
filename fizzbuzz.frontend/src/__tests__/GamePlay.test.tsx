import { Game } from '@/types/game';
import { GameSession } from '@/types/gameSession';
import { GamePlay } from '@/components/game-play';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { sessionService } from '@/services/sessionService';
import { answerService } from '@/services/answerService';

// Mock services
jest.mock('@/services/sessionService', () => ({
    sessionService: {
        endSession: jest.fn(),
        getSessionState: jest.fn(),
    },
}));

jest.mock('@/services/answerService', () => ({
    answerService: {
        submitAnswer: jest.fn(),
    },
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
}));

// Mock data
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

const mockSession: GameSession = {
    sessionId: 'abc',
    gameId: '1',
    game: 'FizzBuzz',
    player: 'Alice',
    duration: 60,
    startedAt: new Date().toISOString(),
    completedAt: undefined,
    isCompleted: false,
    rules: mockGame.rules,
};

describe('GamePlay', () => {
    beforeEach(() => {
        (sessionService.getSessionState as jest.Mock).mockResolvedValue({
            number: 3,
            isCompleted: false,
            isExhausted: false,
            scoreCorrect: 0,
            scoreIncorrect: 0,
            totalNumbers: 100,
            totalAnswers: 0,
            timeRemaining: 60,
        });
        (answerService.submitAnswer as jest.Mock).mockResolvedValue({
            number: 5,
            isCompleted: false,
            isExhausted: false,
            scoreCorrect: 1,
            scoreIncorrect: 0,
            totalNumbers: 100,
            totalAnswers: 1,
            timeRemaining: 59,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the current number and stats', () => {
        render(
            <GamePlay
                game={mockGame}
                session={mockSession}
                onGameEnd={jest.fn()}
                onBack={jest.fn()}
            />
        );

        expect(screen.getByText('...')).toBeInTheDocument();
    });

    it('submits an answer and updates stats', async () => {
        render(
            <GamePlay
                game={mockGame}
                session={mockSession}
                onGameEnd={jest.fn()}
                onBack={jest.fn()}
            />
        );
        await screen.findByText('3');

        // Simulate session state update
        fireEvent.change(screen.getByPlaceholderText(/enter your answer/i), {
            target: { value: 'Fizz' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Submit Answer/i }));

        await waitFor(() => {
            expect(answerService.submitAnswer).toHaveBeenCalled();
            expect(screen.getByText('5')).toBeInTheDocument();
        });
    });

    it('handles game end', async () => {
        const onGameEnd = jest.fn();

        render(
            <GamePlay
                game={mockGame}
                session={{ ...mockSession, isCompleted: true }}
                onGameEnd={onGameEnd}
                onBack={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(onGameEnd).toHaveBeenCalled();
        });
    });
});
