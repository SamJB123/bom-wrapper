import { ORPCError, os } from '@orpc/server'
import { isBomDataError } from '../bom/errors'
import type { OrpcContext } from './context'

export const api = os.$context<OrpcContext>()

export async function withBomErrorHandling<TValue>(
  loader: () => Promise<TValue>,
): Promise<TValue> {
  try {
    return await loader()
  } catch (error) {
    if (!isBomDataError(error)) {
      throw error
    }

    if (error.code === 'NOT_FOUND') {
      throw new ORPCError('NOT_FOUND', {
        message: error.message,
        data: { code: error.code },
      })
    }

    if (error.code === 'UNSUPPORTED_LIVE_SOURCE') {
      throw new ORPCError('NOT_IMPLEMENTED', {
        message: error.message,
        data: { code: error.code },
      })
    }

    if (error.code === 'UPSTREAM_UNAVAILABLE') {
      throw new ORPCError('SERVICE_UNAVAILABLE', {
        message: error.message,
        data: { code: error.code },
      })
    }

    throw new ORPCError('INTERNAL_SERVER_ERROR', {
      message: error.message,
      data: { code: error.code },
    })
  }
}
