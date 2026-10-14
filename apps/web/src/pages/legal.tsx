import { consentimentoResponsaveis, termoDeUso } from '@sorriso/shared';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Legal() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl">Termos e privacidade</h1>
      <Tabs defaultValue="termo" className="mt-4">
        <TabsList>
          <TabsTrigger value="termo">Termo de uso</TabsTrigger>
          <TabsTrigger value="consentimento">Consentimento</TabsTrigger>
        </TabsList>
        <TabsContent value="termo"><Card>{termoDeUso.map((t) => <p key={t}>{t}</p>)}</Card></TabsContent>
        <TabsContent value="consentimento"><Card><ul className="list-disc pl-6">{consentimentoResponsaveis.map((t) => <li key={t}>{t}</li>)}</ul></Card></TabsContent>
      </Tabs>
      <p className="mt-4 text-sm">TODO: textos pendentes de revisão jurídica (LGPD, art. 14).</p>
    </main>
  );
}
