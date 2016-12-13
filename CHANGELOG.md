# Release Notes

##3.1.0 - December 15, 2016

### Code Changes

####BREAKING CHANGES

- **Web > Patterns > Headers and Footers** 

  - Removed the vertical divider line  on the right side of the header (to the left of utility items).  You will need to delete the `li` tag with the `divider-vertical` class — the second line below:

  ```html
    <!-- start right menus -->
    <ul class="nav navbar-nav navbar-right">
      <li class="divider-vertical hidden-xs"></li>
  ```

  - Footer is now consistent on both sign in pages and other pages.  The old sign-in footer has been removed. The only difference between the footer on sign in pages and other pages are the links on the right.  Please see the screenshots and code snippets on the site.

- **Web > Patterns > Tour** was updated to use the new footer.  The HTML has been simplified as well, which should make it easier to add this tour to a typical sign-in screen.

- **Web > Patterns > Error Pages** have updated design/layout, HTML, CSS and icons.  Icons are now SVG embedded in CSS.  See code snippets for usage.

- **Web > Elements > Buttons:** "Pill" buttons are deprecated.  Please switch to standard buttons, as the pill button CSS *will be removed in the next release*.

- **Web > Elements > Tables > Tables with Data > Row Details:** Tables nested inside expanded "detail rows" used to have their cell backgrounds set to gray. This caused issues if you needed to use a table in a detail row with a white background.  Due to this change, it's easier to set your own cell backgrounds on such tables.

- **Web > Elements > Tables > Table Toolbar:** The class `.toolbar` has been modified to use `display:flex` instead of relying on Bootstrap columns and floats. This gives more flexibility for laying out buttons and menus. See the code snippets in the Tables section for instructions on usage. Older toolbars will need to be updated.

  ````html
  <div class="toolbar">
    <!-- immediate child items must be block items, like divs-->
    <div class="toolbar-left">
      <!-- these buttons will be on the left -->
      <button class="btn btn-link" type="button">...</button>
    </div>

    <!-- add a third div here for centered buttons -->

    <div class="toolbar-right">
      <!-- these buttons will be on the left -->
      <!-- or simply add an empty div for proper flexbox spacing end-to-end-->
    </div>
  </div>
  ````

- **Web > Foundation > PBDS Directives** that support angular-translate now have a consistent syntax, see examples.



####NON-BREAKING CHANGES

- **Web > Foundation > Iconography:** PB font now works correctly with size modifier classes (e.g. `x2`).

- **Web > Patterns > Headers and Footers**: The footer logo has been updated with a version optimized for its size. The logo is embedded in CSS as before, so no code changes are required.

- **Web > Foundation > PBDS Directives:**

  - `<pbds-checkbox>` added use of ng-true-value, ng-false-value and ng-required attributes.
  - `<pbds-radio>` added use of ng-value and ng-required attributes.

- **Web > Patterns > Hamburger Menu:** Added in new responsive version.

  - The `.burger-backdrop` and `.hamburger-modal` classes are no longer needed and are deprecated. These will be removed from CSS in a future release.
  - Various bugs were addressed, such as non-working *push* and *slide* examples and footer position.
  - We updated code snippets so the examples will work correctly.

- **Web > Patterns > Sign In/Sign Up:** 

  - Added a new screen for "session time out."
  - Pages are now using angular-translate to support translation. Localized translations will be included in the next release.
  - Containers (e.g. the white box) now have rounded corners.

- **Web > Elements > Miller Column** border colors have been fixed to be consistent with other borders, and list item hover color fixed.

- **Web > Foundation > Color:** The $pb-gray-200 variable changed from #eaeaea to #e1e1e1.

- **Web > Elements > Tabs:** The text color of the active tab has been fixed.

- **Web > Elements > Notifications:** Toastr backgrounds no longer semi-transparent, fixing a bug caused by a plugin update.

- **Web > Elements > Gallery:** Image carousel hover states were updated to match the rest of the DS.

  ​


####Updated Libraries

angular-bootstrap: 2.2.0

angular-chart.js: 1.0.3

angular-dragula: 1.2.8

angular-moment: 1.0.0

angular-ui-select: 0.19.6

bootstrap: 3.3.7

moment: 2.11.0

ng-file-upload: 12.2.13

ng-tags-input: 3.1.1

progress-tracker: 1.4.0


## Thank You

As always, we've relied on the ideas and support from the entire PB community to keep Design System moving forward. Please keep the feedback coming. In particular, we'd like to thank the following individuals for helping with this release:

Anshul Jindal, Arman Bedonian, Beth Jennings, Cameron Chu, Christopher Rued, Dustin Clark, Erik Balisi, Esther Raice, Ishan Misra, Jayachandra, Jessica Spinel-Merete, Jim Zhao, Joan Doutney, John Gomersall, Lawrence Najjar, Luke Daugherty, Maciej Siedlaczek, Mariusz Krymkowski, Matt Lavalle, Neil Sampson, Richard Collette, Ron Cianfaglione, Ron Michaud, Sara Conklin, Vinay Nijhawan, Yuhua Lee


##3.0.2 - October 18, 2016

- Fix pbds-progress-button double click issue (reported by Cameron Chu)

##3.0.1 - September 29, 2016

This hotfix includes a fix for bugs in IE11.  This is a non-breaking change.

- The footer was not staying at the bottom in IE11.  This was due to a known flexbox bug in IE11 that was fixed by Microsoft in Edge.  To make it work in IE11 we made a change in the CSS of the `body` tag's height from `min-height:100%` to `height:100%`.  No html changes are required.


##3.0.0 – August 31, 2016

Beginning with 3.0, we have greatly simplified how to consume the Design System:

- All end users should use the Bower/npm package located on [Github](https://github.com/PBGUX/bower-designsystem).
- If you don't use Bower or npm and want to just use the CSS file, you'll find it (and the required fonts) in the [/dist directory]( https://github.com/PBGUX/bower-designsystem/tree/master/dist) of the same repo.
- To see the Design System integrated into an actual simple Angular JS application that you can download and user as a starting point, please see our [Starter App repo](https://github.com/PBGUX/starter-app).

Any of the above three methods is the best way to get going with Design System 3.x.


## Code Changes

### BREAKING CHANGES

- The **main index page** has been simplified, and now uses CSS Flexbox to maintain footer position instead of CSS `calc`. For this to work correctly, your `body` tag must have **only** these chidren:
```html
    <header pbds-header pbds-header-shadow></header>
    <div ui-view="" class="view-animate site-content"></div>
    <footer pb-ds-footer></footer>
```
- The `site-content` div is critical for correct spacing. It will automatically expand to fill all the space between the header and footer, which will remain locked to top and bottom, respectively. The `site-content` div also automatically adds a *top margin* on pages with a header, so the page's title is the correct distance from the header.
- Font Awesome has been removed. All **icons** are now provided by the Nucleo family. Details on these fonts (and a helpful conversion table for moving from Font Awesome to Nucleo) are on the *Web > Iconography* page. If you must use Font Awesome for a limited time to avoid things breaking, you'll need to add a link to the [Font Awesome CDN](http://fontawesome.io/get-started/) in your `index.html`.
- **Widgets** HTML code has changed to better align the contents with Flexbox.

##### There are a few changes to the Header:

- The header has been updated to include the Pitney Bowes icon at the left. This needs to be added to your header HTML. See *Web > Headers and Footers* for the code snippet.
- The mobile screen's "hamburger" menu now has a directive added to allow it to close automatically once a menu item is selected on a phone.
- The right-side "user" menu item is responsive. At desktop sites, it displays the full user name with an optional notification number next to it. At smaller screen sizes, this changes to the user's initials and a simple "dot" to indicate notifications.
- Right-side items are automatically "moved" to the mobile hamburger menu. See code snippets for details on setting this up.
- The header is now 70px tall instead of 50px.  This is taken care of via CSS.

##### There are a couple of changes to the Footer as well:

- The footer is now light blue, and is also 70px tall.  Both of these are in the updated CSS. *Be sure you are using the latest footer code* as shown on the  *Web > Headers and Footers* page.
- Language and capitalization for the footer's content has been updated and standardized.

##### Other breaking changes:

- **Welcome** pages have new HTML and CSS for improved layout.
- **Hamburger Menu** and **Split View** layouts with expand/collapse side navigation have completely updated HTML. They now use Angular UI Bootstrap for expanding and collapsing behaviors. Non-expanding side navigation variants should not require code changes.



### NON-BREAKING CHANGES

####Look and Feel: One Design System

Our ongoing _One Design System_ initiative has brought together leaders in Global User Experience, Digital Marketing, Branding Strategy and Tech Central to devise strategies for achieving better alignment and harmony across the PB.com domain and our products.

The team's work has resulted in a cohesive set of standards for common master-brand elements (such as typography, colors and critical UI components) and unified experiences for onboarding, notifications and global navigation. To achieve this, the following changes have been made.

##### General Notes

- **Basic Accessibility** has been added to many controls in the form of _aria_ and _role_ attributes, as needed. Note that some items cannot be made accessible.  These items are indicated with a badge: "Not Accessible".


- **CSS animation** classes have been added to the CSS file.  Many don't require any changes to use, but there are several optional classes you can add to your HTML. Documentation can be found at _Web > Motion_. Note these require the installation of the AngularJS ng-animate package.  

#####Foundations
- **Color palette**
  - Colors have been streamlined, and Sass variable names for the Neutral Palette have been updated and made more consistent with other color variable names. This is documented on the *Web > Color* page. These updates are all compiled into the 3.0 CSS and should not require any changes on your part, but Sass variable names and hex colors are provided for those who may need them.
- **Typography** now includes display text styles and comprehensive styling for Header, Body, Navigation and UI Controls.
  - Sass variables, CSS class names, and  hex colors are now displayed inline to simplify usage in code.
  - Code snippets are now provided for list types.
- The **PBDS Components** page has been expanded with more directives and more code samples:
  - Added `pbds-alert-global` directive that adjusts the position of the header based on the height of the global alert message.
  - Added `pbds-accordion` attribute directive that adds and removes the `.active` class to display the selected state on vanilla bootstrap accordions. ***This directive replaces the*** `pb-accordion` ***directive.***
  - Added `pbds-header-shadow` attribute directive that adds and removes the .shadow class when the window scroll is greater than 20 pixels from the top. ***This directive replaces the*** `pb-fixed-navbar` ***directive.***
  - Added `<pbds-progress-button>` element directive that shows a spinner icon animation while a process, such as a network request, is being completed. ***This directive replaces the*** `pb-button-progress` ***directive.***
  - Added `<pbds-transitory-alert>` element directive that shows a message next to a button after a process, such as a network request, is completed. ***This directive replaces the*** `pb-transitory-alert` ***directive.***
- A new **Motion** page has been added with documentation, live examples and code snippets for working with our new animation library.


##### Elements

- **Accordions** include standard Bootstrap as well as Angular UI Bootstrap code snippets.  Styling has been updated and synchronized between both.
- **Breadcrumbs** are now delimited with `>` instead of `/`. This is CSS and requires no changes.
- **Buttons** now have rounded corners, a `focused` state, and updated colors. Basic ARIA attributes have been added to supplied code snippets for accessibility.
- **Charts** have been updated to use latest `chart.js` library.
- **Containers** have been updated with new styles and rounded corners.
- The **Gallery** features a new "items" type.
- **Help popovers and tooltips** have been updated. The info icon is now `$pb-blue-700`(`#314183`) and the popovers and tooltips now leverage the new animation library.
- **Input fields** also have rounded corners and a new focused state.
- **Link** color is now `$pb-blue-700`(`#314183`). ARIA attributes added to icon links.
- **Modals** updated with rounded corners
- **Notifications**  (alerts, toastrs) updated with new colors and styles. A "global" notification type has been added, which appears above the header. The "transitory alert" has an updated directive.
- There is a new **Numeric Stepper** control.
- **Panels** have been renamed to **Cards**.  Therefore all `panel-*` classes are now `card-*` classes.  For the time being, we are maintaining the older panel classes, for backward compatibility. See updated code snippets on *Web > Elements > Cards*.
- **Progress indicators**: Colors have been updated for accessibility and a new "Step Progress" indicator has been added. The progress button has a new directive (see above).
- **Tabs**
  - These have been updated with rounded corners.
  - **“Sliding” tabs** have been updated and classes added to simplify having alternate numbers of tabs, from 3 to 6. See *Web > Elements > Tabs > Sliding > Custom Tab Number*.
  - **Sliding Section Tabs** and **Sliding Boxed Tabs** were added.
- **Tables** updated with new styling and additional sizes.
- **Widgets** now have rounded corners. They also have been updated to use Flexbox to properly align their contents.


##### Patterns

- **Headers and Footers** have several breaking changes.  Please see "Breaking Changes" above.
- We have added code for a **Loading Screen** for applications. This code actually goes on `index.html`. See the code snippet for details.
- **Welcome pages** have updated HTML.  Please see "Breaking Changes" above.
- We have added a **Tour** module and code snippets.


## Thank You

Thank you to the following individuals and the entire PB community, who have given us the feedback needed to get to this 3.0 milestone. Please keep the feedback coming.

Abhijeet Gupta, Abhiraj Satarate, Amod Kumar Singh, Andrea Greggo-McManus, Andrew Wong, Andy Grossman, Bryant Gutierrez, Cameron Chu, Cassie Gunn, Christopher Rued, Colin Brunger, Daniel Roestorf, Dave Fondacaro, Dustin Clark, Eric Robinson, Hemant Sharma, Ian Pitts, Irshad Khan, James R Norris, Jayachandra M, Jenn Church, Joan Doutney, John Rosendahl, John Winkleman, Jorge A Rodriguez, Kenneth S Zaldo, Kevin Bodie, Luke Daugherty, Nicholas Roberts, Nilkantha Aryal, Paresh Sahasrabudhe, Rajeev Verma, Ray Navarette, Richard Collette, Richard J Cole, Rick Dukeshier, Ron Cianfaglione, Sam Singh, Shaishav Saraswat, Shawn Sharifi, Steve Evermore, Steve King, Sula Veneti, Sung Kim, Tom Tyrell
