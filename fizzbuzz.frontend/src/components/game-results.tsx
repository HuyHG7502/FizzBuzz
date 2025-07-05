import { useEffect, useState } from 'react';
import { Game } from '@/types/game';
import { GameSession, SessionResult } from '@/types/gameSession';
import { sessionService } from '@/services/sessionService';
import { cn, formatDate, formatTime } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Crown,
    Flag,
    Home,
    RotateCcw,
    Star,
    Target,
    Trophy,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from './ui/card';

interface GameResultsProps {
    game: Game;
    session: GameSession;
    onGameReplay: (game: Game) => void;
    onBack: () => void;
}

export const GameResults: React.FC<GameResultsProps> = ({
    game,
    session,
    onGameReplay,
    onBack,
}) => {
    const [sessionResults, setSessionResults] = useState<SessionResult>();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const results = await sessionService.getSessionResults(
                    session.sessionId
                );
                setSessionResults(results);
            } catch (error) {
                toast.error(
                    'Failed to fetch session results: ' +
                        (error as Error).message
                );
            }
        };

        fetchResults();
    }, [session]);

    const getPerformanceLevel = () => {
        if (!sessionResults)
            return {
                level: 'Keep Practicing',
                colour: 'bg-orange-500',
                icon: Target,
            };
        if (sessionResults.accuracy >= 90)
            return {
                level: 'Excellent',
                colour: 'bg-green-500',
                icon: Trophy,
            };
        if (sessionResults.accuracy >= 75)
            return {
                level: 'Great',
                colour: 'bg-blue-500',
                icon: Crown,
            };
        if (sessionResults.accuracy >= 50)
            return {
                level: 'Good',
                colour: 'bg-yellow-500',
                icon: Star,
            };
        return {
            level: 'Keep Practicing',
            colour: 'bg-orange-500',
            icon: Target,
        };
    };

    const performance = getPerformanceLevel();
    const PerformanceIcon = performance.icon || Flag;

    const resultCards = [
        {
            label: 'Total',
            value: sessionResults?.totalNumbers || 0,
            colour: 'text-blue-600',
        },
        {
            label: 'Correct',
            value: sessionResults?.scoreCorrect || 0,
            colour: 'text-green-600',
        },
        {
            label: 'Incorrect',
            value: sessionResults?.scoreIncorrect || 0,
            colour: 'text-red-600',
        },
        {
            label: 'Accuracy',
            value: `${sessionResults?.accuracy || 0}%`,
            colour: 'text-orange-600',
        },
    ];

    return (
        <Card className="mx-auto w-full max-w-2xl">
            <CardHeader className="px-4 text-center">
                <div
                    className={cn(
                        'mx-auto mb-2 rounded-full p-3 text-white',
                        performance.colour || 'bg-gray-500'
                    )}
                >
                    <PerformanceIcon className="size-6 sm:size-8" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">
                    Game Completed!
                </CardTitle>
                <CardDescription className="space-y-1 text-sm leading-relaxed sm:text-base">
                    <p>
                        Congratulations <strong>{session.player}</strong> on
                        completing <strong>{session.game}</strong>.
                    </p>
                    <p>
                        The session was completed on{' '}
                        {formatDate(session.completedAt || 'Invalid Date')} in{' '}
                        {formatTime(session.duration)}.
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-2 sm:px-4">
                <div className="text-center">
                    <Badge
                        variant="secondary"
                        className="px-4 py-2 text-sm text-orange-500 sm:text-base"
                    >
                        {performance.level}
                    </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {resultCards.map((card, index) => (
                        <Card key={index}>
                            <CardContent className="flex flex-col items-center justify-center gap-2 text-center">
                                <span
                                    className={cn(
                                        'text-lg font-medium sm:text-xl',
                                        card.colour
                                    )}
                                >
                                    {card.value}
                                </span>
                                <span className="text-muted-foreground text-xs font-medium sm:text-sm">
                                    {card.label}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
                        onClick={() => onGameReplay(game)}
                    >
                        <RotateCcw className="size-4" />
                        Replay
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 border-blue-500 bg-transparent text-blue-500 hover:text-blue-500"
                        onClick={onBack}
                    >
                        <Home className="size-4" />
                        Back to Home
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
