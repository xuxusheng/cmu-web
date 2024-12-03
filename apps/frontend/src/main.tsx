import { loader } from '@monaco-editor/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'animate.css'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'hover.css'
import * as monaco from 'monaco-editor'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'

import './index.scss'
import { router } from './router/router.ts'

loader.config({ monaco })

dayjs.extend(duration)
dayjs.extend(relativeTime)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 1000 * 60, // 60s 内乐观更新
      retry: 0,
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}></RouterProvider>
  </QueryClientProvider>
)
