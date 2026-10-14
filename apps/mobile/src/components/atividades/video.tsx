import { Card, EstadoVazio, Titulo } from '../ui';

/** Vídeo ainda não gravado: aviso amigável (o player real entra quando houver mídia validada). */
export function VideoAviso({ titulo }: { titulo: string }) {
  return <Card><Titulo tamanho="lg">{titulo}</Titulo><EstadoVazio texto="O vídeo ainda não foi gravado. Avance para a próxima etapa." /></Card>;
}
