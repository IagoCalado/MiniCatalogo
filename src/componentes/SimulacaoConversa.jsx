import { MessageCircle, CheckCheck } from "lucide-react";

export default function SimulacaoConversa() {
  return (
    <section className="simulacao-conversa">
      <div className="topo-conversa">
        <span className="titulo-conversa">
          <MessageCircle size={13} className="icone-chat-titulo" />
          Como funciona
        </span>
        <span className="badge-online">Online para te atender</span>
      </div>
      <div className="balao-cliente">
        <p className="texto-mensagem">"Queria uma caneca com uma foto e uma frase especial..."</p>
        <span className="hora-mensagem">10:42</span>
      </div>
      <div className="balao-loja">
        <p className="texto-mensagem">"Deixa com a gente! Montamos a arte do seu jeito."</p>
        <div className="meta-mensagem-loja">
          <span className="hora-mensagem">10:43</span>
          <CheckCheck size={14} className="icone-check-duplo" />
        </div>
      </div>
    </section>
  );
}