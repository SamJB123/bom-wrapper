import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { BomGlobeCanvas } from '~/components/globe/BomGlobeCanvas'
import { createServerApiClient } from '~/lib/orpc/client'

export const Route = createFileRoute('/globe')({
  head: () => ({
    meta: [
      {
        title: 'BOM Access Layer | Australia weather globe',
      },
    ],
  }),
  loader: () => getGlobeOverview(),
  component: GlobeRouteComponent,
})

const getGlobeOverview = createServerFn({ method: 'GET' }).handler(async () => {
  const apiClient = createServerApiClient()

  return apiClient.overview.australia()
})

function GlobeRouteComponent() {
  const overview = Route.useLoaderData()

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <BomGlobeCanvas overview={overview} />
    </div>
  )
}
