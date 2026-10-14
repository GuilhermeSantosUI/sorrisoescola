import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { TEMAS, formatarDuracao, formatarPorcentagem, resultadosParaCsv, type RespostaQuizApi, type Tema } from '@sorriso/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Ilustracao } from '@/components/ilustracao';
import { sync } from '@/lib/api';
import { turmaAtual } from '@/lib/classroom';
import { baixarTexto } from '@/lib/download';

const PAGINA = 15;

export function Resultados() {
  const turma = turmaAtual();
  const [rows, setRows] = useState<RespostaQuizApi[] | null>(null);
  const [tema, setTema] = useState<'todos' | Tema>('todos');
  const [mostrar, setMostrar] = useState(PAGINA);

  useEffect(() => {
    if (!turma) return;
    sync.resultadosDaTurma(turma.id).then(setRows).catch(() => toast.error('Não foi possível carregar os resultados.'));
  }, [turma?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtradas = useMemo(() => (rows ?? []).filter((r) => tema === 'todos' || r.tema === tema), [rows, tema]);

  if (!turma) return <main className="px-6 py-10"><p>Crie uma turma primeiro.</p></main>;
  return (
    <main className="mx-auto grid max-w-6xl gap-4 px-6 py-10">
      <h1 className="text-3xl">Resultados: {turma.nome}</h1>
      <div className="flex flex-wrap items-center gap-3">
        <Select value={tema} onValueChange={(v) => { setTema(v as 'todos' | Tema); setMostrar(PAGINA); }}>
          <SelectTrigger className="h-12 w-64 border-2 text-base" aria-label="Filtrar por tema"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="todos">Todos os temas</SelectItem>{(Object.keys(TEMAS) as Tema[]).map((t) => <SelectItem key={t} value={t}>{TEMAS[t]}</SelectItem>)}</SelectContent>
        </Select>
        <Button icone="baixar" disabled={filtradas.length === 0} onClick={() => { baixarTexto('resultados.csv', resultadosParaCsv(filtradas)); toast.success('CSV exportado.'); }}>Exportar CSV</Button>
        <span className="font-bold">{filtradas.length} resultados</span>
      </div>
      {rows !== null && filtradas.length === 0 ? (
        <Card className="items-center text-center"><Ilustracao nome="dente-triste" size={96} /><p>Nenhum resultado para este filtro.</p></Card>
      ) : (
        <Card className="overflow-x-auto p-2">
          <Table>
            <TableHeader><TableRow><TableHead>Tema</TableHead><TableHead>Acertos</TableHead><TableHead className="w-56">Pontuação</TableHead><TableHead>Duração</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtradas.slice(0, mostrar).map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-bold">{TEMAS[r.tema as Tema] ?? r.tema}</TableCell>
                  <TableCell>{r.acertos}/{r.total}</TableCell>
                  <TableCell><div className="flex items-center gap-2"><Progress value={r.pontuacao} aria-label={`Pontuação ${r.pontuacao}%`} className="h-3 flex-1 border border-border bg-card" /><span className="w-12 text-right font-bold">{formatarPorcentagem(r.pontuacao)}</span></div></TableCell>
                  <TableCell>{formatarDuracao(r.duracaoSegundos)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {filtradas.length > mostrar && <Button variant="outline" icone="mais" className="w-fit" onClick={() => setMostrar((m) => m + PAGINA)}>Mostrar mais</Button>}
    </main>
  );
}
