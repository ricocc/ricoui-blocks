import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/site/home/home-page'
import { pageHead } from '../lib/site'

export const Route = createFileRoute('/')({
  head: () => pageHead('Animated React/HTML components、blocks、Templates.'),
  component: HomePage,
})
