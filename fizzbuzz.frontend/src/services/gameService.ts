import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { sortRules } from '@/lib/utils';
import { CreateGameRequest, Game } from '@/types/game';

export const gameService = {
    getAll: async (): Promise<Game[]> => {
        const games = await apiGet<Game[]>('games');
        return games.map(sortRules);
    },

    getGame: async (gameId: string): Promise<Game> => {
        const game = await apiGet<Game>(`games/${gameId}`);
        return sortRules(game);
    },

    createGame: async (game: CreateGameRequest): Promise<Game> =>
        await apiPost<Game>('games/', game),

    updateGame: async (
        gameId: string,
        game: CreateGameRequest
    ): Promise<Game> => await apiPut<Game>(`games/${gameId}`, game),

    deleteGame: async (gameId: string): Promise<string> =>
        await apiDelete<string>(`games/${gameId}`),
};
