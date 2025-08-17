from behave import given, when, then
from unittest.mock import patch, MagicMock
from gerar import gerar_resposta

@given("uma lista de mensagens válidas para a IA")
def step_given_mensagens_validas(context):
context.messages = [{"role": "user", "content": "Qual é a capital da França?"}]
context.mock = patch("gerar.client").start()
mock_completion = MagicMock()
mock_completion.choices = [MagicMock(message=MagicMock(content="Resposta simulada"))]
context.mock.chat.completions.create.return_value = mock_completion

@given("uma chamada que irá causar erro na IA")
def step_given_erro_na_ia(context):
context.messages = [{"role": "user", "content": "Teste"}]
context.mock = patch("gerar.client").start()
context.mock.chat.completions.create.side_effect = Exception("Erro de API")

@when("a função gerar_resposta é chamada")
def step_when_chama_funcao(context):
context.resposta = gerar_resposta(context.messages)

@then('a resposta deve conter o texto "Resposta simulada"')
def step_then_resposta_valida(context):
assert "Resposta simulada" in context.resposta
context.mock.stop()

@then('a resposta deve conter "Erro ao gerar a resposta"')
def step_then_resposta_erro(context):
assert "Erro ao gerar a resposta" in context.resposta
assert "Erro de API" in context.resposta
context.mock.stop()
