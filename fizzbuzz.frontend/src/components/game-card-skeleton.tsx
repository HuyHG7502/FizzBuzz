import { Card, CardContent, CardHeader } from './ui/card';

export const GameCardSkeleton = () => {
    return (
        <Card data-testid="game-card-skeleton" className="animate-pulse">
            <CardHeader>
                <div className="h-6 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="h-4 rounded bg-gray-200"></div>
                    <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                </div>
            </CardContent>
        </Card>
    );
};
