# Tasks
* Try to make it so I don't need that `NoSsr` stuff... I think it comes from using `LocalStorage`?
* Fix warnings
* Now that I have a tuple nominal type, maybe I should change all the grid methods that take separate x and y to take just `Coordinates`
* Add back drag scroll
* Rendering only the visible parts:
  * Do it for `TableGrid` too
  * Do it for `AsciiGrid` too
* Hiding settings in a drawer
* `MapGrid` and `ArrayGrid` tests are pretty much the same... can't I do some sort of property testing so I can pass the same parameters and just change the implementation?
* A dark mode so it's not so harsh on my eyes?
* Only showing the move cursor when the grid is larger than the screen?
* ` A component is changing a controlled input to be uncontrolled.` warning. Likely because of my `useNumberInput` hook... why not use null instead of undefined?
* React warning because I'm passing the `setValue` property of my `useNumberInput` to the inputs.
