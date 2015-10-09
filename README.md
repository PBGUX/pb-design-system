# packaged design system

This repo is for distribution of the Design System on `bower`. The source is the main [Design System repo](https://github.com/PBGUX/bower-designsystem). Please file issues against that repo.

##Install
You can install this package with `bower`:

```shell
bower install bower-designsystem --save
```

Then add a link tag in the document head AFTER the Bootstrap CSS:

```html
<link rel="stylesheet" href="bower_components/bower-designsystem/dist/css/design_system.css">
```

##Sass
Reference the Design System .scss variables within your application Sass file to use the variables:

```scss
@import 'bower_components/bower-designsystem/sass/mixins';
@import 'bower_components/bower-designsystem/sass/variables';
```
