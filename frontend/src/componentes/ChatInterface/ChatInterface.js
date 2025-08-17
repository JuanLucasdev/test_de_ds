// src/componentes/ChatInterface/ChatInterface.js
import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInterface.module.css';

const ChatInterface = ({ initialOutput, estudoData, onMessagesChange }) => {
  const messageAreaRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  const getInitialMessages = () => {
    const messages = [];

    messages.push({
      role: 'assistant',
      content: 'Olá! Sou o assistente do FocusMe. Como posso te ajudar a organizar seus estudos hoje?',
      timestamp: new Date(),
    });

    if (initialOutput && estudoData) {
      messages.push({
        role: 'user',
        content: `Ok, por favor, gere um cronograma para as seguintes matérias: ${estudoData.disciplinas}.`,
        timestamp: new Date(),
      });

      messages.push({
        role: 'assistant',
        content: initialOutput,
        timestamp: new Date(),
      });
    }

    return messages;
  };

  const [messages, setMessages] = useState(getInitialMessages);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // 🔁 Notifica o componente pai sempre que as mensagens mudam
  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensagem: userMessage.content,
          cronograma_inicial: initialOutput
        }),
      });

      if (!response.ok) throw new Error('Erro ao consultar o servidor');

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.resposta,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Erro ao me comunicar com o servidor. Tente novamente mais tarde.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className={styles.chatInterface}>
      <div className={styles.messageArea} ref={messageAreaRef}>
        {messages.map((msg, index) => {
          const showDateSeparator =
            index === 0 ||
            new Date(messages[index - 1].timestamp).toDateString() !==
              new Date(msg.timestamp).toDateString();

          return (
            <React.Fragment key={index}>
              {showDateSeparator && (
                <div className={styles.dateSeparator}>
                  <span>
                    {new Date(msg.timestamp).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              <div className={`${styles.message} ${styles[msg.role]}`}>
                <p>{msg.content}</p>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <form onSubmit={handleSendMessage} className={styles.inputArea}>
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.messageInput}
        />
        <button type="submit" className={styles.sendButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
              fill="white"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
