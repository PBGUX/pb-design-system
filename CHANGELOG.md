<<<<<<< Updated upstream
# 5.0.1 - November 29, 2018
=======
# 5.1.0 - May 1, 2019 (includes changes from beta)

## Changes

- Updated Angular version to 7.2.2. Although updating Angular is not required to use the Design System CSS, it is recommended. For a smooth update, follow the instructions at [https://update.angular.io/](https://update.angular.io/)
- Updated libraries to support Angular 7
  - PrimeNG 7.0.5
  - ng-bootstrap 4.0.2
  - ngx-loading-bar 4.2.0
>>>>>>> Stashed changes

## Fixes

- FIX PrimeNG icon-only button, as in drag-and-drop UI
- FIX Metric block badge color for accessiblity issue

## **Additions**

<<<<<<< Updated upstream
- Added PrimeNG calendar "date and time" picker (closes [#57](https://github.com/PBGUX/pb-design-system/issues/57))
- Added "expand all" and "collapse all" icons (closes [#65](https://github.com/PBGUX/pb-design-system/issues/65))
- Added additional requested icons: help (without circle), coins, left&amp;right direction arrows, newsletter, glasses, basket, palette, telephone, bullet, outline mini envelope, and a second style of globe and refresh icons.
=======
- Added Pricing Plans 
- Added Sliding Tabs (Angular Material)
- Added Draggable table rows (PrimeNG)
- Added table row "action menu" 
- Added example of table with row headers
- Added PrimeNG "Virtual Scroller" component
- Added links to download fonts and icons
- Added specs for gradient and header colors in themes
- Added new glyphs to PBI icon fonts: headset, checkmark/x/- inside square, refresh, empty outline circle, outline circle with diagonal line
- We now have approval from the PB Open Source Committee for all our open-source plugins, so teams will not need separate approval for these plugins. See the Tech Stack page for details.
- Updated Geosearch API information


## Thank You

As always, we've relied on the ideas and support from the entire PB community to keep Design System moving forward. Please keep the feedback coming. In particular, we'd like to thank the following individuals for helping with this release:

Andrew Dimola, Beth Jennings, Bhalchandra Bhosale, Gaston Hummel, Joan Doutney, Joe Cotton, Ken Zaldo, Rich Collette, Richard Morris, Rick Dukeshier, Ron Cianfaglione, Shawn Sharifi, Tanuj Chauhan, Yuhua “Jennie” Lee

>>>>>>> Stashed changes

---

# 5.0.0 - November 14, 2018

## Breaking Changes

### Iconography

- All references to Nucleo fonts have been removed and replaced with the new PBI-Icon fonts. There are PDF tables showing the old icon names and their new counterparts.
- The PB logo has been replaced everywhere with the newer "4-ring" logo. This is embedded in the CSS and should require no changes; however, if you have added any logos apart from DS code you must update to the newer logo
- The white PB logo now has an opacity gradient in its icon. The embedded CSS is updated.

### Headers

- removed old AngularJS classes (`ng-pristine` `ng-empty` `ng-invalid` `ng-invalid-required` `ng-touched`)
- added margin to the navbar toggler (`mt-2` class)

```html
<button
  class="navbar-toggler p-0 mt-2"
  type="button"
  data-toggle="collapse"
  data-target="#navbarSupportedContent"
  aria-controls="navbarSupportedContent"
  aria-expanded="false"
  aria-label="Toggle navigation"
>
  <span class="navbar-toggler-icon"></span>
</button>
```

- removed outer div wrapping the search in mobile menu (`<div class="nav-link d-sm-none">...</div>`)

```html
<div class="nav-link d-sm-none">
  <div class="form-group d-lg-none">...</div>
</div>
```

- added classes to hide the header search on mobile (added `d-none` and `d-sm-block` classes)

```html
<div
  class="header-search d-none d-sm-block"
  [ngClass]="{'search-active': searchActive}"
></div>
```

- changed classes on the search reset button (removed btn and btn-link classes, added border-0 class)

```html
<button
  class="search-clear border-0"
  type="reset"
  (click)="toggleSearch($event)"
  aria-label="clear search"
>
  ...
</button>
```

- fixed search icon focus (see component TypeScript code snippet)
  - pass `$event` in `(click)` to `preventDefault()`
  - add template variable to add focus when search is closed (`#searchLink`)

```html
<a
  #searchLink
  class="nav-link d-none d-sm-block"
  aria-label="Search"
  href=""
  (click)="toggleSearch($event)"
>
  ...
</a>
```

### Promotional Heros

- updated code to use BS4 classes, reduce custom css
- removed extra elements
- added breakpoint for responsive display

### Welcome Screens

- updated code to use BS4 classes to reduce custom css
- removed extra elements
- added breakpoint for responsive display

### Error Pages

- updated code to use BS4 classes, reduce custom css
- removed extra elements
- added breakpoint for responsive display

### Accessibility

- reviewed all components and updated code to support accessibility
- marked non-accessible components
- please see component code snippets for changes

## Non-breaking Changes

### Typography

- All body text is now `#222222` instead of `#717171`
- Links are now `#0072b8` and _are no longer underlined anywhere_

### Colors

- Gray-700 has been changed from `#2e2e2e` to `#222222`
- Blue-50 has been changed from `#eaedf8` to `#eef1fb`

### Sample App and Starter App

- Both have been updated to use 5.0 release code

## Fixes

- Fix splitview footer not staying at bottom of page
- Fix mis-alignment in tree view
- Fix PrimeNG checkboxes have double checkmarks
- Fix translation strings not correctly displaying HTML in Safari

## Thank You

As always, we've relied on the ideas and support from the entire PB community to keep Design System moving forward. Please keep the feedback coming. In particular, we'd like to thank the following individuals for helping with this release:

Abhinav Shrivastav, Adam Czarnik, Ajay Manas, Andrezej Krzystof Gdula, Ania Mastriano, Ankit Pruthi, Beth Jennings, Bhalchandra Bhosale, Cassie Gunn, Chandra Singh, Colin Kirkham, Dave Fondacaro, Daisuke Sawaki, Devendra Tankar, Eric Dunsker, Gaston Hummel, Gaurav Tikekar, Jaychandra M, Jheel Vala Rawal, Joan Doutney, John Gomersall, John Hall, Joseph Cotton, Ken Zaldo, LocateAPI team, Luke Daughtery, Maciej Pyszka, Mikolaj Chybowski, Monika Szulcfabijanowski, Naga Sagi, Nick Roberts, Nitya Reddy Pannala, Paul Hutson, Rachel Hegeman, Rajesh Karnam, Rajesh Kumar, Rich Collette, Rick Dukeshier, Robert Curran, Ron Cianfaglione, Seema Pawar, Shawn Sharifi, Simranjit Singh, Steven Bickmore, Szymon Holisz, Umesh Mishra, Vaughn Lindquist, William Mitchell, Yuhua Lee

---

# 5.0.0-beta.10 - October 2018

## Breaking changes

- There are no breaking changes in Beta 10
- Remember to migrate your icons: **Nucleo icons are being removed in the final 5.0 release**

## Non-breaking Changes

- FIX Compact UI breadcrumb and checkbox alignment
- FIX Popover/Tooltip icons broken on site
- FIX sample code for date picker (fixes [#56](https://github.com/PBGUX/pb-design-system/issues/56))
- FIX remove erronous styling on fieldsets (fixes [#55](https://github.com/PBGUX/pb-design-system/issues/55))
- FIX remove focus ring on accordions in Chrome (fixes [#54](https://github.com/PBGUX/pb-design-system/issues/54))
- FIX wrong character uses for breadcrumbs (fixes [#58](https://github.com/PBGUX/pb-design-system/issues/58))
- FIX hover and border being applied to nested tables in expanded rows in PrimeNG tables
- Updated Layout guidance to use router-outlets
- Updated Header/Footer code snippets to include `@HostBinding` examples
- Adjusted breakpoint on Hamburger Menu samples

## Additions

- Added additional glyphs to PBI icon fonts as requested by teams
- Added PrimeNG table with all options to Compact UI and theme demo and confirmed compliance
- Added PrimeNG Tree Control
- Added Show/Hide password fields
- Added Payment Blocks

---

# 5.0.0-beta.9 - September 2018

## Breaking Changes and Notes

- Due to licensing compliance issues, the Nucleo fonts have been deprecated and will be removed in 5.0 final. We have used a subset of their icons to create a pair of PBI fonts. The former "PBfont" has also been merged into these fonts. We provide a PDF conversion table of Nucleo icon names to PBI Font icon names, links are below each font on the [Iconography page](https://ng.designsystem.pitneycloud.com/web/iconography).
- NG-Dragula was updated to 2.0, which requires code changes if you are using it in your project. See updated code and links to their migration guide on the [Drag and Drop page](https://ng.designsystem.pitneycloud.com/web/dragdrop)
- The latest version of the site-wide loading bar, ngx-loading-bar 2.0.0, now requires you to specify the color in the component code directly:
  `<ngx-loading-bar color="#009bdf"></ngx-loading-bar>`
- Updated to Bootstrap 4.1 and NG-Bootstrap 3.0.0. There were changes in Bootstrap's HTML for several items, notably accordions, which affects both native and ng-bootstrap. See the [Accordions page](https://ng.designsystem.pitneycloud.com/web/accordions) for updated code snippets. You can read about the other 4.1 changes [in their blog post](https://blog.getbootstrap.com/2018/04/09/bootstrap-4-1/).
- FIX Some drop-buttons had double drop-down icons. These buttons no longer need an icon added in the HTML

## Non-breaking Changes

- FIX Disabled primary button should be gray
- FIX Date range picker only allowed selecting single date
- FIX Category widget hover state
- FIX Mobile header logo centering, logo and logotype made smaller
- Slight changes to address blocks
- Changed table heads to Helvetica Neue, due to issue with Precision Sans and non-English characters
- Fine-tune colors for Dark themes
- PB Logo in the header updated to use the updated "4-ring" logo. All PB logos are now supposed to use this version. Code change is in CSS, so no HTML cjanges required.

## Additions

- Added ZIP code autocomplete example in Address Blocks Basic section
- Added chart specs to all Data Viz example pages, to facilitate using Design System styles regardless of charting tool
- Added CSS for `h6` tags. The font spec matches that of `h5`.
- Hamburger menu examples and code
- Numeric stepper control
- New table examples and code:
  - Added a comprehensive Faceted Search Table
  - Infinite scroll
  - Pagination
  - "Open table" styling for PrimeNG tables
  - "All features" PrimeNG table example added

---

# 5.0.0-beta.8 - August 2018

## Breaking Changes and Notes

- Changed toastrs to use `ngx-toastr` instead of the no-longer-supported `ng2-toastr` plugin
- "Select language" menus for users should be changed to use the names of the languages in the actual languages. See the updated sample on the Globalization page.
- Updated "Invalid email or password" error on Account Access screen to be displayed in a notification, instead of under each field.
- If you are using PrimeNG components in your app:
  - As of version 6 they added their own icon font which needs to be installed and added to your css paths. See [their setup docs](https://www.primefaces.org/primeng/#/setup) for details.
  - However **do not** add the PrimeNG css to your paths. Our CSS assumes no CSS has been added. If you notice something is not styled yet, please file a bug with us.

## Non-Breaking Changes

- FIX Non-Roman characters in table header should now be correct font weight
- FIX Header menu on phone screens could be seen when closed, on a colored page background
- PrimeNG updated to 6.0.2
- Fixes to README.md in our Github repo

## Additions

- Miller column component
- Split views component
- Table infinite scroll component
- Table faceted search component
- Table paginator with number of pages select menu
- Dropdown Menu multi-select with tokens component (ng-select)
- Restore `table-open` class as it was in 4.1

---

# 5.0.0-beta.7 - July 2018

## Breaking Changes and Notes

- The header now has a `container-fluid` version and a `container` version. To properly accomdated this change, the class `bg-brand-header` has to be moved to the `header` tag (it was on the `nav` tag) to show the gradient properly.

  ```html
  <header class="bg-brand-header fixed-top" appHeaderShadow></header>
  ```

  See the Headers page for updated code snippets.

- The footer also now has a `container-fluid` version and a `container` version. See the Footers page for updated code snippets.
- Renamed the "bluish-gray" sass variables to reflect they are really shades of blue:
  - `$gray-60` is now `$blue-50`
  - `$gray-80` is now `$blue-100`

## Non-Breaking Changes

- Consolidate Lists and List boxes to a new "Lists" page
- Changed class names on Data Widgets to better support color themes: `data-widget-1`, `data-widget-2`, and `data-widget-3`. These will automatically switch their colors to match the chosen theme. The older color class names (e.g. `.data-widget-blue`) are still supported, however.
- "Compact UI" page has been moved to under new "Themes" section
- Update Angular to 6.0.3
- Changed Autoprefixer setting to browser support: `">0.25%", "not op_mini all"` instead of broader `last 2 versions`. [Background info](https://jamie.build/last-2-versions)
- FIX: added classes to quick-scale Nucleo icons (e.g. `x4`)

## Additions

- Several new PrimeNG table types were added:
  - Paged table
  - Export table as CSV
  - Grouped rows ("subheader" rows)
- Maps page and Leaflet.js examples
- Added "themes" section with new Light/Dark themes, new Neutral theme, and preliminary content for a new "Unbranded" css file.
- Restore "click to copy" hex codes from Web color swatches
- Transitory alert

---

# 5.0.0-beta.6 – May 2018

## Breaking Changes and Notes

- There are no breaking changes in this release

## Non-Breaking Changes

- Update typography page with font samples
- Fix dropdown carets in table toolbar, including using ng-bootrap dropdowns
- Fix footer logo missing in Firefox
- Fix code snippet for PrimeNG expanding table rows
- Fix to loading screen

## Additions

- Color Picker
- Editable table cells
- Drag and drop table rows
- Address block patterns for checkout and registration
- Promotional hero
- Preliminary "Compact UI" CSS option under Web > Basics. Full documentation page coming in a future beta. If you have usage questions or bugs, contact us.
- Movable modal dialog
- Globalization JSON comments

---

# 5.0.0-beta.5 — April 2018

## Breaking Changes and Notes

- Implemented Error Pages. The HTML structure is different from 4.1, please review code snippets.
- Buttons in Bootstrap 4 are set to `white-space: nowrap`. If you need a button's text to wrap, perhaps in a foreign language, apply the class `btn-wrap` to the button.

## Non-Breaking Changes

- Fixed left padding on Compact Address Blocks
- If Header has no menu items (just a logo and product name) the height remains correct
- Changed style of open accordions to not have a rule between the header and its content
- H3s have been changed from Precision Sans Regular to Precision Sans Light

## Additions

- Time Picker
- Addtional table types, created with PrimeNG:
  - Responsive table
  - Sortable table
  - Row selection
  - Expanding row details
- Slider component
- Loading screen
- Drag and drop
- Address Blocks page started
- Globalization page content added and example code updated
- "Sign In and Sign Up" section has been renamed to "Account Access" and all examples have been added.
- "Floating" labels have been added to the Input Fields page
- Added download link for translation JSON for address blocks and footers

## Updates

- Updated Angular and associated plugins to 5.2.9
- Updated PrimeNG to 5.2.4
- Updated NG-Bootstrap to 1.0.4
- Updated layout and design of Web > Components pages to make component and code examples more prominent and better organized.
- Updated angular-l10n to 4.1.5

---

# 5.0.0-beta.4 — February 2018

## Breaking Changes and Notes

Updated Bootstrap 4 to 4.0 final. There were several breaking changes incurred from moving from 4.0.0.beta.2 to 4.0.0.beta.3 See [their documentation](https://getbootstrap.com/docs/4.0/migration/#beta-3-changes) for details.

Some notable changes:

- Base page layout stucture has been updated to facilitate the sticky header and footer. See the [Basic Layout](https://ng.designsystem.pitneycloud.com/web/grid) page for more information and sample code.
- Input Groups have completely different html structure than DS 4.1. See the [updated code snippets](https://ng.designsystem.pitneycloud.com/web/inputfields#input-2)
- Switched Design System 4's "enhanced" checkboxes and radios to use Boostrap 4's "custom" ones. Please review the new code snippets for [checkboxes](https://ng.designsystem.pitneycloud.com/web/checkboxes) and [radio buttons](https://ngqa.designsystem.pitneycloud.com/web/radios)
- Code for checkbox and radio layout has changed from Bootstrap 3, especially inline ones. Please review the new code snippets for each.
- The class `img-responsive` has been replaced with `img-fluid`
- Table toolbar: all buttons and controls in the toolbar now need a `*-sm` class (e.g. `btn-sm`)
- To get a shaded table heade, as in 4.1, you must now add a class of `thead-light` to the table's `thead` tag. Otherwise, the table header will be white.
- Margin and padding of some items have been changed to use the "rule of 8." For example, something that was 10px might now be 8px or 16px, depending on the component. To faciliate this, as in Bootstrap 4 itself, we have moved to using `rem`s (`1rem` = `16px`)
- Line widths, type sizes, and border radii are all still specified in pixels. This is an ongoing process
- Everywhere a class used `heading` has been changed to `header`. This affects Cards, in particular
- In several components (notably [Sign In](https://ng.designsystem.pitneycloud.com/web/signinup)) we are using the new [Boostrap 4 utility classes](https://getbootstrap.com/docs/4.0/utilities/spacing/) for margins and padding.

It is worth reviewing the [entire migration page](https://getbootstrap.com/docs/4.0/migration/) on the Boostrap 4 web site.

## Additions

- Accessibility
- Cards
- Colors
- Layout (with guidance on Bootstrap 4.0 usage)
- Date picker (basic ng-bootstrap range picker added)
- Footers
- Header
- Iconography
- Indeterminate checkbox
- Modals (all examples, Bootstrap and ng-bootstrap)
- Popovers and tooltips
- Sign In
- Toastrs
- Tech Stack 2 documentation
- Widgets

## Non-Breaking Changes

- Fix color of close buttons on notifications and Toastrs
- Updated Angular to version 5.1.3
- Updated ng-bootstrap to version 1.0.0

## Missing

As you use the site, you will see some placeholder "TODO" boxes for missing components. These are currently being investigated and/or worked on. If there are components you would like to see in the next beta, please use the HelpScout "beacon" at the lower right of every page.

# 5.0.0-beta.3 - December 15, 2017

## Breaking Changes and Notes

- Updated Bootstrap 4 to beta 2. There are several changes to class names. See [their documentation](https://getbootstrap.com/docs/4.0/migration/#beta-2-changes) for details
- "Block Level Button Group" is unsupported in Bootstrap 4, and has been removed
- The structure on the top navbar/header is completely different from Bootstrap 3. See the new code sample for details.
- The BS4 `.badge` class has no background. To get the magenta default badge from Bootstrap 3, you need to add the class `badge-default`, as in
  ```html
  <span class="badge badge-pill badge-default">Default</span>
  ```
- To use the DS Sass files, you will need to import the "functions" sass file from Bootstrap 4's npm package at the top of your sass file, in this order:

  ```scss
  @import "../../../node_modules/bootstrap/scss/functions";
  @import "fonts";
  @import "variables";
  @import "../../../node_modules/bootstrap/scss/bootstrap";
  @import "nucleo_mini/nucleo-mini";
  @import "nucleo_outline/nucleo-outline";
  @import "mixins";
  // and then your sass partials, if any
  ```

---

## 5.0.0-beta.2 – September 25, 2017

- Updated to Bootstrap Beta 4.0.0-beta.

- Bootstrap 4 scss is imported _directly into designsystem.scss_. Therefore, Bootstrap is no longer installed as a dependency. In the 2 optional cases described below, you will need to install Bootstrap yourself.

- Due to this, changed angular-cli config to no longer process Bootstrap css file.

- _Optional_: to use Bootstrap 4's javascript components (dropdowns, tooltips, and/or popovers) you will also need to install Boostrap 4 (`npm install bootstrap@4.0.0-beta`) and load its js files in the scripts array

```json
 "scripts": [
     "../node_modules/jquery/dist/jquery.slim.js",
     "../node_modules/popper.js/dist/umd//popper.min.js",
     "../node_modules/bootstrap/dist/js/bootstrap.js"
 ],
```

- _Optional_: to use the DS variables and mixins in your scss file, you will need to install Bootstrap 4 and include the following at the top of your main scss file:

```scss
@import "../../../node_modules/bootstrap/scss/functions";
@import "../../../node_modules/pb-design-system/dist/sass/variables";
@import "../../../node_modules/pb-design-system/dist/sass/mixins";
```

- All DS breakpoint mixins have been removed in favor of using the Boostrap 4 mixins and utilities.
  See [Bootstrap 4 docs](https://getbootstrap.com/docs/4.0/getting-started/introduction/) for more detail. This is still a work in progress..
- All libraries updated to their latest versions as of 9/23/15

---

## 5.0.0-beta.1 - September 15, 2017

- initial release
