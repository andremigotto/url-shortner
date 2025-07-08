# Brev.ly - Encurtador de URLs

Aplicação **Fullstack** para encurtamento de URLs com dashboard de links e exportação CSV.

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Fastify + TypeScript + Drizzle ORM + PostgreSQL
- **Cloud Storage**: Cloudflare R2
- **Deploy**: Local com Docker ou Node.js
- **Env Manager**: Doppler

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- pnpm
- Doppler CLI
- PosgreSQL (docker-compose)
- Docker (opcional)

---

## ▶️ Execução

### 1. Variáveis de Ambiente

Use o [Doppler](https://docs.doppler.com/docs/install-cli) para gerenciar variáveis de ambiente:

### 2. Rodar Backend
```bash
Instale as dependências
- pnpm install

Configure suas variáveis de ambiente em .env
- cp .env.example .env

Rode as migrations para criar as tabelas no banco
- pnpm db:migrate

Inicie o servidor de desenvolvimento
- pnpm dev

Backend disponível em: `http://localhost:3333`
```

### 3. Rodar Frontend

```bash
cd web
pnpm install
pnpm dev
```

Frontend disponível em: `http://localhost:5173`

---

## 🧪 Rotas HTTP

### 🔗 Links

| Método | Rota              | Descrição                            |
|--------|-------------------|--------------------------------------|
| POST   | `/links`          | Cria um link encurtado               |
| GET    | `/links`          | Lista todos os links                 |
| GET    | `/:slug`          | Redireciona para URL original        |
| DELETE | `/links/:slug`    | Deleta um link encurtado             |
| POST   | `/links/export`   | Exporta os links em formato CSV      |

---

## 💡 Observações

- Todos os links encurtados são acessíveis via: `http://localhost:3333/:slug`
- O frontend usa `brev.ly/:slug` como visualização, mas o redirecionamento real ocorre no backend.
- O botão "Baixar CSV" gera um arquivo `.csv` hospedado via Cloudflare R2.

---

## 📂 Estrutura de Pastas

```
brevly/
├── server/
│   ├── routes/
│   ├── infra/
│   └── utils/
├── web/
│   ├── components/
│   ├── queries/
│   └── types/
```

---
