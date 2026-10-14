/**
 * DADOS DE DEMONSTRAÇÃO, só para desenvolvimento/testes manuais.
 * Ativados por VITE_USE_MOCKS / EXPO_PUBLIC_USE_MOCKS = 'true'. Nunca importe fora de um guard dessa flag.
 */
import { modulos } from '../data/modules';
import type { Modulo } from '../types';
import type { components } from '../api/schema';

type RespostaQuiz = components['schemas']['RespostaQuiz'];

export const TURMA_DEMO = { id: '0192f0a0-0000-7000-8000-000000000001', nome: '5º Ano A', codigo: 'DENTE2' } as const;

export const DEMO = {
  emailProfessor: 'professora@exemplo.com',
  codigoProfessor: '123456',
  codigoTurma: 'DENTE2',
  codigoResponsavel: 'PAPA23',
  nomeTurma: '5º Ano A',
} as const;

/** Cópia dos módulos marcada como validada, para testar o fluxo completo. */
export const modulosDemo = (): Modulo[] =>
  modulos.map((m) => ({ ...m, validadoPor: 'Equipe de Odontologia (DEMO)', validadoEm: '2026-10-01' }));

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 23 alunos × módulos, pontuações realistas e determinísticas. */
function resultadosIniciais(): RespostaQuiz[] {
  const r = rng(2026);
  const rows: RespostaQuiz[] = [];
  const nivel: Record<string, number> = { escovacao: 0.85, 'fio-dental': 0.62, 'alimentacao-carie': 0.74, dentista: 0.8 };
  for (let aluno = 0; aluno < 23; aluno++) {
    for (const m of modulos) {
      if (r() < 0.12) continue; // nem todo aluno fez todos
      const quiz = m.atividades.find((a) => a.tipo === 'quiz');
      const total = quiz && quiz.tipo === 'quiz' ? quiz.perguntas.length : 3;
      let acertos = 0;
      for (let i = 0; i < total; i++) if (r() < nivel[m.tema]!) acertos++;
      rows.push({ moduloId: m.id, tema: m.tema, acertos, total, pontuacao: Math.round((acertos / total) * 100), duracaoSegundos: Math.round(70 + r() * 170) });
    }
  }
  return rows;
}

const KEY = 'sorriso.mock';
type Aluno = components['schemas']['Aluno'];
interface Estado {
  turma: { id: string; nome: string; codigo: string };
  resultados: RespostaQuiz[];
  alunos: Aluno[];
  codigos: Record<string, string>; // código de responsável → alunoId
  responsavelAlunoId: string | null;
}

/** Apelidos de demonstração (nenhum nome real). */
const APELIDOS = ['Leo', 'Duda', 'Nina', 'Bento', 'Lia', 'Teo', 'Maju', 'Caio', 'Bia', 'Davi', 'Lara', 'Gui', 'Isa', 'Noah', 'Alice', 'Enzo', 'Cacau', 'Pedro', 'Sol', 'Rafa', 'Tom', 'Mel', 'Joca'];
export const CODIGO_RESPONSAVEL_DEMO = 'PAPA23';

function alunosIniciais(): Aluno[] {
  const r = rng(77);
  return APELIDOS.map((apelido, i) => {
    const feitos = Math.floor(r() * (modulos.length + 1));
    const ultima = new Date(Date.UTC(2026, 9, 6 + Math.floor(r() * 6), 14)).toISOString();
    return { id: `0192f0a0-0000-7000-8000-000000000${100 + i}`, apelido, modulosConcluidos: modulos.slice(0, feitos).map((m) => m.id), diasEscovando: Math.floor(r() * 12), ultimaAtividadeEm: ultima };
  });
}

const novoEstado = (): Estado => ({
  turma: { ...TURMA_DEMO },
  resultados: resultadosIniciais(),
  alunos: alunosIniciais(),
  codigos: { [CODIGO_RESPONSAVEL_DEMO]: '0192f0a0-0000-7000-8000-000000000100' },
  responsavelAlunoId: null,
});

function carregar(): Estado {
  try { const raw = globalThis.localStorage?.getItem(KEY); if (raw) { const e = JSON.parse(raw) as Estado; if (e.alunos) return e; } } catch { /* sem armazenamento */ }
  return novoEstado();
}
function salvar(e: Estado) { try { globalThis.localStorage?.setItem(KEY, JSON.stringify(e)); } catch { /* sem armazenamento */ } }
export function resetarMock() { try { globalThis.localStorage?.removeItem(KEY); } catch { /* sem armazenamento */ } }

const json = (corpo: unknown, status = 200) => new Response(JSON.stringify(corpo), { status, headers: { 'content-type': 'application/json' } });
const vazio = () => new Response(null, { status: 204 });
let n = 0;
const sessao = (papel: 'professor' | 'crianca' | 'responsavel', turmaId?: string) => json({ accessToken: `mock-access-${++n}`, refreshToken: `mock-refresh-${n}`, papel, turmaId });

/** fetch que simula a API (mesmos contratos do openapi.json). */
export function createMockFetch(latenciaMs = 250): typeof fetch {
  const estado = carregar();
  return async (input, init) => {
    const req = new Request(input as RequestInfo, init);
    await new Promise((r) => setTimeout(r, latenciaMs));
    const { pathname } = new URL(req.url);
    const corpo = req.method === 'GET' ? null : ((await req.json().catch(() => null)) as Record<string, string> | null);

    if (pathname === '/auth/professor/codigo') return vazio();
    if (pathname === '/auth/professor/entrar') {
      return corpo?.codigo === DEMO.codigoProfessor ? sessao('professor', estado.turma.id) : json({ message: 'Código inválido (demo: 123456)' }, 401);
    }
    if (pathname === '/auth/renovar') return sessao('professor');
    if (pathname === '/turmas' && req.method === 'POST') {
      estado.turma = { id: `mock-turma-${++n}`, nome: String(corpo?.nome ?? 'Turma'), codigo: String(corpo?.codigo ?? DEMO.codigoTurma) };
      estado.resultados = [];
      salvar(estado);
      return json(estado.turma, 201);
    }
    if (pathname === '/turmas/entrar') {
      return corpo?.codigo === estado.turma.codigo ? sessao('crianca', estado.turma.id) : json({ message: 'Turma não encontrada (demo: DENTE2)' }, 404);
    }
    if (/^\/turmas\/[^/]+\/resultados$/.test(pathname)) return json(estado.resultados);
    if (pathname === '/quiz/respostas') { estado.resultados.push(corpo as unknown as RespostaQuiz); salvar(estado); return vazio(); }
    if (/^\/turmas\/[^/]+\/alunos$/.test(pathname)) {
      if (req.method === 'GET') return json(estado.alunos);
      const novo: Aluno = { id: `mock-aluno-${++n}`, apelido: String(corpo?.apelido ?? 'Aluno'), modulosConcluidos: [], diasEscovando: 0 };
      estado.alunos.push(novo); salvar(estado);
      return json(novo, 201);
    }
    const concl = /^\/turmas\/[^/]+\/alunos\/([^/]+)\/conclusoes$/.exec(pathname);
    if (concl) {
      const a = estado.alunos.find((x) => x.id === concl[1]);
      if (a && corpo?.moduloId && !a.modulosConcluidos.includes(corpo.moduloId)) { a.modulosConcluidos.push(corpo.moduloId); a.ultimaAtividadeEm = new Date().toISOString(); salvar(estado); }
      return vazio();
    }
    const cod = /^\/alunos\/([^/]+)\/codigo-responsavel$/.exec(pathname);
    if (cod) {
      const codigo = Array.from({ length: 6 }, () => 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 31)]).join('');
      estado.codigos[codigo] = cod[1]!; salvar(estado);
      return json({ codigo, expiraEm: new Date(Date.now() + 7 * 864e5).toISOString() }, 201);
    }
    if (pathname === '/responsaveis/entrar') {
      const alunoId = estado.codigos[String(corpo?.codigo)];
      if (!alunoId) return json({ message: 'Código não encontrado ou expirado (demo: PAPA23)' }, 404);
      estado.responsavelAlunoId = alunoId; salvar(estado);
      return sessao('responsavel');
    }
    if (pathname === '/responsaveis/acompanhamento') {
      const a = estado.alunos.find((x) => x.id === estado.responsavelAlunoId);
      if (!a) return json({ message: 'Sem vínculo' }, 404);
      return json({ apelido: a.apelido, modulosConcluidos: a.modulosConcluidos, totalModulos: modulos.length, diasEscovando: a.diasEscovando, sequenciaDias: Math.min(a.diasEscovando, 4), estrelas: a.modulosConcluidos.length * 3, ultimaAtividadeEm: a.ultimaAtividadeEm, consentimentoEm: new Date().toISOString() });
    }
    if (pathname === '/responsaveis/vinculo') { estado.responsavelAlunoId = null; salvar(estado); return vazio(); }
    if (pathname === '/progresso' || pathname === '/feedback') return vazio();
    return json({ message: `Rota não simulada: ${pathname}` }, 404);
  };
}
