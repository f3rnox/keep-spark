import type { JSX } from 'react'
import { KeepSparkApp } from './components/KeepSparkApp'

/**
 * Root route for KeepSpark. Renders the client-side app shell which owns all
 * interactive state and persistence.
 */
export default function Home(): JSX.Element {
  return <KeepSparkApp />
}
