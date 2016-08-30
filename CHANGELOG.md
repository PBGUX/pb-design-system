## v3.0.0 — August 31, 2016

### BREAKING CHANGES

- The main index page has been simplified, and now uses CSS Flexbox to maintain footer position instead of CSS `calc`. For this to work correctly, your `body` tag must have **only** these chidren:

```html
    <header pbds-header pbds-header-shadow></header>
    <div ui-view="" class="view-animate site-content"></div>
    <footer pb-ds-footer></footer>
```

- The `site-content` div is critical for correct spacing.  It will automatically expand to fill all the space between the header and footer, which will remain locked to top and bottom, respectively.  The `site-content` div also automatically adds a *top margin* on pages with a header, so the page's title is the correct distance from the header.
- Font Awesome has been removed.  All icons are now the Nucleo family.  Details on these fonts and a conversion table from FA to Nucleo are on the *Web > Iconography* page. If you must use Font Awesome for a limited time to avoid things breaking, you will need to add a link to the [Font Awesome CDN](http://fontawesome.io/get-started/) in your `index.html`.
- Widgets html code has changed to better align the contents with Flexbox.

##### There are a few changes to the Header:

- The header has been updated to include the Pitney Bowes icon at the left. This needs to be added to your header HTML.  See *Web > Headers and Footers* for the code snippet.
- The mobile-screen's "hamburger" menu now has a directive added to allow it to close automatically once a menu item is selected on a phone.
- The right-side "user" menu item is responsive.  At desktop sites, it displays the full user name with an option notification number next to it.  At smaller screen sizes, this changes to the user's initials and a simple "dot" to indicate notifications.
- Right-side items are automatically "moved" to the mobile hamburger menu.  See code snippets for details on setting this up.
- The header is now 70px tall instead of 50px.  This is taken care of via CSS.

##### There are a couple of changes to the Footer as well:

- The footer is now light blue, and is also 70px tall.  Both of these are in the updated CSS.  *Be sure you are using the latest Footer code* as shown on the  *Web > Headers and Footers* page.
- Language and capitalization for the footer's content has been updated and standardized.

##### Other breaking changes:

- **Welcome** pages have new HTML and CSS for improved layout.
- **Hamburger Menu** and **Splitview** layouts with expand/collapse side-navigation have completely updated HTML.  They now use Angular UI Bootstrap for the expanding and collapsing. Non-expanding side navigation variants should not require code changes.

### NON-BREAKING CHANGES

#### Look and Feel: One Design System

Our ongoing _One Design System_ initiative has brought together leaders in Global User Experience, Digital Marketing, Branding Strategy and Tech Central to devise strategies for achieving better alignment and harmony across the PB.com domain and our products.

The team's work has resulted in a cohesive set of standards for common master-brand elements (such as typography, colors and critical UI components) and unified experiences for onboarding, notifications and global navigation. To achieve this, the following changes have been made.

##### General Notes

- **Basic Accessibility** has been added to many controls in the form of _aria_ and _role_ attributes, as needed. Note that some items cannot be made accessible.  These items are indicated with a badge "not accessible".


- **CSS animation** classes have been added to the CSS file.  Many don't require any changes to use, but there are several optional classes you can add to your HTML.  Documentation can be found at _Web > Motion_. Note these require the installation of the AngularJS ng-animate package.  

##### Foundations

- **Color palette**
  - Colors have been streamlined, and Sass variable names for the Neutral Palette have been updated and made more consistent with other color variable names. This is documented on the *Web > Color* page. This is all compiled into the 3.0 CSS and should not require any changes on your part, but sass variable names and hex colors are provided for those who may need them.
- **Typography** now includes display text styles and comprehensive styling for Header, Body, Navigation and UI Controls. 
  - Sass variables, CSS class names, and  hex colors are now displayed inline to simplify usage in code.
  - Code snippets are now provided for list types.
- The **PBDS Components** page has been expanded with more directives and more code samples:
  - Added `pbds-alert-global` directive that adjusts the position of the header based on the height of the global alert message.
  - Added `pbds-accordion` attribute directive that adds and removes the `.active` class to display the selected state on vanilla bootstrap accordions. ***This directive replaces the*** `pb-accordion` ***directive.***
  - Added `pbds-header-shadow` attribute directive that adds and removes the .shadow class when the window scroll is greater than 20 pixels from the top. ***This directive replaces the*** `pb-fixed-navbar` ***directive.***
  - Added `<pbds-progress-button>` element directive that shows a spinner icon animation while a process, such as a network request, is being completed. ***This directive replaces the*** `pb-button-progress` ***directive.***
  - Added `<pbds-transitory-alert>` element directive that shows a message next to a button after a process, such as a network request, is completed. ***This directive replaces the*** `pb-transitory-alert` ***directive.***
- A new **Motion** page has been added with documentation, live examples, and code snippets for working with our new animation library.

##### Elements

- **Accordions** include standard Bootstrap as well as Angular UI Bootstrap code snippets.  Styling has been updated and synchronized between both.
- **Breadcrumbs** are now delimited with `>` instead of `/`. This is CSS and require no changes.
- **Buttons** now have rounded corners, a `focused` state, and updated colors. Basic ARIA attributes have been added to supplied code snippets for accessibility.
- **Charts** have been updated to use latest `chart.js` library
- **Help popovers and tooltips** have been updated. The info icon is now `$pb-blue-700`(`#314183`) and the popovers and tooltips now leverage the new animation library.
- **Input fields** also have rounded corners.
- **Link** color is now `$pb-blue-700`(`#314183`). ARIA attributes added to icon links.
- **Modals** updated with rounded corners
- **Notifications**  (alerts, toastrs) updated with new colors and styles. A "global" notification type has been added, which appears above the header. The "transitory alert" has an updated directive.
- There is a new **Numeric Stepper** control.
- **Panels** have been renamed to **Cards**.  Therefore all `panel-*` classes are now `card-*` classes.  For the time being, we are maintaining the older panel classes, for backward compatibility. See updated code snippets on *Web > Elements > Cards*.
- **Progress indicators**: Colors have been updated for accessibility and a new "Step Progress" indicator has been added. The progress button has a new directive (see above).
- **Tabs** 
  - updated with rounded corners
  - **“Sliding” tabs** have been updated and classes added to simplify having alternate numbers of tabs, from 3 to 6. See *Web > Elements > Tabs > Sliding > Custom Tab Number*.
  - Added **Sliding Section Tabs** and **Sliding Boxed Tabs**.
- **Tables** updated with new styling and additional sizes.
- **Widgets** now have rounded corners. They also have been updated to use Flexbox to properly align their contents.

##### Patterns

- **Headers and Footers** have several breaking changes.  Please see "Breaking Changes," above.
- We have added code for a **Loading Screen** for applications. This code actually goes on `index.html`. See the code snippet for details.
- **Welcome pages** have updated HTML.  Please see "Breaking Changes," above.
- We have added a **Tour** module and code snippets.