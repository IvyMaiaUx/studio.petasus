# Petasus Studio

Prévia e planejamento do Instagram da Petasus (feed, destaques e perfil), com
painel de edição protegido por login e exportação em PNG e ZIP.

Feito com Next.js + Payload CMS. Banco de dados no **Supabase (Postgres)** e
imagens no **Supabase Storage**. Hospedagem na **Vercel**.

## O que mudou em relação à versão do Figma Make

- Saiu o pacote `@payloadcms/figma` (banco, login e arquivos da plataforma da Figma).
- Entrou Postgres comum (`@payloadcms/db-postgres`) e Storage S3 (`@payloadcms/storage-s3`).
- O login do editor agora é e-mail e senha do próprio Payload (sem SSO da Figma).
- O plugin MCP foi removido (não deve ficar aberto em produção).
- Removidos: pasta `.figma`, funções Edge/KV do Supabase (não eram usadas) e o carregador de imagens da Figma.
- O build volta a checar erros de tipo (antes estava desligado).
- As migrações do banco estão em `src/migrations` e rodam sozinhas no build.

## Passo a passo

### 1. Supabase
1. Crie um projeto (ou use o existente).
2. Em **Project Settings > Database > Connection string**, copie a string do
   **Session pooler** (porta 5432) e troque `[YOUR-PASSWORD]` pela senha do banco.
   Ela vira a variável `DATABASE_URI`.
3. Em **Storage**, crie um bucket chamado `media` (pode ficar privado: o Payload serve as imagens).
4. Em **Storage > S3 Connection**, copie o endpoint e a região e gere as chaves de acesso
   (`S3_ACCESS_KEY_ID` e `S3_SECRET_ACCESS_KEY`).

### 2. GitHub
Suba esta pasta para um repositório. O `.gitignore` já impede o envio de `.env`.
Nunca coloque chaves no código ou no repositório.

### 3. Vercel
1. **Add New > Project** e escolha o repositório. Framework: Next.js.
2. Em **Environment Variables**, cadastre as variáveis de `.env.example`
   (`DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL` e as `S3_*`).
   Gere o `PAYLOAD_SECRET` com `openssl rand -hex 32`.
3. Deixe o comando de build padrão: ele roda `payload migrate` (cria as tabelas)
   e depois `next build`.
4. Faça o deploy. Cadastre as variáveis só em **Production** se não quiser que
   previews alterem o mesmo banco.
5. Em **Settings > Domains**, aponte o domínio (ex.: `studio.seudominio.com`) e
   atualize `NEXT_PUBLIC_SITE_URL`.

### 4. Primeiro acesso
Abra `/admin`. Na primeira vez, a tela pede para criar o primeiro administrador.
Depois disso, só um administrador logado cria novos.

### 5. Conteúdo
Os posts, destaques e perfil que estavam no Figma **não vêm neste projeto**:
é preciso recriá-los pelo painel (ou exportá-los antes de desligar o projeto na Figma).

## Rodar no computador
```bash
pnpm install
cp .env.example .env      # preencha DATABASE_URI e PAYLOAD_SECRET
pnpm migrate
pnpm dev
```
Sem as variáveis `S3_*`, as imagens ficam numa pasta local (`media/`), só para teste.

## Pontos de atenção
- Payload 4, Next 16 e React 19 estão em versões beta ou muito novas. Mantenha as versões fixas.
- Na Vercel, o envio de arquivo pelo servidor tem limite de cerca de 4,5 MB por requisição.
  Se precisar de imagens maiores, ative `clientUploads` no `s3Storage` em `src/payload.config.ts`.
- Mudou algum campo das coleções? Rode `pnpm migrate:create nome` e envie a migração gerada junto com o código.
