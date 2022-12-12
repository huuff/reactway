# Performance
These are some ideas to improve `ArrayGrid`'s performance. I followed similar ones before with really good results. However, the results were so good that ticking is no longer the bottleneck (ticking takes around 10ms vs at least 60ms for rendering). So implementing these could be overkill.

* Remove tuples from the grid's `get` signature... this will help avoid creating that many objects.
* Store integers instead of booleans in the grid, and just go adding them instead of just doing `result++` (Is that faster? Well, I guess so, because of branching)
* Store the whole grid on a single array, just adding the appropriate offsets to every access.
