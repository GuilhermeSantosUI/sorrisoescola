import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mascot } from '@/components/mascot';
import { sync } from '@/lib/api';
import { salvarTurma, turmaAtual } from '@/lib/classroom';

export function Auth() {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const navegar = useNavigate();

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setCarregando(true);
    try {
      if (!enviado) {
        await sync.solicitarCodigoProfessor(email);
        setEnviado(true);
        toast.success('Enviamos um código de 6 dígitos para o seu e-mail.');
      } else {
        await sync.entrarProfessor(email, codigo);
        if (__USE_MOCKS__ && !turmaAtual()) {
          const m = await import('@sorriso/shared/mocks');
          salvarTurma({ ...m.TURMA_DEMO });
        }
        toast.success('Bem-vindo(a)!');
        navegar('/professor');
      }
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : 'Não foi possível entrar. Tente de novo.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-md gap-4 px-6 py-10">
      <div className="grid place-items-center"><Mascot pose="acenando" size={140} decorativo /></div>
      <Card>
        <CardHeader><CardTitle className="text-2xl">Entrar (professor)</CardTitle><CardDescription>Use seu e-mail; enviaremos um código.</CardDescription></CardHeader>
        <form onSubmit={enviar} className="grid gap-4">
          <div className="grid gap-2"><Label htmlFor="email" className="text-base font-bold">E-mail</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 text-base" disabled={enviado} /></div>
          {enviado && (
            <div className="grid gap-2"><Label htmlFor="codigo" className="text-base font-bold">Código de 6 dígitos</Label>
              <Input id="codigo" inputMode="numeric" pattern="\d{6}" maxLength={6} required autoComplete="one-time-code" value={codigo} onChange={(e) => setCodigo(e.target.value)} className="h-12 text-base tracking-widest" /></div>
          )}
          <Button type="submit" disabled={carregando} icone={enviado ? 'entrar' : 'email'}>{carregando ? 'Aguarde…' : enviado ? 'Entrar' : 'Receber código'}</Button>
        </form>
      </Card>
    </main>
  );
}
