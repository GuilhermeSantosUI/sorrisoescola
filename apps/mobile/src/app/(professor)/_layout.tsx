import { Abas } from '../../components/navigation/abas';
import { Guarda } from '../../components/sessao/guarda';

export default function LayoutProfessor() {
  return (
    <Guarda papel="professor">
      <Abas itens={[
        { nome: 'painel', rotulo: 'Painel', icone: 'casa', sf: 'house.fill', md: 'home' },
        { nome: 'conduzir', rotulo: 'Conduzir', icone: 'sala', sf: 'play.rectangle.fill', md: 'slideshow' },
        { nome: 'turma', rotulo: 'Turma', icone: 'alunos', sf: 'person.3.fill', md: 'groups' },
        { nome: 'resultados', rotulo: 'Resultados', icone: 'resultados', sf: 'chart.bar.fill', md: 'bar_chart' },
      ]} />
    </Guarda>
  );
}
