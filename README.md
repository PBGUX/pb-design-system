# PB Design System 16

This is a release of the Design System with Bootstrap 5.

It requires Bootstrap 5, Angular 16, and NG-Bootstrap 15 to be installed.

Your node version must be 16 or 18, please check by running `node -v`.

## Installation

Install this package with `npm`:

```shell
npm install pb-design-system --save
```

Also you will need to install Boostrap 5.x and Angular Material:

```shell
npm install bootstrap @angular/material @popperjs/core --save
```

You will see warnings about peer dependencies (such as D3); those only need to be installed if you need them.

## Configuring angular.json

Add your app's `styles.scss` after the Design System css file in the styles array, as follows:

```json
"styles": [
  "node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/pb-design-system/dist/css/designsystem.css",
  "styles.scss"
],
```

## Optional Installs:

To use Bootstrap's javascript components (header, dropdowns, tooltips, and/or popovers) you will also need to load its js files in the scripts array:

```json
 "scripts": [
    "node_modules/jquery/dist/jquery.slim.js",
    "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
    "node_modules/bootstrap/dist/js/bootstrap.js"
 ],
```
