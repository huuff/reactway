# Tasks
* Rendering only the visible parts:
  * Do it for `TableGrid` too
  * Do it for `AsciiGrid` too
* I think `DarkModeSelector` and `SlowIndicator` should be in the layout? They're everywhere
* There's a serious issue at this point with dark mode. Since it depends on system settings, it can't be rendered server-side, and it introduces some artifacts when done so. However, wrapping in a `ClientSideOnly` is not a good solution, since that would mean wrapping almost all of the application in it.
* The background for the `DarkModeSelector` isn't working
* Make an introductory page explaining the rules of the game and the implementation
