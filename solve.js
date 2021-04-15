
// https://deno.com/deploy/docs/hello-world

addEventListener("fetch", (event) => event.respondWith(handle(event.request)))
const started = Date.now()

function handle(request) {
  let routes = {
    "/favicon.ico": flag,
    "/new": random,
    "/": solve
  }
  let client = request.headers.get("x-forwarded-for")
  let { pathname, search, origin } = new URL(request.url)
  post([{eventType:'Sudokuku', pathname, search, origin, client, started}])
  try {
    return routes[pathname](search, origin)
  } catch (err) {
    console.log(err)
    return new Response(`<pre>${err}</pre>`, {status:500})
  }
}

// https://css-tricks.com/emojis-as-favicons/

function flag() {
  let text = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎯</text></svg>`
  return new Response(text, { headers: { "content-type": "image/svg+xml" } })
}

function random(search, origin) {
  let puzzles = [
    `?6....7.1.2.....84....6..95....75...1..1...7..8...32....86..3....25.....4.9.5....1`,
    `?.3...1....24.3.5.....7.58...7...4.1.....8.7......579....6.5.3.7.4.......3...2..6.`,
    `?.2.9..1...3.1....8.9.5......6....34.8..3.9..6.47....2......7.8.4....3.1...9..6.5.`,
    `?....4....634..9...7..2.8.4..9.....18.7..6..4.82.....6..6.7.5..9...3..215....9....`,
    `?..6...4...5.6.12......3..65.59.8.6......1......8.7.31.59..4......28.7.3...7...4..`,
    `?18.4........2..97...........79..1...............8..64...........48..2........7.93`,
    `?.475..9....1....4...24...15.3........527.418........9.27...13...6....2....1..457.`  // diabolical
  ]
  let chosen = puzzles[Math.floor(puzzles.length*Math.random())]
  if (chosen == search) return random(search, origin)
  return Response.redirect(origin + chosen, 302)
}



function solve(search) {

  const blank = "................................................................................."
  const givensString = (search.replace('?','') + blank).substr(0, 81)
  const givens = Array.from(givensString)
  const choices = Array.from({length:81}).map(_=>"123456789")

  const subsets = [

    // rows
    [ 0,  1,  2,  9, 10, 11, 18, 19, 20],
    [ 3,  4,  5, 12, 13, 14, 21, 22, 23],
    [ 6,  7,  8, 15, 16, 17, 24, 25, 26],
    [27, 28, 29, 36, 37, 38, 45, 46, 47],
    [30, 31, 32, 39, 40, 41, 48, 49, 50],
    [33, 34, 35, 42, 43, 44, 51, 52, 53],
    [54, 55, 56, 63, 64, 65, 72, 73, 74],
    [57, 58, 59, 66, 67, 68, 75, 76, 77],
    [60, 61, 62, 69, 70, 71, 78, 79, 80],

    // columns
    [ 0,  3,  6, 27, 30, 33, 54, 57, 60],
    [ 1,  4,  7, 28, 31, 34, 55, 58, 61],
    [ 2,  5,  8, 29, 32, 35, 56, 59, 62],
    [ 9, 12, 15, 36, 39, 42, 63, 66, 69],
    [10, 13, 16, 37, 40, 43, 64, 67, 70],
    [11, 14, 17, 38, 41, 44, 65, 68, 71],
    [18, 21, 24, 45, 48, 51, 72, 75, 78],
    [19, 22, 25, 46, 49, 52, 73, 76, 79],
    [20, 23, 26, 47, 50, 53, 74, 77, 80],

    // squares
    [ 0,  1,  2,  3,  4,  5,  6,  7,  8],
    [ 9, 10, 11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42, 43, 44],
    [45, 46, 47, 48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58, 59, 60, 61, 62],
    [63, 64, 65, 66, 67, 68, 69, 70, 71],
    [72, 73, 74, 75, 76, 77, 78, 79, 80]
  ];

  // remove choices eliminated by the at-most-one rule

  for (let subset of subsets) {
    for (let i of subset) {
      const d = givens[i];
      if (d == ".") continue;
      for (let j of subset) {
        choices[j] = choices[j].replace(d, "");
      }
    }
  }

  // identify choices mandated by the at-least-one rule

  const unique = {};
  const digitCounts = Array.from("123456789")
    .reduce((acc, d) => {acc[d] = 0; return acc}, {});
  for (let subset of subsets) {
    const counts = {...digitCounts};
    const where = {...digitCounts};
    subset
      .filter(i => givens[i] == ".")
      .forEach(i => {
        const digits = Array.from(choices[i]);
        for (let d of digits) {
          counts[d] += 1;
          where[d] = i;
        };
      });
    Array.from("123456789")
      .filter(d => counts[d] == 1)
      .forEach(d => unique[where[d]] = d)
  }

  // display board as table of tables of hyperlinked choices

  function table(first) {
    const row = `\n<td bgcolor=#77bbff width=170 height=50 align=center>${first}`;
    return `\n<table>` + Array.from({length:3}).map(_=>`<tr>${row}${row}${row}`).join('') + `</table>`;
  }

  let board = table(table("X"));

  function nextGivens(i, digit) {
    let res = Array.from(givens);
    res[i] = digit;
    return res.join("");
  }

  function nextForced() {
    let res = givens.map((g,i) =>
      g!='.' ? g :
      choices[i].length==1 ? choices[i] :
      unique[i] ? unique[i] : '.')
    return res.join("")
  }

  function choicesFn(i) {
    const uniqueChoice = unique[i];
    return Array.from(choices[i])
      .map(digit => {
        if (uniqueChoice && digit != uniqueChoice) {
          return `\n`;
        } else {
          let search = nextGivens(i, digit);
          return `\n<a href="?${search}">${digit}</a>`;
        }
      }).join("");
  }

  for (let i=0; i <= 80; i++) {
    const digit = givens[i];
    const content = (digit != '.')
      ? `<font size=8>${digit}`
      : choicesFn(i);
    board = board.replace('X', content);
  }

  let text = `
    <html>
    <head>
      <meta name="robots" content="noindex,nofollow">
    </head>
    <body>
      <style>
        table { font-family: "Helvetica Neue", Verdana, helvetica, Arial, Sans; }
        td a { text-decoration: none; }
      </style>
      <center>
      <h1>Sudoku Solver<br>
      <button onclick="location.href='/new'+location.search">new puzzle</button>
      </h1>
      ${board}
      <p><button onclick="location.href='/?${nextForced()}'">forced moves</button>
      <p>We show choices satisfying two simple rules: <br>
      <i>at-most-one</i> and <i>at-least-one</i> of every digit<br>
      must appear in every row, column and square.</p>
      <p>Fork this on <a href="https://github.com/WardCunningham/sudokuku">github</a></p>
    </body>
    </html>`

  return new Response(text, { headers: { "content-type": "text/html" } })
}

function post(data) {
  fetch('https://insights-collector.newrelic.com/v1/accounts/3138524/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Insert-Key': Deno.env.get("INSIGHTS_INSERT_KEY")
    },
    body: JSON.stringify(data),
  })
  .then(res => res.json())
  .then(success => console.log({success}))
  .catch(error => console.error(Date().toLocaleString(),error.message))
}
