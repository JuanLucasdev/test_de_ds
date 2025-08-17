import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('Teste passagem de tela do botão Primeira vez por aqui? Faça seu cadastro da tela de login', () => {
    test('clicar em "Primeira vez por aqui? Faça seu cadastro" e ir para a tela de cadastro', async () => {
        render(<App />);

        // Vendo de a tela de login está aparecendo
        expect(screen.getByText(/Bem-vindo de volta!/i)).toBeInTheDocument();
        expect(screen.getByText(/E-mail/i)).toBeInTheDocument();
        expect(screen.getByText(/Senha/i)).toBeInTheDocument();

        //Pressionando o botão entrar
        const BotaoFazerCadastro = screen.getByTestId('FazerCadastro');
        fireEvent.click(BotaoFazerCadastro);

        //Esperando a passagem de tela e vendo se o texto correto está sendo exibido
        await waitFor(() => {
            expect(screen.getByText(/Olá, registre-se/i)).toBeInTheDocument();
            expect(screen.getByText(/para começar!/i)).toBeInTheDocument();
            expect(screen.getByText(/Nome/i)).toBeInTheDocument();
            expect(screen.getByText(/E-mail/i)).toBeInTheDocument();
            expect(screen.getByText(/Confirme sua senha/i)).toBeInTheDocument();

        });

        //Vendo se conteúdo da página de login não está mais aparecendo
        expect(screen.queryByText(/Bem-vindo de volta!/i)).not.toBeInTheDocument();
    });
});
