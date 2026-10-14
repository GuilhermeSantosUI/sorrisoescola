import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from './components/sections/navbar';
import { Footer } from './components/sections/footer';
import { MockBanner } from './components/mock-banner';
import { Toaster } from './components/ui/sonner';
import { Home } from './pages/home';
import { Auth } from './pages/auth';
import { Sala } from './pages/sala';
import { Professor } from './pages/professor';
import { Turma } from './pages/turma';
import { Resultados } from './pages/resultados';
import { Conteudo } from './pages/conteudo';
import { Ajuda } from './pages/ajuda';
import { Legal } from './pages/legal';
import { Branding } from './pages/branding';
import { Alunos } from './pages/alunos';
import { DesignSystem } from './pages/design-system';
import { Responsaveis } from './pages/responsaveis';
import { Acompanhamento } from './pages/acompanhamento';

export function App() {
  const { pathname } = useLocation();
  const emSala = pathname.startsWith('/sala'); // modo sala ocupa a tela toda
  return (
    <>
      {!emSala && <MockBanner />}
      {!emSala && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entrar" element={<Auth />} />
        <Route path="/sala" element={<Sala />} />
        <Route path="/professor" element={<Professor />} />
        <Route path="/professor/turma" element={<Turma />} />
        <Route path="/professor/alunos" element={<Alunos />} />
        <Route path="/professor/resultados" element={<Resultados />} />
        <Route path="/responsaveis" element={<Responsaveis />} />
        <Route path="/responsaveis/acompanhamento" element={<Acompanhamento />} />
        <Route path="/conteudo" element={<Conteudo />} />
        <Route path="/ajuda" element={<Ajuda />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/marca" element={<Branding />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!emSala && <Footer />}
      <Toaster position="top-center" />
    </>
  );
}
