// Thin fetch wrapper for the /api routes (proxied to the Django API). Throws ApiError with the
// server's message. Django checks a CSRF token on signed-in POST/PATCH/DELETE requests: the token
// lives in the `csrftoken` cookie and is echoed back in the X-CSRFToken header.

export class ApiError extends Error {
  constructor(message, status, field) {
    super(message);
    this.status = status;
    this.field = field;
  }
}

function readCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

let csrfRequest = null;
async function ensureCsrf() {
  if (readCookie("csrftoken")) return;
  csrfRequest = csrfRequest || fetch("/api/auth/csrf", { credentials: "same-origin" }).finally(() => (csrfRequest = null));
  await csrfRequest;
}

export async function api(method, path, body) {
  const unsafe = method !== "GET" && method !== "HEAD";
  let res;
  try {
    if (unsafe) await ensureCsrf();
    const token = unsafe ? readCookie("csrftoken") : null;
    res = await fetch(path, {
      method,
      headers: {
        ...(body ? { "content-type": "application/json" } : {}),
        ...(token ? { "x-csrftoken": token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
    });
  } catch {
    throw new ApiError("Can't reach Simbatech. Check your connection and try again.", 0);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError((data && data.error) || "Something went wrong. Please try again.", res.status, data && data.field);
  return data;
}
