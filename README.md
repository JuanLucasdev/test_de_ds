Cronograma de Estudos – Técnica Pomodoro

Este projeto é uma aplicação fullstack para gerenciamento de cronogramas de estudo baseados na técnica Pomodoro.

A aplicação permite:
✅ Criar usuários
✅ Criar e listar cronogramas por usuário
✅ Exibir cronogramas organizados por dias da semana
✅ Utilizar um parser de Markdown para formatar os cronogramas

Tecnologias Utilizadas
Backend

FastAPI – Framework para construção de APIs

SQLAlchemy – ORM para modelagem do banco de dados

SQLite – Banco de dados (pode ser trocado por PostgreSQL, MySQL etc.)

Frontend

React – Biblioteca para construção da interface

Axios – Cliente HTTP para consumir a API

React Markdown – Renderização do cronograma em Markdown                                                                                                                                                                            
Backend (FastAPI)


⚙️ Como Rodar o Projeto
Clone o repositório:

git clone 
cd cronograma-pomodoro/backend


Crie um ambiente virtual:

python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows


Instale as dependências:

pip install -r requirements.txt


Rode a API:

uvicorn main:app --reload


Acesse a documentação automática:

Swagger: http://127.0.0.1:8000/docs

Redoc: http://127.0.0.1:8000/redoc

Frontend (React)

Vá para a pasta do frontend:

cd ../frontend

Instale as dependências:

npm install

Rode o servidor de desenvolvimento:

npm start

Acesse em:
http://localhost:3000
