// GitHub OAuth handshake for Decap CMS (/admin). No third-party service, no dependencies.
//   /oauth/auth      -> redirects the editor to GitHub's authorize page
//   /oauth/callback  -> exchanges the code for a token and hands it to the /admin window
//
// Setup (founder): create a GitHub OAuth App with callback URL https://hearthstoneandco.com/oauth/callback,
// then set env vars GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET in Netlify (secret, functions scope).
// Only GitHub users with write access to the repo can actually save or publish; GitHub enforces that.

const SITE = "https://hearthstoneandco.com";
export const config = { path: ["/oauth/auth", "/oauth/callback"] };

const rand = () => [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
const cookie = (name) => (v) => (v || "").split(/;\s*/).map((c) => c.split("=")).find(([k]) => k === name)?.[1];

function page(message, origin) {
  // Decap protocol: popup tells opener it is authorizing, opener answers, popup posts the result.
  const payload = JSON.stringify(message);
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Signing in…</title><script>
(function(){
  var origin=${JSON.stringify(origin)}, msg=${JSON.stringify(payload)};
  function receive(e){ if(e.origin!==origin) return; window.opener.postMessage(msg,e.origin); window.removeEventListener("message",receive,false); window.close(); }
  window.addEventListener("message",receive,false);
  window.opener.postMessage("authorizing:github",origin);
})();
</script><p>Signing in… you can close this window.</p>`,
    { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Set-Cookie": "cms_oauth_state=; Path=/oauth; Max-Age=0; Secure; HttpOnly; SameSite=Lax" } }
  );
}

export default async (req) => {
  const id = process.env.GITHUB_OAUTH_CLIENT_ID, secret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!id || !secret) return new Response("CMS login is not configured.", { status: 503, headers: { "Cache-Control": "no-store" } });
  const u = new URL(req.url);

  if (u.pathname === "/oauth/auth") {
    const state = rand();
    const dest = new URL("https://github.com/login/oauth/authorize");
    dest.search = new URLSearchParams({ client_id: id, scope: "repo,user", state, redirect_uri: `${SITE}/oauth/callback` });
    return new Response(null, { status: 302, headers: { Location: dest.href, "Cache-Control": "no-store", "Set-Cookie": `cms_oauth_state=${state}; Path=/oauth; Max-Age=600; Secure; HttpOnly; SameSite=Lax` } });
  }

  const code = u.searchParams.get("code");
  const state = u.searchParams.get("state");
  if (!code || !state || state !== cookie("cms_oauth_state")(req.headers.get("cookie")))
    return new Response("Sign-in failed (invalid state). Close this window and try again.", { status: 400, headers: { "Cache-Control": "no-store" } });
  try {
    const r = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: id, client_secret: secret, code, redirect_uri: `${SITE}/oauth/callback` }),
    });
    const j = await r.json();
    if (!j.access_token) return page("authorization:github:error:" + JSON.stringify({ message: j.error_description || "GitHub did not return a token" }), SITE);
    return page("authorization:github:success:" + JSON.stringify({ token: j.access_token, provider: "github" }), SITE);
  } catch {
    return page("authorization:github:error:" + JSON.stringify({ message: "Could not reach GitHub" }), SITE);
  }
};
