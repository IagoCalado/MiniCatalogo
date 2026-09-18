import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function Carrossel({
  imagens = [],
  nomeProduto = 'Produto',
  fotoAtiva = 0,
  aoMudarFoto,
}) {
  const [toqueInicioX, setToqueInicioX] = useState(null);
  const [toqueFimX, setToqueFimX] = useState(null);
  const [erros, setErros] = useState({});

  const formatarCaminho = (url) => {
    if (typeof url !== 'string') return url;
    if (url.startsWith('./')) return url.slice(1);
    return url;
  };

  // Normaliza imagens para array
  const lista = (Array.isArray(imagens) ? imagens : [imagens].filter(Boolean)).map(formatarCaminho);
  const total = lista.length;

  // Garante que o índice da foto esteja dentro dos limites válidos
  const indiceFoto = Math.min(
    Math.max(0, typeof fotoAtiva === 'number' ? fotoAtiva : 0),
    Math.max(0, total - 1)
  );

  // Reseta erros quando a lista de fotos mudar
  useEffect(() => {
    setErros({});
  }, [imagens]);

  // Setas de cima das imagens passam APENAS as fotos
  const fotoAnterior = (e) => {
    if (e) e.stopPropagation();
    if (total <= 1) return;
    const novoIndice = (indiceFoto - 1 + total) % total;
    if (aoMudarFoto) aoMudarFoto(novoIndice);
  };

  const proximaFoto = (e) => {
    if (e) e.stopPropagation();
    if (total <= 1) return;
    const novoIndice = (indiceFoto + 1) % total;
    if (aoMudarFoto) aoMudarFoto(novoIndice);
  };

  const irParaFoto = (index, e) => {
    if (e) e.stopPropagation();
    if (aoMudarFoto) aoMudarFoto(index);
  };

  // Suporte a swipe no celular para passar as fotos
  const handleTouchStart = (e) => {
    setToqueFimX(null);
    setToqueInicioX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setToqueFimX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!toqueInicioX || !toqueFimX) return;
    const diff = toqueInicioX - toqueFimX;
    if (diff > 40) proximaFoto();
    else if (diff < -40) fotoAnterior();
    setToqueInicioX(null);
    setToqueFimX(null);
  };

  if (total === 0) return null;

  return (
    <div className="carrossel-wrapper">
      <div 
        className="carrossel-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Trilho de fotos deslizante deste produto */}
        <div 
          className="carrossel-trilho"
          style={{ transform: `translateX(-${indiceFoto * 100}%)` }}
        >
          {lista.map((img, idx) => (
            <div key={idx} className="carrossel-item">
              {erros[idx] ? (
                  <div className="carrossel-placeholder">
                    <ImageIcon size={36} className="icone-placeholder" />
                  <span>{nomeProduto}</span>
                    <small>Foto em breve</small>
                  </div>
                ) : (
                  <img
                  src={img}
                  alt={`${nomeProduto} - Foto ${idx + 1}`}
                    className="carrossel-imagem"
                  onError={() => setErros((prev) => ({ ...prev, [idx]: true }))}
                  />
                )}
              </div>
          ))}
        </div>

        {/* Setas de cima das imagens APENAS para passar as fotos */}
        {total > 1 && (
          <>
            <button
              type="button"
              className="carrossel-btn carrossel-btn-anterior"
              onClick={fotoAnterior}
              aria-label="Foto anterior"
              title="Foto anterior"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="carrossel-btn carrossel-btn-proximo"
              onClick={proximaFoto}
              aria-label="Próxima foto"
              title="Próxima foto"
            >
              <ChevronRight size={22} />
            </button>

            {/* Bolinhas indicadoras das fotos do produto na parte inferior */}
            <div className="carrossel-indicadores">
              {lista.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`carrossel-ponto ${idx === indiceFoto ? 'ativo' : ''}`}
                  onClick={(e) => irParaFoto(idx, e)}
                  aria-label={`Foto ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas de fotos do produto abaixo do carrossel */}
      {total > 1 && (
        <div className="carrossel-miniaturas">
          {lista.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className={`carrossel-thumb ${idx === indiceFoto ? 'ativo' : ''}`}
              onClick={(e) => irParaFoto(idx, e)}
              aria-label={`Selecionar foto ${idx + 1}`}
            >
              {erros[idx] ? (
                <div className="thumb-placeholder">
                  <ImageIcon size={14} />
                </div>
              ) : (
              <img
                  src={item}
                  alt={`Miniatura ${idx + 1}`}
                  onError={() => setErros((prev) => ({ ...prev, [idx]: true }))}
              />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
