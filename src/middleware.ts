import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que requieren login
const PROTECTED_PATHS = ["/dashboard"];

// Rutas que solo los admins pueden ver (por ahora ninguna)

// Rutas que los empleados NO pueden ver
const EMPLOYEE_RESTRICTED_PATHS = ["/dashboard/monitoreo"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const pathname = request.nextUrl.pathname;

  // Redirección si ya está logueado e intenta ir a /login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirección de raíz al login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Validar si necesita autenticación
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Restricción para empleados
  const isRestrictedForEmployee = EMPLOYEE_RESTRICTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (role === "employee" && isRestrictedForEmployee) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Acceso permitido
  return NextResponse.next();
}

// Aplica a todas las rutas menos assets estáticos o APIs
export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
