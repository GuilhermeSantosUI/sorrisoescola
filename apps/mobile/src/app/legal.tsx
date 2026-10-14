import { consentimentoResponsaveis, termoDeUso } from '@sorriso/shared';
import { Card, Tela, Texto, Titulo } from '../components/ui';

export default function Legal() {
  return (
    <Tela voltar titulo="Termos e privacidade">
      <Card><Titulo tamanho="lg">Termo de uso</Titulo>{termoDeUso.map((t) => <Texto key={t}>{t}</Texto>)}</Card>
      <Card><Titulo tamanho="lg">Consentimento dos responsáveis</Titulo>{consentimentoResponsaveis.map((t) => <Texto key={t}>• {t}</Texto>)}</Card>
      <Texto pequeno>TODO: textos pendentes de revisão jurídica (LGPD, art. 14).</Texto>
    </Tela>
  );
}
