# 5.0.0-beta.6 – May 2018

## Breaking Changes and Notes

* The header gradient's class has changed from `bg-pb-header-gradient` to `bg-brand-header`.  Failing to change this will cause the header to appear to vanish.

## Non-Breaking Changes

* Update typography page with font samples
* Fix dropdown carets in table toolbar, including using ng-bootrap dropdowns
* Fix footer logo missing in Firefox
* Fix code snippet for PrimeNG expanding table rows
* Fix to loading screen

## Additions

* Color Picker
* Editable table cells
* Drag and drop table rows
* Address block patterns for checkout and registration
* Promotional hero
* Preliminary "Compact UI" CSS option under Web > Basics. Full documentation page coming in a future beta. If you have usage questions or bugs, contact us.
* Movable modal dialog
* Globalization JSON comments

---

# 5.0.0-beta.5 — April 2018

## Breaking Changes and Notes

* Implemented Error Pages. The HTML structure is different from 4.1, please review code snippets.
* Buttons in Bootstrap 4 are set to `white-space: nowrap`. If you need a button's text to wrap, perhaps in a foreign language, apply the class `btn-wrap` to the button.

## Non-Breaking Changes

* Fixed left padding on Compact Address Blocks
* If Header has no menu items (just a logo and product name) the height remains correct
* Changed style of open accordions to not have a rule between the header and its content
* H3s have been changed from Precision Sans Regular to Precision Sans Light

## Additions

* Time Picker
* Addtional table types, created with PrimeNG:
  * Responsive table
  * Sortable table
  * Row selection
  * Expanding row details
* Slider component
* Loading screen
* Drag and drop
* Address Blocks page started
* Globalization page content added and example code updated
* "Sign In and Sign Up" section has been renamed to "Account Access" and all examples have been added.
* "Floating" labels have been added to the Input Fields page
* Added download link for translation JSON for address blocks and footers

## Updates

* Updated Angular and associated plugins to 5.2.9
* Updated PrimeNG to 5.2.4
* Updated NG-Bootstrap to 1.0.4
* Updated layout and design of Web > Components pages to make component and code examples more prominent and better organized.
* Updated angular-l10n to 4.1.5

---

# 5.0.0-beta.4 — February 2018

## Breaking Changes and Notes

Updated Bootstrap 4 to 4.0 final. There were several breaking changes incurred from moving from 4.0.0.beta.2 to 4.0.0.beta.3 See [their documentation](https://getbootstrap.com/docs/4.0/migration/#beta-3-changes) for details.

Some notable changes:

* Base page layout stucture has been updated to facilitate the sticky header and footer. See the [Basic Layout](https://ng.designsystem.pitneycloud.com/web/grid) page for more information and sample code.
* Input Groups have completely different html structure than DS 4.1. See the [updated code snippets](https://ng.designsystem.pitneycloud.com/web/inputfields#input-2)
* Switched Design System 4's "enhanced" checkboxes and radios to use Boostrap 4's "custom" ones. Please review the new code snippets for [checkboxes](https://ng.designsystem.pitneycloud.com/web/checkboxes) and [radio buttons](https://ngqa.designsystem.pitneycloud.com/web/radios)
* Code for checkbox and radio layout has changed from Bootstrap 3, especially inline ones. Please review the new code snippets for each.
* The class `img-responsive` has been replaced with `img-fluid`
* Table toolbar: all buttons and controls in the toolbar now need a `*-sm` class (e.g. `btn-sm`)
* To get a shaded table heade, as in 4.1, you must now add a class of `thead-light` to the table's `thead` tag. Otherwise, the table header will be white.
* Margin and padding of some items have been changed to use the "rule of 8." For example, something that was 10px might now be 8px or 16px, depending on the component. To faciliate this, as in Bootstrap 4 itself, we have moved to using `rem`s (`1rem` = `16px`)
* Line widths, type sizes, and border radii are all still specified in pixels. This is an ongoing process
* Everywhere a class used `heading` has been changed to `header`. This affects Cards, in particular
* In several components (notably [Sign In](https://ng.designsystem.pitneycloud.com/web/signinup)) we are using the new [Boostrap 4 utility classes](https://getbootstrap.com/docs/4.0/utilities/spacing/) for margins and padding.

It is worth reviewing the [entire migration page](https://getbootstrap.com/docs/4.0/migration/) on the Boostrap 4 web site.

## Additions

* Accessibility
* Cards
* Colors
* Layout (with guidance on Bootstrap 4.0 usage)
* Date picker (basic ng-bootstrap range picker added)
* Footers
* Header
* Iconography
* Indeterminate checkbox
* Modals (all examples, Bootstrap and ng-bootstrap)
* Popovers and tooltips
* Sign In
* Toastrs
* Tech Stack 2 documentation
* Widgets

## Non-Breaking Changes

* Fix color of close buttons on notifications and Toastrs
* Updated Angular to version 5.1.3
* Updated ng-bootstrap to version 1.0.0

## Missing

As you use the site, you will see some placeholder "TODO" boxes for missing components. These are currently being investigated and/or worked on. If there are components you would like to see in the next beta, please use the HelpScout "beacon" at the lower right of every page.

## 5.0.0-beta.2 – September 25, 2017

* Updated to Bootstrap Beta 4.0.0-beta.

* Bootstrap 4 scss is imported _directly into designsystem.scss_. Therefore, Bootstrap is no longer installed as a dependency. In the 2 optional cases described below, you will need to install Bootstrap yourself.

* Due to this, changed angular-cli config to no longer process Bootstrap css file.

* _Optional_: to use Bootstrap 4's javascript components (dropdowns, tooltips, and/or popovers) you will also need to install Boostrap 4 (`npm install bootstrap@4.0.0-beta`) and load its js files in the scripts array

```json
 "scripts": [
     "../node_modules/jquery/dist/jquery.slim.js",
     "../node_modules/popper.js/dist/umd//popper.min.js",
     "../node_modules/bootstrap/dist/js/bootstrap.js"
 ],
```

* _Optional_: to use the DS variables and mixins in your scss file, you will need to install Bootstrap 4 and include the following at the top of your main scss file:

```scss
@import "../../../node_modules/bootstrap/scss/functions";
@import "../../../node_modules/pb-design-system/dist/sass/variables";
@import "../../../node_modules/pb-design-system/dist/sass/mixins";
```

* All DS breakpoint mixins have been removed in favor of using the Boostrap 4 mixins and utilities.
  See [Bootstrap 4 docs](https://getbootstrap.com/docs/4.0/getting-started/introduction/) for more detail. This is still a work in progress..
* All libraries updated to their latest versions as of 9/23/15

## 5.0.0-beta.1 - September 15, 2017

* initial release
