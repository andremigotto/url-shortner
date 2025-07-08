
# Brev.ly - URL Shortener API

API para encurtamento de URLs, desenvolvida como desafio da Fase 1 do programa da Rocketseat.

## ✨ Tecnologias

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Fastify](https://fastify.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [Cloudflare R2 (CDN)](https://developers.cloudflare.com/r2/)
- [Doppler (Env Secrets)](https://www.doppler.com/)
- [Docker](https://www.docker.com/)

## 📦 Instalação

### Pré-requisitos

- Node.js >= 18
- pnpm (`npm i -g pnpm`)
- PostgreSQL local ou via Docker

### Clone o projeto

```bash
git clone https://github.com/seu-usuario/brevly-server.git
cd brevly-server
```

### Variáveis de ambiente

Copie o `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite as variáveis conforme necessário.

### Instalação de dependências

```bash
pnpm install
```

### Migrations (criar tabelas)

```bash
pnpm db:migrate
```

---

## 🚀 Rodando o servidor

### Em ambiente de desenvolvimento

```bash
pnpm dev
```

O servidor estará acessível em `http://localhost:3333`.

---

## 🐳 Usando com Docker + Doppler

1. Crie um projeto no [Doppler](https://dashboard.doppler.com/)
2. Adicione todas as variáveis de ambiente
3. Gere seu token em **Project > Access > Service Token**
4. Rode o container:

```bash
docker build -t brevly-server .
docker run -p 3333:3333 -e DOPPLER_TOKEN=seu_token_aqui brevly-server
```

---

## ✅ Funcionalidades

- [x] Criar link encurtado
- [x] Slug customizável e validado
- [x] Evitar duplicação de slug
- [x] Redirecionamento pela URL encurtada
- [x] Contador de cliques
- [x] Listagem de todos os links
- [x] Exportar links em CSV
  - [x] CSV acessível via CDN (Cloudflare R2)
  - [x] Arquivo com nome aleatório e único
  - [x] Campos: original URL, slug, cliques e data de criação
- [x] Deletar link
- [x] Performático mesmo com muitos registros

---

## 🧪 Exemplo de Requisições

### Criar link

```http
POST /links
Content-Type: application/json

{
  "originalUrl": "https://rocketseat.com.br",
  "slug": "rocketseat"
}
```

### Obter URL original

```http
GET /rocketseat
```

### Exportar links

```http
GET /links/export
```

---

## 📁 Estrutura

```
src/
├── env.ts
├── server.ts
├── app.ts
├── routes/
├── utils/
└── infra/
    └── db/
        ├── schemas/
        ├── client.ts
        └── migrations/
```

---

## 📝 Licença

Projeto com fins educacionais. Desenvolvido para o desafio da Rocketseat.
