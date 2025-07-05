import { Gamepad2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export const BlankSlate = () => {
    return (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 py-6 text-center">
            <CardContent className="space-y-4">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Gamepad2 className="size-8 text-white" />
                </div>
                <h1 className="text-muted-foreground mb-4 text-base">
                    No games available yet.
                </h1>
                <p className="text-muted-foreground text-sm">
                    Create your first FizzBuzz game to get started!
                </p>
            </CardContent>
        </Card>
    );
};
