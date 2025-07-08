"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_fastify = __toESM(require("fastify"));
var import_cors = __toESM(require("@fastify/cors"));
var import_static = __toESM(require("@fastify/static"));
var import_node_path3 = __toESM(require("path"));

// src/routes/links/create-link.ts
var import_zod2 = require("zod");
var import_crypto = require("crypto");

// src/infra/db/client.ts
var import_node_postgres = require("drizzle-orm/node-postgres");
var import_pg = require("pg");

// src/env.ts
var import_zod = require("zod");
var import_config = require("dotenv/config");
var envSchema = import_zod.z.object({
  PORT: import_zod.z.coerce.number().default(3333),
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: import_zod.z.string().url(),
  CLOUDFLARE_ACCOUNT_ID: import_zod.z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: import_zod.z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: import_zod.z.string(),
  CLOUDFLARE_BUCKET: import_zod.z.string(),
  CLOUDFLARE_PUBLIC_URL: import_zod.z.string().url(),
  DEFAULT_SHORT_URL: import_zod.z.string().url()
});
var env = envSchema.parse(process.env);

// src/infra/db/schemas/links.ts
var links_exports = {};
__export(links_exports, {
  links: () => links
});
var import_pg_core = require("drizzle-orm/pg-core");
var links = (0, import_pg_core.pgTable)(
  "links",
  {
    id: (0, import_pg_core.uuid)("id").primaryKey().defaultRandom(),
    originalUrl: (0, import_pg_core.varchar)("original_url", { length: 2048 }).notNull(),
    slug: (0, import_pg_core.varchar)("slug", { length: 255 }).notNull(),
    clicks: (0, import_pg_core.integer)("clicks").notNull().default(0),
    createdAt: (0, import_pg_core.timestamp)("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [(0, import_pg_core.uniqueIndex)("slug_idx").on(table.slug)]
);

// src/infra/db/client.ts
var pool = new import_pg.Pool({
  connectionString: env.DATABASE_URL
});
var db = (0, import_node_postgres.drizzle)(pool, { schema: links_exports });
var { links: links2 } = links_exports;

// src/routes/links/create-link.ts
var import_drizzle_orm = require("drizzle-orm");
function generateSlug() {
  return (0, import_crypto.randomUUID)().slice(0, 8);
}
async function createLinkRoute(app2) {
  app2.post(
    "/links",
    async (request, reply) => {
      try {
        const bodySchema = import_zod2.z.object({
          originalUrl: import_zod2.z.string().url({ message: "URL original inv\xE1lida" }),
          slug: import_zod2.z.string().min(3, { message: "Slug deve ter pelo menos 3 caracteres" }).max(255, { message: "Slug deve ter no m\xE1ximo 255 caracteres" }).regex(/^[a-zA-Z0-9_-]+$/, {
            message: "Slug deve conter apenas letras, n\xFAmeros, h\xEDfen e underline"
          }).optional()
        });
        const { originalUrl, slug: providedSlug } = bodySchema.parse(request.body);
        const slug = providedSlug ?? generateSlug();
        const existing = await db.select().from(links2).where((0, import_drizzle_orm.eq)(links2.slug, slug));
        if (existing.length > 0) {
          return reply.status(409).send({ error: "Slug j\xE1 existe" });
        }
        await db.insert(links2).values({ originalUrl, slug });
        return reply.status(201).send({
          shortUrl: `${env.DEFAULT_SHORT_URL}/${slug}`
        });
      } catch (err) {
        if (err instanceof import_zod2.z.ZodError) {
          return reply.status(400).send({
            error: "Validation Error",
            issues: err.errors
          });
        }
        throw err;
      }
    }
  );
}

// src/routes/links/delete-link.ts
var import_zod3 = require("zod");
var import_drizzle_orm2 = require("drizzle-orm");
async function deleteLinkRoute(app2) {
  app2.delete("/links/:slug", async (request, reply) => {
    const paramsSchema = import_zod3.z.object({
      slug: import_zod3.z.string().min(1)
    });
    const { slug } = paramsSchema.parse(request.params);
    const result = await db.delete(links2).where((0, import_drizzle_orm2.eq)(links2.slug, slug)).returning();
    if (result.length === 0) {
      return reply.status(404).send({ error: "Link n\xE3o encontrado" });
    }
    return reply.status(204).send();
  });
}

// src/routes/links/get-original-url.ts
var import_zod4 = require("zod");
var import_drizzle_orm3 = require("drizzle-orm");
async function getOriginalUrlRoute(app2) {
  app2.get("/:slug", async (request, reply) => {
    const paramsSchema = import_zod4.z.object({
      slug: import_zod4.z.string().min(1)
    });
    const { slug } = paramsSchema.parse(request.params);
    const result = await db.select().from(links2).where((0, import_drizzle_orm3.eq)(links2.slug, slug));
    const link = result[0];
    if (!link) {
      return reply.status(404).send({ error: "Link n\xE3o encontrado" });
    }
    await db.update(links2).set({ clicks: link.clicks + 1 }).where((0, import_drizzle_orm3.eq)(links2.id, link.id));
    return reply.status(200).send({ originalUrl: link.originalUrl });
  });
}

// src/routes/links/list-links.ts
var import_zod5 = require("zod");
async function listLinksRoute(app2) {
  app2.get("/links", async (request, reply) => {
    const querySchema = import_zod5.z.object({
      page: import_zod5.z.coerce.number().min(1).default(1),
      perPage: import_zod5.z.coerce.number().min(1).max(100).default(10)
    });
    const { page, perPage } = querySchema.parse(request.query);
    const offset = (page - 1) * perPage;
    const result = await db.select().from(links2).orderBy(links2.createdAt).limit(perPage).offset(offset);
    return reply.send({ links: result });
  });
}

// src/utils/generate-csv.ts
var import_node_fs = __toESM(require("fs"));
var import_node_path = __toESM(require("path"));
var import_fast_csv = require("fast-csv");
var import_crypto2 = require("crypto");
async function generateCsvFile(data) {
  const fileName = `${(0, import_crypto2.randomUUID)()}.csv`;
  const filePath = import_node_path.default.resolve("src", "tmp", fileName);
  await new Promise((resolve, reject) => {
    const ws = import_node_fs.default.createWriteStream(filePath);
    const csvStream = (0, import_fast_csv.format)({ headers: true });
    csvStream.pipe(ws).on("finish", () => resolve()).on("error", reject);
    data.forEach((row) => {
      csvStream.write({
        originalUrl: row.originalUrl,
        shortUrl: `${env.DEFAULT_SHORT_URL}/${row.slug}`,
        clicks: row.clicks,
        createdAt: row.createdAt.toISOString()
      });
    });
    csvStream.end();
  });
  return filePath;
}

// src/lib/r2.ts
var import_client_s3 = require("@aws-sdk/client-s3");
var r2 = new import_client_s3.S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY
  }
});

// src/routes/links/export-csv.ts
var import_client_s32 = require("@aws-sdk/client-s3");
var import_promises = __toESM(require("fs/promises"));
var import_node_path2 = __toESM(require("path"));
async function exportCsvRoute(app2) {
  app2.get("/links/export", async (request, reply) => {
    const result = await db.select().from(links2);
    const filePath = await generateCsvFile(result);
    const fileName = import_node_path2.default.basename(filePath);
    const file = await import_promises.default.readFile(filePath);
    await r2.send(
      new import_client_s32.PutObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET,
        Key: fileName,
        Body: file,
        ContentType: "text/csv"
      })
    );
    const publicUrl = `${env.CLOUDFLARE_PUBLIC_URL}/${fileName}`;
    return reply.send({ url: publicUrl });
  });
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(import_cors.default);
app.register(import_static.default, {
  root: import_node_path3.default.resolve(__dirname, "..", "tmp"),
  prefix: "/public/"
});
app.register(createLinkRoute);
app.register(deleteLinkRoute);
app.register(getOriginalUrlRoute);
app.register(listLinksRoute);
app.register(exportCsvRoute);

// src/server.ts
app.listen({
  port: env.PORT,
  host: "0.0.0.0"
}).then(() => {
  console.log(`\u{1F680} HTTP server running on port ${env.PORT}`);
}).catch((err) => {
  console.error("\u274C Failed to start server", err);
  process.exit(1);
});
