import { createRouter } from "@tanstack/react-router";
import [routeTree] from "./route-tree";

export function getRouter() {
    const router = createRouter({
        routeTree,
        scrollRestoration: true
    });

    return router;
}
