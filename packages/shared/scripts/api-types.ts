// Gera src/api/schema.ts a partir de src/api/openapi.json.
// Se OPENAPI_URL estiver definido, baixa o spec da API antes (ex.: http://localhost:3000/openapi.json).
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../src/api/', import.meta.url));
const url = process.env.OPENAPI_URL;
if (url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar ${url}: ${res.status}`);
  writeFileSync(`${dir}openapi.json`, JSON.stringify(await res.json(), null, 2) + '\n');
}
execFileSync('pnpm', ['exec', 'openapi-typescript', `${dir}openapi.json`, '-o', `${dir}schema.ts`], {
  stdio: 'inherit',
});
