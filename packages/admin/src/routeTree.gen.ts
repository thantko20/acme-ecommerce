/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as MainImport } from './routes/_main'
import { Route as AuthImport } from './routes/_auth'
import { Route as MainTestImport } from './routes/_main/test'
import { Route as MainProductsImport } from './routes/_main/products'
import { Route as MainOrdersImport } from './routes/_main/orders'
import { Route as MainCustomersImport } from './routes/_main/customers'
import { Route as MainAnalyticsImport } from './routes/_main/analytics'
import { Route as AuthAuthRegisterImport } from './routes/_auth/auth/register'
import { Route as AuthAuthLoginImport } from './routes/_auth/auth/login'

// Create Virtual Routes

const MainIndexLazyImport = createFileRoute('/_main/')()
const MainAboutLazyImport = createFileRoute('/_main/about')()

// Create/Update Routes

const MainRoute = MainImport.update({
  id: '/_main',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
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

const MainOrdersRoute = MainOrdersImport.update({
  path: '/orders',
  getParentRoute: () => MainRoute,
} as any)

const MainCustomersRoute = MainCustomersImport.update({
  path: '/customers',
  getParentRoute: () => MainRoute,
} as any)

const MainAnalyticsRoute = MainAnalyticsImport.update({
  path: '/analytics',
  getParentRoute: () => MainRoute,
} as any)

const AuthAuthRegisterRoute = AuthAuthRegisterImport.update({
  path: '/auth/register',
  getParentRoute: () => AuthRoute,
} as any)

const AuthAuthLoginRoute = AuthAuthLoginImport.update({
  path: '/auth/login',
  getParentRoute: () => AuthRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/_main': {
      preLoaderRoute: typeof MainImport
      parentRoute: typeof rootRoute
    }
    '/_main/analytics': {
      preLoaderRoute: typeof MainAnalyticsImport
      parentRoute: typeof MainImport
    }
    '/_main/customers': {
      preLoaderRoute: typeof MainCustomersImport
      parentRoute: typeof MainImport
    }
    '/_main/orders': {
      preLoaderRoute: typeof MainOrdersImport
      parentRoute: typeof MainImport
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
    '/_auth/auth/login': {
      preLoaderRoute: typeof AuthAuthLoginImport
      parentRoute: typeof AuthImport
    }
    '/_auth/auth/register': {
      preLoaderRoute: typeof AuthAuthRegisterImport
      parentRoute: typeof AuthImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  AuthRoute.addChildren([AuthAuthLoginRoute, AuthAuthRegisterRoute]),
  MainRoute.addChildren([
    MainAnalyticsRoute,
    MainCustomersRoute,
    MainOrdersRoute,
    MainProductsRoute,
    MainTestRoute,
    MainAboutLazyRoute,
    MainIndexLazyRoute,
  ]),
])

/* prettier-ignore-end */
