
# 7.0.0

## BREAKING CHANGES

**Design System 7.x requires Bootstrap 5, Angular 14, and NG-Bootstrap 13 to be installed.**

Your npm version must be at least 6.14.17, please check by running `npm -v`.
Your node version must be at least 14.20.0, please check by running `node -v`.

- For Bootstrap dropdowns, popovers, tooltips, etc. be sure to include `bootstrap.bundle.min.js` or `bootstrap.bundle.js` which contains Popper.
- Everywhere there was a `data-toggle`, this needs to be changed to `data-bs-toggle`. This applies to Bootstrap dropdowns, header menus, tooptips, popovers, and modals.
- Modals
  - Bootstrap modals now need to be opened with `data-bs-toggle` and `data-bs-target`. The close button now requires `data-bs-close`
  - Both Bootstrap and NG-Bootstrap modals' close button (the "X") require a class of `btn-close` instead of `close`. This affects dismissable notificationns as well.
- Accordions have [new HTML](https://getbootstrap.com/docs/5.2/components/accordion/)
- The Class `form-row` was removed, needs to be replaced with `row g-3` to use new gutter utilities
- `badge-pill` becomes `rounded-pill`
- Toggle buttons require [new HTML](https://getbootstrap.com/docs/5.2/components/button-group/#checkbox-and-radio-button-groups)
- Text alignment classes are [different](https://getbootstrap.com/docs/5.2/utilities/text/):
  - `text-left` is now `text-start`
  - `text-right` is now `text-end`
  - these can still be set by viewport size (e.g., `xs`, `md`)
- Due to the above new text classes, our Footer HTML has changes
- Card Deck and Card Columns have been removed
- Remove `.input-group-append` and `.input-group-prepend`. You now just add buttons and `.input-group-text` span or divs as direct children of the input groups.
- NG Bootstrap dropdown items no longer need a class, instead each menu item (button) needs `ngbDropdownItem`. See input fields > with dropdown for an example.
- There were extensive css class name changes to Angular Material 15 components.  The changes were integrated into the Design System css, so no work should be required unless you made your own overrides to the Design System.


---

# 6.18

## Additions

- Added new dropdown with autocomplete and ability to add entered item if it's not in the list
- Added examples of progress bars without numbers
- Added Accessibility Checklists for Designers and Developers
- Added new content to Accessibility Color Contrast page
- Added option for custom color palette for most charts

## Changes

-- Removed Precisely APIs from address blocks

## Fixes

- Fixed color of Error Pages headers
- Fixed bug in bar graph tooltips in Firefox

---


# 6.17

## Additions

- Added option for Divergent Stacked bar chart
- Added "password expired" flow to Account Access screens
- Added Action List & Panel pattern
- Maps page now has documentation for using the Google Maps API. Leaflet and the Precisely API are no longer used.

## Changes

- Design System updated to Angular 14.2.12
- Expanded table rows are now white when on gray background, and gray when on a white background.
- Changed order of US/CA address blocks to be city/state/zip by default

## Fixes

- Fixed gap in Multiselect with Checkboxes dropdown

---

# 6.16

## Additions

- Added a Knob Slider to Sliders
- Added an Acessibility Dos and Don'ts page
- Added a color variant of Feedback Ratings
- Added a working example of the Editable Card
- Added latest VPATs and accessibility scores

## Changes

- "Tab Tile Buttons" have moved to the buttons page

## Fixes

- Fix background color on input error examples
- Link for PB Brand Site has changed
- Update screen shots in Account Access to show correct alignment of alert icons

---

# 6.15

## Additions

- Dark Mode: new class `bgdark` can be applied to body tag in any theme
- Added DHL package images to Package Library
- Added Impersonation pattern
- Added Device Profile patterns
- Added Bubble Chart to DataViz components
- Added table row toggle icon

## Changes

- Added Dark modes to Theme Switcher component

---

# 6.14

## Additions

- New DataViz Scatter Plot component and documentation
- New "rate your experience" pattern and code

## Bug Fixes

- Fixed regression on H1-H6 font sizes

# 6.13

## Additions

- Added a "Create a Case" pattern and code
- Added css class `label-allcaps` to style text to look like a standard form field label
- Update UPS package images in Package Library with new UPS branding
- Added a Simple Time Form Field

## Changes

- Icons Multi-line alerts and toasts now align with the first line of text, instead of vertically centered

## Bug Fixes

- Fix label color for disabled OS checkboxes
- Fix multiple nested button groups overlapping
- Fix Tree menu code snippet
- Fix tabs were not working on Modals page
- Fix card headers and body text were misaligned

---

# 6.12.1

## Additions

- Add Accessibility icons to PBI Outline font, `pbi-a11y-outline` and `pbi-a11y-solid`

---

# 6.12

## Additions

- Add PrimeNG InputNumber component
- Add PrimeNG Rich Text Editor component

## Bug Fixes

- Fixed Mega Menu section headers to match existing menu header design

---

# 6.11

## Additions

- Add PBDS Progress Button component
- Add Sticky Table Column component
- Add Tree Menu components, single select and multiple select
- Added examples from User Messaging to Modals, Notifications, and Input fields pages
- Added example of search input type

## Changes

- Updated Stepper component to use new PrimeNG InputNumber component. Older component was discontinued, but we have kept its CSS to maintain backward compatibility.

## Bug Fixes

- Fixed color of NGBootstrap Accordion headers
- DataViz: fix tooltips that are not showing a value when it is 0

---

# 6.10.2

## Additions

- Replace "hamburger menu" code with Angular Material "sidenav" due to old plugin being abandoned
- Theme switcher header menu item
- Ability to open the PBDS Date Range calendar from another element, such as a button elsewhere on screen
- Updated list of VPATs
- Ability to add an X-axis label to vertical bar, line, and area charts

## Bug Fixes

- Updated customer email sample image to match the actual code in the template
- Stacked bar tooltip position in Firefox

# 6.10.1

## Additions

- Added code example for Parcel Tracking Map
- Added example of multiple simultaneous global alerts, and added classes to support "info" and "warning" alert types
- Added table example to expand/collapse all table rows

## Bug Fixes

- Fixed several instances for proper visibility in Windows High Contrast Mode
- Fixed Horeshoe Gauge had extra space below chart
- Fixed regression with "danger" icon on alerts and toasters
- Fixed width of toasters

# 6.10.0

## Additions

- Added an error screen for unsupported browsers
- Added a "process completed" widget to progress indicators
- Added new mobile screens to Onboarding
- Added code snippet for Horizontal Tracking Timeline to Tracking Pattern
- Additional Header examples including mega-menu, account switcher, carets, and postage button
- Color picker with WCAG contrast checker
- Added accessibility statement component

## Changes

- Sunset theme orange (in gradient) is now PB Brand Dark Orange
- Split "Terminology & Style" into 2 pages and added a glossary of terms

## Bug Fixes

- Fixed "undefined values" in line chart tooltips
- Fixed components that did not display correctly in Windows High Contrast Mode: dropdowns, radios, and tabs
- Fixed accessibility for Account Access form fields
- Fixed code snippet for faceted search example
- Fixed missing file upload component warning box

# 6.9.1

## Changes

- Vertically centered sign-in boxes on account access screens

# 6.9.0

## Additions

- Added pbds-avatar component
- Added rating stars component
- Added `line-clamp` typographic utility css class to limit number of lines shown. See [Typography > Utilities](https://designsystem.pitneycloud.com/web/typography).

## Bug Fixes

- Fixed font on radio button labels

# 6.8.4

## Changes

- Added classes to use new "sticky footer" for layout. To use this, the structure of your `app.component.html` needs to be changed as described in [Web > Layout](https://designsystem.pitneycloud.com/web/grid).

  This is an _optional enhancement_; the older "fixed" footer will continue to function correctly.

# 6.8.3

## Bug Fixes

- Fix font family for large number in widgets

# 6.8.2

## Bug Fixes

- Fixed Multiline Input in Firefox, the multiple lines are no longer combine into a single line

# 6.8.1

## Changes

- Make p-table sort icons inline to improve line break behavior

---

# 6.8.0

## Changes

- There are no breaking changes in this release
- Updated to support Angular 12.2.12, NG-Boostrap 10, PrimeNg 12.2.2. Updating from Angular 11 is not required.
- Normalize form field focus to match brower's style

## Bug Fixes

- The PBDS Date Picker is now accessible
- Spacing fix in date/time picker
- Updated input field "validation" code snippet for better accessibility support

## Additions

- 6 new patterns have been added, in a new pattern section. Code snippets and CSS have been added to support these patterns.
- Added alternate for switches to support internationalization, with the switch state on the right
- Added PrimeNG sticky header table
- Added PrimeNG pick list
- Added multiple-file upload component
- Added PBDS input component that supports multiple values
- Added header variation with carets on drop-down menus

---

# 6.7.0

## Breaking Changes

- Bootstrap SCSS in no longer compiled with the Design System SCSS. Therefore you need to **import the Bootstrap CSS file** in your `angular.json` "styles" array, like this:

  ```
      "styles": [
                "node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
                "node_modules/bootstrap/dist/css/bootstrap.min.css",

                ...

                "src/sass/designsystem/designsystem.scss",
                "src/styles.scss"
              ],
  ```

- The SCSS files (\_mixins.scss and \_variables.scss) are no longer included as everyting is a CSS variable.
  - If you used any imports like this in your components' scss files they need to be removed:
    ```
    @import '~pb-design-system/sass/mixins';
    @import '~pb-design-system/sass/variables';
    ```
  - Convert any `$` variables to their css variable equivalent. For example:
    `$font-family-brand-regular` would need to change to `var(--font_family_brand_regular)`. Note the names are the same but the new variables are snake-cased (`_`).
- Support for PrimeNG < 10.0.0 has been removed. It was deprecated in 6.6. Please update to PrimeNG 10 or higher (11 recommended).
- For D3 `PbdsDatavizLine` and `PbdsDatavizArea` charts:
  - the `date` key is changed to `labels`.
  - This allows x-axis labels to be dates, numbers, or strings, instead of only dates

## Bug Fixes

- The PBDS Date Range picker is now accessible; the popup list of date ranges can be navigated by keyboard.
- Fixed styling of P-Chips component chips to match chips/tokens used elsewhere
- Fixes to Table examples:
  - Filter menus actually filter the sample data
  - Pagination control now shows number of records
- Date picker calendars start week on Sunday
- Update column toggle menu styling
- Accesibility fixes to Address Blocks
- Fixed sizing of `btn-lg` class

## Additions

- You can now create an "unbranded" white-labelled theme of your own by using the included CSS template and instructions on the [Color Sets page](https://designsystem.pitneycloud.com/web/themes/colorsets).
- Added PrimeNG Skeleton loaders.
- Added a Header variation with carets next to drop-down menus
- Added a "Back" version of Breadcrumbs

---

# 6.6.0

## Breaking Changes

- (Added in 6.5.1)To properly support teams not using Angular, we had to remove the sass import for the base Angular Material theme. You will need to import it in the `styles` array in your `angular.json`. Add the following path, ensuring it is before the `designsystem.css` in the styles array.

```
"node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
```

## Deprecation Notice

- The use of PrimeNG < 10.0 is deprecated and CSS support for it will be removed in the next point release. Please update to PrimeNG 10 or higher (11). DS 6.6 still supports the same versions supported by DS 6.0-6.5.

## Non-Breaking Changes

- Updated to support Angular 11.2, NG-Bootstrap 9.0, PrimeNG 11.2.2
- Improvements to Table Toolbar buttons
  - Added toggle button styling and example
  - Added date picker example
  - Updated CSS so you can use normal-sized controls in toolbar
- Added new Empty State component to PBDS component library
- Added styling and example for `input type=file`.
- Add "batch" icon

## Bug Fixes

- Angular Material checkboxes and radio button keyboard focus state
- Active tabs lose borders when hovered

# 6.5.2

- fix keyboard focus colors on Material checkboxes and radio buttons

---

# 6.5.1

## Breaking Change

- to properly support teams not using Angular, we had to remove the sass import for the base Angular Material theme. You will need to import it in the `styles` array in your `angular.json`, ensure it is before the `designsystem.css`, with this path:

```
"node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
```

## Non-breaking Changes

- fix for missing highlight on Tree Navigation nodes

---

# 6.5.0

## Breaking Changes

- PBDS Component Library

  - Changed the import structure of the library modules, you no longer need to import the entire library and install all dependencies.
  - You should import only what your app will use. Note that peer dependencies need to be installed as needed. If using the `PbdsDatavizModule` for example, `D3` and `topojson-client` need to be installed. See the `Web > Component Library` page for more information on peer dependencies for each module.

  ```
  import { PbdsHeaderShadowModule } from 'pb-design-system/header-shadow';
  import { PbdsPageTitleModule } from 'pb-design-system/page-title';

  // if you use dataviz charts
  import { PbdsDatavizModule } from 'pb-design-system/dataviz';
  ```

- Updated Angular L10N to 10.1.2
  - the plugin was rewritten for Angular 10 and the implementation has changed, [see the website for details](https://github.com/robisim74/angular-l10n) and the `Web > Language Selector` page. Also see the plugin [migration guide here](https://github.com/robisim74/angular-l10n/blob/master/MIGRATION_GUIDE.md).

## Changes and Fixes

- Added support for:
  - Angular 10.2.x
  - PrimeNG 10.0.x
  - NG-Bootstrap 7.0.x/8.0.x
  - Angular Material 10.x.x
- Removed outdated/unsupported "unbranded.css"
- Fixed compile issues with the POI font. The POI font has been rebuilt in Icomoon and the CSS updated to match the other icon fonts.
- Fixed PB white logo in downloads
- Added styling and examples for `mat-toggle-button`
- PBDS Component Library
  - Updated peer dependencies, you need to install peer dependencies depending on the components being imported. If using the `PbdsDatavizModule` for example, `D3` and `topojson-client` need to be installed. See the `Web > Component Library` page for more information on peer dependencies for each module.
  - Added ng-bootstrap v8.0.0 support
  - PBDS Dataviz
    - Updated D3 imports internally to support tree-shaking
  - PBDS Datepicker component
    - added `(closed)` output which fires when the component menu is closed
    - internally updated the Ngb `(select)` event to `(dateSelect)`, select is removed in Ngb v8.0.0
    - fixed preset selections not being set on initialization
    - fixed rendering issue if setting an empty `[filter]` array

## Additions

- PBDS Component Library
  - Added Page Title component
  - Added PBDS Column Toggle
- Added animation pattern for adding items to lists
- Updated mobile standards (fonts, screenshots, etc.)
- Updated Globalization guidelines
- Added guidelines for Account Access MFA (Multi-Factor Authentication)
- Added illustrations page with downloadable package and carrier logo images
- Added generic "something went wrong" error page
- Added "pbi-delivery" icon to PBI Outline font

---

# 6.5.0-beta.17

- PBDS Component Library
  - remove PbdsComponentsModule, all imports should be from subfolders

---

# 6.5.0-beta.16

- PBDS Component Library
  - fix build
  - top level imports
  - add ng-bootstrap v8.0.0 support

---

# 6.5.0-beta.14

- PBDS Datepicker component
  - fixed preset selection
  - fixed rendering issue if setting an empty filter array
- PBDS Column Toggle
  - added `[label]` input to change the text next to the icon, primarily used for globalization.
  - added `[showAllLabel]` input to change the text in the dropdown menu, primarily used for globalization.

---

# 6.5.0-beta.13

- PBDS Datepicker component
  - added `(closed)` output
  - internally updated the Ngb `(select)` event to `(dateSelect)`, select is deprecated

---

# 6.5.0-beta.12

- PBDS Datepicker component: the date dropdown was using 'body' by default, but the ngb-datepicker was not. Added an input to component, with a default of 'body'.

---

# 6.5.0-beta.10 and 11

- minor tweaks and bug fixes

---

# 6.5.0-beta.9

## Breaking change

- Changed import structure on PBDS library modules. You no longer need to import the entire library. You can (and should) import only what your app will use, similar to PrimeNG imports, i.e.

```
//required
import { PbdsHeaderShadowModule } from 'pb-design-system/header-shadow';
import { PbdsPageTitleModule } from 'pb-design-system/page-title';
// if you use charts:
import { PbdsDatavizModule } from 'pb-design-system/dataviz';
```

## Other Changes

- Add table row context menu example
- Fix styling on TreeTable
- Update all code snippets for dataviz

---

# 6.5.0-beta.8

- refactor dependencies
- Add icon for new column-toggle component

---

# 6.5.0-beta.7

- Add styling and examples for mat-toggle-button

---

# 6.5.0-beta.6

- Fix regression on PrimeNG tree table
- Add toggle-column component for hiding and showing table columns

---

# 6.5.0-beta.5

- Further fixes to PrimeNG 10 CSS: treeemenu, dropdowns, date/time picker

---

# 6.5.0-beta.2 through 4

- fixes related to compile issues with POI font. The POI font has been rebuilt in Icomoon and the CSS updated to match the other icon fonts.

---

# 6.5.0-beta.1

- Support for Angular 10.1.x
- Support for PrimeNG 10.0, NG-Bootstrap 7.0, Angular Material 10
- Removed peer dependencies from install; you will still need to install D3 and topojson if you want to use any DataViz components
- Added Page Title component
- Removed outdated/unsupported "unbranded.css"

---

# 6.1.4

- Add "delivery" icon to pbi-icon-outline

---

# 6.1.12

- Fix spacing between buttons
- Fix header gradient issue on mobile screens
- Fix code snippet for Empty State "list"
- Fix missing checkbox background color in selection lists
- Clean up code snippets
- Form elements on white elements, when your app has the default tinted background. To ensure they work correctly, the containing
- Fix error state of ng-select menus
- Updated sort icons for PrimeNg 9

---

# 6.1.11 - April 20, 2020

- Fix focus glow color on page-primary buttons (was using Bootstrap default focus glow)

---

# 6.1.10 - April 7, 2020

- Fix styling of cards used within accordions

---

# 6.1.9 - April 6, 2020

- fix table header size on compact-ui primeNg tables
- fix hover color of rows on striped tables
- Removed class `.table-striped-on-white`, now striped tables will be colored correctly if place inside a card or other container with the Bootstrap `bg-white` class applied.
- Fixed droparrow caret on disabled select menus to look disabled

---

# 6.1.8 - April 1, 2020

- added "pbi-rocket" icon to pbi-outline font
- added padding to PrimeNG table row toggle to increase hit target

---

# 6.1.7 - March 25, 2020

- created class `.table-striped-on-white` for when you need a striped table in a white container on an otherwise tinted background page
- fix font face inside sliding tabs
- fix table header size on compact-ui tables
- fix hover color of rows on striped tables

---

# 6.1.6 - March 20, 2020

- adjust assignment of link color

---

# 6.1.5 - March 12, 2020

- Fixed size of progress button to match other buttons, and added a "small" variant
- Added a modifier class `container-fluid-limit` which, when added to a `container-fluid` will add more white space to the outside margins on large and extra-large screens.

---

# 6.1.4 - February 25, 2020

- Fixed page header component on compact ui

---

# 6.1.3 - February 13, 2020

- Add `pbi-support` and `pbi-insights` icons to PBI Mini font

---

# 6.1.2 - February 11, 2020

- Fix for missing css file errors.

# 6.1 - February 7, 2020

## Changes

- Reverted Dashboard design to Card-based layout. See [Data Visualization > Dashboards](https://designsystem.pitneycloud.com/web/dataviz/dashboards) for examples and updated code. HTML change requires only to remove any `"border-*"` classes.
- Restructured layout of Modals page to simplify content; no code changes
- Removed PB Software content from website, removed brand category icons for LI, CES, CIM.

## Additions

- Progress Indicators:
  - PBDS Spinner Component
  - Angular Material sliding step-based "wizard"
  - Angular Material progress button
- Angular Material selection list to Lists
- Table header tooltip example
- DS6 Sketch UI kit uploaded
- Theme selector on DS web site persists your selection between visits
- Added filter on Iconography page to facilitate searching for PBI icons

## Fixes

- Fixed sortable table header color
- Fixed incorrect spacing on NG-Bootstrap and PrimeNG menu items
- Fixed gradient in category widget SVG icons

---

# 6.0.7 - December 17, 2019

- Slight change to Sunset tinted background color

---

# 6.0.6 - November 19, 2019

- Dataviz:
  - add average and threshold keys to legend
  - change average line color (slightly darker)
  - add x axis title
  - add threshold and average label inputs (for globalization)
  - tweak legend styling
  - update documentation

---

# 6.0.5 - November 14, 2019

- H1s are the secondary color of each theme

---

# 6.0.4 - November 14, 2019

- Fixes for styling of drag and drop to upload component
- Fixes for chart tooltips

---

# 6.0.3 - November 13, 2019

- Chart color updated
- Fix for sparklines

---

# 6.0.2 - November 11, 2019

- Fix active tab on white background should be white

---

# 6.0.0 - November 11, 2019

## Breaking Changes from 5.1

- _Internet Explorer 11 is no longer supported_. Use latest Chrome, Edge, Safari, or Firefox for best results.
- Page layout no longer requires Flexbox, the footer is now fixed to the bottom of the screen. See the **Web > Basics > Layout** page for specific change and instructions.
- Since the footer is now fixed to the bottom, your main content area should have `padding-bottom` of 200px.
- There is a new Page Title component. The main H1 of your page should be converted to use this code. See **Web > Components > Page Title** for details.
- Animation is now integrated. When you npm install the Design System package, you will see warnings for peer dependencies. You should install those for proper operation.
- To enable animation, some components require simple HTML changes. See the **Web > Basics > Animation** page for details.
- Buttons and controls in the table toolbar must no longer use the `*-sm` classes (i.e. `btn-sm`)
- Old "custom" checkboxes and radio buttons have been replaced with Angular Material checkboxes and radio buttons.
- "Empty State" icons are now inline SVG icons. See **Web > Components > Empty States** for code snippets and details.
- Error Page SVG icons have been updated to use gradient icons. See **Web > Components > Error Pages** for code snippets and details.
- Dashboards have new HTML code for transparent cards and borders between cards and rows. See the **Web > Data Visualization > Dashboards** page for details and code.

## Changes

- The default page background is a gray that incorporates a tint from your chosen theme. A white background can be used instead by adding the class `bgwhite` to the `body` tag. See the **Web > Themes > Background** page for details.
- We no longer use the color variables in the optional `_variables.scss` file, we now use CSS variables so that the colors can be accessed in your CSS without needing to compile and SCSS files.
- Form input field labels are uppercase. The label and input must be wrapped in a `form-group` class, as shown on **Web > Components > Input Fields**. If you text in a label (such as "(required)" or "(optional)") that is in parentheses and should be upper/lowercase, wrap that in a `span` tag.
- There is now only one style of Accordions. Gray and bordered accordions are no longer supported.
- Tab content no longer has a bordered option. The style of the inactive tabs has changed.
- Category widgets now use gradient icons. Gradient icons will be solid primary color on Safari <13.1 due to a Safari bug.

## Additions

- We have added a PBDS component library. This simplifies using custom components we have provided for elements such as D3 charts. See the **Web > Basics > Component Library** page for details.
- Added 15 new D3 chart components. These greatly simplify working with D3 charts. The new chart components are Area, Bar (vertical/horizontal, grouped, stacked), Bubble Map, Choropleth Map, Donut, Dot Map, Gauge, Heat Map, Line, Metric Block, Pie, and Sparkline.
  - **Note:** component names and interfaces for bar charts has changed from beta releases for consistency:
    - `<pbds-dataviz-stacked-bar>` is now `<pbds-dataviz-bar-stacked>`
    - PbdsDatavizStackedBar is now PbdsDatavizBarStacked
- Added an Account Switcher Menu component.
- Added Split Panes component, see **Web > Components > Split Panes**.
- A new type of button has be added, called a Page-Level Button. Use a page-level button when you have an action that will affect the entire page, such as "Save" or "Submit" or "Sign In". For more information, see **Web > Components > Buttons**.

## Updated Libraries

- Moved to Angular 8.2.4. This required the updating of many supporting libraries:
  - Angular CDK 8.1.4
  - Angular Material 8.1.4
  - ng-bootstrap 5.1.1
  - PrimeNg 8.0.2
  - ng-select 3.0.7
  - D3 5.11.0
  - angular-l10n 8.0.0
- Updated Leaflet to 1.5.1 and examples with ES6 imports

**Note:** PrimeNG 8.0.4 changed the implementation of table custom filters, use 8.0.2 if you are using filterConstraints. [See issue #8123](https://github.com/primefaces/primeng/issues/8123) for details.

# 5.1.0 - May 1, 2019

## Changes (includes changes from beta)

- Updated Angular version to 7.2.2. Although updating Angular is not required to use the Design System CSS, it is recommended. For a smooth update, follow the instructions at [https://update.angular.io/](https://update.angular.io/)
- Updated libraries to support Angular 7
  - PrimeNG 7.0.5
  - ng-bootstrap 4.0.2
  - ngx-loading-bar 4.2.0

## Fixes

- FIX PrimeNG icon-only button, as in drag-and-drop UI
- FIX Metric block badge color for accessiblity issue

## **Additions**

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
<div class="header-search d-none d-sm-block" [ngClass]="{'search-active': searchActive}"></div>
```

- changed classes on the search reset button (removed btn and btn-link classes, added border-0 class)

```html
<button class="search-clear border-0" type="reset" (click)="toggleSearch($event)" aria-label="clear search">...</button>
```

- fixed search icon focus (see component TypeScript code snippet)
  - pass `$event` in `(click)` to `preventDefault()`
  - add template variable to add focus when search is closed (`#searchLink`)

```html
<a class="nav-link d-none d-sm-block" #searchLink aria-label="Search" href="" (click)="toggleSearch($event)"> ... </a>
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
  - As of version 6 they added their own icon font which needs to be installed and added to your css paths. See [their setup docs](https://www.primefaces.org/primeng/setup) for details.
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
  @import '../../../node_modules/bootstrap/scss/functions';
  @import 'fonts';
  @import 'variables';
  @import '../../../node_modules/bootstrap/scss/bootstrap';
  @import 'nucleo_mini/nucleo-mini';
  @import 'nucleo_outline/nucleo-outline';
  @import 'mixins';
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
@import '../../../node_modules/bootstrap/scss/functions';
@import '../../../node_modules/pb-design-system/dist/sass/variables';
@import '../../../node_modules/pb-design-system/dist/sass/mixins';
```

- All DS breakpoint mixins have been removed in favor of using the Boostrap 4 mixins and utilities.
  See [Bootstrap 4 docs](https://getbootstrap.com/docs/4.0/getting-started/introduction/) for more detail. This is still a work in progress..
- All libraries updated to their latest versions as of 9/23/15

---

## 5.0.0-beta.1 - September 15, 2017

- initial release
