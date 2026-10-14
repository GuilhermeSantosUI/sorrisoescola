import { Abas } from '../../components/navigation/abas';
import { Guarda } from '../../components/sessao/guarda';

export default function LayoutAluno() {
  return (
    <Guarda papel="crianca">
      <Abas itens={[
        { nome: 'inicio', rotulo: 'Início', icone: 'casa', sf: 'house.fill', md: 'home' },
        { nome: 'aprender', rotulo: 'Aprender', icone: 'conteudo', sf: 'book.fill', md: 'menu_book' },
        { nome: 'escovar', rotulo: 'Escovar', icone: 'timer', sf: 'timer', md: 'timer' },
        { nome: 'conquistas', rotulo: 'Conquistas', icone: 'conquista', sf: 'star.fill', md: 'star' },
      ]} />
    </Guarda>
  );
}
