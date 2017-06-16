# PB Design System 

This repo is for distribution of the Design System on `bower` and `npm`. 

##npm Install
You can install this package with `npm`:

```shell
npm install git://github.com/PBGUX/bower-designsystem.git#ng-ds-alpha --save
```
Then add a link tag in the document head AFTER the Bootstrap CSS:

```html
<link rel="stylesheet" href="bower_components/pb-design-system/dist/css/design_system.css">
```

##Sass
Reference the Design System .scss variables within your application Sass file to use the variables:

```scss
@import '../node_modules/pb-design-system/sass/settings/variables';
@import '../node_modules/pb-design-system/sass/settings/mixins';
```

**NOTE: variables import must go first.
