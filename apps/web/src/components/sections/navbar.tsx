import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { List, X } from '@phosphor-icons/react';
import { Icone, type IconeNome } from '../ui';

const links: [string, string, IconeNome][] = [['/conteudo', 'Conteúdo', 'conteudo'], ['/sala', 'Modo sala', 'sala'], ['/professor', 'Professor', 'professor'], ['/responsaveis', 'Famílias', 'sorriso'], ['/ajuda', 'Ajuda', 'ajuda']];

export function Navbar() {
  const [aberto, setAberto] = useState(false);
  const item = ({ isActive }: { isActive: boolean }) => `inline-flex min-h-12 items-center gap-2 rounded-full px-4 font-bold whitespace-nowrap transition-colors hover:bg-card/60 ${isActive ? 'bg-card' : ''}`;
  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-turquesa/95 backdrop-blur">
      <nav aria-label="Principal" className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-6 py-2 lg:flex-nowrap">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-titulo text-xl font-extrabold">
          <img src="/brand/logo-icone.svg" alt="" width={40} height={40} /> Sorriso na Escola
        </Link>
        <button type="button" aria-expanded={aberto} aria-controls="menu-principal" onClick={() => setAberto((v) => !v)} className="ml-auto inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-border bg-card px-4 font-bold lg:hidden">
          {aberto ? <X size={22} weight="bold" aria-hidden="true" /> : <List size={22} weight="bold" aria-hidden="true" />} Menu
        </button>
        <ul id="menu-principal" className={`${aberto ? 'flex' : 'hidden'} w-full flex-col gap-1 pb-2 lg:ml-auto lg:flex lg:w-auto lg:flex-row lg:pb-0`}>
          {links.map(([to, rotulo, ic]) => (
            <li key={to}><NavLink to={to} onClick={() => setAberto(false)} className={item}><Icone nome={ic} size={22} /> {rotulo}</NavLink></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
