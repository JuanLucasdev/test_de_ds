<img src="assets/FocusMe-Logo.png" height="400px">

# **FocusMe**
Projeto da disciplina de Desenvolvimento de Software (2025.1) do Centro de Informática da UFPE

### **Contexto**
O projeto é uma aplicação com integração de API para inteligencia artificial generativa, e a proposta central é solucionar o problema de organização da rotina de estudos para pessoas com rotinas apertadas.

### **Equipe**
* Ádson Viana \<aav>
* Arthur Fernandes \<afol>
* Gabriel Rio \<grtc>
* Juan Lucas \<jlcm>
* Maria Amorim \<maca>
* Raul Silva \<rvas>

### **Sobre a Aplicação**

O FocusMe é um software que auxilia na organização da sua rotina de estudos com o auxílio de inteligência artificial para ajustar os melhores horários de estudos, tudo isso de maneira personalizada levando em consideração a sua rotina, disponibilidade, matérias e dificuldades. E o melhor de tudo isso é a possibilidade que o FocusMe tem de atualizar o cronograma da sua semana em tempo real, basta você enviar uma mensagem para o nosso assistente virtual, o Fábio! Entre no chat da aplicação e informe as alterações necessárias para continuar com o seu cronograma focado, funcional e atualizado para você!

### **Como Configurar o Projeto Localmente**

1. Pré-requisitos: ter instalado na máquina o [node.js](http://node.js) (pode ser baixado no site [https://nodejs.org/en](https://nodejs.org/en)), o git (pode ser baixado no site [https://git-scm.com/downloads](https://git-scm.com/downloads)) e o react (pode ser baixado e no site [https://react.dev/](https://react.dev/) ) e um editor de código
2. Clone o repositório com o comando: “git clone [https://github.com/Equipe07-DS/FocusMe.git](https://github.com/Equipe07-DS/FocusMe.git)”
3. Pelo terminal entre na pasta do backend e instale as dependências do backend pelo comando  “pip install \-r requirements.txt”
4. Em seguida, entre na pasta app e use o comando “uvicorn main:app  \--reload” (caso queira verificar se está tudo funcionando abra o navegador e coloque no endereço: “[http://localhost:8000/redoc](http://localhost:8000/redoc)”)
5. Abra outro terminal e entre na pasta do frontend e use o comando “npm install” em seguida “npm start”
