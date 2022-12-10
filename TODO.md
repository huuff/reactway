# Tasks
* Tracking performance should take into account more stuff than ticking, such as rendering
* The settings view looks pretty bad on google chrome
* Show population somewhere?
* Make a page showing some guns like Gosper's Glider Gun
* Try to make it so I don't need that `NoSsr` stuff... I think it comes from using `LocalStorage`?
* Rendering only the visible parts:
  * Do it for `TableGrid` too
  * Do it for `AsciiGrid` too
* Hiding settings in a drawer
* `MapGrid` and `ArrayGrid` tests are pretty much the same... can't I do some sort of property testing so I can pass the same parameters and just change the implementation?

## Performance
(Some ideas to improve ArrayGrid's performance)
* Remove tuples from the grid's `get` signature... this will help avoid creating that many objects.
* Store integers instead of booleans in the grid, and just go adding them instead of just doing `result++` (Is that faster? Well, I guess so, because of branching)
* Store the whole grid on a single array, just adding the appropriate offsets to every access.
