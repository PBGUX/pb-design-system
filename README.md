# PB Design System 6

This repo is for distribution of the Design System on `npm` using Bootstrap 4.6.0 and Angular 12.2.1

## Installation

Install this package with `npm`:

```shell
npm install pb-design-system --save
```

Also you will need to install Boostrap 4.6.0 and Angular Material 11:

```shell
npm install bootstrap@4.6.0 @angular/material@12.2.1 --save
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

To use Bootstrap 4's javascript components (header, dropdowns, tooltips, and/or popovers) you will also need to load its js files in the scripts array:

```json
 "scripts": [
     "node_modules/jquery/dist/jquery.slim.js",
     "node_modules/popper.js/dist/umd/popper.min.js",
     "node_modules/bootstrap/dist/js/bootstrap.js"
 ],
```
