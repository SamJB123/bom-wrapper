import { describe, expect, it } from 'vitest'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { generateOpenApiDocument } from '../openapi'
import { apiRouter } from '../router'

describe('oRPC router', () => {
  it('serves the health endpoint through the OpenAPI handler', async () => {
    const handler = new OpenAPIHandler(apiRouter)
    const request = new Request('https://example.com/api/v1/health')
    const result = await handler.handle(request, {
      prefix: '/api',
      context: {
        request,
      },
    })

    expect(result.matched).toBe(true)
    expect(result.response?.status).toBe(200)

    const payload = (await result.response?.json()) as {
      status: string
      sourceStatuses: unknown
    }

    expect(payload.status).toMatch(/ok|degraded/)
    expect(Array.isArray(payload.sourceStatuses)).toBe(true)
  })

  it('generates an OpenAPI document with the overview path', async () => {
    const document = await generateOpenApiDocument('https://example.com/api')

    expect(document.openapi).toBe('3.1.1')
    expect(document.paths?.['/v1/overview/australia']).toBeDefined()
    expect(document.paths?.['/v1/stations/{stationId}/observation']).toBeDefined()
  })
})
