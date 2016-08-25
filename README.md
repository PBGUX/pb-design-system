#PB Design System Package

This package simplifies installing and maintaining your app's use of the PB Design System.

Please file any issues against the main [Design System repo](https://github.com/PBGUX/designsystem-3/tree/master).

##Bower Install
You can install this package with `bower`:

```shell
bower install pb-design-system --save
```

##NPM Install
You can install this package with `npm`:

```shell
npm install pb-design-system --save
```

After installing, just add a link tag in the document head AFTER the Bootstrap CSS:

```html
<link rel="stylesheet" href="node_modules/pb-design-system/dist/css/design_system.css">
```

You are now all set, and will be using the Design System.  Create an additional css file if needed with styles unique to your application.

If your project uses Sass for css, you can import the 2 provided partials into your scss file to gain access to the mixins and variables we used in creating the Design System.  Add the following **to the top** of your main scss file:

```scss
@import '../../bower_components/pb-design-system/sass/settings/variables';
@import '../../bower_components/pb-design-system/sass/settings/mixins';
```

This assumes your parent scss file is in `./assets/sass`. Also not that the above order is important, *variables first*.
