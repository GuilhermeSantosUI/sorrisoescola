import { Link } from 'react-router-dom';
import { estaValidado, type Atividade } from '@sorriso/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Ilustracao } from '@/components/ilustracao';
import { Icone, type IconeNome } from '@/components/ui';
import { useModules } from '@/lib/use-modules';

const ROTULO: Record<Atividade['tipo'], [IconeNome, string]> = { video: ['play', 'Vídeo'], tutorial: ['sorriso', 'Passo a passo'], jogo: ['brilho', 'Jogo'], quiz: ['estrela', 'Quiz'] };

export function Conteudo() {
  const modulos = useModules();
  return (
    <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-6 py-10">
      <h1 className="text-3xl">Conteúdo</h1>
      {modulos.length === 0 && (
        <Card className="items-center text-center"><Ilustracao nome="dente-feliz" size={96} /><p>Nenhum módulo validado pela Odontologia ainda.</p></Card>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {modulos.map((m) => (
          <Card key={m.id}>
            <div className="flex items-start gap-4">
              <Ilustracao nome="dente-feliz" size={72} />
              <div className="grid gap-1"><CardTitle className="text-xl">{m.titulo}</CardTitle><CardDescription className="text-base">{m.resumo}</CardDescription></div>
            </div>
            <ul className="flex flex-wrap gap-2">
              {m.atividades.map((a, i) => { const [ic, nome] = ROTULO[a.tipo]; return <li key={i}><Badge variant="outline" className="gap-1"><Icone nome={ic} size={16} /> {nome}</Badge></li>; })}
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-2">
              {estaValidado(m) ? <Badge variant="secondary">Validado: {m.validadoPor}</Badge> : <Badge>Em validação (só dev)</Badge>}
              <Button asChild size="sm" icone="sala"><Link to={`/sala?modulo=${m.id}`}>Abrir na sala</Link></Button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
