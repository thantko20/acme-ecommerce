import { RoutePaths } from "@tanstack/react-router";

import { routeTree } from "@/routeTree.gen";

export type RoutePath = RoutePaths<typeof routeTree>;
