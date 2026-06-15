import type { JSX } from 'react'
import { KeepSparkApp } from './components/KeepSparkApp'

/**
 * Props for the home route.
 */
interface HomePageProps {
  searchParams: Promise<{ q?: string | ReadonlyArray<string> }>
}

/**
 * Root route for KeepSpark. Renders the client-side app shell which owns all
 * interactive state and persistence.
 */
export default async function Home({ searchParams }: HomePageProps): Promise<JSX.Element> {
  const params: { q?: string | ReadonlyArray<string> } = await searchParams
  const raw: string | ReadonlyArray<string> | undefined = params.q
  const initialQuery: string =
    typeof raw === 'string' ? raw : Array.isArray(raw) ? (raw[0] ?? '') : ''

  return <KeepSparkApp key={initialQuery} initialQuery={initialQuery} />
}
