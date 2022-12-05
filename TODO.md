# Tasks
* Show population somewhere?
* There's some slight displacement in the colored box that follows the cursor to indicate where a click would toggle a cell in `CanvasGridView` when the grid takes less than the viewport size... this is obviously due to the transform to center it, but so far I've found no way to fix it.
* Try to make it so I don't need that `NoSsr` stuff... I think it comes from using `LocalStorage`?
* Rendering only the visible parts:
  * Do it for `TableGrid` too
  * Do it for `AsciiGrid` too
* Hiding settings in a drawer
* `MapGrid` and `ArrayGrid` tests are pretty much the same... can't I do some sort of property testing so I can pass the same parameters and just change the implementation?
* Only showing the move cursor when the grid is larger than the screen?
* Maybe use classNames everywhere? Seems like it'll be cleaner
* Use a theme somehow, because I'm messing colors all around
* `CanvasGameGrid` hover breaks when scrolling down (see `/lifeforms`)
