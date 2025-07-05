import { apiPost } from '@/lib/api';
import { SubmitAnswerRequest } from '@/types/gameAnswer';
import { SessionState } from '@/types/gameSession';

export const answerService = {
    submitAnswer: async (
        sessionId: string,
        answer: SubmitAnswerRequest
    ): Promise<SessionState> =>
        apiPost<SessionState>(`sessions/${sessionId}/answer`, answer),
};
