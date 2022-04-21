// Map choice point alternatives for diabolical sudoku puzzles
// deno run choices.js .475..9....1....4...24...15.3........527.418........9.27...13...6....2....1..457.
// deno run choices.js .3...1....24.3.5.....7.58...7...4.1.....8.7......579....6.5.3.7.4.......3...2..6.

import * as rules from './rules.js'

let query = rules.trim(Deno.args[0])
// query = '.3...1....24.3.5.....7.58...7...4.1.....8.7......579....6.5.3.7.4.......3...2..6.'
// query = '.1......5..628...9.9...64..5..8..7...3..54......6.1...49...6..7...8..6...6.23...4' // difficult
// query = '.475..9....1....4...24...15.3........527.418........9.27...13...6....2....1..457.' // diabolical

search(query,'start')

function search(here, why) {
  const setone = (str, i, ch) => {
    const letters = Array.from(str)
    letters[i] = ch
    return letters.join('')
  }
  console.error()
  console.error('search', why)
  const there = choice(here)
  if (there.includes('.')) {
    const trying = todo(there,2)
    if (trying.length == 0) {
      console.error('%cstuck','color:red')
    }
    else {
      console.error(`%ctrying [${trying[0].i}] = "${trying[0].choice}"`,"color:yellow")
      const lets = Array.from(trying[0].choice)
      search(setone(there,trying[0].i,lets[0]),`[${trying[0].i}] = ${lets[0]}`)
      search(setone(there,trying[0].i,lets[1]),`[${trying[0].i}] = ${lets[1]}`)
    }
  } else {
    console.error("%csolved","color:green")
  }
}

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
