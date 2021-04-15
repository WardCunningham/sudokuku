# sudokuku

This server helps you solve sudoku puzzles by showing choices satisfying two simple rules: at-most-one and at-least-one of every digit must appear in every row, column and square. Choices that violate the at-most-one rule are omitted. Alternatives to digits that must be chosen by the at-least-one rule are grayed.

https://sudokuku.deno.dev/?.3...1....24.3.5.....7.58...7...4.1.....8.7......579....6.5.3.7.4.......3...2..6.

Empty squares are dead ends. Back up the browser to make a new choice. The above rules are insufficent to solve the hardest puzzles. You can guess or look for a third rule. This program will help you find these most interesting places in the hardest puzzles without becomming a mechanical master of the simpler logic.

Each step has a unique url that you can bookmark or send to friends. Use a blank query to enter new puzzles.


# deploy

This repo is linked to Deno Deploy to publish changes globally on merge to main.

https://deno.com/deploy

# history

In 2005 I bought a sudoku puzzle book at the airport as I headed out cross-country to Boston.
I reached for the book expecting more idle entertainment on the return trip but found I had left it in the hotel.
I did have a laptop with me so I wrote this puzzle solver instead.

http://c2.com/~ward/sudokant.txt
