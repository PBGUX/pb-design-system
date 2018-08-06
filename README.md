# PB Design System 5 Technology Preview

This repo is for distribution of the Design System on `npm` using Bootstrap 4 and Angular.

## npm Install
You can install this package with `npm`:

```shell
npm install pb-design-system@beta --save
```

or install a specific beta version:

```shell
npm install pb-design-system@5.0.0-beta.2 --save
```

## .angular-cli.json
Add your app's `styles.scss` after the Design System css file in the styles array

```json
"styles": [
  "../node_modules/pb-design-system/dist/css/designsystem.css",
  "styles.scss"
],
```

*Optional*: to use Bootstrap 4's javascript components (dropdowns, tooltips, and/or popovers) you will also need to install Boostrap 4 `npm install bootstrap` and load its js files in the scripts array

```json
 "scripts": [
     "../node_modules/jquery/dist/jquery.slim.js",
     "../node_modules/popper.js/dist/umd//popper.min.js",
     "../node_modules/bootstrap/dist/js/bootstrap.js"
 ],
```

This is not required if you use the `ng-bootstrap` version of the components (recommended).

## Using the Design System scss files:

*Optional*: to use the DS variables and mixins in your scss file, you will need to install Bootstrap 4 and include the following at the top of your main scss file:

```scss
@import '../../../node_modules/bootstrap/scss/functions';
@import '../../../node_modules/pb-design-system/dist/sass/variables';
@import '../../../node_modules/pb-design-system/dist/sass/mixins';
```


