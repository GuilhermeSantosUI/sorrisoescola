import { unwrap, type ApiClient, type TokenStore } from './client';
import { ClassCode, Nickname } from '../class-code';
import { progressoParaApi, type AlunoApi, type RespostaQuizApi } from './mappers';
import type { ProgressoState } from '../progress';

/** Camada única usada por web e mobile. Nenhum app chama a API diretamente. */
export function createSync(api: ApiClient, tokens: TokenStore) {
  const guardar = async (s: { accessToken: string; refreshToken: string }) =>
    tokens.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });

  return {
    async solicitarCodigoProfessor(email: string): Promise<void> {
      unwrap(await api.POST('/auth/professor/codigo', { body: { email: email.trim() } }));
    },

    async entrarProfessor(email: string, codigo: string): Promise<void> {
      if (!/^\d{6}$/.test(codigo)) throw new Error('O código tem 6 dígitos.');
      await guardar(unwrap(await api.POST('/auth/professor/entrar', { body: { email: email.trim(), codigo } })));
    },

    /** Criança entra com código da turma + apelido. Sem senha, sem dados pessoais. */
    async entrarCrianca(codigo: string, apelido: string): Promise<{ turmaId?: string }> {
      const c = ClassCode.parse(codigo);
      if (!c) throw new Error('Código da turma inválido.');
      const n = Nickname.parse(apelido);
      if (!n) throw new Error('Apelido inválido. Use um apelido curto, sem números de contato.');
      const s = unwrap(await api.POST('/turmas/entrar', { body: { codigo: c.toString(), apelido: n.toString() } }));
      await guardar(s);
      return { turmaId: s.turmaId };
    },

    async sair(): Promise<void> {
      await tokens.set(null);
    },

    async temSessao(): Promise<boolean> {
      return (await tokens.get()) !== null;
    },

    async criarTurma(nome: string) {
      return unwrap(await api.POST('/turmas', { body: { nome: nome.trim(), codigo: ClassCode.generate().toString() } }));
    },

    async resultadosDaTurma(turmaId: string): Promise<RespostaQuizApi[]> {
      return unwrap(await api.GET('/turmas/{turmaId}/resultados', { params: { path: { turmaId } } }));
    },

    async enviarQuiz(r: RespostaQuizApi): Promise<void> {
      unwrap(await api.POST('/quiz/respostas', { body: r }));
    },

    async enviarProgresso(p: ProgressoState): Promise<void> {
      unwrap(await api.PUT('/progresso', { body: progressoParaApi(p) }));
    },

    // ---- Alunos (somente apelido) e tarefas ----
    async alunosDaTurma(turmaId: string): Promise<AlunoApi[]> {
      return unwrap(await api.GET('/turmas/{turmaId}/alunos', { params: { path: { turmaId } } }));
    },

    async adicionarAluno(turmaId: string, apelido: string): Promise<AlunoApi> {
      const n = Nickname.parse(apelido);
      if (!n) throw new Error('Apelido inválido. Use um apelido curto, sem nome completo nem números de contato.');
      return unwrap(await api.POST('/turmas/{turmaId}/alunos', { params: { path: { turmaId } }, body: { apelido: n.toString() } }));
    },

    async concluirModuloAluno(turmaId: string, alunoId: string, moduloId: string): Promise<void> {
      unwrap(await api.POST('/turmas/{turmaId}/alunos/{alunoId}/conclusoes', { params: { path: { turmaId, alunoId } }, body: { moduloId } }));
    },

    // ---- Responsáveis: acompanhamento opcional, com o mínimo de dados ----
    async gerarCodigoResponsavel(alunoId: string) {
      return unwrap(await api.POST('/alunos/{alunoId}/codigo-responsavel', { params: { path: { alunoId } } }));
    },

    async entrarResponsavel(codigo: string, consentimento: boolean): Promise<void> {
      const c = ClassCode.parse(codigo);
      if (!c) throw new Error('Código de acompanhamento inválido.');
      if (!consentimento) throw new Error('É preciso concordar com o acompanhamento para continuar.');
      await guardar(unwrap(await api.POST('/responsaveis/entrar', { body: { codigo: c.toString(), consentimento } })));
    },

    async acompanhamento() {
      return unwrap(await api.GET('/responsaveis/acompanhamento'));
    },

    async revogarVinculo(): Promise<void> {
      unwrap(await api.DELETE('/responsaveis/vinculo'));
      await tokens.set(null);
    },

    async enviarFeedback(turmaId: string, respostas: Record<string, string>): Promise<void> {
      unwrap(await api.POST('/feedback', { body: { turmaId, respostas } }));
    },
  };
}
export type Sync = ReturnType<typeof createSync>;
