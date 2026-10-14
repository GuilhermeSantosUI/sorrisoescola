import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 p-6 text-sm">
        <img src="/brand/logo-icone.svg" alt="" width={40} height={40} />
        <p className="min-w-60 flex-1">Sorriso na Escola, projeto de extensão da Universidade Tiradentes (UNIT) com a Nossa Escola, Aracaju/SE.</p>
        <nav aria-label="Rodapé" className="flex gap-4 font-bold">
          <Link to="/legal" className="underline">Termos e privacidade</Link>
          <Link to="/responsaveis" className="underline">Famílias</Link>
          <Link to="/marca" className="underline">Marca</Link>
          <Link to="/ajuda" className="underline">Ajuda</Link>
        </nav>
      </div>
    </footer>
  );
}
