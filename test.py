from openai import OpenAI
import datetime

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",
)
def calcular_pomodoro(tempo_total):
    pomodoro_duracao = 25  
    pausa_curta = 5  
    pausa_longa = 15  
    pomodoros = tempo_total // (pomodoro_duracao + pausa_curta) 
    tempo_restante = tempo_total % (pomodoro_duracao + pausa_curta)

    # Ajusta para incluir tempo restante em um Pomodoro extra, se viável
    if tempo_restante >= pomodoro_duracao:
        pomodoros += 1

    return pomodoros, pomodoro_duracao, pausa_curta, pausa_longa

def gerar_roteiro(tempo_total, materias):
    """Gera um roteiro de estudo usando a API do OpenRouter."""
    pomodoros, pomodoro_duracao, pausa_curta, pausa_longa = calcular_pomodoro(tempo_total)

    # Prompt para o modelo gerar o roteiro
    prompt = f"""
    Você é um assistente de produtividade especializado na técnica Pomodoro. O usuário tem {tempo_total} minutos disponíveis e quer estudar as seguintes matérias/tarefas: {materias}.
    Crie um roteiro de estudo otimizado, distribuindo as matérias em {pomodoros} sessões de Pomodoro (cada uma com {pomodoro_duracao} minutos de foco e {pausa_curta} minutos de pausa curta). 
    Após 4 Pomodoros, inclua uma pausa longa de {pausa_longa} minutos. 
    Forneça um cronograma com horários (começando agora, às {datetime.datetime.now().strftime('%H:%M')}) e sugira como dividir as tarefas/materias de forma equilibrada. 
    Retorne o roteiro em formato de texto claro, com cada Pomodoro numerado, horário de início, tarefa e pausas.
    """

    # Faz a chamada à API do OpenRouter
    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "http://localhost", 
                "X-Title": "Nome-qualquer",  
            },
            extra_body={},
            model="meta-llama/llama-3.3-8b-instruct:free", 
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Erro ao gerar o roteiro: {str(e)}"

def main():
    # Solicita entrada do usuário
    try:
        tempo_total = int(input("Quantos minutos você tem disponível para estudar? (ex: 120): "))
        materias = input("Quais matérias ou tarefas você quer estudar? (ex: Matemática, História, Redação): ")
    except ValueError:
        print("Por favor, insira um número válido para o tempo.")
        return

    if tempo_total < 25:
        print("O tempo mínimo para um Pomodoro é 25 minutos. Tente novamente.")
        return

    # Gera e exibe o roteiro
    print("\nGerando seu roteiro de estudo...\n")
    roteiro = gerar_roteiro(tempo_total, materias)
    print(roteiro)

if __name__ == "__main__":
    main()