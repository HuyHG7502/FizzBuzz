'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Game } from '@/types/game';
import { GameSession } from '@/types/gameSession';
import { gameService } from '@/services/gameService';
import { sessionService } from '@/services/sessionService';
import { GameResults } from '@/components/game-results';
import { GameEditor } from '@/components/game-editor';
import { GameList } from '@/components/game-list';
import { GamePlay } from '@/components/game-play';
import { List, Settings, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';

type AppState = string | 'home' | 'game' | 'results';

export default function Home() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');
    const [appState, setAppState] = useState<AppState>('home');
    const [session, setSession] = useState<GameSession | null>(null);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [selectedTab, setSelectedTab] = useState('games');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleGameStart = (game: Game) => {
        const params = new URLSearchParams(window.location.search);
        params.delete('sessionId');
        const query = params.toString();
        router.replace(query ? `/?${query}` : '/');

        setSelectedGame(game);
        setSession(null);
        setAppState('game');
    };

    const handleGameEnd = () => {
        setAppState('results');
    };

    const handleGameUpdate = (game: Game) => {
        setSelectedGame(game);
        setSelectedTab('create');
    };

    const handleGameDelete = async (game: Game) => {
        try {
            await gameService.deleteGame(game.id);
            toast.success('Game deleted successfully.');
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            toast.error('Game deletion failed: ' + (error as Error).message);
        }
    };

    const handleGameSaved = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleToHome = useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        params.delete('sessionId');
        const query = params.toString();
        router.push(query ? `/?${query}` : '/');

        setSession(null);
        setSelectedGame(null);
        setAppState('home');
    }, [router]);

    useEffect(() => {
        if (sessionId) {
            // Load session from backend if provided
            const fetchSession = async () => {
                try {
                    const session = await sessionService.getSession(sessionId);
                    const game = await gameService.getGame(session.gameId);
                    setSession(session);
                    setSelectedGame(game);

                    if (session.isCompleted) setAppState('results');
                    else setAppState('game');
                } catch (error) {
                    toast.error(
                        'Failed to load session: ' + (error as Error).message
                    );
                    handleToHome();
                }
            };

            fetchSession();
        }
    }, [sessionId, handleToHome]);

    if (appState === 'game') {
        return (
            <div className="bg-background min-h-screen">
                <div className="px-4 py-8">
                    <GamePlay
                        game={selectedGame!}
                        session={session!}
                        onGameEnd={handleGameEnd}
                        onBack={handleToHome}
                    />
                </div>
            </div>
        );
    }

    if (appState === 'results') {
        return (
            <div className="bg-background min-h-screen">
                <div className="px-4 py-8">
                    <GameResults
                        game={selectedGame!}
                        session={session!}
                        onGameReplay={handleGameStart}
                        onBack={handleToHome}
                    />
                </div>
            </div>
        );
    }

    const tabs = [
        {
            value: 'games',
            label: 'Play Games',
            icon: <List className="size-4" />,
            content: (
                <GameList
                    onGameStart={handleGameStart}
                    onGameUpdate={handleGameUpdate}
                    onGameDelete={handleGameDelete}
                    refreshTrigger={refreshTrigger}
                />
            ),
        },
        {
            value: 'create',
            label: selectedGame ? 'Update Game' : 'Create Game',
            icon: selectedGame ? (
                <Settings className="size-4" />
            ) : (
                <Plus className="size-4" />
            ),
            content: (
                <GameEditor
                    baseGame={selectedGame}
                    onGameSaved={handleGameSaved}
                />
            ),
        },
    ];

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
                        FizzBuzz Arena
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl">
                        Create and play custom FizzBuzz-inspired games.
                        <br />
                        Challenge yourself and others with unique rules and
                        compete for the highest score!
                    </p>
                </div>
                <Tabs
                    defaultValue="games"
                    value={selectedTab}
                    onValueChange={value => {
                        setSelectedTab(value);
                        setSelectedGame(null);
                    }}
                    className="w-full"
                >
                    <TabsList className="mx-auto mb-8 grid h-auto w-full max-w-sm grid-cols-2 rounded-sm p-1 sm:max-w-md">
                        {tabs.map(tab => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex cursor-pointer items-center gap-2 rounded-sm p-2"
                            >
                                {tab.icon}
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {tabs.map(tab => (
                        <TabsContent
                            key={tab.value}
                            value={tab.value}
                            className="space-y-6"
                        >
                            {tab.content}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}
