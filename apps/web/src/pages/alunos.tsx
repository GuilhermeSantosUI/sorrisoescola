import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Copy, UserPlus, UsersThree } from '@phosphor-icons/react';
import { modulos, formatarData, percentualConcluido, type AlunoApi } from '@sorriso/shared';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ilustracao } from '@/components/ilustracao';
import { ProgressBar } from '@/components/ui';
import { sync } from '@/lib/api';
import { turmaAtual } from '@/lib/classroom';

function Detalhe({ aluno, turmaId, onMudou }: { aluno: AlunoApi; turmaId: string; onMudou: () => void }) {
  const [codigo, setCodigo] = useState<{ codigo: string; expiraEm: string } | null>(null);

  async function alternar(moduloId: string, marcado: boolean) {
    if (!marcado) return; // a API só registra conclusões
    try { await sync.concluirModuloAluno(turmaId, aluno.id, moduloId); toast.success('Tarefa registrada.'); onMudou(); }
    catch { toast.error('Não foi possível registrar.'); }
  }
  async function gerar() {
    try { setCodigo(await sync.gerarCodigoResponsavel(aluno.id)); }
    catch { toast.error('Não foi possível gerar o código.'); }
  }
  return (
    <div className="grid gap-5">
      <section aria-labelledby="tarefas" className="grid gap-2">
        <h3 id="tarefas" className="text-lg">Tarefas concluídas</h3>
        <ul className="grid gap-2">
          {modulos.map((m) => {
            const feito = aluno.modulosConcluidos.includes(m.id);
            return (
              <li key={m.id} className="flex items-center gap-3">
                <Checkbox id={`m-${m.id}`} checked={feito} disabled={feito} onCheckedChange={(v) => void alternar(m.id, v === true)} className="size-6" />
                <Label htmlFor={`m-${m.id}`} className="text-base">{m.titulo}</Label>
              </li>
            );
          })}
        </ul>
      </section>
      <section aria-labelledby="resp" className="grid gap-2 rounded-lg bg-neve p-4">
        <h3 id="resp" className="text-lg">Acompanhamento da família (opcional)</h3>
        <p className="text-base">Gere um código de uso único. A família vê só tarefas concluídas, dias escovando e estrelas. Nada de respostas individuais nem dados de outros alunos.</p>
        {codigo ? (
          <div className="flex flex-wrap items-center gap-3">
            <strong className="font-titulo text-3xl tracking-widest">{codigo.codigo.slice(0, 3)}-{codigo.codigo.slice(3)}</strong>
            <Button variant="outline" size="sm" onClick={() => { void navigator.clipboard.writeText(codigo.codigo); toast.success('Código copiado.'); }}><Copy size={20} weight="bold" aria-hidden="true" /> Copiar</Button>
            <span className="text-sm">Vale até {formatarData(codigo.expiraEm)}</span>
          </div>
        ) : (
          <Button className="w-fit" icone="email" onClick={() => void gerar()}>Gerar código para a família</Button>
        )}
      </section>
    </div>
  );
}

export function Alunos() {
  const turma = turmaAtual();
  const [alunos, setAlunos] = useState<AlunoApi[] | null>(null);
  const [apelido, setApelido] = useState('');
  const [aberto, setAberto] = useState<string | null>(null);

  const carregar = () => { if (turma) sync.alunosDaTurma(turma.id).then(setAlunos).catch(() => toast.error('Não foi possível carregar os alunos.')); };
  useEffect(carregar, [turma?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function adicionar(e: FormEvent) {
    e.preventDefault();
    if (!turma) return;
    try { await sync.adicionarAluno(turma.id, apelido); setApelido(''); toast.success('Aluno adicionado.'); carregar(); }
    catch (err) { toast.error(err instanceof Error ? err.message : 'Não foi possível adicionar.'); }
  }

  if (!turma) return <main className="mx-auto max-w-6xl px-6 py-10"><p>Crie uma turma primeiro. <Link to="/professor/turma" className="font-bold underline">Criar turma</Link></p></main>;
  return (
    <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-6 py-10">
      <div className="flex flex-wrap items-center gap-3"><UsersThree size={36} weight="duotone" aria-hidden="true" /><h1 className="text-3xl">Alunos de {turma.nome}</h1></div>
      <p className="max-w-3xl text-lg">Identificamos cada aluno só por um apelido. Use esta lista para acompanhar as tarefas de cada um e, se a família quiser, gerar um código de acompanhamento.</p>
      <Card>
        <form onSubmit={adicionar} className="flex flex-wrap items-end gap-3">
          <div className="grid min-w-56 flex-1 gap-2"><Label htmlFor="apelido" className="text-base font-bold">Novo aluno (apelido)</Label><Input id="apelido" value={apelido} onChange={(e) => setApelido(e.target.value)} placeholder="Ex.: Duda" required /></div>
          <Button type="submit"><UserPlus size={24} weight="bold" aria-hidden="true" /> Adicionar</Button>
        </form>
        <CardDescription>Não use nome completo, sobrenome nem números de contato.</CardDescription>
      </Card>

      {alunos !== null && alunos.length === 0 && <Card className="items-center text-center"><Ilustracao nome="dente-feliz" size={96} /><p>Nenhum aluno ainda. Adicione o primeiro apelido acima.</p></Card>}
      <ul className="grid gap-3 sm:grid-cols-2">
        {(alunos ?? []).map((a) => (
          <li key={a.id}>
            <Dialog open={aberto === a.id} onOpenChange={(o) => setAberto(o ? a.id : null)}>
              <DialogTrigger asChild>
                <button type="button" className="w-full text-left focus-visible:outline-none">
                  <Card className="transition-shadow hover:shadow-forte focus-visible:ring-4">
                    <div className="flex items-center justify-between gap-2"><CardTitle className="text-xl">{a.apelido}</CardTitle><span className="text-sm font-bold">{a.modulosConcluidos.length} de {modulos.length}</span></div>
                    <ProgressBar valor={percentualConcluido(a.modulosConcluidos.length, modulos.length)} rotulo={`Tarefas de ${a.apelido}`} />
                    <p className="text-sm">{a.diasEscovando} dias escovando · última atividade: {formatarData(a.ultimaAtividadeEm)}</p>
                  </Card>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader><DialogTitle className="text-2xl">{a.apelido}</DialogTitle><DialogDescription>Tarefas e acompanhamento da família.</DialogDescription></DialogHeader>
                <Detalhe aluno={a} turmaId={turma.id} onMudou={carregar} />
              </DialogContent>
            </Dialog>
          </li>
        ))}
      </ul>
    </main>
  );
}
