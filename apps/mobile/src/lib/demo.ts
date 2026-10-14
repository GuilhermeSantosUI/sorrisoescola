/** API simulada (dados de demonstração) só com EXPO_PUBLIC_USE_MOCKS=true; some do bundle de produção. */
export const usandoMock = process.env.EXPO_PUBLIC_USE_MOCKS === 'true';

export async function carregarDemo() {
  if (process.env.EXPO_PUBLIC_USE_MOCKS !== 'true') throw new Error('Demonstração desativada');
  return import('@sorriso/shared/mocks');
}
