import { GameRule } from './game';

export interface GameSession {
    sessionId: string;
    gameId: string;
    game: string;
    player: string;
    duration: number;
    rules: GameRule[];
    startedAt: string;
    completedAt?: string;
    isCompleted: boolean;
}

export interface SessionState {
    number?: number;
    isExhausted: boolean;
    isCompleted: boolean;
    scoreCorrect: number;
    scoreIncorrect: number;
    totalNumbers: number;
    totalAnswers: number;
    timeRemaining: number;
}

export interface SessionResult {
    game: string;
    player: string;
    duration: number;
    scoreCorrect: number;
    scoreIncorrect: number;
    totalNumbers: number;
    accuracy: number;
    startedAt: string;
    completedAt: string;
}

export interface StartSessionRequest {
    gameId: string;
    player: string;
    duration: number;
}
