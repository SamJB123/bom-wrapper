import { createRouterClient } from '@orpc/server'
import { apiRouter } from './router'

export function createServerApiClient(request?: Request) {
  const contextRequest =
    request ?? new Request('http://localhost/internal-orpc-client')

  return createRouterClient(apiRouter, {
    context: {
      request: contextRequest,
    },
  })
}
