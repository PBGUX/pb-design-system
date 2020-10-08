# PB Design System 6

This repo is for distribution of the Design System on `npm` using Bootstrap 4.5 and Angular 10.1.

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

**IMPORTANT: You do not need to load the Boostrap css files. They are compiled into the designsystem.css.**
