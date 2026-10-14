import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBar, Check, ClipboardText, DeviceMobile, Desktop, DeviceTablet, HandHeart, ClosedCaptioning, CircleHalf, EyeSlash, FileCsv, HandTap, Infinity as InfinityIcon,
  LockKey, PencilSimpleLine, Prohibit, SealCheck, Tooth, Target, UserCircle, UsersThree, Wind, type Icon,
} from '@phosphor-icons/react';
import { modulos, TEMAS } from '@sorriso/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Ilustracao } from '@/components/ilustracao';
import { Mascot, MascoteRosto } from '@/components/mascot';
import { Decoracao } from '@/components/efeitos';

export const Secao = ({ id, titulo, kicker, children, fundo = false }: { id: string; titulo: string; kicker?: string; children: ReactNode; fundo?: boolean }) => (
  <section id={id} aria-labelledby={`${id}-t`} className={fundo ? 'bg-card/70 py-16' : 'py-16'}>
    <div className="mx-auto max-w-6xl px-6">
      {kicker && <p data-reveal className="text-sm font-extrabold tracking-wide uppercase">{kicker}</p>}
      <h2 id={`${id}-t`} data-reveal className="mt-1 max-w-3xl text-3xl">{titulo}</h2>
      <div className="mt-8">{children}</div>
    </div>
  </section>
);

const Item = ({ icone: Ic, titulo, texto }: { icone: Icon; titulo: string; texto: string }) => (
  <li data-reveal>
    <Card className="h-full">
      <span className="grid size-12 place-items-center rounded-full bg-turquesa"><Ic size={26} weight="bold" aria-hidden="true" /></span>
      <h3 className="text-lg">{titulo}</h3>
      <p>{texto}</p>
    </Card>
  </li>
);

const Lista = ({ itens }: { itens: string[] }) => (
  <ul className="grid gap-3">
    {itens.map((t) => (
      <li key={t} data-reveal className="flex items-start gap-3 text-lg">
        <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-limao"><Check size={16} weight="bold" aria-hidden="true" /></span>{t}
      </li>
    ))}
  </ul>
);

export function Confianca() {
  const itens = ['Computador, tablet ou celular do professor', 'Alunos não precisam de aparelho', 'Nenhum dado pessoal das crianças', 'Conteúdo validado pela Odontologia'];
  return (
    <section aria-label="Destaques" className="border-y-2 border-border bg-limao">
      <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 px-6 py-4 font-bold">
        {itens.map((t) => <li key={t} className="flex items-center gap-2"><Check size={20} weight="bold" aria-hidden="true" /> {t}</li>)}
      </ul>
    </section>
  );
}

export function ParaQuem() {
  const grupos = [
    { rosto: 'feliz' as const, titulo: 'Professores', texto: 'Conduzem a aula pelo próprio aparelho, acompanham as tarefas de cada aluno e exportam o relatório para a devolutiva.' },
    { rosto: 'rindo' as const, titulo: 'Crianças de 10 e 11 anos', texto: 'Aprendem jogando, com o hipopótamo como guia, a partir do que o professor mostra. Só aparecem por um apelido.' },
    { rosto: 'serio' as const, titulo: 'Famílias', texto: 'Acompanham, se quiserem, as tarefas e os dias escovando, com um código do professor e o mínimo de dados.' },
  ];
  return (
    <Secao id="para-quem" kicker="Para quem é" titulo="Uma plataforma, três jeitos de cuidar do sorriso">
      <ul className="grid gap-4 md:grid-cols-3">
        {grupos.map((g) => (
          <li key={g.titulo} data-reveal>
            <Card className="h-full items-center text-center">
              <MascoteRosto nome={g.rosto} size={96} decorativo />
              <h3 className="text-xl">{g.titulo}</h3>
              <p>{g.texto}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Secao>
  );
}

export function ComoFunciona() {
  const etapas = [
    { pose: 'acenando' as const, titulo: 'Vídeo curto', texto: 'O professor apresenta o tema em poucos minutos, com legendas.' },
    { pose: 'escovando' as const, titulo: 'Demonstração', texto: 'Passo a passo da técnica, uma ação por tela, no ritmo da turma.' },
    { pose: 'comemorando' as const, titulo: 'Jogo', texto: 'Atividades que reforçam o que foi visto, sem tempo limite.' },
    { pose: 'pensando' as const, titulo: 'Quiz coletivo', texto: 'A pergunta aparece grande; o professor registra a resposta da turma.' },
    { pose: 'joinha' as const, titulo: 'Uma semana depois', texto: 'Questionário de acompanhamento: o app foi usado? Os cuidados melhoraram?' },
  ];
  return (
    <Secao id="como" kicker="Como funciona" titulo="Da aula ao hábito: cinco etapas simples" fundo>
      <ol className="grid gap-4 md:grid-cols-5">
        {etapas.map((e, i) => (
          <li key={e.titulo} data-reveal>
            <Card className="relative h-full items-center pt-8 text-center">
              <span className="absolute -top-4 left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-full border-2 border-border bg-amarelo-limao font-titulo text-lg font-extrabold">{i + 1}</span>
              <div className="grid h-28 place-items-end"><Mascot pose={e.pose} size={104} decorativo animar={false} /></div>
              <h3 className="text-lg">{e.titulo}</h3>
              <p className="text-base">{e.texto}</p>
            </Card>
          </li>
        ))}
      </ol>
    </Secao>
  );
}

export function Conteudo() {
  return (
    <Secao id="conteudo" kicker="Conteúdo" titulo="Quatro módulos sobre o que realmente importa">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modulos.map((m) => (
          <li key={m.id} data-reveal>
            <Card className="h-full">
              <Ilustracao nome={m.tema === 'dentista' ? 'dente-bochechas' : m.tema === 'alimentacao-carie' ? 'dente-sujo' : m.tema === 'fio-dental' ? 'dente-azul' : 'dente-feliz'} size={72} />
              <Badge variant="outline">{TEMAS[m.tema]}</Badge>
              <h3 className="text-lg">{m.titulo}</h3>
              <p className="text-base">{m.resumo}</p>
            </Card>
          </li>
        ))}
      </ul>
      <p data-reveal className="mt-4 text-sm">Cada módulo combina vídeo, passo a passo, jogo e quiz. Nenhum conteúdo aparece sem a validação da Odontologia.</p>
    </Secao>
  );
}

export function ModoSala() {
  return (
    <Secao id="sala" kicker="Em sala de aula" titulo="Modo sala: o professor conduz, a turma acompanha" fundo>
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <Lista itens={['Funciona no computador, no tablet e no celular do professor', 'Mostre no projetor ou deixe a turma ver a tela', 'Textos e botões grandes, uma ação por tela, sem rolagem', 'Navegação por toque, setas, espaço ou clicador', 'Quiz coletivo: o professor registra a resposta da turma', 'Sem limite de tempo; vídeos e módulos ficam em cache para internet instável']} />
        <div data-reveal className="overflow-hidden rounded-lg border-8 border-petroleo-escuro bg-neve shadow-forte">
          <div className="flex items-center justify-between gap-3 border-b-2 border-border bg-card px-5 py-3">
            <strong className="font-titulo text-lg">{modulos[0]?.titulo}</strong>
            <ol className="flex gap-1.5" aria-label="Etapas">{[0, 1, 2, 3].map((k) => <li key={k} className={`size-3.5 rounded-full border-2 border-border ${k < 3 ? 'bg-turquesa' : 'bg-amarelo-limao'}`} />)}</ol>
          </div>
          <div className="grid items-center gap-4 p-6 sm:grid-cols-[auto_1fr]">
            <div className="hidden sm:block"><Mascot pose="pensando" size={150} decorativo animar={false} /></div>
            <div className="grid gap-3">
              <p className="text-sm font-bold">Pergunta 1 de 4</p>
              <p className="font-titulo text-2xl font-extrabold leading-tight">Pergunta em letras grandes para toda a turma ler</p>
              {['Primeira opção', 'Segunda opção'].map((o, i) => <span key={o} className="flex min-h-12 items-center gap-3 rounded-full border-2 border-border bg-card px-4 py-2 font-bold"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-turquesa">{i + 1}</span>{o}</span>)}
            </div>
          </div>
        </div>
      </div>
    </Secao>
  );
}

export function Professor() {
  return (
    <Secao id="professor" kicker="Para o professor" titulo="Um painel simples para acompanhar a turma">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Item icone={UsersThree} titulo="Turma em um código" texto="Crie a turma e compartilhe um código de 6 caracteres. Os alunos entram sem senha." />
        <Item icone={ChartBar} titulo="Acertos por tema" texto="Veja onde a turma tem mais dúvidas e reforce o ponto certo na próxima aula." />
        <Item icone={FileCsv} titulo="Relatório em CSV" texto="Exporte os resultados para a devolutiva do projeto, sem dados pessoais." />
        <Item icone={ClipboardText} titulo="Feedback de uma semana" texto="Questionário de acompanhamento pronto para projetar ou compartilhar com as famílias." />
        <Item icone={UserCircle} titulo="Alunos por apelido" texto="Lista da turma só com apelidos, para marcar as tarefas de cada aluno sem precisar de aparelho." />
        <Item icone={HandHeart} titulo="Código para a família" texto="Gere um código de uso único para os responsáveis que quiserem acompanhar o filho." />
      </ul>
    </Secao>
  );
}

export function Dispositivos() {
  const itens: { icone: Icon; titulo: string; texto: string }[] = [
    { icone: Desktop, titulo: 'Computador e projetor', texto: 'Abra o modo sala no navegador, sem instalar nada, e projete para a turma.' },
    { icone: DeviceTablet, titulo: 'Tablet do professor', texto: 'Mesma experiência em tela intermediária. Ideal para circular pela sala.' },
    { icone: DeviceMobile, titulo: 'Celular e aplicativo', texto: 'Conduza a aula e acompanhe a turma pelo app. As crianças só precisam olhar para a tela.' },
  ];
  return (
    <Secao id="dispositivos" kicker="Onde usar" titulo="No computador, no tablet ou no celular: você escolhe">
      <ul className="grid gap-4 md:grid-cols-3">{itens.map((i) => <Item key={i.titulo} icone={i.icone} titulo={i.titulo} texto={i.texto} />)}</ul>
      <p data-reveal className="mt-4 text-lg">Muitas crianças ainda não têm celular. Por isso a aula é pensada para o professor mostrar, e o aplicativo existe para ajudar quem guia e quem acompanha.</p>
    </Secao>
  );
}

export function Familias() {
  return (
    <Secao id="familias" kicker="Para as famílias" titulo="Acompanhar é opcional e usa o mínimo de dados" fundo>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <Card data-reveal>
          <h3 className="text-xl">O que a família vê</h3>
          <Lista itens={['Tarefas concluídas', 'Dias escovando e sequência', 'Estrelas conquistadas']} />
        </Card>
        <Card data-reveal>
          <h3 className="text-xl">O que nunca aparece</h3>
          <ul className="grid gap-3">{['Respostas individuais do quiz', 'Outros alunos da turma', 'Nome completo, foto ou localização'].map((t) => <li key={t} className="flex items-center gap-3 text-lg"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-neve"><EyeSlash size={16} weight="bold" aria-hidden="true" /></span>{t}</li>)}</ul>
        </Card>
      </div>
      <div data-reveal className="mt-6 flex flex-wrap items-center gap-3">
        <p className="text-lg">O professor gera um código de uso único. A família entra, concorda e pode encerrar quando quiser.</p>
        <Button asChild icone="entrar"><Link to="/responsaveis">Sou responsável</Link></Button>
      </div>
    </Secao>
  );
}

export function EmCasa() {
  return (
    <Secao id="casa" kicker="Em casa" titulo="O app: para o professor e, se houver aparelho, para as crianças" fundo>
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div data-reveal className="mx-auto w-64 overflow-hidden rounded-[2.2rem] border-4 border-petroleo-escuro bg-neve shadow-forte">
          <div className="mx-auto mt-2 h-1.5 w-14 rounded-full bg-petroleo-escuro" aria-hidden="true" />
          <div className="mt-2 flex items-center gap-2 bg-turquesa p-3"><img src="/brand/logo-icone.svg" alt="" width={36} height={36} /><strong className="font-titulo">Hora de escovar!</strong></div>
          <div className="grid justify-items-center gap-1 p-4 text-center">
            <Mascot pose="escovando" size={150} decorativo animar={false} />
            <span className="font-titulo text-4xl font-extrabold">2:00</span>
            <span className="rounded-full bg-turquesa px-5 py-2 font-bold">Começar</span>
          </div>
        </div>
        <Lista itens={['Área do professor: conduza a aula, acompanhe a turma e as tarefas de cada aluno', 'Área das crianças: timer de 2 minutos, jogos, quiz e conquistas', 'Área das famílias: resumo opcional com código e consentimento', 'Progresso salvo no aparelho e sincronizado quando houver conexão', 'Mesmo visual e mesmos componentes da versão web']} />
      </div>
    </Secao>
  );
}

export function Acessibilidade() {
  return (
    <Secao id="acessibilidade" kicker="Para todas as crianças" titulo="Acessibilidade é requisito, não extra">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Item icone={HandTap} titulo="Toque fácil" texto="Alvos de, no mínimo, 48 px e fonte base grande." />
        <Item icone={Wind} titulo="Respeita “reduzir movimento”" texto="Sem animações piscantes e sem sons automáticos." />
        <Item icone={InfinityIcon} titulo="Sem pressa" texto="Nenhum limite de tempo no quiz." />
        <Item icone={ClosedCaptioning} titulo="Legendas e narração" texto="Vídeos legendados e textos com opção de áudio." />
        <Item icone={CircleHalf} titulo="Contraste AA" texto="Texto sempre legível sobre as cores da marca." />
        <Item icone={Target} titulo="Uma ação por tela" texto="Instruções curtas e botões com ícone e texto." />
      </ul>
    </Secao>
  );
}

export function Privacidade() {
  return (
    <Secao id="privacidade" kicker="Privacidade" titulo="Dados de crianças merecem cuidado (LGPD, art. 14)" fundo>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Item icone={UserCircle} titulo="Só um apelido" texto="A criança é identificada por apelido dentro da turma." />
        <Item icone={EyeSlash} titulo="Nada de dados pessoais" texto="Sem nome completo, foto, nascimento, localização ou contato." />
        <Item icone={Prohibit} titulo="Sem anúncios" texto="Nenhum rastreamento de terceiros." />
        <Item icone={LockKey} titulo="Professor: nome e e-mail" texto="Só o necessário para entrar e acompanhar a turma." />
      </ul>
      <p data-reveal className="mt-4"><Link to="/legal" className="font-bold underline">Ler termo de uso e consentimento</Link></p>
    </Secao>
  );
}

export function Validacao() {
  const passos: { icone: Icon; titulo: string; texto: string }[] = [
    { icone: PencilSimpleLine, titulo: 'A equipe cria o módulo', texto: 'Vídeo, passo a passo, jogo e quiz, com linguagem simples para crianças de 10 e 11 anos.' },
    { icone: Tooth, titulo: 'A Odontologia revisa', texto: 'A integrante do curso de Odontologia confere cada informação de saúde antes de publicar.' },
    { icone: SealCheck, titulo: 'Só então vai ao ar', texto: 'O módulo é publicado com o nome de quem validou e a data. Sem validação, ele não aparece.' },
  ];
  return (
    <Secao id="validacao" kicker="Confiança" titulo="Conteúdo de saúde revisado por quem entende">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <ol className="relative grid gap-5">
          <span aria-hidden="true" className="absolute top-12 bottom-24 left-6 w-0.5 bg-border/30" />
          {passos.map((p, i) => (
            <li key={p.titulo} data-reveal className="relative flex gap-4">
              <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border-2 border-border bg-amarelo-limao"><p.icone size={26} weight="bold" aria-hidden="true" /></span>
              <div><p className="text-sm font-extrabold">Passo {i + 1}</p><h3 className="text-xl">{p.titulo}</h3><p className="mt-1 text-lg">{p.texto}</p></div>
            </li>
          ))}
        </ol>

        <div data-reveal className="relative mx-auto w-full max-w-md">
          <div className="relative overflow-hidden rounded-lg border-2 border-border bg-neve px-6 pt-10 pb-24">
            <Decoracao />
            <Card className="relative">
              <div className="flex items-start gap-3">
                <Ilustracao nome="dente-brilhando" size={64} />
                <div className="min-w-0 flex-1">
                  <Badge variant="secondary" className="max-w-full gap-1 whitespace-normal"><SealCheck size={16} weight="fill" aria-hidden="true" /> Validado pela Odontologia</Badge>
                  <h3 className="mt-1 text-lg">{modulos[0]?.titulo}</h3>
                </div>
              </div>
              <p className="text-base">{modulos[0]?.resumo}</p>
              <p className="rounded-md bg-neve px-3 py-2 text-sm font-bold">Validado por: nome de quem revisou · data da validação</p>
            </Card>
            <div className="absolute right-4 bottom-0 translate-y-2"><Mascot pose="joinha" size={130} decorativo animar={false} /></div>
          </div>
          <span aria-hidden="true" className="absolute -top-5 right-2 grid size-16 -rotate-12 place-items-center rounded-full border-2 border-border bg-limao shadow-suave"><SealCheck size={36} weight="fill" /></span>
        </div>
      </div>
      <p data-reveal className="mt-8"><Link to="/conteudo" className="font-bold underline underline-offset-4">Ver os módulos disponíveis</Link></p>
    </Secao>
  );
}

export function Projeto() {
  return (
    <Secao id="projeto" kicker="Sobre o projeto" titulo="Extensão universitária com a escola" fundo>
      <p data-reveal className="max-w-3xl text-lg">O Sorriso na Escola nasceu em um projeto de extensão da Universidade Tiradentes (UNIT) com a Nossa Escola, em Aracaju/SE. A equipe leva a intervenção até a turma, deixa o professor como multiplicador e volta uma semana depois para entender se o hábito mudou.</p>
    </Secao>
  );
}

export function ChamadaFinal() {
  return (
    <section aria-labelledby="cta-t" className="px-6 pb-4 pt-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-lg border-2 border-border bg-turquesa p-8 text-center shadow-forte">
        <Decoracao />
        <div className="relative grid justify-items-center gap-4">
          <Mascot pose="comemorando" size={170} decorativo />
          <h2 id="cta-t" className="text-3xl">Vamos fazer a turma sorrir?</h2>
          <p className="max-w-xl text-lg">Abra o modo sala agora ou entre como professor para criar a turma.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="outline" icone="sala"><Link to="/sala">Abrir modo sala</Link></Button>
            <Button asChild size="lg" variant="secondary" icone="entrar"><Link to="/entrar">Entrar como professor</Link></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
