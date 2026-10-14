import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ilustracao } from '@/components/ilustracao';
import { sync } from '@/lib/api';
import { salvarTurma, turmaAtual } from '@/lib/classroom';

export function Turma() {
  const [turma, setTurma] = useState(turmaAtual());
  const [nome, setNome] = useState('');
  const [criando, setCriando] = useState(!turma);

  async function criar(e: FormEvent) {
    e.preventDefault();
    try {
      const t = await sync.criarTurma(nome);
      salvarTurma(t);
      setTurma(t);
      setCriando(false);
      toast.success('Turma criada! Compartilhe o código com os alunos.');
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : 'Não foi possível criar a turma.');
    }
  }
  async function copiar(c: string) {
    try { await navigator.clipboard.writeText(c); toast.success('Código copiado!'); } catch { toast.error('Não foi possível copiar.'); }
  }

  return (
    <main className="mx-auto grid w-full max-w-lg grid-cols-1 gap-4 px-6 py-10">
      <h1 className="text-3xl">Turma</h1>
      {turma && !criando && (
        <Card className="items-center text-center">
          <Ilustracao nome="dente-bochechas" size={96} />
          <CardTitle className="text-xl">{turma.nome}</CardTitle>
          <CardDescription>Código para as crianças entrarem no app</CardDescription>
          <p className="font-titulo text-5xl font-extrabold tracking-widest" aria-label={`Código ${turma.codigo.split('').join(' ')}`}>{turma.codigo.slice(0, 3)}-{turma.codigo.slice(3)}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button icone="copiar" onClick={() => void copiar(turma.codigo)}>Copiar código</Button>
            <Button variant="outline" icone="mais" onClick={() => setCriando(true)}>Nova turma</Button>
          </div>
        </Card>
      )}
      {criando && (
        <Card>
          <form onSubmit={criar} className="grid gap-4">
            <div className="grid gap-2"><Label htmlFor="nome" className="text-base font-bold">Nome da turma</Label>
              <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} className="h-12 text-base" placeholder="Ex.: 5º Ano B" /></div>
            <Button type="submit" icone="mais">Criar turma e gerar código</Button>
          </form>
        </Card>
      )}
    </main>
  );
}
