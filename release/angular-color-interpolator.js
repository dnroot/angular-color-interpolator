/*
 * angular-color-interpolator
 * https://github.com/dnroot/angular-color-interpolator
 * @version 0.0.2 <2015-07-24>
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
      this.blend = function(c1, c2, percentage) {
        var b, factor, g, r, rgb1, rgb2;
        factor = percentage < 0 ? -percentage : percentage;
        rgb1 = splitRGB(c1);
        rgb2 = splitRGB(c2);
        if (!(rgb1 && rgb2)) {
          return;
        }
        if (c1.match(RGB_REGEX)) {
          r = Math.round((rgb2.r - rgb1.r) * factor) + rgb1.r;
          g = Math.round((rgb2.g - rgb1.g) * factor) + rgb1.g;
          b = Math.round((rgb2.b - rgb1.b) * factor) + rgb1.b;
          return "rgb(" + r + ", " + g + ", " + b + ")";
        } else {
          r = 0x1000000 + 0x10000 * (Math.round((rgb2.r - rgb1.r) * factor) + rgb1.r);
          g = 0x100 * (Math.round((rgb2.g - rgb1.g) * factor) + rgb1.g);
          b = Math.round((rgb2.b - rgb1.b) * factor) + rgb1.b;
          return "#" + ((r + g + b).toString(16).slice(1));
        }
      };
      this.lighten = function(color, factor) {
        var blendedColor;
        if (color.match(RGB_REGEX)) {
          blendedColor = factor < 0 ? 'rgb(0,0,0)' : 'rgb(255,255,255)';
        } else if (color.match(HEX_REGEX)) {
          blendedColor = factor < 0 ? '#000000' : '#ffffff';
        }
        if (blendedColor) {
          return this.blend(color, blendedColor, factor);
        }
      };
      this.darken = function(color, factor) {
        return this.lighten(color, -factor);
      };
      this.$get = function() {
        return this;
      };
      return this;
    });
  })(window, window.angular);

}).call(this);
