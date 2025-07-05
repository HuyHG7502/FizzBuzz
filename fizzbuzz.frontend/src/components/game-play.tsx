import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Game } from '@/types/game';
import { SubmitAnswerRequest } from '@/types/gameAnswer';
import {
    GameSession,
    SessionState,
    StartSessionRequest,
} from '@/types/gameSession';
import { sessionService } from '@/services/sessionService';
import { answerService } from '@/services/answerService';
import { GameInit } from './game-init';
import { RuleItem } from './rule-item';
import { CheckCircle, CircleQuestionMark, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatTime, getGameColour } from '@/lib/utils';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';

interface GamePlayProps {
    game: Game;
    session: GameSession;
    onGameEnd: () => void;
    onBack: () => void;
}

export const GamePlay: React.FC<GamePlayProps> = ({
    game,
    session,
    onGameEnd,
    onBack,
}) => {
    const router = useRouter();

    const [sessionData, setSessionData] = useState<GameSession>(session);
    const [sessionState, setSessionState] = useState<SessionState>();
    const [answer, setAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleStart = async (session: StartSessionRequest) => {
        try {
            const res = await sessionService.startSession(session);
            const stateRes = await sessionService.getSessionState(
                res.sessionId
            );
            setSessionData(res);
            setSessionState(stateRes);

            router.push(`/?sessionId=${res.sessionId}`);
        } catch (error) {
            toast.error('Failed to start game: ' + (error as Error).message);
        }
    };

    const handleEnd = useCallback(async () => {
        if (!sessionData || !sessionData.sessionId) return;

        try {
            await sessionService.endSession(sessionData.sessionId);
            onGameEnd();
        } catch (error) {
            toast.error('Failed to end session: ' + (error as Error).message);
        }
    }, [sessionData, onGameEnd]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session || !sessionState) return;
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const answerReq: SubmitAnswerRequest = {
                sessionId: session.sessionId,
                number: sessionState?.number || 0,
                answer: answer.trim(),
            };

            const resp = await answerService.submitAnswer(
                session.sessionId,
                answerReq
            );
            setSessionState(resp);
            setAnswer('');
        } catch (error) {
            toast.error('Failed to submit answer: ' + (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Timer
    useEffect(() => {
        if (!sessionState || !sessionState) return;
        if (sessionState.timeRemaining <= 0) {
            handleEnd();
            return;
        }

        const timer = setInterval(() => {
            setSessionState(prev => {
                if (!prev) return prev;

                const newTime = prev.timeRemaining - 1;
                if (newTime <= 0) {
                    handleEnd();
                    return { ...prev, timeRemaining: 0, number: undefined };
                }

                return { ...prev, timeRemaining: newTime };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [handleEnd, session, sessionState]);

    // Input focus
    useEffect(() => {
        if (session && inputRef.current) inputRef.current.focus();
    }, [session, sessionState?.number]);

    useEffect(() => {
        if (!session) return;
        if (!session.isCompleted) {
            sessionService
                .getSessionState(session.sessionId)
                .then(setSessionState)
                .catch(error => {
                    toast.error(
                        'Failed to fetch session state: ' +
                            (error as Error).message
                    );
                });
        } else {
            onGameEnd();
        }
    }, [onGameEnd, session]);

    useEffect(() => {
        if (!sessionState) return;
        if (sessionState.isCompleted || sessionState.number === null) {
            onGameEnd();
        }
    }, [onGameEnd, sessionState]);

    if (!session) {
        return (
            <GameInit game={game} onGameStart={handleStart} onBack={onBack} />
        );
    }

    const stats = [
        {
            icon: CheckCircle,
            value: sessionState?.scoreCorrect || 0,
            colour: 'text-green-600',
        },
        {
            icon: XCircle,
            value: sessionState?.scoreIncorrect || 0,
            colour: 'text-red-600',
        },
        {
            icon: CircleQuestionMark,
            value: `${sessionState?.totalAnswers || 0} / ${
                sessionState?.totalNumbers || 0
            }`,
            colour: 'text-blue-600',
        },
    ];

    return (
        <Card className="mx-auto w-full max-w-2xl">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-2">
                    <CardTitle className="sm:text-lg">
                        {sessionData.game}
                    </CardTitle>
                    <CardDescription>
                        Answer as many as you can!
                    </CardDescription>
                </div>
                <div className="flex items-center justify-center gap-3 sm:justify-end">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-2 text-sm ${stat.colour}`}
                        >
                            <stat.icon className="size-4" />
                            <span className="font-medium">{stat.value}</span>
                        </div>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="space-y-4 px-2 sm:px-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>Time Remaining</span>
                        <span className="font-mono text-sm sm:text-base">
                            {formatTime(sessionState?.timeRemaining || 0)}
                        </span>
                    </div>
                    <Progress
                        className="h-2"
                        value={
                            ((sessionState?.timeRemaining || 0) /
                                session.duration) *
                            100
                        }
                    />
                </div>
                <div className="space-y-4 text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl lg:text-8xl">
                        {sessionState?.number !== undefined
                            ? sessionState.number
                            : '...'}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            ref={inputRef}
                            value={answer}
                            onChange={e => setAnswer(e.target.value)}
                            placeholder="Enter your answer..."
                            className="text-center text-sm sm:text-base"
                            disabled={isSubmitting}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
                            disabled={!answer.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                        </Button>
                    </form>
                </div>
                <div className="text-muted-foreground space-y-2 text-center text-xs leading-relaxed">
                    <p>
                        Hint: If the number matches multiple rules, combine the
                        replacement words.
                    </p>
                    <p>If no rules apply, just enter the number itself.</p>
                </div>
                <div className="space-y-4 text-sm">
                    <p className="font-semibold">Rules Cheatsheet:</p>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {sessionData.rules.map((rule, index) => (
                            <RuleItem
                                key={index}
                                rule={rule}
                                colour={getGameColour(sessionData.sessionId)}
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
