export function redirecionarParaWhatsApp(interesse) {
  const numeroContato = "5518996905636"; 
  const textoMensagem = `Olá, CJ Personalizados! Vim pelo site e gostaria de saber mais sobre: ${interesse}`;
  const textoCodificado = encodeURIComponent(textoMensagem);
  window.open(`https://wa.me/${numeroContato}?text=${textoCodificado}`, '_blank');
}