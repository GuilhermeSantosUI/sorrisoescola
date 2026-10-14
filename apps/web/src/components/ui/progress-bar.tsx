import { Progress } from './progress';

export function ProgressBar({ valor, rotulo, testId }: { valor: number; rotulo: string; testId?: string }) {
  return <Progress data-testid={testId} value={Math.max(0, Math.min(100, valor))} aria-label={rotulo} className="h-4 border-2 border-border bg-card" />;
}
