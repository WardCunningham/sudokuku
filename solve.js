
// https://deno.com/deploy/docs/hello-world

addEventListener("fetch", (event) => event.respondWith(handle(event.request)))

function handle(request) {
  let routes = { "/favicon.ico": flag, "/": solve }
  let { pathname, search } = new URL(request.url)
  try {
    return routes[pathname](search)
  } catch (err) {
    return new Response("malformed request", {status:500})
  }
}

// https://css-tricks.com/emojis-as-favicons/

function flag() {
  let text = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎯</text></svg>`
  return new Response(text, { headers: { "content-type": "image/svg+xml" } })
}

function solve(search) {
  let text = `<h1>Sudoku Solver Coming Soon</h1>
    Fork this on <a href="https://github.com/WardCunningham/sudokuku">github</a>`
  return new Response(text, { headers: { "content-type": "text/html" } })
}