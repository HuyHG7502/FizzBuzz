import { Game } from '@/types/game';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from './ui/card';
import { cn, getGameColour, getGameIcon, formatDate } from '@/lib/utils';
import { Edit, Play, Trash2, User } from 'lucide-react';
import { Badge } from './ui/badge';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTrigger,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogAction,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { RuleItem } from './rule-item';

interface GameCardProps {
    game: Game;
    onGameStart: (game: Game) => void;
    onGameUpdate: (game: Game) => void;
    onGameDelete: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
    game,
    onGameStart,
    onGameUpdate,
    onGameDelete,
}) => {
    const gameColour = getGameColour(game.id);
    const GameIcon = getGameIcon(game.id);

    const deleteBtn = (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="size-8 bg-white p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                    <Trash2 className="size-3 lg:size-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-sm">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base">
                        Delete Game
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                    <AlertDialogDescription className="text-sm leading-relaxed">
                        Are you sure you want to delete {game.name}?
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-4">
                    <AlertDialogCancel className="cursor-pointer text-sm font-medium sm:text-base">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onGameDelete(game)}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    return (
        <Card className="gap-1 overflow-hidden rounded-md p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className={cn('h-2 bg-gradient-to-r', gameColour)}></div>
            <CardHeader className="space-y-2 p-3">
                <CardTitle className="flex items-center gap-2 truncate">
                    <div
                        className={cn(
                            'flex-shrink-0 rounded-lg bg-gradient-to-br p-1 text-white sm:p-2',
                            gameColour
                        )}
                    >
                        <GameIcon className="size-3 sm:size-4" />
                    </div>
                    <span className="truncate sm:text-lg">{game.name}</span>
                </CardTitle>
                <CardDescription className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 truncate">
                        <User className="size-3 sm:size-4" />
                        <span>by {game.author}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        {game.rules.length} rules
                    </Badge>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-3 px-3 pb-4 sm:gap-4">
                <div className="flex-1 space-y-3">
                    <div className="flex justify-between text-xs sm:text-sm">
                        <span className="font-medium">
                            Range: {game.minValue} - {game.maxValue}
                        </span>
                        <span>{game.maxValue - game.minValue + 1} numbers</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {game.rules.map((rule, index) => (
                            <RuleItem
                                key={index}
                                rule={rule}
                                colour={gameColour}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-between gap-2 border-t pt-3">
                    <span className="text-xs">
                        {formatDate(game.createdAt)}
                    </span>
                    <div className="flex items-center justify-end gap-2">
                        {deleteBtn}
                        <Button
                            size="sm"
                            variant="outline"
                            className="size-8 bg-white p-0 hover:bg-gray-50"
                            onClick={() => onGameUpdate(game)}
                        >
                            <Edit className="size-3 lg:size-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className={cn(
                                'bg-gradient-to-r hover:text-white hover:opacity-90',
                                'border-0 px-2 text-xs text-white lg:text-sm',
                                gameColour
                            )}
                            onClick={() => onGameStart(game)}
                        >
                            <Play className="size-3 lg:size-4" /> Play
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
