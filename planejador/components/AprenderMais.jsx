import "../src/App.css";

function AprenderMais({ setTelaAtual }) {
  return (
    <div className="incializer">
      <h1>Aprender Mais</h1>
      <p>Informações detalhadas sobre o planejador de estudos.</p>
      <button className="button_1" onClick={() => setTelaAtual("inicial")}>Voltar</button>
    </div>
  );
}

export default AprenderMais;