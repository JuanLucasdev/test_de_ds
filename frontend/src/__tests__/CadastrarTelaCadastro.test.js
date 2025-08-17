import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {MemoryRouter , Routes, Route} from 'react-router-dom';
import App from '../App';
import TelaCadastro from '../TelaCadastro/TelaCadastro';
import Novo from '../NovoCronograma/NovoCronograma';

describe('Teste passagem de tela do botão Cadastrar da tela de cadastro', () => {
    test('clicar no botão "Cadastrar" e ir para a página da tela de novo cronograma', async () => {

        render(
            <MemoryRouter initialEntries={['/TelaCadastro']}>
                <Routes>
                    <Route path='/' element={<App />}></Route>
                    <Route path='/TelaCadastro' element={<TelaCadastro />}></Route>
                    <Route path='/novocronograma' element={<Novo />}></Route>
                </Routes>
            </MemoryRouter>
        );
        
            <TelaCadastro />
    


        // Vendo de a tela de cadastro está aparecendo
        expect(screen.getByText(/Olá, registre-se/i)).toBeInTheDocument();
        expect(screen.getByText(/para começar!/i)).toBeInTheDocument();

        //Pressionando o botão de ir para o login
        const BotaoCadastrar = screen.getByTestId('Cadastrar');
        fireEvent.click(BotaoCadastrar);

        //Esperando a passagem de tela e vendo se o texto correto está sendo exibido
        await waitFor(() => {
            expect(screen.getByText(/Crie seu cronograma de estudos personalizado/i)).toBeInTheDocument();
        });


        
        //Vendo se conteúdo da página de cadastro não está mais aparecendo
        expect(screen.queryByText(/Olá, registre-se/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/para começar!/i)).not.toBeInTheDocument();
  });
});
