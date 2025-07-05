import { cn } from '@/lib/utils';
import { GameRule } from '@/types/game';

interface RuleItemProps {
    rule: GameRule;
    colour?: string;
}

export const RuleItem: React.FC<RuleItemProps> = ({ rule, colour }) => {
    return (
        <div className="flex items-center gap-2">
            <div
                className={cn(
                    'size-6 md:size-8',
                    'flex flex-shrink-0 items-center justify-center',
                    'rounded-full bg-gradient-to-br',
                    'text-xs font-bold text-white md:text-sm',
                    colour
                )}
            >
                {rule.divisor}
            </div>
            <span className="text-xs sm:text-sm">→</span>
            <span className="bg-muted rounded-sm px-2 py-1.5 font-mono text-xs font-medium sm:text-sm">
                {rule.word}
            </span>
        </div>
    );
};
