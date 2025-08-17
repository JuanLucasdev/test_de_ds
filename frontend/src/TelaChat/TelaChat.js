import React, { useState } from 'react';
import ChatInterface from '../componentes/ChatInterface/ChatInterface';
import styles from './TelaChat.module.css';
import Barra from '../componentes/Barra/Barra';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function TelaChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cronograma_output, estudoData } = location.state || {};

  const [salvo, setSalvo] = useState(false);
  const [todasAsMensagens, setTodasAsMensagens] = useState([]);

  const salvarCronograma = async () => {
    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
      alert('Usuário não autenticado. Faça login novamente.');
      navigate('/login');
      return;
    }

    if (!cronograma_output || !estudoData) {
      alert('Dados do cronograma ou estudo estão ausentes. Gere um novo cronograma.');
      navigate('/gerar');
      return;
    }

    // Seleciona apenas a última mensagem do array
    const ultimaMensagem = todasAsMensagens[todasAsMensagens.length - 1];
    const textoCompleto = ultimaMensagem
      ? `${ultimaMensagem.role === 'user' ? 'Usuário' : 'Assistente'}: ${ultimaMensagem.content}`
      : '';

    const cronograma_data = {
      nome: `Cronograma - ${estudoData.disciplinas || 'Estudo'}`,
      descricao: textoCompleto,
      user_id: parseInt(user_id),
    };

    console.log('Enviando cronograma:', cronograma_data);

    try {
      const response = await fetch('http://localhost:8000/salvar-cronograma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cronograma_data),
      });

      if (response.ok) {
        const data = await response.json();
        setSalvo(true);
        alert(`Cronograma salvo com sucesso! ID: ${data.id}`);
      } else {
        const erro = await response.json();
        alert(`Erro ao salvar: ${erro.detail || 'Erro desconhecido'}`);
      }
    } catch (error) {
      alert('Erro ao salvar cronograma. Verifique sua conexão.');
    }
  };

  return (
    <div className={styles.telaChatWrapper}>
      <Barra />
      <div className={styles.chatHeader}>
        <Link to="/" className={styles.backButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" />
          </svg>
        </Link>
        <h2 className={styles.chatTitle}>Chat</h2>
        <button onClick={salvarCronograma} className={styles.salvarButton}>Salvar</button>
      </div>

      <div className={styles.chatWindow}>
        <ChatInterface
          initialOutput={cronograma_output}
          estudoData={estudoData}
          onMessagesChange={setTodasAsMensagens}
        />
      </div>
    </div>
  );
}

export default TelaChat;