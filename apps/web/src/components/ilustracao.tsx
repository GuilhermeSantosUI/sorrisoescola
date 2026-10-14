import type { IlustracaoId } from '@sorriso/shared';

/** Ilustrações do kit (assets/illustrations). Decorativas por padrão. */
export function Ilustracao({ nome, size = 96, alt = '', className }: { nome: IlustracaoId; size?: number; alt?: string; className?: string }) {
  return <img src={`/ilustracoes/${nome}.svg`} width={size} height={size} alt={alt} draggable={false} className={className} />;
}
