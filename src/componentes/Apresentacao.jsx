import { Sparkles, BadgeCheck } from "lucide-react";

export default function Apresentacao() {
  return (
    <>
      <section className="identidade-marca">
        <div className="avatar-container">
          <a
            href="https://instagram.com/cjpersonalizadosiacri"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/logo.jpeg"
              alt="Logo CJ Personalizados"
              className="logo-imagem"
            />
          </a>
        </div>
        <div className="textos-marca">
          <div className="titulo-marca-linha">
            <h1 className="titulo-marca">CJ PERSONALIZADOS</h1>
            <BadgeCheck size={18} className="icone-verificado" />
          </div>
          <p className="subtitulo-marca">Papelaria & Criatividade</p>
        </div>
      </section>

      <section className="apresentacao">
        <div className="etiqueta-destaque">
          <Sparkles size={13} className="icone-tag" />
          <span>Presentes & Lembrancinhas</span>
        </div>
        <h2 className="chamada-principal">
          Buscando um <br />
          <span className="texto-verde">presente único ?</span>
        </h2>
        <p className="descricao-curta">
          Você imagina e a gente cria. Produtos personalizados, cheios de
          carinho e com a sua cara.
        </p>
      </section>
    </>
  );
}
