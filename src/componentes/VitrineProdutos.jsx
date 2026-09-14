import { useState, useEffect } from "react";
import { redirecionarParaWhatsApp } from "../utils/whatsapp";
import {
  Truck,
  Gift,
  Package,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Carrossel from "./Carrossel";
import IconeWhatsApp from "./IconeWhatsApp";

// Mantemos a lista de fora para ficar mais leve
const produtos = [
  {
    id: 1,
    nome: "Educacional",
    imagemCapa: [
      "./educacional/educacional-01.jpeg",
      "./educacional/educacional-02.jpeg",
      "./educacional/educacional-03.jpeg",
      "./educacional/educacional-04.jpeg",
    ],
    descricao: "Produtos para auxiliar nas tarefas escolares.",
    preco: "Sob consulta",
  },
  {
    id: 2,
    nome: "Tags e Adesivos",
    imagemCapa: [
      "./tagsAdesivos/adesivos-01.jpeg",
      "./tagsAdesivos/adesivos-02.jpeg",
      "./tagsAdesivos/adesivos-03.jpeg",
      "./tagsAdesivos/adesivos-04.jpeg",
    ],
    descricao: "Tags personalizadas para todos os tipos de produtos.",
    preco: "Sob consulta",
  },
  {
    id: 3,
    nome: "Casamentos",
    imagemCapa: [
      "./casamentos/casamento-01.jpeg",
      "./casamentos/casamento-02.jpeg",
      "./casamentos/casamento-03.jpeg",
      "./casamentos/casamento-04.jpeg",
    ],
    descricao: "Itens para festas, casamentos e eventos.",
    preco: "Sob consulta",
  },
  {
    id: 4,
    nome: "Polaroids e Fotos",
    imagemCapa: [
      "./polaroidFoto/foto-01.jpeg",
      "./polaroidFoto/foto-02.jpeg",
      "./polaroidFoto/foto-03.jpeg",
      "./polaroidFoto/foto-04.jpeg",
      "./polaroidFoto/foto-05.jpeg",
    ],
    descricao: "Impressão de fotos, estilo e polaroid.",
    preco: "Sob consulta",
  },
  {
    id: 5,
    nome: "Garrafas e Copos",
    imagemCapa: [
      "./garrafasCopos/garrafa-01.jpeg",
      "./garrafasCopos/garrafa-02.jpeg",
      "./garrafasCopos/garrafa-03.jpeg",
      "./garrafasCopos/copo-01.jpeg",
    ],
    descricao: "Garrafas e copos personalizados.",
    preco: "Sob consulta",
  },
  {
    id: 6,
    nome: "Lembranças",
    imagemCapa: [
      "./lembrancas/lembrancas-01.jpeg",
      "./lembrancas/lembrancas-02.jpeg",
      "./lembrancas/lembrancas-03.jpeg",
      "./lembrancas/lembrancas-04.jpeg",
    ],
    descricao: "Lembranças personalizadas para todas as ocasiões.",
    preco: "Sob consulta",
  },
  {
    id: 7,
    nome: "Empresarial",
    imagemCapa: [
      "./empresarial/empresarial-01.jpeg",
      "./empresarial/empresarial-02.jpeg",
      "./empresarial/empresarial-03.jpeg",
      "./empresarial/empresarial-04.jpeg",
    ],
    descricao: "Itens de papelaria personalizados para empresas.",
    preco: "Sob consulta",
  },
  {
    id: 8,
    nome: "Aniversários",
    imagemCapa: [
      "./aniversarios/aniversario-01.jpeg",
      "./aniversarios/aniversario-02.jpeg",
      "./aniversarios/aniversario-03.jpeg",
      "./aniversarios/aniversario-04.jpeg",
    ],
    descricao: "Itens de papelaria personalizados para aniversários.",
    preco: "Sob consulta",
  },
  {
    id: 9,
    nome: "Encadernação",
    imagemCapa: [
      "./encadernacao/encadernacao-01.jpeg",
      "./encadernacao/encadernacao-02.jpeg",
      "./encadernacao/encadernacao-03.jpeg",
      "./encadernacao/encadernacao-04.jpeg",
      "./encadernacao/encadernacao-05.jpeg",
    ],
    descricao: "Encadernação de alta qualidade para seus projetos.",
    preco: "Sob consulta",
  },
];

function IndicadorNumeroSuave({ indice, total, direcao }) {
  const [itens, setItens] = useState([
    { id: `ativo-${indice}`, valor: indice + 1, status: "ativo" },
  ]);

  useEffect(() => {
    const novoValor = indice + 1;
    setItens((prev) => {
      const ultimo = prev[prev.length - 1];
      if (ultimo && ultimo.valor === novoValor) return prev;
      return [
        {
          id: `saindo-${ultimo ? ultimo.valor : novoValor}-${Date.now()}`,
          valor: ultimo ? ultimo.valor : novoValor,
          status: "saindo",
        },
        {
          id: `entrando-${novoValor}-${Date.now()}`,
          valor: novoValor,
          status: "entrando",
        },
      ];
    });

    const timer = setTimeout(() => {
      setItens([
        {
          id: `ativo-${novoValor}-${Date.now()}`,
          valor: novoValor,
          status: "ativo",
        },
      ]);
    }, 260);

    return () => clearTimeout(timer);
  }, [indice]);

  return (
    <div className={`indicador-opcao-num direcao-${direcao}`}>
      <span className="indicador-janela-digito">
        {itens.map((item) => (
          <span
            key={item.id}
            className={`indicador-digito-item ${item.status}`}
          >
            {item.valor}
          </span>
        ))}
      </span>
      <span className="indicador-divisor">/</span>
      <span className="indicador-total">{total}</span>
    </div>
  );
}

export default function VitrineProdutos() {
  const [indice, setIndice] = useState(null);
  const [direcao, setDirecao] = useState("neutro");

  if (indice !== null) {
    const produto = produtos[indice];

    const irParaAnterior = () => {
      setDirecao("anterior");
      setIndice((prev) => (prev - 1 + produtos.length) % produtos.length);
    };

    const irParaProximo = () => {
      setDirecao("proximo");
      setIndice((prev) => (prev + 1) % produtos.length);
    };

    const imagensDoProduto = Array.isArray(produto.imagemCapa)
      ? produto.imagemCapa
      : [produto.imagemCapa];

    return (
      <div className="detalhes-produto">
        <div className="topo-detalhes">
          <button className="botao-voltar" onClick={() => setIndice(null)}>
            <ArrowLeft size={14} />
            <span>Voltar para a vitrine</span>
          </button>

          <div className="navegacao-opcoes-rapida">
            <button
              type="button"
              className="botao-opcao-nav"
              onClick={irParaAnterior}
              aria-label="Catálogo anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <IndicadorNumeroSuave
              indice={indice}
              total={produtos.length}
              direcao={direcao}
            />

            <button
              type="button"
              className="botao-opcao-nav"
              onClick={irParaProximo}
              aria-label="Próximo catálogo"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div key={`conteudo-${indice}`} className="conteudo-produto-transicao">
          <Carrossel imagens={imagensDoProduto} nomeProduto={produto.nome} />

          <div className="infos-produto">
            <h2 className="titulo-detalhe">{produto.nome}</h2>
            <p className="descricao-detalhe">{produto.descricao}</p>
          </div>
        </div>

        <button
          className="botao-whatsapp"
          onClick={() => redirecionarParaWhatsApp(produto.nome)}
        >
          <IconeWhatsApp size={20} className="icone-whatsapp-btn" />
          <span>Pedir no WhatsApp</span>
        </button>
      </div>
    );
  }

  return (
    <div className="secao-vitrine">
      <p className="titulo-opcoes">Toque em um produto para detalhes:</p>

      <section className="grade-3x3">
        {produtos.map((produto, i) => {
          const imagemCapaGrid = Array.isArray(produto.imagemCapa)
            ? produto.imagemCapa[0]
            : produto.imagemCapa;

          return (
            <div
              key={produto.id}
              className="item-grade"
              onClick={() => {
                setDirecao("neutro");
                setIndice(i);
              }}
            >
              <div className="container-imagem">
                <img
                  src={imagemCapaGrid}
                  alt={produto.nome}
                  className="imagem-quadrada"
                />
              </div>
              <span className="titulo-item">{produto.nome}</span>
            </div>
          );
        })}
      </section>

      <footer className="rodape-beneficios">
        <div className="beneficio">
          <div className="icone-beneficio-circulo">
            <Truck size={14} className="icone-destaque" />
          </div>
          <span>
            ENVIO PARA
            <br />
            TODO BRASIL
          </span>
        </div>
        <div className="beneficio-divisor"></div>
        <div className="beneficio">
          <div className="icone-beneficio-circulo">
            <Gift size={14} className="icone-destaque" />
          </div>
          <span>
            PRESENTES
            <br />
            EXCLUSIVOS
          </span>
        </div>
        <div className="beneficio-divisor"></div>
        <div className="beneficio">
          <div className="icone-beneficio-circulo">
            <Package size={14} className="icone-destaque" />
          </div>
          <span>
            PAPELARIA
            <br />
            PERSONALIZADA
          </span>
        </div>
      </footer>

      <button
        type="button"
        className="botao-whatsapp botao-whatsapp-home"
        onClick={() => redirecionarParaWhatsApp("Atendimento Geral")}
      >
        <IconeWhatsApp size={20} className="icone-whatsapp-btn" />
        <span>Falar com a loja no WhatsApp</span>
      </button>
    </div>
  );
}
