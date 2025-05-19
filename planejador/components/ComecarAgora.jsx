import "../src/App.css";

function ComecarAgora({ setTelaAtual }) {
  return (
    <div className="incializer">
      <h1>Começar Agora</h1>
      <p>Bem-vindo ao planejador! Comece a organizar seus estudos.</p>
      <button className="button_2" onClick={() => setTelaAtual("inicial")}>Voltar</button>
    </div>
  );
}

export default ComecarAgora;