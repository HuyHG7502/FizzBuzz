export interface GameAnswer {
    isCorrect: boolean;
    correctAnswer: string;
    playerAnswer: string;
    scoreCorrect: number;
    scoreIncorrect: number;
    isCompleted: boolean;
}

export interface SubmitAnswerRequest {
    sessionId: string;
    number: number;
    answer: string;
}
