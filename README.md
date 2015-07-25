# angular-color-interpolator
Angular provider for color interpolation.

## Inspiration
The primary reason this was needed was to use database-driven branding colors for an angular application.
When customizing [angular-material](https://material.angularjs.org/)'s [themes](https://material.angularjs.org/latest/#/Theming/01_introduction), it became apparent that storing a bunch of colors wasn't necessarily ideal.

Instead, we store a single color in the database and create a custom theme by running:
```javascript
generateTheme = function(base) {
  return {
    '50'  : $colorInterpolator.lighten(base, 0.5),
    '100' : $colorInterpolator.lighten(base, 0.4),
    '200' : $colorInterpolator.lighten(base, 0.3),
    '300' : $colorInterpolator.lighten(base, 0.2),
    '400' : $colorInterpolator.lighten(base, 0.1),
    '500' : base,
    '600' : $colorInterpolator.darken(base, 0.1),
    '700' : $colorInterpolator.darken(base, 0.2),
    '800' : $colorInterpolator.darken(base, 0.3),
    '900' : $colorInterpolator.darken(base, 0.4),
    'A100': $colorInterpolator.lighten(base, 0.3),
    'A200': $colorInterpolator.lighten(base, 0.15),
    'A400': $colorInterpolator.darken(base, 0.15),
    'A700': $colorInterpolator.darken(base, 0.3),
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
    'contrastLightColors': ['900', '800', '700', '600', '500', 'A700']
  }
}
```

## Usage
* `lighten(color, factor)` - color being a hex or rgb color, factory being 0.1 for 10%, 0.2 for 20%, and so on. Will lighten the color by that factor.
* `darken(color, factor)` - inverse of lighten
* `blend(color1, color2, factor)` - given two colors, blend the colors together using the given factor to determine how to weight each color.

## Contributions
* Fork the project, make changes, and submit a PR. I will bundle the release together and push out the new version.

## Build for release
Bump up the version and run:
```
$ grunt
```
Commit the new version and run `git tag [version]` and `git push origin --tags`.
