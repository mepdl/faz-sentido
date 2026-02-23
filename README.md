# Faz Sentido - Aplicação Web

Este projeto é uma aplicação web fullstack utilizando React (Frontend), Node.js/Express (Backend) e PostgreSQL (Supabase).

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20 ou superior recomendada)
- [NPM](https://www.npmjs.com/) (geralmente vem com o Node.js)
- Conta no [Supabase](https://supabase.com/)

## Configuração Inicial

1.  **Clone o repositório** (se ainda não o fez).

2.  **Instale as dependências**:
    Abra o terminal na pasta raiz do projeto e execute:
    ```bash
    npm install
    ```

3.  **Configuração do Ambiente**:
    Verifique se o arquivo `.env` foi criado na raiz do projeto com as credenciais do Supabase. Se não, crie-o usando o modelo abaixo e preencha com seus dados do painel do Supabase:

    ```env
    DATABASE_URL=postgresql://postgres:[SUA-SENHA]@[SEU-PROJETO].supabase.co:5432/postgres
    SUPABASE_URL=https://[SEU-PROJETO].supabase.co
    SUPABASE_ANON_KEY=[SUA-CHAVE-ANON]
    SUPABASE_SERVICE_ROLE_KEY=[SUA-CHAVE-SERVICE-ROLE]
    SESSION_SECRET=sua-chave-secreta-aleatoria
    NODE_ENV=development
    ```

4.  **Configuração do Banco de Dados**:
    Para criar as tabelas no seu banco de dados Supabase, execute:
    ```bash
    npm run db:push
    ```
    Isso aplicará o schema definido no projeto ao seu banco de dados remoto.

## Executando a Aplicação

Para iniciar o servidor de desenvolvimento (Frontend + Backend):

```bash
npm run dev
```

A aplicação estará acessível em: `http://localhost:5000`

## Estrutura do Projeto

- **/client**: Código fonte do Frontend (React)
- **/server**: Código fonte do Backend (Express)
- **/shared**: Código compartilhado (Schemas, Tipos)
- **drizzle.config.ts**: Configuração do ORM Drizzle
- **vite.config.ts**: Configuração do Vite

## Comandos Disponíveis

- `npm run dev`: Inicia o ambiente de desenvolvimento.
- `npm run build`: Compila a aplicação para produção.
- `npm start`: Inicia a aplicação compilada (produção).
- `npm run db:push`: Sincroniza o schema local com o banco de dados remoto.
