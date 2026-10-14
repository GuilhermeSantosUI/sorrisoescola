import { useLocalSearchParams, useRouter } from 'expo-router';
import { resultadoParaApi } from '@sorriso/shared';
import { EstadoVazio, Tela } from '../components/ui';
import { Quiz } from '../components/atividades/quiz';
import { sync } from '../lib/api';
import { useModules } from '../lib/use-modules';
import { concluirModulo } from '@sorriso/shared';
import { lerProgresso, salvarESincronizar } from '../store/progress';

export default function QuizAluno() {
  const { modulo, i } = useLocalSearchParams<{ modulo: string; i: string }>();
  const router = useRouter();
  const m = useModules().find((x) => x.id === modulo);
  const a = m?.atividades[Number(i)];
  if (!m || a?.tipo !== 'quiz') return <Tela voltar><EstadoVazio texto="Quiz não encontrado." /></Tela>;
  return (
    <Tela voltar>
      <Quiz modo="aluno" perguntas={a.perguntas} onFim={async (r, s) => {
        void sync.enviarQuiz(resultadoParaApi(m.id, m.tema, r, s)).catch(() => undefined); // TODO: fila offline
        await salvarESincronizar(concluirModulo(await lerProgresso(), m.id));
        router.back();
      }} />
    </Tela>
  );
}
