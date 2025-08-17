import './VerCronograma.css';
import { useEffect, useState } from 'react';

function VerCronograma() {
  const [cronogramaDias, setCronogramaDias] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUltimoCronograma = async () => {
      const user_id = localStorage.getItem('user_id');
      if (!user_id) {
        setError('Usuário não autenticado. Faça login novamente.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/cronogramas/ultimo?user_id=${user_id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Nenhum cronograma encontrado. Crie um novo cronograma.');
          } else {
            throw new Error(`Erro HTTP: ${res.status} ${res.statusText}`);
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        setCronogramaDias(data);
        setLoading(false);
      } catch (err) {
        console.error('Erro detalhado:', err.message);
        setError(`Erro ao carregar o cronograma: ${err.message}`);
        setLoading(false);
      }
    };

    fetchUltimoCronograma();
  }, []);

  if (loading) {
    return (
      <div className="cronograma-container">
        <h1 className="Título">Carregando...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cronograma-container">
        <h1 className="Título">Erro</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="cronograma-container">
      <h1 className="Título">Seu cronograma de estudos</h1>
      {Object.entries(cronogramaDias).map(([dia, tarefas]) => (
        <div key={dia} className="Quadro-cronograma">
          <h2 className="Título">{dia}</h2>
          {tarefas.length > 0 ? (
            <ul className="Texto-cronograma">
              {tarefas.map((tarefa, index) => (
                <li key={`${dia}-${index}`}>
                  {tarefa.horario && <>📌 {tarefa.horario}: </>}
                  {tarefa.descricao}
                </li>
              ))}
            </ul>
          ) : (
            <p className="Texto-cronograma">Nenhuma tarefa para este dia.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default VerCronograma;
