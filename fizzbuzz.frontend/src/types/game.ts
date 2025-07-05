export interface GameRule {
    divisor: number;
    word: string;
}

export interface Game {
    id: string;
    name: string;
    author: string;
    minValue: number;
    maxValue: number;
    createdAt: string;
    rules: GameRule[];
}

export interface CreateGameRequest {
    name: string;
    author: string;
    minValue: number;
    maxValue: number;
    rules: GameRule[];
}
