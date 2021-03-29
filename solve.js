addEventListener("fetch", (event) => {
  const response = new Response(`Sudoku Solver Coming Soon\n\n${Object.keys(event).join("\n")}`, {
    headers: { "content-type": "text/plain" },
  });
  event.respondWith(response);
});