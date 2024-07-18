## Step 3: CMLL

In this step, we will solve the four corners at the top.
This process is called CMLL, and it's the only step where we need to memorize move sequences.

We'll divide it into two parts:
1. Twist the corners
2. Swap the corners

### Part 1: Twist the corners
First, let's twist the top corners to get their yellow stickers on the top.
Our goal is something like this:

<!-- Show example of corners all oriented but not permuted -->

When a corner has yellow on top, we call it an **oriented** corner.
If all your corners are already oriented like shown above, you got lucky and skipped this step!

To twist the corners, we'll use a move sequence called **sune**.
This sequence will twist each corner clockwise except the front-left one.

<!-- show the alg -->
`R U R' U R U2 R'`

<!-- TODO: need to make a React component for notation -->
<!-- Like those official Roux pamphlets with the card that says R and shows the cube with an arrow -->

To help make it easier to memorize this sequence,
watch what it does to the front-right pair of the Second Block:

<!-- insert animation where we highlight FR pair -->
You can see that `R U R'` takes the pair out, then `U R U2 R'` puts it back.
We temporarily mess up the Second Block then fix it,
and the side effect is twisting three of the top corners.

Repeat sune 10 times on your cube to build some muscle memory, because we'll be using this sequence a lot!

#### Sune and Antisune cases

The simplest case is the **sune case**: 3 corners needs to twist clockwise and
one corner is already oriented.

<!-- Show sune case, at an ALMOST 2D (birds eye view) but slightly tilted and with hint facelets -->

Turn the top layer so that the oriented corner is at the front-left position.
Then do the sune sequence, and you're done!
This is called the sune case because it's solved with the sune sequence.

<!-- show example of solving Sune: AUF then sune -->

The **anti-sune** case looks similar: three corners need to twist counterclockwise:
<!-- show antisune -->

Again, turn the top layer so the oriented corner is at the front-left.
Do the sune sequence, but this time you are left with the sune case.
We can then solve the sune case as before.

<!-- show example of solving antisune: AUF sune AUF sune. -->

#### Headlight cases
The next type of cases are the **headlight cases**.
All of them have "headlights": a pair of yellow stickers on the same side, but not the top side. The cases look like this:

<!-- Show Pi, U, H with headlights circled -->

To solve these cases, turn the top layer so that headlights are on the left side. Then do the sune sequence. You'll either get a sune case which we know how to solve, or another case that we'll cover next!

<!-- show examples for each, in a collapsed section. Note that H has two pairs of headlights, so you can have them on the left and right -->

#### Other cases
There are two remaining cases:

<!-- Show T, L cases -->

To solve either of them, turn the top layer until you have a yellow sticker on the front side, towards the left. Like this:

<!-- Show **F**UL sticker position -->

Then do the sune sequence, and you'll get an anti-sune case which can be solved like before.

### Part 2: Swap the corners