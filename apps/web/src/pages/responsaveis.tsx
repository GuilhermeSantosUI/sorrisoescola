import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Check, EyeSlash, ShieldCheck } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MascoteRosto } from '@/components/mascot';
import { sync } from '@/lib/api';

export const VE = ['Tarefas concluídas', 'Dias escovando e sequência', 'Estrelas conquistadas', 'Data da última atividade'];
export const NAO_VE = ['Respostas individuais do quiz', 'Outros alunos da turma', 'Nome completo, foto ou localização'];

export function Responsaveis() {
  const [codigo, setCodigo] = useState('');
  const [aceito, setAceito] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const navegar = useNavigate();

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setCarregando(true);
    try { await sync.entrarResponsavel(codigo, aceito); navegar('/responsaveis/acompanhamento'); }
    catch (err) { toast.error(err instanceof Error ? err.message : 'Não foi possível entrar.'); }
    finally { setCarregando(false); }
  }
  return (
    <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-10">
      <header className="flex flex-wrap items-center gap-4"><MascoteRosto nome="feliz" size={88} decorativo /><div className="min-w-0 flex-1 basis-64"><h1 className="text-2xl sm:text-3xl">Acompanhamento para famílias</h1><p className="mt-1 max-w-2xl text-lg">Opcional e com o mínimo de dados. O professor gera um código para você ver como seu filho ou sua filha está avançando.</p></div></header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck size={26} weight="duotone" aria-hidden="true" /> O que você vê</CardTitle>
          <ul className="grid gap-2">{VE.map((t) => <li key={t} className="flex items-center gap-2"><Check size={20} weight="bold" aria-hidden="true" />{t}</li>)}</ul>
          <CardTitle className="mt-2 flex items-center gap-2 text-xl"><EyeSlash size={26} weight="duotone" aria-hidden="true" /> O que não aparece</CardTitle>
          <ul className="grid gap-2">{NAO_VE.map((t) => <li key={t} className="flex items-center gap-2"><EyeSlash size={20} weight="bold" aria-hidden="true" />{t}</li>)}</ul>
          <CardDescription>Não pedimos seu e-mail nem seus dados. O vínculo pode ser encerrado a qualquer momento.</CardDescription>
        </Card>
        <Card>
          <form onSubmit={entrar} className="grid gap-4">
            <CardTitle className="text-xl">Entrar com o código</CardTitle>
            <div className="grid gap-2"><Label htmlFor="codigo" className="text-base font-bold">Código de acompanhamento</Label><Input id="codigo" required maxLength={7} autoCapitalize="characters" value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} placeholder="ABC-234" className="text-xl tracking-widest" /></div>
            <div className="flex items-start gap-3"><Checkbox id="consent" checked={aceito} onCheckedChange={(v) => setAceito(v === true)} className="mt-1 size-6" /><Label htmlFor="consent" className="block text-base font-normal"><span>Concordo em acompanhar apenas o resumo acima e entendo que posso encerrar quando quiser. </span><Link to="/legal" className="font-bold underline">Ler termos</Link></Label></div>
            <Button type="submit" disabled={carregando || !aceito} icone="entrar">{carregando ? 'Aguarde…' : 'Acompanhar'}</Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
