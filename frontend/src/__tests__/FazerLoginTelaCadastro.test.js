import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {MemoryRouter , Routes, Route} from 'react-router-dom';
import App from '../App';
import TelaCadastro from '../TelaCadastro/TelaCadastro';
import TelaLogin from "../TelaLogin/TelaLogin";

describe('Teste passagem de tela do botão Já possui uma conta? Faça login agora da tela de cadastro', () => {
    test('clicar no botão "Já possui uma conta? Faça login agora" e ir para a página da tela de login', async () => {

        render(
            <MemoryRouter initialEntries={['/TelaCadastro']}>
                <Routes>
                    <Route path='/' element={<App />}></Route>
                    <Route path='/TelaCadastro' element={<TelaCadastro />}></Route>
                    <Route path='/TelaLogin' element={<TelaLogin />}></Route>
                </Routes>
            </MemoryRouter>
        );
        
            <TelaCadastro />
    


        // Vendo de a tela de cadastro está aparecendo
        expect(screen.getByText(/Olá, registre-se/i)).toBeInTheDocument();
        expect(screen.getByText(/para começar!/i)).toBeInTheDocument();

        //Pressionando o botão cadastrar
        const BotaoFazerLogin = screen.getByTestId('Fazerlogin');
        fireEvent.click(BotaoFazerLogin);

        //Esperando a passagem de tela e vendo se o texto correto está sendo exibido
        await waitFor(() => {
            expect(screen.getByText(/Bem-vindo de volta!/i)).toBeInTheDocument();
            expect(screen.getByText(/E-mail/i)).toBeInTheDocument();
            expect(screen.getByText(/Senha/i)).toBeInTheDocument();
        });

        //Vendo se conteúdo da página de cadastro não está mais aparecendo
        expect(screen.queryByText(/Olá, registre-se/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/para começar!/i)).not.toBeInTheDocument();
  });
});
