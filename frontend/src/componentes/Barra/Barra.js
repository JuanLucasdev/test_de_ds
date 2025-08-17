import { Link, useNavigate } from "react-router-dom";
import styles from './Barra.module.css';

const Barra = () => {
    const navigate = useNavigate();
    const handleLogo = () => {
        navigate('/TelaLogin');
    };
    
    return (
        <nav className={`${styles.Barra}`}>
            <div>
                <button className={`${styles.botao_logo}`} onClick={handleLogo}>
                    <img src="/Logo-fundo-transparente.png" alt="Logo do FocusMe em fundo transparente" className={`${styles.logo}`}/>
                </button>
            </div>
            <ul className="flex flex-row gap-10 pointer">
                <li className={`${styles.caixa_botoes}`}>
                    <Link to="/inicio" className={`${styles.texto_botoes}`}>Inicio</Link>
                </li>
                <li className={`${styles.caixa_botoes}`}>
                    <Link to="/novocronograma" className={`${styles.texto_botoes}`}>Cronograma</Link>
                </li>
                <li className={`${styles.caixa_botoes}`}>
                    <Link to="/chat" className={`${styles.texto_botoes}`}>Chat</Link>
                </li>
                <li className={`${styles.caixa_botoes}`}>
                    <Link to="/perfil" className={`${styles.texto_botoes}`}>Perfil</Link>
                </li>
                <li className={`${styles.caixa_botoes}`}>
                    <Link to="/vercronograma" className={`${styles.texto_botoes}`}>Ver Cronograma</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Barra;