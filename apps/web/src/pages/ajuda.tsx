import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Faq } from '@/components/sections/faq';

const ATALHOS = [['→  ou  Espaço', 'Avançar'], ['←', 'Voltar'], ['1 a 4', 'Registrar a resposta da turma no quiz'], ['Enter', 'Ativar o botão selecionado']] as const;

export function Ajuda() {
  return (
    <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-10">
      <h1 className="text-3xl">Ajuda</h1>
      <Card>
        <CardTitle className="text-xl">Atalhos do modo sala</CardTitle>
        <Table><TableHeader><TableRow><TableHead>Tecla</TableHead><TableHead>Ação</TableHead></TableRow></TableHeader>
          <TableBody>{ATALHOS.map(([t, a]) => <TableRow key={t}><TableCell className="font-bold">{t}</TableCell><TableCell>{a}</TableCell></TableRow>)}</TableBody></Table>
      </Card>
      <Faq embutido />
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" icone="ajuda"><Link to="/legal">Termos e privacidade</Link></Button>
        <Button asChild variant="outline" icone="marca"><Link to="/marca">Livro de marca</Link></Button>
      </div>
    </main>
  );
}
