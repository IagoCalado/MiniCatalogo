import { useState, useEffect, useRef } from "react";
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
import produtos, {
  encontrarIndiceProdutoPorIdentificador,
} from "../utils/produtos";

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

function extrairProdutoEFotoDaUrl() {
  if (typeof window === "undefined") {
    return { indiceProduto: null, indiceFoto: 0 };
  }

  const params = new URLSearchParams(window.location.search);
  const paramProduto =
    params.get("produto") ||
    params.get("item") ||
    window.location.hash.replace("#", "");

  if (!paramProduto) {
    return { indiceProduto: null, indiceFoto: 0 };
  }

  const indiceEncontrado = encontrarIndiceProdutoPorIdentificador(paramProduto);
  if (indiceEncontrado === -1) {
    return { indiceProduto: null, indiceFoto: 0 };
  }

  const prod = produtos[indiceEncontrado];
  const listaFotos = Array.isArray(prod?.imagemCapa)
    ? prod.imagemCapa
    : prod?.imagemCapa
    ? [prod.imagemCapa]
    : [];

  const paramFoto =
    params.get("foto") ||
    params.get("img") ||
    params.get("imagem") ||
    params.get("f");

  let fotoIndex = 0;
  if (paramFoto && listaFotos.length > 0) {
    const num = parseInt(paramFoto, 10);
    if (!isNaN(num)) {
      fotoIndex = num > 0 ? num - 1 : 0;
    } else {
      const encontrada = listaFotos.findIndex((img) =>
        String(img).toLowerCase().includes(paramFoto.toLowerCase())
      );
      if (encontrada !== -1) {
        fotoIndex = encontrada;
      }
    }
  }

  if (fotoIndex < 0 || (listaFotos.length > 0 && fotoIndex >= listaFotos.length)) {
    fotoIndex = 0;
  }

  return { indiceProduto: indiceEncontrado, indiceFoto: fotoIndex };
}

export default function VitrineProdutos() {
  const [dadosIniciais] = useState(extrairProdutoEFotoDaUrl);
  const [indice, setIndice] = useState(dadosIniciais.indiceProduto);
  const [fotoAtiva, setFotoAtiva] = useState(dadosIniciais.indiceFoto);
  const [direcao, setDirecao] = useState("neutro");
  const [copiado, setCopiado] = useState(false);
  const detalhesRef = useRef(null);

  // Lê o parâmetro da URL na inicialização e sincroniza com o histórico (ex: botão voltar/avançar do celular)
  useEffect(() => {
    const sincronizarProdutoDaUrl = () => {
      const { indiceProduto, indiceFoto } = extrairProdutoEFotoDaUrl();
      setIndice(indiceProduto);
      setFotoAtiva(indiceFoto);
    };

    window.addEventListener("popstate", sincronizarProdutoDaUrl);
    window.addEventListener("hashchange", sincronizarProdutoDaUrl);
    return () => {
      window.removeEventListener("popstate", sincronizarProdutoDaUrl);
      window.removeEventListener("hashchange", sincronizarProdutoDaUrl);
    };
  }, []);

  useEffect(() => {
    setCopiado(false);

    // Quando abrir um produto, rola suavemente até o elemento se necessário
    if (indice !== null && detalhesRef.current) {
      const timer = setTimeout(() => {
        if (detalhesRef.current) {
          detalhesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [indice]);

  const abrirProduto = (i) => {
    setDirecao("neutro");
    setFotoAtiva(0);
    setIndice(i);
    const prod = produtos[i];
    if (prod) {
      const url = new URL(window.location.href);
      url.searchParams.set("produto", prod.slug || prod.id);
      url.searchParams.set("foto", "1");
      window.history.pushState({ produto: prod.slug, foto: 1 }, "", url.toString());
    }
  };

  const fecharProduto = () => {
    setIndice(null);
    setFotoAtiva(0);
    const url = new URL(window.location.href);
    url.searchParams.delete("produto");
    url.searchParams.delete("item");
    url.searchParams.delete("foto");
    url.searchParams.delete("img");
    url.searchParams.delete("imagem");
    url.searchParams.delete("f");
    url.hash = "";
    window.history.pushState({}, "", url.toString());
  };

  const irParaAnterior = () => {
    setDirecao("anterior");
    setFotoAtiva(0);
    const novoIndice = (indice - 1 + produtos.length) % produtos.length;
    setIndice(novoIndice);
    const prod = produtos[novoIndice];
    if (prod) {
      const url = new URL(window.location.href);
      url.searchParams.set("produto", prod.slug || prod.id);
      url.searchParams.set("foto", "1");
      window.history.replaceState({ produto: prod.slug, foto: 1 }, "", url.toString());
    }
  };

  const irParaProximo = () => {
    setDirecao("proximo");
    setFotoAtiva(0);
    const novoIndice = (indice + 1) % produtos.length;
    setIndice(novoIndice);
    const prod = produtos[novoIndice];
    if (prod) {
      const url = new URL(window.location.href);
      url.searchParams.set("produto", prod.slug || prod.id);
      url.searchParams.set("foto", "1");
      window.history.replaceState({ produto: prod.slug, foto: 1 }, "", url.toString());
    }
  };

  const handleMudarFoto = (novoIndiceFoto) => {
    setFotoAtiva(novoIndiceFoto);
    if (indice !== null) {
      const prod = produtos[indice];
      if (prod) {
        const url = new URL(window.location.href);
        url.searchParams.set("produto", prod.slug || prod.id);
        url.searchParams.set("foto", String(novoIndiceFoto + 1));
        window.history.replaceState(
          { produto: prod.slug, foto: novoIndiceFoto + 1 },
          "",
          url.toString()
        );
      }
    }
  };

  const copiarParaAreaDeTransferencia = (texto) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      });
    }
  };

  const compartilharProduto = async (produtoAtual) => {
    const listaFotos = Array.isArray(produtoAtual.imagemCapa)
      ? produtoAtual.imagemCapa
      : [produtoAtual.imagemCapa];

    // Pega a foto que o usuário selecionou no momento
    const indiceFotoAtual = Math.min(
      Math.max(0, fotoAtiva),
      Math.max(0, listaFotos.length - 1)
    );
    const caminhoFoto = listaFotos[indiceFotoAtual] || listaFotos[0];

    const urlFotoCompleta = caminhoFoto.startsWith("http")
      ? caminhoFoto
      : `${window.location.origin}${caminhoFoto}`;

    // Monta a URL direta para o produto e para a foto específica compartilhada
    const slug = produtoAtual.slug || produtoAtual.id;
    const urlBase = `${window.location.origin}${window.location.pathname}`
      .replace(/\/index\.html$/, "")
      .replace(/\/+$/, "");
    const numeroFoto = indiceFotoAtual + 1;
    const urlProduto = `${urlBase}?produto=${slug}&foto=${numeroFoto}`;

    const textoMensagem = `Olha que lindo esse item de ${produtoAtual.nome} da CJ Personalizados! ✨\n${urlProduto}`;

    // Compartilhamento nativo com o arquivo da foto (WhatsApp / Instagram / redes no celular)
    if (navigator.share) {
      try {
        let arquivoFoto = null;
        if (caminhoFoto) {
          try {
            const resposta = await fetch(urlFotoCompleta);
            const blob = await resposta.blob();
            const tipo = blob.type.startsWith("image/")
              ? blob.type
              : "image/jpeg";
            const extensao = tipo.includes("png") ? "png" : "jpeg";
            const nomeArquivo = `${produtoAtual.nome.toLowerCase().replace(/\s+/g, "-")}-foto-${numeroFoto}.${extensao}`;
            arquivoFoto = new File([blob], nomeArquivo, { type: tipo });
          } catch (e) {
            console.warn("Não foi possível processar o arquivo da imagem:", e);
          }
        }

        // Se o dispositivo/navegador suportar compartilhamento de arquivos
        if (
          arquivoFoto &&
          navigator.canShare &&
          navigator.canShare({ files: [arquivoFoto] })
        ) {
          await navigator.share({
            title: `CJ Personalizados - ${produtoAtual.nome}`,
            text: textoMensagem,
            url: urlProduto,
            files: [arquivoFoto],
          });
          return;
        }

        // Caso o navegador suporte compartilhamento mas não suporte anexo de arquivo direto
        await navigator.share({
          title: `CJ Personalizados - ${produtoAtual.nome}`,
          text: textoMensagem,
          url: urlProduto,
        });
        return;
      } catch (erro) {
        if (erro.name !== "AbortError") {
          copiarParaAreaDeTransferencia(textoMensagem);
        }
        return;
      }
    }

    // Fallback para computadores ou navegadores sem suporte a compartilhamento nativo
    copiarParaAreaDeTransferencia(textoMensagem);
  };

  if (indice !== null) {
    const produto = produtos[indice];

    const imagensDoProduto = Array.isArray(produto.imagemCapa)
      ? produto.imagemCapa
      : [produto.imagemCapa];

    return (
      <div ref={detalhesRef} className="detalhes-produto">
        <div className="topo-detalhes">
          <button className="botao-voltar" onClick={fecharProduto}>
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
          <Carrossel
            imagens={imagensDoProduto}
            nomeProduto={produto.nome}
            fotoAtiva={fotoAtiva}
            aoMudarFoto={handleMudarFoto}
          />

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
              onClick={() => abrirProduto(i)}
            >
              <div className="container-imagem">
                <img
                  src={imagemCapaGrid}
                  alt={produto.nome}
                  className="imagem-quadrada"
                  loading="lazy"
                  decoding="async"
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
