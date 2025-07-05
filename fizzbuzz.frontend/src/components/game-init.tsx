import { Game } from '@/types/game';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn, getGameColour } from '@/lib/utils';
import { Input } from './ui/input';
import { StartSessionRequest } from '@/types/gameSession';
import { useState } from 'react';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface GameInitProps {
    game: Game;
    onGameStart: (session: StartSessionRequest) => void;
    onBack: () => void;
}

export const GameInit: React.FC<GameInitProps> = ({
    game,
    onGameStart,
    onBack,
}) => {
    const [session, setSession] = useState<StartSessionRequest>({
        gameId: game.id,
        player: '',
        duration: 60,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate form data
        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
            return;
        }

        if (!session.player.trim()) {
            toast.error('Player name is required.');
            return;
        }

        if (session.duration < 10 || session.duration > 300) {
            toast.error('Invalid duration.');
            return;
        }

        onGameStart(session);
    };

    return (
        <Card className="mx-auto w-full max-w-2xl">
            <CardHeader className="flex items-start justify-between gap-2">
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft className="size-4" />
                </Button>
                <div className="flex-1 space-y-2">
                    <CardTitle className="sm:text-lg">{game.name}</CardTitle>
                    <CardDescription>by {game.author}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 px-2 sm:px-4">
                <div className="space-y-4">
                    <h3 className="flex items-center justify-between text-base font-semibold sm:text-lg">
                        Game Rules:
                        <p className="text-xs sm:text-sm">
                            Range: {game.minValue} - {game.maxValue}
                        </p>
                    </h3>
                    <div className="space-y-2">
                        <p className="text-sm">Replace numbers divisible by</p>
                        {game.rules.map((rule, index) => (
                            <div
                                key={index}
                                className="flex items-center text-xs sm:text-sm"
                            >
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        'mx-2 w-fit',
                                        `text-${getGameColour(game.id)} border-${getGameColour(game.id)}`
                                    )}
                                >
                                    {rule.divisor}
                                </Badge>
                                with{' '}
                                <span className="mx-2 font-bold">{`"${rule.word}"`}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-muted-foreground space-y-2 text-xs leading-relaxed sm:text-sm">
                        If a number is divisible by multiple rules, combine the
                        replacement words.
                    </p>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Label
                                    htmlFor="player"
                                    className="block text-sm sm:text-base"
                                >
                                    Player Name{' '}
                                    <span className="font-bold text-red-500">
                                        *
                                    </span>
                                </Label>
                                <Input
                                    id="player"
                                    value={session.player}
                                    className="text-sm sm:text-base"
                                    onChange={(e: any) =>
                                        setSession({
                                            ...session,
                                            player: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., Your Name"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label
                                    htmlFor="duration"
                                    className="block text-sm sm:text-base"
                                >
                                    Duration{' '}
                                    <span className="font-bold text-red-500">
                                        *
                                    </span>
                                </Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={session.duration.toString()}
                                    min="10"
                                    max="300"
                                    className="text-sm sm:text-base"
                                    onChange={(e: any) =>
                                        setSession({
                                            ...session,
                                            duration: isNaN(
                                                e.target.valueAsNumber
                                            )
                                                ? 0
                                                : e.target.valueAsNumber,
                                        })
                                    }
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
                        >
                            Start Game
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
};
