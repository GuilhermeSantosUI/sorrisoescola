import { NativeTabs } from 'expo-router/unstable-native-tabs';
import type { IconeNome } from '../ui/icon';

export interface ItemAba { nome: string; rotulo: string; icone: IconeNome; sf: string; md: string }

/** Abas nativas: liquid glass no iOS 26 e abas Material no Android. A versão web está em abas.web.tsx. */
export function Abas({ itens }: { itens: ItemAba[] }) {
  return (
    <NativeTabs>
      {itens.map((i) => (
        <NativeTabs.Trigger key={i.nome} name={i.nome}>
          <NativeTabs.Trigger.Label>{i.rotulo}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={i.sf as never} md={i.md as never} />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
