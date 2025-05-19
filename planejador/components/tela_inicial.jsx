import "../src/App.css";

function TelaInicial({ setTelaAtual }) {
  return (
    <div className="incializer">
      <h1>Organize seu aprendizado</h1>
      <p>Um planejador de estudos que ajuda você a mapear conteúdos e estabelecer metas.</p>
      <button className="button_1" onClick={() => setTelaAtual("aprender-mais")}>
        Aprender mais
      </button>
      <button className="button_2" onClick={() => setTelaAtual("comecar-agora")}>
        Começar agora
      </button>
    </div>
  );
}

export default TelaInicial;