# Brev.ly - Encurtador de URLs

Brev.ly é uma aplicação fullstack para encurtar links, exportar para CSV e acompanhar cliques. Utiliza Fastify no backend e React + TanStack Form/Query no frontend.

## 🧩 Tecnologias

### Backend
- [Fastify](https://fastify.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [SQLite](https://www.sqlite.org/)
- [Zod](https://github.com/colinhacks/zod)
- [AWS SDK (S3 compatible)](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/)
- Cloudflare R2

### Frontend
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TanStack Form](https://tanstack.com/form)
- [TanStack Query](https://tanstack.com/query)
- [Phosphor Icons](https://phosphoricons.com/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- [Radix UI Scroll Area](https://www.radix-ui.com/primitives/docs/components/scroll-area)
- Tailwind CSS

---

## ⚙️ Backend

### Rotas

#### `POST /links`
Cria um novo link encurtado.

**Body:**

```json
{
  "originalUrl": "https://rocketseat.com.br",
  "slug": "meu-link"
}
```

#### `GET /links`
Lista todos os links.

#### `DELETE /links/:slug`
Remove um link.

#### `POST /links/export`
Gera um arquivo `.csv` com os links e retorna a URL de download hospedada na R2.

**Response:**
```json
{
  "url": "https://cloudflare-r2.../arquivo.csv"
}
```

#### `GET /:slug`
Redireciona para o link original e incrementa o contador de cliques.

### Configurações `.env`

```env
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_ACCESS_KEY_ID=...
CLOUDFLARE_SECRET_ACCESS_KEY=...
CLOUDFLARE_BUCKET=...
CLOUDFLARE_PUBLIC_URL=https://<bucket>.r2.cloudflarestorage.com
```

---

## 💻 Frontend

### Scripts

```bash
pnpm install
pnpm dev
```

### Configuração

Defina o endpoint da API no arquivo `.env` do frontend:

```env
VITE_API_URL=http://localhost:3333
VITE_APP_URL=http://localhost:5173
```

---

## 📁 Estrutura de Pastas

- `backend/` - Código Fastify e rotas
- `web/` - Aplicação React
- `tmp/` - Armazenamento temporário dos arquivos CSV

---

## 🔁 Fluxo de funcionamento

1. Usuário cadastra um link no frontend.
2. O backend armazena no banco e gera slug.
3. O frontend atualiza automaticamente a listagem.
4. Exportações geram arquivos em `.csv` hospedados na R2.
5. Slugs redirecionam e contabilizam os cliques.

---

## 🧪 Teste a API

Você pode testar diretamente no Swagger:

```
http://localhost:3333/docs
```

---

## 🚀 Deploy
> O backend é compatível com qualquer provedor Node.js que suporte Fastify (Railway, Vercel Serverless, etc). A R2 é usada como CDN para os arquivos CSV.

---

Desenvolvido com 💜 para a Rocketseat Pós-Graduação.
