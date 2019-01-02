# PB Design System 5

This repo is for distribution of the Design System on `npm` using Bootstrap 4 and Angular.

## npm Install

You can install this package with `npm`:

```shell
npm install pb-design-system --save
```

or install a specific version:

```shell
npm install pb-design-system@5.0.0 --save
```

## angular.json

Add your app's `styles.scss` after the Design System css file in the styles array

```json
"styles": [
  "../node_modules/pb-design-system/dist/css/designsystem.css",
  "styles.scss"
],
```

## Optional: 

To use Bootstrap 4's javascript components (dropdowns, tooltips, and/or popovers) you will also need to install Boostrap 4 `npm install bootstrap` and load its js files in the scripts array:

```json
 "scripts": [
     "../node_modules/jquery/dist/jquery.slim.js",
     "../node_modules/popper.js/dist/umd//popper.min.js",
     "../node_modules/bootstrap/dist/js/bootstrap.js"
 ],
```

This is not required if you use the `ng-bootstrap` version of the components (recommended).

**IMPORTANT: You do not need to load the Boostrap css files. They are compiled into the designsystem.css.**

## Using the Design System scss files:

_Optional_: to use the Design System variables and mixins in your scss file, you will need to install Bootstrap 4 and include the following at the top of your main scss file:

```scss
@import "../../../node_modules/bootstrap/scss/functions";
@import "../../../node_modules/pb-design-system/sass/variables";
@import "../../../node_modules/pb-design-system/sass/mixins";
```

## Using the optional "Unbranded" CSS

We provide a file, `unbranded.css`, which can be used to completely override the colors in the default Design System. This is intended for those cases where the application needs to branded for a client, for example.

Simply edit this file and load it in your project after the `designsystem.css` file. See https://designsystem.pitneycloud.com/web/unbranded-theme for details on usage and limitations.
