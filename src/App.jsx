import './estilo.css';
import Cabecalho from './componentes/Cabecalho';
import Apresentacao from './componentes/Apresentacao';
import SimulacaoConversa from './componentes/SimulacaoConversa';
import VitrineProdutos from './componentes/VitrineProdutos';

export default function App() {
  return (
    <main className="fundo-tela">
      <div className="cartao-principal">
        <div className="efeito-brilho"></div>
        
        <Cabecalho />
        <Apresentacao />
        <SimulacaoConversa />
        <VitrineProdutos />

        <footer className="rodape">
          <p>Feito com ♥ para você.</p>
        </footer>
      </div>
    </main>
  );
}