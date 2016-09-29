# PB Design System 

This repo is for distribution of the Design System on `bower` and `npm`. 

##Bower Install
You can install this package with `bower`:

```shell
bower install pb-design-system --save
```

Then add a link tag in the document head AFTER the Bootstrap CSS:

```html
<link rel="stylesheet" href="bower_components/pb-design-system/dist/css/design_system.css">
```

##npm Install
You can install this package with `npm`:

```shell
npm install pb-design-system --save
```

Then add a link tag in the document head AFTER the Bootstrap CSS:

```html
<link rel="stylesheet" href="node_modules/pb-design-system/dist/css/design_system.css">
```

##Sass
Reference the Design System .scss variables within your application Sass file to use the variables:

```scss
@import '../bower_components/pb-design-system/sass/settings/variables';
@import '../bower_components/pb-design-system/sass/settings/mixins';
```

**NOTE: variables import must go first. The above relative path assumes `bower_components` is a sibling of your `sass` directory.**
