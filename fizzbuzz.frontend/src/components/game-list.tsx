'use client';

import { gameService } from '@/services/gameService';
import { Game } from '@/types/game';
import { useState, useEffect } from 'react';
import { GameCardSkeleton } from './game-card-skeleton';
import { BlankSlate } from './blank-slate';
import { GameCard } from './game-card';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';
import { toast } from 'sonner';

interface GameListProps {
    onGameStart: (game: Game) => void;
    onGameUpdate: (game: Game) => void;
    onGameDelete: (game: Game) => void;
    refreshTrigger?: number;
}

export function GameList({
    onGameStart,
    onGameUpdate,
    onGameDelete,
    refreshTrigger,
}: GameListProps) {
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchGames = async () => {
        setIsLoading(true);
        gameService
            .getAll()
            .then(setGames)
            .catch(error => {
                toast.error(
                    'Failed to fetch games: ' + (error as Error).message
                );
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchGames();
    }, [refreshTrigger]);

    const content = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <GameCardSkeleton key={i} />
                    ))}
                </div>
            );
        }

        if (games.length === 0) {
            return <BlankSlate />;
        }

        return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {games.map(game => (
                    <GameCard
                        key={game.id}
                        game={game}
                        onGameStart={onGameStart}
                        onGameUpdate={onGameUpdate}
                        onGameDelete={onGameDelete}
                    />
                ))}
            </div>
        );
    };

    return (
        <Card className="mx-auto w-full max-w-7xl">
            <CardHeader className="gap-2">
                <CardTitle className="sm:text-lg">Available Games</CardTitle>
                <CardDescription>
                    Browse and join games created by others, or create your own
                    custom game.
                </CardDescription>
            </CardHeader>
            <CardContent>{content()}</CardContent>
        </Card>
    );
}
