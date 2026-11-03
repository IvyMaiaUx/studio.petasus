import path from 'path'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { pt as adminLanguage } from '@payloadcms/translations/languages/pt'
import { fileURLToPath } from 'url'
import { Admins } from './collections/Admins'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { SocialPosts } from './collections/SocialPosts'
import { StudioProfile } from './globals/StudioProfile'
import { SocialHighlights } from './collections/SocialHighlights'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Variáveis de ambiente (veja .env.example). Nenhuma chave fica no código.
const s3Ready = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY &&
    process.env.S3_ENDPOINT,
)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Admins.slug,
    constrainWidth: true,
    dashboard: {
      widgets: [],
      defaultLayout: [
        { widgetSlug: 'activity', width: 'full' },
        { widgetSlug: 'collections', width: 'full' },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: 'pt',
    supportedLanguages: { pt: adminLanguage },
  },
  collections: [Admins, Media, Folders, Tags, SocialPosts, SocialHighlights],
  globals: [StudioProfile],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // Supabase (pooler) + Vercel serverless: poucas conexões por instância.
      max: 5,
    },
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  // Guarda as imagens (Media) no Supabase Storage via API compatível com S3.
  // Sem as variáveis S3_*, usa o disco local (só serve para testar no computador).
  storage: s3Ready
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET as string,
          config: {
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION || 'us-east-1',
            forcePathStyle: true,
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
            },
          },
        }),
      ]
    : [],
})
