/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as MainImport } from './routes/_main'
import { Route as MainTestImport } from './routes/_main/test'
import { Route as MainProductsImport } from './routes/_main/products'

// Create Virtual Routes

const MainIndexLazyImport = createFileRoute('/_main/')()
const MainAboutLazyImport = createFileRoute('/_main/about')()

// Create/Update Routes

const MainRoute = MainImport.update({
  id: '/_main',
  getParentRoute: () => rootRoute,
} as any)

const MainIndexLazyRoute = MainIndexLazyImport.update({
  path: '/',
  getParentRoute: () => MainRoute,
} as any).lazy(() => import('./routes/_main/index.lazy').then((d) => d.Route))

const MainAboutLazyRoute = MainAboutLazyImport.update({
  path: '/about',
  getParentRoute: () => MainRoute,
} as any).lazy(() => import('./routes/_main/about.lazy').then((d) => d.Route))

const MainTestRoute = MainTestImport.update({
  path: '/test',
  getParentRoute: () => MainRoute,
} as any)

const MainProductsRoute = MainProductsImport.update({
  path: '/products',
  getParentRoute: () => MainRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_main': {
      preLoaderRoute: typeof MainImport
      parentRoute: typeof rootRoute
    }
    '/_main/products': {
      preLoaderRoute: typeof MainProductsImport
      parentRoute: typeof MainImport
    }
    '/_main/test': {
      preLoaderRoute: typeof MainTestImport
      parentRoute: typeof MainImport
    }
    '/_main/about': {
      preLoaderRoute: typeof MainAboutLazyImport
      parentRoute: typeof MainImport
    }
    '/_main/': {
      preLoaderRoute: typeof MainIndexLazyImport
      parentRoute: typeof MainImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  MainRoute.addChildren([
    MainProductsRoute,
    MainTestRoute,
    MainAboutLazyRoute,
    MainIndexLazyRoute,
  ]),
])

/* prettier-ignore-end */
