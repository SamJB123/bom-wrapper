import { upstreamUnavailable } from './errors'

export async function fetchUpstreamText(
  url: string,
  init?: RequestInit,
): Promise<string> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json, text/plain, application/xml, text/xml',
      ...init?.headers,
    },
  })

  const text = await response.text()

  if (!response.ok) {
    throw upstreamUnavailable(
      `Upstream request failed with ${response.status} for ${url}`,
      text,
    )
  }

  if (text.includes('Your access is blocked due to the detection')) {
    throw upstreamUnavailable(
      `Upstream blocked automated access for ${url}`,
      text,
    )
  }

  return text
}
