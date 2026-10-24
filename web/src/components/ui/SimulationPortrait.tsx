import clsx from 'clsx';
import type { Simulation } from '@/lib/types';
import { PersonaAvatar } from './PersonaAvatar';

export function SimulationPortrait({ simulation, priority, sizes, className }: {
  simulation: Simulation & { persona_role?: string | null };
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const participants = simulation.participants ?? [];
  if (participants.length < 2) {
    return <PersonaAvatar name={simulation.persona_name} slug={simulation.persona_slug}
      avatarUrl={simulation.avatar_url} roleHint={simulation.persona_role}
      variant="wide" priority={priority} sizes={sizes} className={className} />;
  }
  return (
    <div className={clsx('grid aspect-[3/2] grid-cols-2 gap-0.5 overflow-hidden border-2 border-black bg-black shadow-retro-2 dark:border-retro-ink-dark dark:bg-retro-ink-dark dark:shadow-retro-dark-2', className)}>
      {participants.map(participant => (
        <div key={participant.actor_id} className="relative min-h-0 min-w-0">
          <PersonaAvatar name={participant.name} slug={participant.persona_slug}
            roleHint={participant.role} variant="panel" priority={priority} sizes={sizes} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-2 pb-2 pt-6 text-center text-xs font-semibold text-white sm:text-sm">
            {participant.name}
          </div>
        </div>
      ))}
    </div>
  );
}
