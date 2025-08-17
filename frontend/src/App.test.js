import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('Teste da inicialização na tela inicial', () => {
    test('Verificar se os textos da tela de login estão impressos na tela', async () => {
        render(<App />);

        // Vendo de a tela de login está aparecendo
        expect(screen.getByText(/Bem-vindo de volta!/i)).toBeInTheDocument();
        expect(screen.getByText(/E-mail/i)).toBeInTheDocument();
        expect(screen.getByText(/Senha/i)).toBeInTheDocument();

    });
});

