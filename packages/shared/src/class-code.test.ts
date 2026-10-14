import { describe, expect, it } from 'vitest';
import { ClassCode, Nickname } from './class-code';

describe('ClassCode', () => {
  it('gera código válido de 6 caracteres', () => {
    const c = ClassCode.generate();
    expect(c.toString()).toHaveLength(6);
    expect(ClassCode.parse(c.toString())?.toString()).toBe(c.toString());
  });
  it('normaliza entrada', () => expect(ClassCode.parse('abc-234')?.toString()).toBe('ABC234'));
  it('rejeita ambíguos e tamanho errado', () => {
    expect(ClassCode.parse('ABC0O1')).toBeNull();
    expect(ClassCode.parse('ABC')).toBeNull();
  });
});

describe('Nickname', () => {
  it('aceita apelido simples', () => expect(Nickname.parse(' Léo ')?.toString()).toBe('Léo'));
  it('rejeita dados pessoais', () => {
    expect(Nickname.parse('a@b.com')).toBeNull();
    expect(Nickname.parse('79999991234')).toBeNull();
    expect(Nickname.parse('Maria da Silva Souza')).toBeNull();
    expect(Nickname.parse('x')).toBeNull();
  });
});
