// Map choice point alternatives for diabolical sudoku puzzles
// deno run choices.js .475..9....1....4...24...15.3........527.418........9.27...13...6....2....1..457.
// deno run choices.js .3...1....24.3.5.....7.58...7...4.1.....8.7......579....6.5.3.7.4.......3...2..6.

import * as rules from './rules.js'

let query = rules.trim(Deno.args[0])
query = '.3...1....24.3.5.....7.58...7...4.1.....8.7......579....6.5.3.7.4.......3...2..6.'
query = '.475..9....1....4...24...15.3........527.418........9.27...13...6....2....1..457.'

console.error(query)
console.error('ones',todo(query, 1))

query = choice(query)
console.error('ones',todo(query, 1))
console.error('twos',todo(query, 2))

function force(query) {
  const {givens,choices} = rules.apply(query)
  return givens
    .map((g,i) => g=='.' ? (choices[i].length==1 ? choices[i] : g) : g)
    .join('')
}

function choice(query) {
  console.error('')
  let here = query
  console.error(here)
  let there = force(here)
  while (there != here) {
    here = there
    console.error(here)
    there = force(here)
  }
  return here
}

function todo(query, width) {
  const {givens,choices} = rules.apply(query)
  return givens
    .map((digit,i) => (digit == '.' && choices[i].length == width) ? {i,choice:choices[i]} : null)
    .filter(choice => choice != null)
}
