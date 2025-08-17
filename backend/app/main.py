import threading
import time
import schedule
from fastapi import FastAPI, HTTPException, status, Depends, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import json
import re
import unicodedata
from database.database import baixar_banco, subir_banco, Base, engine, get_session
from database.models import User, Cronograma
from database.schemas import UserSchema
from gerar import gerar_resposta
from typing import Optional

# Inicializa app FastAPI
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ajuste conforme seu domínio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

def agendador():
    schedule.every(5).minutes.do(subir_banco)
    while True:
        schedule.run_pending()
        time.sleep(1)


@app.on_event("startup")
async def startup_event():
    baixar_banco()
    thread = threading.Thread(target=agendador, daemon=True)
    thread.start()

def normalizar(texto):
    return ''.join(
        c for c in unicodedata.normalize('NFD', texto.lower())
        if unicodedata.category(c) != 'Mn'
    )

def obter_contexto_cronograma():
    return (
        "cronograma gerado>>\n"
        "Segunda: <horario>: <atividade>\n" 
        "Segunda: <horario>: <atividade>\n"
        "Terça: <horario>: <atividade>\n"
        "Terça: <horario>: <atividade>\n"
        "Quarta: <horario>: <atividade>\n"
        "Quarta: <horario>: <atividade>\n"
    )

def parse_cronograma_texto(texto):
    dias = {
        "segunda": [],
        "terca": [],
        "quarta": [],
        "quinta": [],
        "sexta": [],
        "sabado": [],
        "domingo": []
    }

    padrao = r"(?i)(segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo)\s*:\s*(\d{1,2}[:h]\d{2})\s*:\s*(.+)"
    linhas = texto.strip().splitlines()

    for linha in linhas:
        match = re.match(padrao, linha.strip())
        if match:
            dia_raw, horario, descricao = match.groups()
            dia = normalizar(dia_raw)
            if dia == "terça":
                dia = "terca"
            if dia == "sábado":
                dia = "sabado"
            if dia in dias:
                dias[dia].append({
                    "horario": horario.strip(),
                    "descricao": descricao.strip()
                })

    return dias



class EstudoInput(BaseModel):
    segunda: str
    terca: str
    quarta: str
    quinta: str
    sexta: str
    sabado: str
    domingo: str
    disciplinas: str
    observacoes: str

class UserInfo(BaseModel):
    nome: str
    email: str
    senha: str
    confirmacao: str

class LoginInput(BaseModel):
    email: str
    senha: str

class CronogramaInput(BaseModel):
    nome: str
    segunda: Optional[str] = None
    terca: Optional[str] = None
    quarta: Optional[str] = None
    quinta: Optional[str] = None
    sexta: Optional[str] = None
    user_id: int

class ChatInput(BaseModel):
    mensagem: str
    cronograma_inicial: str

# === ENDPOINTS ===

@app.get("/cronogramas/ultimo")
def get_ultimo_cronograma(user_id: int, db: Session = Depends(get_session)):
    cronograma = (
        db.query(Cronograma)
        .filter(Cronograma.user_id == user_id)
        .order_by(Cronograma.id.desc())
        .first()
    )
    if not cronograma:
        raise HTTPException(status_code=404, detail="Nenhum cronograma encontrado.")

    def carregar_json(campo):
        try:
            return json.loads(campo) if campo else []
        except:
            return []

    return {
        "Segunda-feira": carregar_json(cronograma.segunda),
        "Terça-feira": carregar_json(cronograma.terca),
        "Quarta-feira": carregar_json(cronograma.quarta),
        "Quinta-feira": carregar_json(cronograma.quinta),
        "Sexta-feira": carregar_json(cronograma.sexta),
    }

@app.post("/cadastro")
def cadastro(info: UserInfo, db: Session = Depends(get_session)):
    if info.senha != info.confirmacao:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Senhas diferentes")

    if db.query(User).filter(User.email == info.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email já cadastrado")

    if db.query(User).filter(User.nome == info.nome).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nome já cadastrado")

    novo_usuario = User(nome=info.nome, email=info.email, senha=info.senha)
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return {"email": novo_usuario.email, "mensagem": "Cadastro bem-sucedido"}

@app.post("/login")
def login(info: LoginInput, db: Session = Depends(get_session)):
    usuario = db.query(User).filter(User.email == info.email).first()
    if not usuario or usuario.senha != info.senha:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email ou senha incorretos")

    return {"id": usuario.id, "email": usuario.email, "mensagem": "Login bem-sucedido"}

@app.post("/gerar-cronograma")
def gerar_cronograma(estudo: EstudoInput, db: Session = Depends(get_session)):
    mensagem = f"""
    O usuário tem os seguintes horários disponíveis para estudar:
    Segunda: {estudo.segunda}
    Terça: {estudo.terca}
    Quarta: {estudo.quarta}
    Quinta: {estudo.quinta}
    Sexta: {estudo.sexta}
    Sábado: {estudo.sabado}
    Domingo: {estudo.domingo}

    Disciplinas: {estudo.disciplinas}
    Observações: {estudo.observacoes}

    Crie um cronograma personalizado com técnica Pomodoro (25min estudo + pausas),
    distribuindo as disciplinas equilibradamente.
    Responda **somente** no formato a seguir:
    {obter_contexto_cronograma()}
    """
    resposta = gerar_resposta([{"role": "user", "content": mensagem}])

    dados = parse_cronograma_texto(resposta)

    novo_cronograma = Cronograma(
        nome="Cronograma gerado",
        segunda=json.dumps(dados["segunda"], ensure_ascii=False),
        terca=json.dumps(dados["terca"], ensure_ascii=False),
        quarta=json.dumps(dados["quarta"], ensure_ascii=False),
        quinta=json.dumps(dados["quinta"], ensure_ascii=False),
        sexta=json.dumps(dados["sexta"], ensure_ascii=False),
        user_id=1  
    )
    db.add(novo_cronograma)
    db.commit()
    db.refresh(novo_cronograma)

    return {"cronograma": resposta, "dados": dados}

@app.post("/salvar-cronograma")
def salvar_cronograma(cronograma: dict = Body(...), db: Session = Depends(get_session)):
    user_id = cronograma.get("user_id")
    nome = cronograma.get("nome", "Cronograma")
    descricao = cronograma.get("descricao", "")

    if not user_id or not descricao:
        raise HTTPException(status_code=400, detail="Dados incompletos")

    dados_dias = parse_cronograma_texto(descricao)

    novo_cronograma = Cronograma(
        nome=nome,
        user_id=user_id,
        segunda=json.dumps(dados_dias.get("segunda", []), ensure_ascii=False),
        terca=json.dumps(dados_dias.get("terca", []), ensure_ascii=False),
        quarta=json.dumps(dados_dias.get("quarta", []), ensure_ascii=False),
        quinta=json.dumps(dados_dias.get("quinta", []), ensure_ascii=False),
        sexta=json.dumps(dados_dias.get("sexta", []), ensure_ascii=False),
    )

    db.add(novo_cronograma)
    db.commit()
    db.refresh(novo_cronograma)

    return {
        "id": novo_cronograma.id,
        "nome": novo_cronograma.nome,
        "mensagem": "Cronograma salvo com sucesso",
        "dados": dados_dias
    }

@app.get("/cronogramas/{user_id}")
def listar_cronogramas(user_id: int, db: Session = Depends(get_session)):
    usuario = db.query(User).filter(User.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

    cronogramas = db.query(Cronograma).filter(Cronograma.user_id == user_id).all()
    return [{"id": c.id, "nome": c.nome} for c in cronogramas]

@app.post("/chat")
def conversar(chat_input: ChatInput, db: Session = Depends(get_session)):
    mensagem = chat_input.mensagem
    cronograma = chat_input.cronograma_inicial or ""
    mensagem_normalizada = normalizar(mensagem)

    palavras_chave = [
        "cronograma", "horario", "disciplinas", "estudo", "pomodoro",
        "segunda", "terca", "quarta", "quinta", "sexta"
    ]

    if not any(p in mensagem_normalizada for p in palavras_chave):
        return {"resposta": "Eu não sou feito para responder isso."}

    mensagem_completa = (
        f"Cronograma atual:\n{cronograma.strip()}\n\n"
        f"Instrução: Modifique o cronograma acima aplicando exatamente as alterações solicitadas, "
        f"mantendo a técnica Pomodoro (25min estudo + pausas). "
        f"Responda **somente** no formato a seguir:\n"
        f"{obter_contexto_cronograma()}\n\n"
        f"Solicitação do usuário: {mensagem}"
    )

    resposta_ia = gerar_resposta([{"role": "user", "content": mensagem_completa}])
    dados = parse_cronograma_texto(resposta_ia)

    return {"resposta": resposta_ia, "dados": dados}
