import { gameService } from '@/services/gameService';
import { CreateGameRequest, Game, GameRule } from '@/types/game';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Label } from './ui/label';

interface GameEditorProps {
    onGameSaved: () => void;
    baseGame?: Game | null;
}

export function GameEditor({ baseGame, onGameSaved }: GameEditorProps) {
    const [game, setGame] = useState<CreateGameRequest>({
        name: baseGame?.name || '',
        author: baseGame?.author || '',
        minValue: baseGame?.minValue || 1,
        maxValue: baseGame?.maxValue || 100,
        rules: baseGame?.rules || [{ divisor: 3, word: 'Fizz' }],
    });
    const [isLoading, setIsLoading] = useState(false);

    const addRule = () => {
        setGame((prev: CreateGameRequest) => ({
            ...prev,
            rules: [...prev.rules, { divisor: 1, word: '' }],
        }));
    };

    const removeRule = (index: number) => {
        setGame((prev: CreateGameRequest) => ({
            ...prev,
            rules: prev.rules.filter((_, i) => i !== index),
        }));
    };

    const updateRule = (
        index: number,
        field: keyof GameRule,
        value: string | number
    ) => {
        const updatedRules = [...game.rules];
        updatedRules[index] = { ...updatedRules[index], [field]: value };
        setGame((prev: CreateGameRequest) => ({
            ...prev,
            rules: updatedRules,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate form data
        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
            return;
        }

        if (!game.name.trim() || !game.author.trim()) {
            toast.error('Name and author are required.');
            return;
        }

        if (
            game.rules.some(
                (rule: GameRule) => rule.divisor <= 0 || !rule.word.trim()
            )
        ) {
            toast.error(
                'All rules must have a positive divisor and a non-empty word.'
            );
            return;
        }

        if (game.minValue < 1 || game.maxValue <= game.minValue) {
            toast.error('Invalid min or max value.');
            return;
        }

        setIsLoading(true);

        try {
            if (baseGame) {
                await gameService.updateGame(baseGame.id, game);
                toast.success('Game updated successfully!');

                onGameSaved();
            } else {
                await gameService.createGame(game);
                toast.success('Game created successfully!');

                // Reset the form
                setGame({
                    name: '',
                    author: '',
                    minValue: 1,
                    maxValue: 100,
                    rules: [{ divisor: 3, word: 'Fizz' }],
                });

                onGameSaved();
            }
        } catch (error) {
            toast.error(
                baseGame
                    ? 'Failed to update game:\n' + (error as Error).message
                    : 'Failed to create game:\n' + (error as Error).message
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="mx-auto w-full max-w-2xl">
            <CardHeader className="gap-2">
                <CardTitle className="sm:text-lg">
                    {baseGame
                        ? 'Update ' + baseGame.name
                        : 'Create New FizzBuzz Game'}
                </CardTitle>
                <CardDescription>
                    Design your own FizzBuzz game with custom rules.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Label
                                htmlFor="name"
                                className="block text-sm sm:text-base"
                            >
                                Game Name{' '}
                                <span className="font-bold text-red-500">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="name"
                                value={game.name}
                                className="text-sm sm:text-base"
                                onChange={(e: any) =>
                                    setGame({ ...game, name: e.target.value })
                                }
                                placeholder="e.g., FooBooLoo"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="author"
                                className="block text-sm sm:text-base"
                            >
                                Author{' '}
                                <span className="font-bold text-red-500">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="author"
                                value={game.author}
                                className="text-sm sm:text-base"
                                onChange={(e: any) =>
                                    setGame({ ...game, author: e.target.value })
                                }
                                placeholder="Your Name"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Label
                                htmlFor="minValue"
                                className="block text-sm sm:text-base"
                            >
                                Min Value
                            </Label>
                            <Input
                                id="minValue"
                                type="number"
                                min="1"
                                value={game.minValue.toString()}
                                className="text-sm sm:text-base"
                                onChange={(e: any) =>
                                    setGame({
                                        ...game,
                                        minValue: isNaN(e.target.valueAsNumber)
                                            ? 0
                                            : e.target.valueAsNumber,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="maxValue"
                                className="block text-sm sm:text-base"
                            >
                                Max Value
                            </Label>
                            <Input
                                id="maxValue"
                                type="number"
                                min="1"
                                value={game.maxValue.toString()}
                                className="text-sm sm:text-base"
                                onChange={(e: any) =>
                                    setGame({
                                        ...game,
                                        maxValue: isNaN(e.target.valueAsNumber)
                                            ? 0
                                            : e.target.valueAsNumber,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Game Rules</h4>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addRule}
                                className="border-blue-700 text-blue-700 hover:text-blue-700"
                            >
                                <Plus className="size-4" />
                                Add Rule
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {game.rules.map((rule, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-md border p-2"
                                >
                                    <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor={`divisor-${index}`}
                                                className="block text-sm"
                                            >
                                                Divisible by
                                            </Label>
                                            <Input
                                                id={`divisor-${index}`}
                                                type="number"
                                                min="1"
                                                value={rule.divisor.toString()}
                                                className="text-sm sm:text-base"
                                                onChange={(e: any) =>
                                                    updateRule(
                                                        index,
                                                        'divisor',
                                                        isNaN(
                                                            e.target
                                                                .valueAsNumber
                                                        )
                                                            ? 0
                                                            : e.target
                                                                  .valueAsNumber
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor={`word-${index}`}
                                                className="block text-sm"
                                            >
                                                Replace with
                                            </Label>
                                            <Input
                                                id={`word-${index}`}
                                                value={rule.word}
                                                placeholder="e.g., Foo"
                                                className="text-sm sm:text-base"
                                                onChange={(e: any) =>
                                                    updateRule(
                                                        index,
                                                        'word',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    {game.rules.length > 1 && (
                                        <Button
                                            type="button"
                                            onClick={() => removeRule(index)}
                                            size="sm"
                                            variant="outline"
                                            className="size-9 self-end text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'Saving Game...'
                            : baseGame
                              ? 'Update Game'
                              : 'Create Game'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
