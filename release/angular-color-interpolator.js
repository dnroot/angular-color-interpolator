/*
 * angular-color-interpolator
 * https://github.com/dnroot/angular-color-interpolator
 * @version 1.0.0 <2016-01-27>
 * @author Dan Root
 * @license MIT
 */
(function() {
  (function(window, angular) {
    var HEX_REGEX, RGB_REGEX;
    HEX_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    RGB_REGEX = /^rgb\((?:\s*(\d{1,3})\s*,?){3}\)$/;
    return angular.module('ngColorInterpolator', []).provider('$colorInterpolator', function() {
      var splitRGB, toLongHex;
      toLongHex = function(color) {
        if (color.match(RGB_REGEX) && color.length === 4) {
          return "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
        } else {
          return color;
        }
      };
      splitRGB = function(color) {
        var value, values;
        if (color.match(RGB_REGEX)) {
          values = color.split(',');
          return {
            r: parseInt(values[0].slice(4)),
            g: parseInt(values[1]),
            b: parseInt(values[2])
          };
        } else if (color.match(HEX_REGEX)) {
          color = toLongHex(color);
          value = parseInt(color.slice(1), 16);
          return {
            r: value >> 16,
            g: value >> 8 & 0x00FF,
            b: value & 0x0000FF
          };
        }
      };

      /*
       * Blends two colors together
       * @example
       * $colorInterpolator.blend('#a1c311', '#ec8d1c', 0.8)
       * @param c1 {string} HEX or RGB color
       * @param c2 {string} HEX or RGB color
       * @param factor {number} (optional) the weight which to blend the two colors together (between 0-1)
       */
      this.blend = function(c1, c2, factor) {
        var b, g, r, rgb1, rgb2;
        if (factor == null) {
          factor = 0.5;
        }
        if (isNaN(parseFloat(factor))) {
          throw new Error("Invalid factor " + factor + " - must be a numeric value");
        }
        if (!(c1.match(RGB_REGEX) || c1.match(HEX_REGEX))) {
          throw new Error("Invalid color: " + c1 + " - must be hex or rgb format");
        }
        if (!(c2.match(RGB_REGEX) || c2.match(HEX_REGEX))) {
          throw new Error("Invalid color: " + c2 + " - must be hex or rgb format");
        }
        if (factor < 0) {
          factor = -factor;
        }
        if (factor > 1) {
          factor = 1;
        }
        rgb1 = splitRGB(c1);
        rgb2 = splitRGB(c2);
        if (!(rgb1 && rgb2)) {
          return;
        }
        if (c1.match(RGB_REGEX) && c2.match(RGB_REGEX)) {
          r = Math.round((rgb2.r - rgb1.r) * factor) + rgb1.r;
          g = Math.round((rgb2.g - rgb1.g) * factor) + rgb1.g;
          b = Math.round((rgb2.b - rgb1.b) * factor) + rgb1.b;
          return "rgb(" + r + ", " + g + ", " + b + ")";
        } else if (c1.match(HEX_REGEX) && c2.match(HEX_REGEX)) {
          r = 0x1000000 + 0x10000 * (Math.round((rgb2.r - rgb1.r) * factor) + rgb1.r);
          g = 0x100 * (Math.round((rgb2.g - rgb1.g) * factor) + rgb1.g);
          b = Math.round((rgb2.b - rgb1.b) * factor) + rgb1.b;
          return "#" + ((r + g + b).toString(16).slice(1));
        } else {
          throw new Error("Color format mismatch - " + c1 + " and " + c2 + " are different formats");
        }
      };

      /*
       * Lighten a color by a given factor
       * @example
       * $colorInterpolator.lighten("#ececec", 0.5)
       * @param color {string} HEX or RGB color
       * @param factor {number} weight to lighten the color (between 0-1)
       */
      this.lighten = function(color, factor) {
        var blendedColor;
        if (isNaN(parseFloat(factor))) {
          throw new Error("Invalid factor " + factor + " - must be a numeric value");
        }
        factor = parseFloat(factor);
        if (color.match(RGB_REGEX)) {
          blendedColor = factor < 0 ? 'rgb(0,0,0)' : 'rgb(255,255,255)';
        } else if (color.match(HEX_REGEX)) {
          blendedColor = factor < 0 ? '#000000' : '#ffffff';
        } else {
          throw new Error("Invalid color: " + color + " - must be hex or rgb format");
        }
        if (blendedColor) {
          return this.blend(color, blendedColor, factor);
        }
      };

      /*
       * Darken a color by a given factor
       * @example
       * $colorInterpolator.darken("#ececec", 0.5)
       * @param color {string} HEX or RGB color
       * @param factor {number} weight to lighten the color (between 0-1)
       */
      this.darken = function(color, factor) {
        if (isNaN(parseFloat(factor))) {
          throw new Error("Invalid factor " + factor + " - must be a numeric value");
        }
        return this.lighten(color, -parseFloat(factor));
      };
      this.$get = function() {
        return this;
      };
      return this;
    });
  })(window, window.angular);

}).call(this);
