import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('Teste passagem de tela do botão Entrar da tela de login', () => {
    test('clicar no botão "Entrar" e ir para a página da tela de novo cronograma', async () => {
        render(<App />);

        // Vendo de a tela de login está aparecendo
        expect(screen.getByText(/Bem-vindo de volta!/i)).toBeInTheDocument();
        expect(screen.getByText(/E-mail/i)).toBeInTheDocument();
        expect(screen.getByText(/Senha/i)).toBeInTheDocument();

        //Pressionando o botão entrar
        const BotaoEntrar = screen.getByTestId('Entrar');
        fireEvent.click(BotaoEntrar);

        //Esperando a passagem de tela e vendo se o texto correto está sendo exibido
        await waitFor(() => {
        expect(screen.getByText(/Crie seu cronograma de estudos personalizado/i)).toBeInTheDocument();
        });

        //Vendo se conteúdo da página de login não está mais aparecendo
        expect(screen.queryByText(/Bem-vindo de volta!/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/E-mail/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Senha/i)).not.toBeInTheDocument();
  });
});
