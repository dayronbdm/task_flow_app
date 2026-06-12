import fs from 'fs'
import path from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['nuxt-auth-utils'],
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || ''
    }
  },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
          integrity: 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH',
          crossorigin: 'anonymous'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
        }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
          integrity: 'sha384-YvpcrYf0tY3lHB60NNkmXc4s9bIOgUxi8T/jzmLqSGH6EFJAAj5PXEpIvsWXZCl0',
          crossorigin: 'anonymous'
        }
      ],
      meta: [
        { name: 'description', content: 'iNotes — your personal note manager' }
      ],
      htmlAttrs: { lang: 'en' },
      bodyAttrs: { 'data-bs-theme': 'dark' }
    }
  },
  devServer: {
    https: true
  },
  vite: {
    server: {
      https: {
        key: fs.readFileSync(path.resolve('./certs/localhost-key.pem')),
        cert: fs.readFileSync(path.resolve('./certs/localhost.pem'))
      }
    }
  },
  nitro: {
    esbuild: {
      options: {
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true,
            // @ts-ignore
            emitDecoratorMetadata: true
          }
        }
      }
    }
  }
})
