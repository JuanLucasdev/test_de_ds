Feature: Gerar resposta com IA

Scenario: Gerar uma resposta válida da função gerar_resposta
Given uma lista de mensagens válidas para a IA
When a função gerar_resposta é chamada
Then a resposta deve conter o texto "Resposta simulada"

Scenario: Gerar uma resposta com erro na API
Given uma chamada que irá causar erro na IA
When a função gerar_resposta é chamada
Then a resposta deve conter "Erro ao gerar a resposta"
