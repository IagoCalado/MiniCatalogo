function IconeInstagram() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="icone-instagram"
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="instagram-gradient-colors" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="25%" stopColor="#fa7e1e" />
          <stop offset="50%" stopColor="#d62976" />
          <stop offset="75%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        ry="5"
        stroke="url(#instagram-gradient-colors)"
        strokeWidth="2.2"
      />
      <path
        d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
        stroke="url(#instagram-gradient-colors)"
        strokeWidth="2.2"
      />
      <circle cx="17.5" cy="6.5" r="1.3" fill="url(#instagram-gradient-colors)" />
    </svg>
  );
}

export default function Cabecalho() {
  return (
    <header className="cabecalho">
      <a
        href="https://instagram.com/cjpersonalizadosiacri"
        target="_blank"
        rel="noopener noreferrer"
        className="usuario-instagram-badge"
      >
        <IconeInstagram />
        <span>@CJ Personalizados</span>
      </a>
      <div className="localizacao-badge">
        <span className="indicador-pulso"></span>
        <span>Iacri-SP e Região</span>
      </div>
    </header>
  );
}