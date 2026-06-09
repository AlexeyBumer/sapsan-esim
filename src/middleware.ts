import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware обновляет сессию пользователя на каждом запросе
 * и защищает приватные страницы (личный кабинет).
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Важно: getUser() обращается к серверу Supabase и проверяет токен.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl;

  // Защита личного кабинета: без входа — на страницу логина
  if (url.pathname.startsWith("/account") && !user) {
    const redirect = url.clone();
    redirect.pathname = "/login";
    redirect.searchParams.set("next", url.pathname);
    return NextResponse.redirect(redirect);
  }

  // Залогиненного с /login и /register отправляем в кабинет
  if ((url.pathname === "/login" || url.pathname === "/register") && user) {
    const redirect = url.clone();
    redirect.pathname = "/account";
    redirect.search = "";
    return NextResponse.redirect(redirect);
  }

  return response;
}

export const config = {
  // Не трогаем статику и картинки
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
