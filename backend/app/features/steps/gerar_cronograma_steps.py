import requests
from behave import given, when, then

@given('o servidor da API está rodando em "{url}"')
def step_given_api_url(context, url):
    context.url = url + "/gerar-cronograma"

@when('eu envio um JSON válido com horários e disciplinas')
def step_when_envio_json(context):
    context.payload = {
        "segunda": "08:00-10:00",
        "terca": "10:00-12:00",
        "quarta": "14:00-16:00",
        "quinta": "16:00-18:00",
        "sexta": "08:00-10:00",
        "sabado": "Livre",
        "domingo": "Livre",
        "disciplinas": "Matemática, Física, Química",
        "observacoes": "Tenho mais dificuldade em Física."
    }
    context.response = requests.post(context.url, json=context.payload)

@then('a resposta deve conter status 200')
def step_then_status_code(context):
    assert context.response.status_code == 200

@then('o campo "cronograma" deve estar presente na resposta')
def step_then_tem_cronograma(context):
    json_data = context.response.json()
    assert "cronograma" in json_data
    assert isinstance(json_data["cronograma"], str)
    assert len(json_data["cronograma"]) > 0
