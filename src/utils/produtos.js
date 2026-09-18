export function gerarSlug(texto) {
  if (!texto) return "";
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const listaDeProdutos = [
  {
    id: 1,
    slug: "educacional",
    nome: "Educacional",
    imagemCapa: [
      "/educacional/educacional-01.jpeg",
      "/educacional/educacional-02.jpeg",
      "/educacional/educacional-03.jpeg",
      "/educacional/educacional-04.jpeg",
    ],
    descricao: "Produtos para auxiliar nas tarefas escolares.",
  },
  {
    id: 2,
    slug: "tags-e-adesivos",
    nome: "Tags e Adesivos",
    imagemCapa: [
      "/tagsAdesivos/adesivos-01.jpeg",
      "/tagsAdesivos/adesivos-02.jpeg",
      "/tagsAdesivos/adesivos-03.jpeg",
      "/tagsAdesivos/adesivos-04.jpeg",
    ],
    descricao: "Tags personalizadas para todos os tipos de produtos.",
  },
  {
    id: 3,
    slug: "casamentos",
    nome: "Casamentos",
    imagemCapa: [
      "/casamentos/casamento-01.jpeg",
      "/casamentos/casamento-02.jpeg",
      "/casamentos/casamento-03.jpeg",
      "/casamentos/casamento-04.jpeg",
    ],
    descricao: "Itens para festas, casamentos e eventos.",
  },
  {
    id: 4,
    slug: "polaroids-e-fotos",
    nome: "Polaroids e Fotos",
    imagemCapa: [
      "/polaroidFoto/foto-01.jpeg",
      "/polaroidFoto/foto-02.jpeg",
      "/polaroidFoto/foto-03.jpeg",
      "/polaroidFoto/foto-04.jpeg",
      "/polaroidFoto/foto-05.jpeg",
    ],
    descricao: "Impressão de fotos, estilo e polaroid.",
  },
  {
    id: 5,
    slug: "garrafas-e-copos",
    nome: "Garrafas e Copos",
    imagemCapa: [
      "/garrafasCopos/garrafa-01.jpeg",
      "/garrafasCopos/garrafa-02.jpeg",
      "/garrafasCopos/garrafa-03.jpeg",
      "/garrafasCopos/copo-01.jpeg",
    ],
    descricao: "Garrafas e copos personalizados.",
  },
  {
    id: 6,
    slug: "lembrancas",
    nome: "Lembranças",
    imagemCapa: [
      "/lembrancas/lembrancas-01.jpeg",
      "/lembrancas/lembrancas-02.jpeg",
      "/lembrancas/lembrancas-03.jpeg",
      "/lembrancas/lembrancas-04.jpeg",
    ],
    descricao: "Lembranças personalizadas para todas as ocasiões.",
  },
  {
    id: 7,
    slug: "empresarial",
    nome: "Empresarial",
    imagemCapa: [
      "/empresarial/empresarial-01.jpeg",
      "/empresarial/empresarial-02.jpeg",
      "/empresarial/empresarial-03.jpeg",
      "/empresarial/empresarial-04.jpeg",
    ],
    descricao: "Itens de papelaria personalizados para empresas.",
  },
  {
    id: 8,
    slug: "aniversarios",
    nome: "Aniversários",
    imagemCapa: [
      "/aniversarios/aniversario-01.jpeg",
      "/aniversarios/aniversario-02.jpeg",
      "/aniversarios/aniversario-03.jpeg",
      "/aniversarios/aniversario-04.jpeg",
    ],
    descricao: "Itens de papelaria personalizados para aniversários.",
  },
  {
    id: 9,
    slug: "encadernacao",
    nome: "Encadernação",
    imagemCapa: [
      "/encadernacao/encadernacao-01.jpeg",
      "/encadernacao/encadernacao-02.jpeg",
      "/encadernacao/encadernacao-03.jpeg",
      "/encadernacao/encadernacao-04.jpeg",
      "/encadernacao/encadernacao-05.jpeg",
    ],
    descricao: "Encadernação de alta qualidade para seus projetos.",
  },
];

export function encontrarIndiceProdutoPorIdentificador(identificador) {
  if (!identificador) return -1;
  const termoLimpo = gerarSlug(identificador);
  return listaDeProdutos.findIndex(
    (p) =>
      p.slug === termoLimpo ||
      String(p.id) === String(identificador).trim() ||
      gerarSlug(p.nome) === termoLimpo
  );
}

export default listaDeProdutos;