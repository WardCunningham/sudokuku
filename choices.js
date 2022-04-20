// Map choice point alternatives for diabolical sudoku puzzles
// deno run choices.js .475..9....1....4...24...15.3........527.418........9.27...13...6....2....1..457.
// deno run choices.js .3...1....24.3.5.....7.58...7...4.1.....8.7......579....6.5.3.7.4.......3...2..6.

import * as rules from './rules.js'

const query = rules.trim(Deno.args[0])
// const query = '.475..9....1....4...24...15.3........527.418........9.27...13...6....2....1..457.'

console.error(query)
console.error(rules.apply(query))

let {givens,choices,unique} = rules.apply(query)
nextChoice()

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
