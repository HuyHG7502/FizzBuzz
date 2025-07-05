import { apiGet, apiPost } from '@/lib/api';
import { sortRules } from '@/lib/utils';
import {
    GameSession,
    SessionResult,
    SessionState,
    StartSessionRequest,
} from '@/types/gameSession';

export const sessionService = {
    getSession: async (sessionId: string): Promise<GameSession> => {
        const session = await apiGet<GameSession>(`sessions/${sessionId}`);
        return sortRules(session);
    },

    getSessionState: async (sessionId: string): Promise<SessionState> =>
        apiGet<SessionState>(`sessions/${sessionId}/question`),

    getSessionResults: async (sessionId: string): Promise<SessionResult> => {
        const results = await apiGet<SessionResult>(
            `sessions/${sessionId}/results`
        );
        results.accuracy *= 100;
        return results;
    },

    startSession: async (
        session: StartSessionRequest
    ): Promise<GameSession> => {
        const sessionRes = await apiPost<GameSession>(
            'sessions/start',
            session
        );
        return sortRules(sessionRes);
    },

    endSession: async (sessionId: string): Promise<SessionResult> => {
        const results = await apiPost<SessionResult>(
            `sessions/${sessionId}/end`
        );
        results.accuracy *= 100;
        return results;
    },
};
