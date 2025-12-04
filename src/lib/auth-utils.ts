export type UserRole = "ADMIN" | "CLIENT"| "HOST";


export type RouteConfig = {
    exact: string[],
    patterns: RegExp[],
}

export const authRoutes = ["/login", "/register", "/forgot-password"];

export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/settings", "/change-password", "/reset-password"],
    patterns: [], // [/password/change-password, /password/reset-password => /password/*]
}

// export const doctorProtectedRoutes: RouteConfig = {
//     patterns: [/^\/doctor/], // Routes starting with /doctor/* , /assitants, /appointments/*
//     exact: [], // "/assistants"
// }

export const adminProtectedRoutes: RouteConfig = {
    patterns: [/^\/admin/], // Routes starting with /admin/*
    exact: [], // "/admins"
}

export const clientProtectedRoutes: RouteConfig = {
    patterns: [/^\/dashboard/], // Routes starting with /dashboard/*
    exact: [], // "/dashboard"
}

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route: string) => route === pathname);
}

export const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.patterns.some((pattern: RegExp) => pattern.test(pathname))
    // if pathname === /dashboard/my-appointments => matches /^\/dashboard/ => true
}

export const getRouteOwner = (pathname: string): "ADMIN" | "CLIENT" | "COMMON" | null => {
    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    if (isRouteMatches(pathname, clientProtectedRoutes)) {
        return "CLIENT";
    }
    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }
    return null;
}

export const getDefaultDashboardRoute = (role: UserRole): string => {
    if (role === "ADMIN") {
        return "/admin/dashboard";
    }
    if (role === "CLIENT") {
        return "/dashboard";
    }
    return "/";
}

export const isValidRedirectForRole = (redirectPath: string, role: UserRole): boolean => {
    const routeOwner = getRouteOwner(redirectPath);

    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }

    if (routeOwner === role) {
        return true;
    }

    return false;
}