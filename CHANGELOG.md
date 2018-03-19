# Release Notes

## 4.1.2 - March 19, 2018

* Fix spacing on Table toolbar buttons. For this to work, you must use the HTML as illustrated on the Tables page:

```html
<div class="toolbar">
  <!-- immediate child items must be block items-->
  <div class="toolbar-left">
    <!-- left-side buttons go here  -->
  </div>
  <div class="toolbar-right">
    <!-- right-side items go here, or leave empty-->
  </div>
</div>
```

* Fix padding on Address Blocks Shipping "Compact Boxed" floating labrls

## 4.1 - December 15, 2017

### Code Changes

#### ADDITIONS

* **Web > Basics > Color Themes:** Added 3 new color themes. To use, add a `theme` attribute to your main `body` tag, as in
  ```html
  <body ng-controller="AppController as app" theme="ocean">
  ```
  See the Color Themes page for detailed instructions.
* **Gradients** on large areas, such as Sign In page backgrounds, are now at an angle on all themes.
* **Web > Components > Address Blocks:** Added a 7th "generic" address block type, along with guidance for additional countries
* **Web > Components > Buttons:** Added a white button, to use on image or dark backgrounds
* **Web > Components > Input Fields:** "Floating label" examples added
* **Web > Components > Payment Blocks:** New section with code, plug-ins, and code examples
* **Web > Components > Promotional:** A collapsible and configurable promotional "Hero" pattern
* **Web > Components > Widgets:** HTML structure of Data Widgets has been updated and simplified. New classes for applying colors to Data Widgets have been added. Existing Data Widgets should still work as before.

#### NON-BREAKING CHANGES

* **Web > Basics > Typography:** Line spacing with geometric progress to promote a better visual rhythm.
  * Line height has been standardized to 1.5.
  * Space above and below headers, paragraphs, and list items are now based on multiples of 8 (e.g. 4px, 8px, 16px, 32px).
* **Web > Components > Accordions:** The size of the carets has been reduced
* **Web > Components > Buttons:**
  * Fixed styling of table toolbar dropdown button menu
  * Fixed code snippet for Block Button Group
  * Added class for Icon Buttons in tables, to override the normal min-width:
  ```html
      <button class="btn btn-default btn-icon">
    <i class="nc-icon-mini ui-1_email-84"></i>
  </button>
  ```
* **Web > Components > Checkboxes:** Fixed code snippet for Enhanced Checkboxes
* **Web > Components > Drag & Drop:** Fixed icon positioning issue while dragging a table row
* **Web > Components > Headers & Footers:** Fixed padding-right on last header item in right menu icons. Fixed padding on footer to match container
* **Web > Components > Signin and Signup:** Fixed field names in code snippets
* **Web > Components > Tables:** Table column headers are now bold

## Thank You

As always, we've relied on the ideas and support from the entire PB community to keep Design System moving forward. Please keep the feedback coming. In particular, we'd like to thank the following individuals for helping with this release:

Abraham Dybvig, Alexandra Gruggett, Andrzej Krzysztof Gdula, Ania Mastriano, Beth Jennings, Cameron Chu, Consuelo Ruybal, Dave Fondacaro, Eric Dunsker, Gaurav Tikekar, Jake Taylor, James Crisp, Jennifer Bird, Jim Norris, Joan Doutney, Lawrence Najjar, Manisha Monga, Ron Cianfaglione, Sean Prince

## 4.0.4 - October 26, 2017

* **Web > Components > Drag and Drop:** Fixed icons in draggable table row to hide while dragging. Added right padding to table columns to prevent content from crashing into next column.

## 4.0.3 - October 19, 2017

* **Web > Components > Menus:** fixed line height on XS menus

## 4.0.2 - October 16, 2017

* **Web > Components > Cards:** every last-child inside `card-body` was set to `margin-bottom 0`. This has been removed.

## 4.0.1 - October 6, 2017

#### NON-BREAKING CHANGES

* **Web > Components > Address Blocks:** fixed alignment of error messages on floating label variant
* **Web > Components > Accordions:** reduced size of carets

## 4.0 - October 3, 2017

### Code Changes

#### BREAKING CHANGES

* **Web > Basics > Iconography:** Updated PBFont to add Data Hub icons
* **Web > Components > Miller Columns:** Updated to use Flexbox instead of BS columns
* **Web > Components > Modals:** Draggable modal removed
* **Web > Data Visualization:** C3 charts have been deprecated in favor of D3 charts. ChartJS is still supported.

#### NON-BREAKING CHANGES

* **Web > Data Visualization:**
  * Added Dashboard examples and guidance
  * Added D3 charts along with code samples and guidance around best practices and chart accessibility
    * Area Chart
    * Bar Chart
    * Bubble Chart
    * Bubble Map
    * Choropleth Map
    * Donut Chart
    * Dot Map
    * Gauge
    * Line Chart
    * Metric Blocks
    * Pie Chart
    * Scatterplot Chart
    * Sparkline
    * Stacked Bar Chart
* **Web > Components > Directives:** Added a Password Reveal directive
* **Web > Components > Error Pages:** added translation strings as json for download
* **Web > Components > Forms:** space between label and field tightened; space between form fields tightened
* **Web > Components > Headers & Footers:** Header height adjusted slightly to match PB.com header (from 70px to 75px)
* **Web > Components > Maps:**
  * Add UI-Leaflet examples
  * Add POI icons and color palette
  * Update fullscreen icon to change state when map is fullscreened
* **Web > Components > Sliders:** Added new slider control
* **Web > Components > Switches:** Fixed "off" color
* **Web > Components > Tabs:** Fix active tab label color

### Kudos and Thanks

The Design System [team](https://designsystem.pitneycloud.com/#/about/theteam) relies on your feedback, ideas and perspective for every improvement and addition.

For our 4.0 release, heaping loads of gratitude go to Nick Roberts and Jim Norris for their help on Tech Stack 2.

**These people also deserve a nod of recognition:**  
 Awkash Agrawal, Yarin Assaraf, Erik Balisi, Jenn Bird, Eric Booth, Market Bredholt, Kenn Bryant, Cameron Chu, Ron Cianfaglione, Dustin Clark, Richard Cole, Richard Collette, Sara Conklin, James Crisp, Nathan Curtis, Adam Czarnik, Luke Daugherty, Joan Doutney, Rick Dukeshier, Eric Dunsker, Stephen Evermore, Noam Feldman, Dave Fondacaro, Darin Gachne, Bama Govindaraja, Andy Grossman, Alexandra Gruggett, Cassie Gunn, Beth Jennings, Deepa Karodkar, Irshad A. Khan, Colin Kirkham, Jennie Lee, Robin Lupo, Jayachandra Madarapu, Ania Mastriano, Ronald Michaud, Lawrence Najjar, Erika Osterberg, Nitya Reddy Pannala, Christine Peckaitis, Ian Pitts, Sean Prince, Esther Raice, John Rosendahl, Christopher Rued, Consuelo Ruybal, Surya Sagi, Paresh Sahasrabudhe, Sikhar Jyoti Saikia, David Saunders, Daisuke Sawaki, Jerome Selinger, Shawn Sharifi, Chandra Prakash Sharma, Sanket Singh, Nat Sweeney, Jake Taylor, LI API Team, Gail Thomas, Benny Tseng, Connie Tuck, Aaran Williams , Marek Wisniewski

---

## 3.2.1 - April 27, 2017

### Code Changes

#### NON-BREAKING CHANGES

* Slight adjustments to a couple of colors:
  * pb-green-500 is now #00b140. This is also called "success-green."
  * The text version of this color is now #007d00.
  * pb-cyan-500 was incorrect on the **Web > Elements > Charts** and **Fundamentals > Accessibility** pages. This only affects the documentation.

## 3.2.0 - April 13, 2017

### Code Changes

#### BREAKING CHANGES

There should be no breaking changes in this build.

#### NON-BREAKING CHANGES

* The Design System web site runs on Angular 1.5.11, and all code has been tested to work with Angular 1.5.11.

* Design System pages now use a ui-router 3-view system: header, content, and footer
* **Web > Elements > Buttons:** Tile buttons now have a gray border
* **Web > Elements > Canvas Objects:** Added Canvas Objects guidance, palette, and code samples
* **Web > Elements > Checkboxes:** Fixed color of disabled checkboxes
* **Web > Elements > Date Pickers:** Fixes to Date Range Picker to hide redundant dates
* **Web > Elements > Help Popovers and Tooltips:** Fixed z-index of popovers and tooltips
* **Web > Elements > Links:** Links in blocks of copy (specifically, inside P, LI, and TD tags) are now underlined
* **Web > Elements > Menus:**
  * Deprecated use of “ng-tag-input” third-party directive
  * Fixed border color of UI-Select menus
  * Fixed styling of Select menus in Firefox
  * Fixed color contrast of tokens in the “multi-select with token”
* **Web > Elements > Modals:** Deprecated "draggable modal"
* **Web > Elements > Tabs:** Tile tabs now have rounded corners
* **Web > Elements > Tables:** Improved the “table-large” style to be noticeably different from standard table
* **Web > Foundation Iconography > Tables:** Nucleo icon fonts updated to their latest release
* **Web > Patterns > Drag and Drop:** Added drag-and-drop “table row” pattern and code sample
* **Web > Patterns > Empty States:** Added an Empty State with no icon
* **Web > Patterns > Headers and Footers:** Added code to footer controller to automatically display a date range

#### Updated Libraries

* angular: 1.5.11
* angular-bootstrap: 2.5.0
* angular-moment: 1.0.1
* angular-xeditable: 0.6.0
* chart.js: 2.5.0
* moment: 2.17.0
* ng-file-upload: 12.2.13
* ng-tags-input: 3.1.1
* progress-tracker: 1.4.0
* ui-router: 0.3.1

### Thank You

The Design System Team relies on your feedback, ideas and
perspective for every improvement and addition.

#### Special Thanks:

* Nilkantha Aryal for AWS support
* Henry Rogando for OKTA integration

#### These people also deserve recognition:

Ania Mastriano, Anshul Jindal, Bhalchandra Bhosale, Cameron Chu, Denish Gandhi, Eesha Veeravalli, Erik Balisi, Gaurav Jain, Jane Matthews, Jayachandra Madarapu, Jennie Lee, Jenniza Paunetto, Jim Norris, Joan Doutney, Ken Zaldo, Lawrence Najjar, Rajesh Kumar, Rich Collette, Rick Dukeshier, Ron Cianfaglione, Sara Conklin, Shawn Sharifi, Sula Veneti.

##3.1.1 - December 20, 2016

* Removed an image reference from the CSS which interfered with users wishing to use Webpack. There should be no images in the css now.

* `pbds-checkboxes` was incorrectly checking for the existence of controller properties (for `ng-model`, `ng-true-value`, `ng-false-value` and `ng-required`), rather than checking for the element attributes. If the controller property for `ng-model` was not explicitly defined an error would be thrown. This is fixed.

##3.1.0 - December 15, 2016

### Code Changes

#### BREAKING CHANGES

* **Web > Patterns > Headers and Footers**

  * Removed the vertical divider line on the right side of the header (to the left of utility items). You will need to delete the `li` tag with the `divider-vertical` class — the second line below:

  ```html
    <!-- start right menus -->
    <ul class="nav navbar-nav navbar-right">
      <li class="divider-vertical hidden-xs"></li>
  ```

  * Footer is now consistent on both sign in pages and other pages. The old sign-in footer has been removed. The only difference between the footer on sign in pages and other pages are the links on the right. Please see the screenshots and code snippets on the site.

* **Web > Patterns > Tour** was updated to use the new footer. The HTML has been simplified as well, which should make it easier to add this tour to a typical sign-in screen.

* **Web > Patterns > Error Pages** have updated design/layout, HTML, CSS and icons. Icons are now SVG embedded in CSS. See code snippets for usage.

* **Web > Elements > Buttons:** "Pill" buttons are deprecated. Please switch to standard buttons, as the pill button CSS _will be removed in the next release_.

* **Web > Elements > Tables > Tables with Data > Row Details:** Tables nested inside expanded "detail rows" used to have their cell backgrounds set to gray. This caused issues if you needed to use a table in a detail row with a white background. Due to this change, it's easier to set your own cell backgrounds on such tables.

* **Web > Elements > Tables > Table Toolbar:** The class `.toolbar` has been modified to use `display:flex` instead of relying on Bootstrap columns and floats. This gives more flexibility for laying out buttons and menus. See the code snippets in the Tables section for instructions on usage. Older toolbars will need to be updated.

  ```html
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
  ```

* **Web > Foundation > PBDS Directives** that support angular-translate now have a consistent syntax, see examples.

#### NON-BREAKING CHANGES

* **Web > Foundation > Iconography:** PB font now works correctly with size modifier classes (e.g. `x2`).

* **Web > Patterns > Headers and Footers**: The footer logo has been updated with a version optimized for its size. The logo is embedded in CSS as before, so no code changes are required.

* **Web > Foundation > PBDS Directives:**

  * `<pbds-checkbox>` added use of ng-true-value, ng-false-value and ng-required attributes.
  * `<pbds-radio>` added use of ng-value and ng-required attributes.

* **Web > Patterns > Hamburger Menu:** Added in new responsive version.

  * The `.burger-backdrop` and `.hamburger-modal` classes are no longer needed and are deprecated. These will be removed from CSS in a future release.
  * Various bugs were addressed, such as non-working _push_ and _slide_ examples and footer position.
  * We updated code snippets so the examples will work correctly.

* **Web > Patterns > Sign In/Sign Up:**

  * Added a new screen for "session time out."
  * Pages are now using angular-translate to support translation. Localized translations will be included in the next release.
  * Containers (e.g. the white box) now have rounded corners.

* **Web > Elements > Miller Column** border colors have been fixed to be consistent with other borders, and list item hover color fixed.

* **Web > Foundation > Color:** The $pb-gray-200 variable changed from #eaeaea to #e1e1e1.

* **Web > Elements > Tabs:** The text color of the active tab has been fixed.

* **Web > Elements > Notifications:** Toastr backgrounds no longer semi-transparent, fixing a bug caused by a plugin update.

* **Web > Elements > Gallery:** Image carousel hover states were updated to match the rest of the DS.

  ​

#### Updated Libraries

* angular-bootstrap: 2.2.0
* angular-chart.js: 1.0.3
* angular-dragula: 1.2.8
* angular-moment: 1.0.0
* angular-ui-select: 0.19.6
* bootstrap: 3.3.7
* moment: 2.11.0
* ng-file-upload: 12.2.13
* ng-tags-input: 3.1.1
* progress-tracker: 1.4.0

## Thank You

As always, we've relied on the ideas and support from the entire PB community to keep Design System moving forward. Please keep the feedback coming. In particular, we'd like to thank the following individuals for helping with this release:

Anshul Jindal, Arman Bedonian, Beth Jennings, Cameron Chu, Christopher Rued, Dustin Clark, Erik Balisi, Esther Raice, Ishan Misra, Jayachandra, Jessica Spinel-Merete, Jim Zhao, Joan Doutney, John Gomersall, Lawrence Najjar, Luke Daugherty, Maciej Siedlaczek, Mariusz Krymkowski, Matt Lavalle, Neil Sampson, Richard Collette, Ron Cianfaglione, Ron Michaud, Sara Conklin, Vinay Nijhawan, Yuhua Lee

## 3.0.2 - October 18, 2016

* Fix pbds-progress-button double click issue (reported by Cameron Chu)

## 3.0.1 - September 29, 2016

This hotfix includes a fix for bugs in IE11. This is a non-breaking change.

* The footer was not staying at the bottom in IE11. This was due to a known flexbox bug in IE11 that was fixed by Microsoft in Edge. To make it work in IE11 we made a change in the CSS of the `body` tag's height from `min-height:100%` to `height:100%`. No html changes are required.

## 3.0.0 – August 31, 2016

Beginning with 3.0, we have greatly simplified how to consume the Design System:

* All end users should use the Bower/npm package located on [Github](https://github.com/PBGUX/bower-designsystem).
* If you don't use Bower or npm and want to just use the CSS file, you'll find it (and the required fonts) in the [/dist directory](https://github.com/PBGUX/bower-designsystem/tree/master/dist) of the same repo.
* To see the Design System integrated into an actual simple Angular JS application that you can download and user as a starting point, please see our [Starter App repo](https://github.com/PBGUX/starter-app).

Any of the above three methods is the best way to get going with Design System 3.x.

The release notes for 3.0.0 are divided into two main sections: Code Changes and Site Changes.

## Code Changes

### BREAKING CHANGES

* The main index page has been simplified, and now uses CSS Flexbox to maintain footer position instead of CSS `calc`. For this to work correctly, your `body` tag must have only these chidren:
  ​```html
    <header pbds-header pbds-header-shadow></header>
  <div ui-view="" class="view-animate site-content"></div>
  <footer pb-ds-footer></footer>
​```
* The `site-content` div is critical for correct spacing. It will automatically expand to fill all the space between the header and footer, which will remain locked to top and bottom, respectively. The `site-content` div also automatically adds a top margin on pages with a header, so the page's title is the correct distance from the header.
* Font Awesome has been removed. All icons are now provided by the Nucleo family. Details on these fonts (and a helpful conversion table for moving from Font Awesome to Nucleo) are on the Web > Iconography page. If you must use Font Awesome for a limited time to avoid things breaking, you'll need to add a link to the [Font Awesome CDN](http://fontawesome.io/get-started/) in your `index.html`.
* Widgets HTML code has changed to better align the contents with Flexbox.

##### There are a few changes to the Header:

* The header has been updated to include the Pitney Bowes icon at the left. This needs to be added to your header HTML. See Web > Headers and Footers for the code snippet.
* The mobile screen's "hamburger" menu now has a directive added to allow it to close automatically once a menu item is selected on a phone.
* The right-side "user" menu item is responsive. At desktop sites, it displays the full user name with an optional notification number next to it. At smaller screen sizes, this changes to the user's initials and a simple "dot" to indicate notifications.
* Right-side items are automatically "moved" to the mobile hamburger menu. See code snippets for details on setting this up.
* The header is now 70px tall instead of 50px. This is taken care of via CSS.

##### There are a couple of changes to the Footer as well:

* The footer is now light blue, and is also 70px tall. Both of these are in the updated CSS. Be sure you are using the latest footer code as shown on the Web > Headers and Footers page.
* Language and capitalization for the footer's content has been updated and standardized.

##### Other breaking changes:

* Welcome pages have new HTML and CSS for improved layout.
* Hamburger Menu and Split View layouts with expand/collapse side navigation have completely updated HTML. They now use Angular UI Bootstrap for expanding and collapsing behaviors. Non-expanding side navigation variants should not require code changes.

### NON-BREAKING CHANGES

#### Look and Feel: One Design System

Our ongoing _One Design System_ initiative has brought together leaders in Global User Experience, Digital Marketing, Branding Strategy and Tech Central to devise strategies for achieving better alignment and harmony across the PB.com domain and our products.

The team's work has resulted in a cohesive set of standards for common master-brand elements (such as typography, colors and critical UI components) and unified experiences for onboarding, notifications and global navigation. To achieve this, the following changes have been made.

##### General Notes

* Basic Accessibility has been added to many controls in the form of _aria_ and _role_ attributes, as needed. Note that some items cannot be made accessible. These items are indicated with a badge: "Not Accessible".

- CSS animation classes have been added to the CSS file. Many don't require any changes to use, but there are several optional classes you can add to your HTML. Documentation can be found at _Web > Motion_. Note these require the installation of the AngularJS ng-animate package.

##### Foundations

* Color palette
  * Colors have been streamlined, and Sass variable names for the Neutral Palette have been updated and made more consistent with other color variable names. This is documented on the Web > Color page. These updates are all compiled into the 3.0 CSS and should not require any changes on your part, but Sass variable names and hex colors are provided for those who may need them.
* Typography now includes display text styles and comprehensive styling for Header, Body, Navigation and UI Controls.
  * Sass variables, CSS class names, and hex colors are now displayed inline to simplify usage in code.
  * Code snippets are now provided for list types.
* The PBDS Components page has been expanded with more directives and more code samples:
  * Added `pbds-alert-global` directive that adjusts the position of the header based on the height of the global alert message.
  * Added `pbds-accordion` attribute directive that adds and removes the `.active` class to display the selected state on vanilla bootstrap accordions. This directive replaces the `pb-accordion` directive.
  * Added `pbds-header-shadow` attribute directive that adds and removes the .shadow class when the window scroll is greater than 20 pixels from the top. This directive replaces the `pb-fixed-navbar` directive.
  * Added `<pbds-progress-button>` element directive that shows a spinner icon animation while a process, such as a network request, is being completed. This directive replaces the `pb-button-progress` directive.
  * Added `<pbds-transitory-alert>` element directive that shows a message next to a button after a process, such as a network request, is completed. This directive replaces the `pb-transitory-alert` directive.
* A new Motion page has been added with documentation, live examples and code snippets for working with our new animation library.

##### Elements

* Accordions include standard Bootstrap as well as Angular UI Bootstrap code snippets. Styling has been updated and synchronized between both.
* Breadcrumbs are now delimited with `>` instead of `/`. This is CSS and requires no changes.
* Buttons now have rounded corners, a `focused` state, and updated colors. Basic ARIA attributes have been added to supplied code snippets for accessibility.
* Charts have been updated to use latest `chart.js` library.
* Containers have been updated with new styles and rounded corners.
* The Gallery features a new "items" type.
* Help popovers and tooltips have been updated. The info icon is now `$pb-blue-700`(`#314183`) and the popovers and tooltips now leverage the new animation library.
* Input fields also have rounded corners and a new focused state.
* Link color is now `$pb-blue-700`(`#314183`). ARIA attributes added to icon links.
* Modals updated with rounded corners
* Notifications (alerts, toastrs) updated with new colors and styles. A "global" notification type has been added, which appears above the header. The "transitory alert" has an updated directive.
* There is a new Numeric Stepper control.
* Panels have been renamed to Cards. Therefore all `panel-` classes are now `card-` classes. For the time being, we are maintaining the older panel classes, for backward compatibility. See updated code snippets on Web > Elements > Cards.
* Progress indicators: Colors have been updated for accessibility and a new "Step Progress" indicator has been added. The progress button has a new directive (see above).
* Tabs
  * These have been updated with rounded corners.
  * “Sliding” tabs have been updated and classes added to simplify having alternate numbers of tabs, from 3 to 6. See Web > Elements > Tabs > Sliding > Custom Tab Number.
  * Sliding Section Tabs and Sliding Boxed Tabs were added.
* Tables updated with new styling and additional sizes.
* Widgets now have rounded corners. They also have been updated to use Flexbox to properly align their contents.

##### Patterns

* Headers and Footers have several breaking changes. Please see "Breaking Changes" above.
* We have added code for a Loading Screen for applications. This code actually goes on `index.html`. See the code snippet for details.
* Welcome pages have updated HTML. Please see "Breaking Changes" above.
* We have added a Tour module and code snippets.

## Site Changes

The Design System web site has undergone major changes and expansion for 3.0. Design guidance has been expanded to include Desktop, Hardware, and printed documentation. The existing Web and Mobile sections have been reorganized and expanded, with more examples and web code snippets you can simply cut and paste into your code editor.

#### Navigation

The Design System's navigation has been improved. The informatioon architecture has been revamped, with pages (and their sections of content) renamed to facilitate finding exactly what you need. On individual pages, an auto-expanding side navigation menu has been added to allow instant navigation on the page and also provide feedback as you scroll between sections, so you always know where you are.

#### Search

A keyword search field has been added to the global header. It will show matches to typed queries and the section(s) where the query was found, so you can focus on the most relevant search results.

#### Fundamentals

* The Fundamentals section (formerly called "Principles") includes content about our goals, principles and methods for achieving excellence in branding, design and development. It also includes key information on Accessibility and Globalization.

  * The expanded Accessibility section adds an accessibility checklist and numerous links to resources on the web.
  * The Globalization section includes documentation and a live demo of Angular Translate.

#### Web

* The Web section has been greatly exapanded, rewritten, and reorganized based largely on user feedback. Code-related changes to the Web section are outlined above in the "Code Changes" section.

#### Foundation

* The Color palette has been streamlined to six colors, the Neutral palette color have been updated and renamed, and the background colors have been updated.
* A Motion page has been added with live demos and documentation for our animation library.
  * The PBDS Directives page has been expanded and updated with new directives and expanded code snippets.
  * Typography now includes display text styles and comprehensive styling for Header, Body, Navigation and UI Controls. Sass variables, CSS class names, and hex colors are now displayed inline to simplify usage in code.
  * The Tech Stack page has been updated with more up-to-date information.

#### Elements

* Components now have code snippets that can be copied and pasted into your code editor. Depending on the component, this might be HTML, Javascript and/or Sass code.
* Items have been reorganized and relabeled based on developer feedback. Each element has its own link in the area's megamenu, and each page is better organized and labeled — with a new, expanding left navigation that allows you to easily jump to the information you need.
  * Elements have been updated to use the One Design System look and feel, with rounded corners, more space around items and updated colors.
  * For detailed information on Elements, please see the "Code Changes" section above.

#### Patterns

* Headers now include PB logo designmark, larger header height, Nucleo icons, and hub notification.
* Footers have been updated with new light blue background and expandable "Contact us" information.
  * There's new left-hand navigation in Hamburger menu and Split views.
  * A new Loading screen pattern was added.
  * Sign in/Sign up containers now have rounded corners.
  * There is a Sample App to show how the various elements of the Design System are used together.
  * There's a new pre-sign-in Tour pattern, with code snippet.

#### Mobile

The mobile section of the Design System has been reorganized and expanded with images that reflect our One Design System initiative.

* Our new mobile sample app shows how various mobile elements and patterns are used together. You can view the demo video, or download the app.
* A new Development section has been added with links to iOS and Android SDKs and sample applications.
* Images have been updated, and are now shown in a device surround.
* Writing guidance and usage tips have been added throughout.
* Motion has been added with a video demonstrating motion standards.
* A Loading Screens page has been added.

#### Desktop

New for 3.0: this section shows Design System guidelines and specifications for Windows-based products. Measurements, colors, and type specifications for all interface elements in a typical desktop software application are provided.

#### Hardware

Also new for 3.0, this section provides guidance and specifications for hardware products.

#### Content

The content section has been enhanced and expanded, and now includes guidance for user documentation, packaging and PDF reports.

#### Resources

The resources section has been updated to provide links to download the Design System for Web and Mobile platforms. It also includes a Starter App: a GitHub repo of a typical AngularJS application using the latest Design System Bower component and basic pages and ui-router setup. You can download or clone this repo and have a running Design System 3 web application within minutes.

## Thank You

Thank you to the following individuals and the entire PB community, who have given us the feedback needed to get to this 3.0 milestone. Please keep the feedback coming.

Abhijeet Gupta, Abhiraj Satarate, Amod Kumar Singh, Andrea Greggo-McManus, Andrew Wong, Andy Grossman, Bryant Gutierrez, Cameron Chu, Cassie Gunn, Christopher Rued, Colin Brunger, Daniel Roestorf, Dave Fondacaro, Dustin Clark, Eric Robinson, Hemant Sharma, Ian Pitts, Irshad Khan, James R Norris, Jayachandra M, Jenn Church, Joan Doutney, John Rosendahl, John Winkleman, Jorge A Rodriguez, Kenneth S Zaldo, Kevin Bodie, Luke Daugherty, Nicholas Roberts, Nilkantha Aryal, Paresh Sahasrabudhe, Rajeev Verma, Ray Navarette, Richard Collette, Richard J Cole, Rick Dukeshier, Ron Cianfaglione, Sam Singh, Shaishav Saraswat, Shawn Sharifi, Steve Evermore, Steve King, Sula Veneti, Sung Kim, Tom Tyrell
