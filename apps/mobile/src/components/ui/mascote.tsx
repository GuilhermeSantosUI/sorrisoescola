/* eslint-disable @typescript-eslint/no-require-imports -- Metro exige require() para assets */
import { Image } from 'react-native';
import { MASCOTE_PROPORCAO, expressoes, poses, type ExpressaoMascote, type PoseMascote } from '@sorriso/shared';

const POSES = {
  frontal: require('../../../assets/mascote/frontal.png'),
  escovando: require('../../../assets/mascote/escovando.png'),
  'fio-dental': require('../../../assets/mascote/fio-dental.png'),
  joinha: require('../../../assets/mascote/joinha.png'),
  comemorando: require('../../../assets/mascote/comemorando.png'),
  pensando: require('../../../assets/mascote/pensando.png'),
} as const;

const ROSTOS = {
  feliz: require('../../../assets/mascote/rosto-feliz.png'),
  rindo: require('../../../assets/mascote/rosto-rindo.png'),
  serio: require('../../../assets/mascote/rosto-serio.png'),
  triste: require('../../../assets/mascote/rosto-triste.png'),
} as const;

/** Mascote com arte própria por pose (mesmos nomes do web). */
export function Mascote({ pose = 'acenando', altura = 160, decorativo = false }: { pose?: PoseMascote; altura?: number; decorativo?: boolean }) {
  const info = poses.find((p) => p.id === pose) ?? poses[0]!;
  return (
    <Image
      source={POSES[info.arquivo as keyof typeof POSES]}
      style={{ height: altura, width: altura * (MASCOTE_PROPORCAO[info.arquivo] ?? 1), alignSelf: 'center' }}
      resizeMode="contain"
      accessible={!decorativo}
      accessibilityLabel={decorativo ? undefined : `Mascote hipopótamo: ${info.nome.toLowerCase()}`}
    />
  );
}

export function MascoteRosto({ nome, altura = 64 }: { nome: ExpressaoMascote; altura?: number }) {
  const arquivo = expressoes.find((e) => e.id === nome)?.arquivo ?? 'rosto-feliz';
  return <Image source={ROSTOS[nome]} style={{ height: altura, width: altura * (MASCOTE_PROPORCAO[arquivo] ?? 1) }} resizeMode="contain" accessibilityLabel={`Mascote ${nome}`} />;
}
