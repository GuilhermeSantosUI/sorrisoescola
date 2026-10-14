import { View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Pressable } from 'react-native';
import { AA_NORMAL, brand, colors, contrastRatio, expressoes, hexToCmyk, hexToRgb, palette, paresContraste, poses, variacoesLogo } from '@sorriso/shared';
import { borda, theme } from '../constants/theme';
import { Card, Icone, ICONES, Mascote, MascoteRosto, Tela, Texto, Titulo, type IconeNome } from '../components/ui';
import { Logo } from '../components/ui/logo';

/** Mesmo conteúdo do /marca do web, em layout de celular. Sem API e sem dados de demonstração. */
export default function Marca() {
  return (
    <Tela voltar titulo="Livro de marca">
      <Texto>{brand.proposito}</Texto>
      <Texto>{brand.ilustracao}</Texto>

      <Titulo tamanho="xl">Logo e mascote</Titulo>
      <View style={{ flexDirection: 'row', gap: theme.espaco(3), flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Logo variante="completa" size={112} rotulo="Logo completa" /><Logo variante="sem-fundo" size={112} rotulo="Logo sem fundo" /><Logo variante="icone" size={48} rotulo="Ícone reduzido" />
      </View>
      {variacoesLogo.map((v) => <Card key={v.id}><Titulo tamanho="lg">{v.nome}</Titulo><Texto pequeno>{v.descricao}</Texto></Card>)}
      <Texto>{brand.areaProtecao}</Texto>
      <Texto>Tamanho mínimo: {brand.tamanhoMinimo.digitalPx} px (digital), {brand.tamanhoMinimo.impressaoMm} mm (impressão).</Texto>
      {brand.usosIncorretos.map((u) => <Texto key={u.id}>Evite: {u.texto}</Texto>)}

      <Titulo tamanho="xl">Poses</Titulo>
      {poses.map((p) => <Card key={p.id} style={{ alignItems: 'center' }}><Mascote pose={p.id} altura={140} /><Texto negrito>{p.nome}</Texto><Texto pequeno style={{ textAlign: 'center' }}>{p.quando}</Texto></Card>)}
      <Titulo tamanho="xl">Expressões</Titulo>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.espaco(4) }}>
        {expressoes.map((e) => <View key={e.id} style={{ alignItems: 'center' }}><MascoteRosto nome={e.id} altura={72} /><Texto pequeno negrito>{e.nome}</Texto></View>)}
      </View>

      <Titulo tamanho="xl">Cores</Titulo>
      {palette.map((c) => {
        const [r, g, b] = hexToRgb(c.hex);
        return (
          <Pressable key={c.name} accessibilityRole="button" accessibilityLabel={`Copiar ${c.label} ${c.hex}`} onPress={() => void Clipboard.setStringAsync(c.hex)}>
            <View style={{ flexDirection: 'row', gap: theme.espaco(3), alignItems: 'center', minHeight: theme.minTouch }}>
              <View style={{ width: theme.espaco(12), height: theme.espaco(12), borderRadius: theme.radii.md, borderWidth: borda, borderColor: theme.colors.petroleo, backgroundColor: c.hex }} />
              <View style={{ flex: 1 }}><Texto negrito>{c.label} {c.hex}{c.apoio ? ' (apoio, aprovar)' : ''}</Texto><Texto pequeno>RGB {r},{g},{b} · CMYK {hexToCmyk(c.hex).join(',')} · {c.uso}</Texto></View>
            </View>
          </Pressable>
        );
      })}
      <Titulo tamanho="xl">Contraste</Titulo>
      {paresContraste.map(([fg, bg]) => {
        const razao = contrastRatio(colors[fg], colors[bg]);
        return <View key={`${fg}${bg}`} style={{ backgroundColor: colors[bg], padding: theme.espaco(3), borderRadius: theme.radii.md, borderWidth: borda, borderColor: theme.colors.petroleo }}><Texto negrito style={{ color: colors[fg] }}>{fg} em {bg}: {razao.toFixed(2)}:1 {razao >= AA_NORMAL ? 'passa AA' : 'não passa AA'}</Texto></View>;
      })}

      <Titulo tamanho="xl">Tipografia</Titulo>
      <Texto>{brand.tipografia.titulo}</Texto><Texto>{brand.tipografia.texto}</Texto>
      <Titulo tamanho="xl">Ícones</Titulo>
      {brand.iconografia.regras.map((r) => <Texto key={r}>• {r}</Texto>)}
      <View style={{ flexDirection: 'row', gap: theme.espaco(4), flexWrap: 'wrap' }}>{(Object.keys(ICONES) as IconeNome[]).map((n) => <Icone key={n} nome={n} size={32} />)}</View>
      <Titulo tamanho="xl">Ilustração</Titulo>
      <Texto>{brand.ilustracaoRegras}</Texto>
    </Tela>
  );
}
