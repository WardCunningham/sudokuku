
// https://deno.com/deploy/docs/hello-world

addEventListener("fetch", (event) => event.respondWith(handle(event.request)));

function handle(request) {
  let html = `<h1>Sudoku Solver Coming Soon</h1>
    Fork this on <a href="https://github.com/WardCunningham/sudokuku">github</a>`
  return new Response(html, { headers: { "content-type": "text/html" } });
}