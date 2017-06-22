# PB Design System for Bootstrap 4 and Angular

This repo is for distribution of the Design System on `npm`. 

## npm Install
You can install this package with `npm`:

```shell
npm install git://github.com/PBGUX/bower-designsystem.git#ng-ds-alpha --save
```

## .angular-cli.json
Add the design system css after the Bootstrap 4 css in the styles array

```
"styles": [
  "../node_modules/bootstrap/dist/css/bootstrap.css", // Bootstrap 4 Alpha 6
  "../node_modules/pb-design-system/dist/css/designsystem.css",
  "styles.scss"
],
```


## Sass
Reference the Design System .scss variables within your application Sass file to use the variables:

```scss
@import '../node_modules/pb-design-system/sass/settings/variables';
@import '../node_modules/pb-design-system/sass/settings/mixins';
```

**NOTE:** variables import must be first.
