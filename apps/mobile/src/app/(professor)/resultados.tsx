import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TEMAS, formatarDuracao, formatarPorcentagem, mediaGeral, resumoPorTema, type RespostaQuizApi, type Tema } from '@sorriso/shared';
import { theme } from '../../constants/theme';
import { Card, EstadoVazio, Progresso, Tela, Texto, Titulo } from '../../components/ui';
import { sync } from '../../lib/api';
import { useSessao } from '../../store/sessao';

export default function Resultados() {
  const { turma } = useSessao();
  const [rows, setRows] = useState<RespostaQuizApi[] | null>(null);
  useEffect(() => { if (turma) sync.resultadosDaTurma(turma.id).then(setRows).catch(() => setRows([])); }, [turma?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!turma) return <Tela titulo="Resultados"><EstadoVazio texto="Crie uma turma no Painel primeiro." /></Tela>;
  const temas = rows ? resumoPorTema(rows) : [];
  return (
    <Tela titulo="Resultados">
      <Texto>{rows?.length ?? 0} quizzes · média {rows ? mediaGeral(rows) : 0}%. Para exportar em CSV, use a versão web.</Texto>
      {rows !== null && rows.length === 0 ? <EstadoVazio ilustracao="dente-triste" texto="Nenhum resultado ainda." /> : (
        <>
          <Card><Titulo tamanho="lg">Por tema</Titulo>{temas.map((t) => <View key={t.tema} style={{ gap: theme.espaco(1) }}><Texto negrito>{t.nome}: {formatarPorcentagem(t.percentual)} em {t.tentativas} tentativas</Texto><Progresso valor={t.percentual} rotulo={t.nome} /></View>)}</Card>
          <Card>
            <Titulo tamanho="lg">Últimos resultados</Titulo>
            {(rows ?? []).slice(-12).reverse().map((r, i) => (
              <View key={i} style={{ gap: theme.espaco(1) }}>
                <Texto negrito>{TEMAS[r.tema as Tema] ?? r.tema}</Texto>
                <Texto pequeno>{r.acertos} de {r.total} · {formatarPorcentagem(r.pontuacao)} · {formatarDuracao(r.duracaoSegundos)}</Texto>
              </View>
            ))}
          </Card>
        </>
      )}
    </Tela>
  );
}
