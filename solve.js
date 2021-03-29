addEventListener("fetch", (event) => {
  const response = new Response("Sudoku Solver Coming Soon", {
    headers: { "content-type": "text/plain" },
  });
  event.respondWith(response);
});