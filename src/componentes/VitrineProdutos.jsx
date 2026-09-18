import { useState, useEffect } from "react";
import { redirecionarParaWhatsApp } from "../utils/whatsapp";
import {
  Truck,
  Gift,
  Package,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Share2,
  Check,
} from "lucide-react";
import Carrossel from "./Carrossel";
import IconeWhatsApp from "./IconeWhatsApp";
import produtos from "../utils/produtos";

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
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setCopiado(false);
  }, [indice]);

  const copiarParaAreaDeTransferencia = (texto) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      });
    }
  };

  const compartilharProduto = async (produtoAtual) => {
    const caminhoFoto = Array.isArray(produtoAtual.imagemCapa)
      ? produtoAtual.imagemCapa[0]
      : produtoAtual.imagemCapa;

    const urlPagina = window.location.href;
    const urlFotoCompleta = caminhoFoto.startsWith("http")
      ? caminhoFoto
      : `${window.location.origin}${caminhoFoto}`;

    const textoMensagem = `Olha que lindo esse item de ${produtoAtual.nome} da CJ Personalizados! ✨\n${urlPagina}`;

    // Compartilhamento nativo com o arquivo da foto (WhatsApp / Instagram / redes no celular)
    if (navigator.share) {
      try {
        let arquivoFoto = null;
        if (caminhoFoto) {
          try {
            const resposta = await fetch(urlFotoCompleta);
            const blob = await resposta.blob();
            const tipo = blob.type.startsWith("image/") ? blob.type : "image/jpeg";
            const extensao = tipo.includes("png") ? "png" : "jpeg";
            const nomeArquivo = `${produtoAtual.nome.toLowerCase().replace(/\s+/g, "-")}.${extensao}`;
            arquivoFoto = new File([blob], nomeArquivo, { type: tipo });
          } catch (e) {
            console.warn("Não foi possível processar o arquivo da imagem:", e);
          }
        }

        // Se o dispositivo/navegador suportar compartilhamento de arquivos
        if (arquivoFoto && navigator.canShare && navigator.canShare({ files: [arquivoFoto] })) {
          await navigator.share({
            title: `CJ Personalizados - ${produtoAtual.nome}`,
            text: textoMensagem,
            files: [arquivoFoto],
          });
          return;
        }

        // Caso o navegador suporte compartilhamento mas não suporte anexo de arquivo direto
        await navigator.share({
          title: `CJ Personalizados - ${produtoAtual.nome}`,
          text: `${textoMensagem}\n\nFoto: ${urlFotoCompleta}`,
        });
        return;
      } catch (erro) {
        if (erro.name !== "AbortError") {
          copiarParaAreaDeTransferencia(`${textoMensagem}\n\nFoto: ${urlFotoCompleta}`);
        }
        return;
      }
    }

    // Fallback para computadores ou navegadores sem suporte a compartilhamento nativo
    copiarParaAreaDeTransferencia(`${textoMensagem}\n\nFoto: ${urlFotoCompleta}`);
  };

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

        <div className="acoes-produto">
          <button
            className="botao-whatsapp"
            onClick={() => redirecionarParaWhatsApp(produto.nome)}
          >
            <IconeWhatsApp size={20} className="icone-whatsapp-btn" />
            <span>Pedir no WhatsApp</span>
          </button>

          <button
            type="button"
            className={`botao-compartilhar ${copiado ? "copiado" : ""}`}
            onClick={() => compartilharProduto(produto)}
            title={copiado ? "Link copiado!" : "Compartilhar produto"}
            aria-label="Compartilhar produto"
          >
            {copiado ? <Check size={18} /> : <Share2 size={18} />}
            {copiado && <span className="aviso-copiado">Link copiado!</span>}
          </button>
        </div>
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
