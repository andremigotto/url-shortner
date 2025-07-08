
# URL Shortener

Projeto completo de encurtador de URLs com backend em Node.js (Fastify + Prisma + PostgreSQL) e frontend em React + Tailwind CSS.

---

## Estrutura do Projeto

- **backend/** — API REST para criação, listagem, redirecionamento e analytics das URLs encurtadas, com documentação Swagger.
- **frontend/** — Aplicação React moderna, estilizada com Tailwind CSS, que consome a API para criar e gerenciar URLs.

---

## Tecnologias Utilizadas

- Backend:
  - Node.js
  - Fastify
  - Prisma ORM
  - PostgreSQL
  - Zod para validação
  - Swagger para documentação
- Frontend:
  - React
  - Tailwind CSS
  - Axios para chamadas HTTP
  - Vite como bundler

---

## Pré-requisitos

- Node.js >= 18
- PostgreSQL instalado e rodando
- pnpm ou npm

---

## Configuração e Execução

### Backend

1. Entre na pasta backend:

   ```bash
   cd backend
   ```

2. Instale as dependências:

   ```bash
   pnpm install
   ```

3. Configure as variáveis de ambiente:

   - Crie um arquivo `.env` com as variáveis:

     ```
     DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/url_shortener
     BASE_URL=http://localhost:3333
     NODE_ENV=development
     ```

4. Rode as migrações do banco de dados:

   ```bash
   pnpm prisma migrate dev
   ```

5. Inicie o servidor:

   ```bash
   pnpm run dev
   ```

6. A API estará disponível em: `http://localhost:3333`

7. A documentação Swagger pode ser acessada em: `http://localhost:3333/docs`

---

### Frontend

1. Entre na pasta frontend:

   ```bash
   cd frontend
   ```

2. Instale as dependências:

   ```bash
   pnpm install
   ```

3. Inicie a aplicação React:

   ```bash
   pnpm run dev
   ```

4. A aplicação estará disponível em: `http://localhost:5173`

---

## Testes

- Para rodar os testes no backend:

  ```bash
  cd backend
  pnpm run test
  ```

---

## Observações

- Certifique-se que o backend está rodando antes de iniciar o frontend para que as chamadas API funcionem corretamente.
- Utilize o arquivo `.env.test` para ambiente de testes (backend).
- O frontend consome a API diretamente pelo endereço configurado (ex: `http://localhost:3333`).
