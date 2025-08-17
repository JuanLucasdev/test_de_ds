from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",
)

def gerar_resposta(messages):
    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "http://localhost",
                "X-Title": "Assistente de Estudo",
            },
            model="google/gemini-2.0-flash-001",
            messages=messages
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Erro ao gerar a resposta: {str(e)}"
