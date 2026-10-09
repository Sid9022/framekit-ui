import * as React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/ui/toast'
import { CommandPaletteProvider } from '@/components/command-palette'
import { DocsLayout } from '@/layouts/DocsLayout'
import { LandingPage } from '@/pages/LandingPage'
import { RouteAnalytics } from '@/components/route-analytics'
import { RouteHead, ScrollManager } from '@/components/route-effects'
import { PageSkeleton } from '@/components/docs/states'

// Docs pages load lazily; each one then fetches only its own demo + source chunk (src/docs/demos.ts, sources.ts).
const DocPage = React.lazy(() => import('@/pages/DocPage').then((m) => ({ default: m.DocPage })))
const GuidePage = React.lazy(() => import('@/pages/GuidePage').then((m) => ({ default: m.GuidePage })))
const GuidesIndexPage = React.lazy(() => import('@/pages/GuidePage').then((m) => ({ default: m.GuidesIndexPage })))
const CategoryPage = React.lazy(() => import('@/pages/CategoryPage').then((m) => ({ default: m.CategoryPage })))

export default function App() {
  return (
    <ThemeProvider>
      {/* Every motion/react animation honours prefers-reduced-motion (transforms drop, opacity stays). */}
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <CommandPaletteProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/docs" element={<DocsLayout />}>
                <Route index element={<Navigate to="introduction" replace />} />
                <Route
                  path="category/:category"
                  element={
                    <React.Suspense fallback={<PageSkeleton />}>
                      <CategoryPage />
                    </React.Suspense>
                  }
                />
                <Route
                  path=":slug"
                  element={
                    <React.Suspense fallback={<PageSkeleton />}>
                      <DocPage />
                    </React.Suspense>
                  }
                />
              </Route>
              {/* Long-form guides share the docs shell (sidebar + header). Each guide is prerendered: see seo.ts → sitemapRoutes(). */}
              <Route path="/guides" element={<DocsLayout />}>
                <Route
                  index
                  element={
                    <React.Suspense fallback={<PageSkeleton />}>
                      <GuidesIndexPage />
                    </React.Suspense>
                  }
                />
                <Route
                  path=":slug"
                  element={
                    <React.Suspense fallback={<PageSkeleton />}>
                      <GuidePage />
                    </React.Suspense>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <RouteAnalytics />
            <RouteHead />
            <ScrollManager />
          </CommandPaletteProvider>
        </ToastProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
