
// https://deno.com/deploy/docs/hello-world

addEventListener("fetch", (event) => event.respondWith(handle(event.request)));

function handle(request) {
  let html = `<h1>Sudoku Solver Coming Soon</h1>`
  return new Response(html, { headers: { "content-type": "text/html" } });
}