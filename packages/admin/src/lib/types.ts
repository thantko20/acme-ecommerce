import { routeTree } from "@/routeTree.gen";
import { RoutePaths } from "@tanstack/react-router";

export type RoutePath = RoutePaths<typeof routeTree>;
