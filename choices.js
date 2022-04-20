// Map choice point alternatives for diabolical sudoku puzzles
// deno run choices.js .475..9....1....4...24...15.3........527.418........9.27...13...6....2....1..457.
// deno run choices.js .3...1....24.3.5.....7.58...7...4.1.....8.7......579....6.5.3.7.4.......3...2..6.

import * as rules from './rules.js'

let query = rules.trim(Deno.args[0])
query = '.475..9....1....4...24...15.3........527.418........9.27...13...6....2....1..457.'

console.error('search', query)

let {givens,choices,unique} = rules.apply(query)
console.error({givens,choices,unique})
console.error('ones',todo(1))


const t0 = Date.now()
nextChoice()
console.error('time',Date.now() - t0)

console.error('ones',todo(1))
console.error('twos',todo(2))


function nextForced() {
  let res = givens.map((g,i) =>
    g!='.' ? g :
    choices[i].length==1 ? choices[i] :
    unique[i] ? unique[i] : '.')
  return res.join("")
}

function nextChoice() {
  console.error('')
  let res = givens.join("");
  let state = rules.apply(res); givens = state.givens; choices = state.choices; unique = state.unique
  console.error(res)
  let nxt = nextForced();
  while (nxt != res) {
    res = nxt
    state = rules.apply(res); givens = state.givens; choices = state.choices; unique = state.unique
    console.error(res)
    nxt = nextForced()
  }
}

function todo(width) {
  return givens
    .map((digit,i) => (digit == '.' && choices[i].length == width) ? {i,choice:choices[i]} : null)
    .filter(choice => choice != null)
}
