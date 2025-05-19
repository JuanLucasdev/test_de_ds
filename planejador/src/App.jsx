import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TelaInicial from '../components/tela_inicial'
import AprenderMais from "../components/AprenderMais";
import ComecarAgora from "../components/ComecarAgora";

function App() {
  const [telaAtual, setTelaAtual] = useState("inicial");

  const renderTela = () => {
    switch (telaAtual) {
      case "inicial":
        return <TelaInicial setTelaAtual={setTelaAtual} />;
      case "aprender-mais":
        return <AprenderMais setTelaAtual={setTelaAtual} />;
      case "comecar-agora":
        return <ComecarAgora setTelaAtual={setTelaAtual} />;
      default:
        return <TelaInicial setTelaAtual={setTelaAtual} />;
    }
  };

  return <div>{renderTela()}</div>;
}

export default App;