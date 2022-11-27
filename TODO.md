# Tasks
* Finish the choosing of cell size:
  * Make it change when moving the scroll wheel
  * I'm sure I broke some test, or at least, that I should test the cellSize setting
* Hiding settings in a drawer
* `MapGrid` and `ArrayGrid` tests are pretty much the same... can't I do some sort of property testing so I can pass the same parameters and just change the implementation?
* A dark mode so it's not so harsh on my eyes?
* Only showing the move cursor when the grid is larger than the screen?
* What about rendering only the part of the grid that's visible? That might be helpful with performance, though hard.
* Optimize `MapGrid` as I did for `SetGrid`
* ` A component is changing a controlled input to be uncontrolled.` warning. Likely because of my `useNumberInput` hook... why not use null instead of undefined?
* React warning because I'm passing the `setValue` property of my `useNumberInput` to the inputs.
