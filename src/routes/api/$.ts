import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { createFileRoute } from '@tanstack/react-router'
import { generateOpenApiDocument } from '~/lib/orpc/openapi'
import { apiRouter } from '~/lib/orpc/router'

const openApiHandler = new OpenAPIHandler(apiRouter)

function renderDocsHtml(specUrl: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>BOM Access Layer API Docs</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #07111f;
        --panel: rgba(10, 21, 41, 0.92);
        --border: rgba(122, 162, 255, 0.25);
        --text: #e7f0ff;
        --muted: #9ab0d1;
      }
      html,
      body,
      #app {
        height: 100%;
        margin: 0;
        background:
          radial-gradient(circle at top, rgba(55, 93, 185, 0.35), transparent 30%),
          linear-gradient(180deg, #08101e 0%, #050913 100%);
        color: var(--text);
        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          sans-serif;
      }
      .notice {
        position: fixed;
        inset: 16px 16px auto 16px;
        z-index: 2;
        max-width: 720px;
        border: 1px solid var(--border);
        background: var(--panel);
        color: var(--muted);
        border-radius: 16px;
        padding: 12px 16px;
        backdrop-filter: blur(12px);
        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.25);
      }
      .notice strong {
        color: var(--text);
      }
      .spacer {
        height: 84px;
      }
    </style>
  </head>
  <body>
    <div class="notice">
      <strong>BOM Access Layer API</strong> — this project defaults to curated fixtures for development because live BOM access is blocked in this environment and some Bureau products have redistribution constraints. Attribute data to the Bureau of Meteorology.
    </div>
    <div class="spacer"></div>
    <div id="app"></div>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <script>
      Scalar.createApiReference('#app', {
        url: ${JSON.stringify(specUrl)},
        theme: 'purple',
        darkMode: true,
        hideDownloadButton: false,
        layout: 'modern',
      })
    </script>
  </body>
</html>`
}

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const url = new URL(request.url)

        if (url.pathname === '/api/openapi.json') {
          const serverUrl = new URL('/api', request.url).toString()
          const document = await generateOpenApiDocument(serverUrl)

          return Response.json(document)
        }

        if (url.pathname === '/api/docs') {
          const specUrl = new URL('/api/openapi.json', request.url).toString()

          return new Response(renderDocsHtml(specUrl), {
            headers: {
              'content-type': 'text/html; charset=utf-8',
            },
          })
        }

        if (url.pathname.startsWith('/api/v1/')) {
          const result = await openApiHandler.handle(request, {
            prefix: '/api',
            context: {
              request,
            },
          })

          return result.response ?? new Response('Not Found', { status: 404 })
        }

        return new Response('Not Found', { status: 404 })
      },
    },
  },
})
