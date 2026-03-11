import { OpenAPIGenerator } from '@orpc/openapi'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { apiRouter } from './router'

const openApiGenerator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
})

export function generateOpenApiDocument(serverUrl: string) {
  return openApiGenerator.generate(apiRouter, {
    info: {
      title: 'BOM Access Layer API',
      version: '1.0.0',
      description:
        'A curated OpenAPI wrapper around BOM-style observations and daily forecasts, designed for visualisation and developer-friendly consumption.',
    },
    servers: [
      {
        url: serverUrl,
      },
    ],
  })
}
