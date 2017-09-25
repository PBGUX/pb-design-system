# Release Notes

## 5.0.0-beta.2 – September 25, 2017

- Updated to Bootstrap Beta 4.0.0-beta.

- Bootstrap 4 scss is imported *directly into designsystem.scss*. Therefore, Bootstrap is no longer installed as a dependency.  In the 2 optional cases described below, you will need to install Bootstrap yourself.

- Due to this, changed angular-cli config to no longer process Bootstrap css file. 

- *Optional*: to use Bootstrap 4's javascript components (dropdowns, tooltips, and/or popovers) you will also need to install Boostrap 4 (`npm install bootstrap@4.0.0-beta`) and load its js files in the scripts array

```json
 "scripts": [
     "../node_modules/jquery/dist/jquery.slim.js",
     "../node_modules/popper.js/dist/umd//popper.min.js",
     "../node_modules/bootstrap/dist/js/bootstrap.js"
 ],
```

- *Optional*: to use the DS variables and mixins in your scss file, you will need to install Bootstrap 4 and include the following at the top of your main scss file:

```scss
@import '../../../node_modules/bootstrap/scss/functions';
@import '../../../node_modules/pb-design-system/dist/sass/variables';
@import '../../../node_modules/pb-design-system/dist/sass/mixins';
```

-  All DS breakpoint mixins have been removed in favor of using the Boostrap 4 mixins and utilities.
   See [Bootstrap 4 docs](https://getbootstrap.com/docs/4.0/getting-started/introduction/) for more detail.  This is still a work in progress..
-  All libraries updated to their latest versions as of 9/23/15

## 5.0.0-beta.1 - September 15, 2017

- initial release


