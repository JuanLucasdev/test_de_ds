Feature: Gerar cronograma de estudos

  Scenario: O usuário envia horários e disciplinas e recebe um cronograma
    Given o servidor da API está rodando em "http://localhost:8000"
    When eu envio um JSON válido com horários e disciplinas
    Then a resposta deve conter status 200
    And o campo "cronograma" deve estar presente na resposta

