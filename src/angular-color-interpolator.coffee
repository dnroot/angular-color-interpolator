# angular factory for interpolating colors, based on
# http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
((window, angular) ->

  HEX_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  RGB_REGEX = /^rgb\((?:\s*(\d{1,3})\s*,?){3}\)$/

  angular.module 'ngColorInterpolator'
    .factory '$colorInterpolator', ->
      toLongHex = (color) ->
        if color.match(RGB_REGEX) && color.length == 4
          "##{color[1]}#{color[1]}#{color[2]}#{color[2]}#{color[3]}#{color[3]}"
        else
          color

      splitRGB = (color) ->
        if color.match(RGB_REGEX)
          values = color.split(',')
          { r: parseInt(values[0].slice(4)), g: parseInt(values[1]), b: parseInt(values[2]) }
        else if color.match(HEX_REGEX)
          color = toLongHex(color)
          value = parseInt(color.slice(1), 16)
          { r: (value >> 16), g: (value >> 8&0x00FF), b: (value & 0x0000FF) }

      blend = (c1, c2, percentage) ->
        factor = if percentage < 0 then -percentage else percentage
        rgb1 = splitRGB(c1)
        rgb2 = splitRGB(c2)

        return unless rgb1 && rgb2

        if c1.match(RGB_REGEX)
          r = Math.round((rgb2.r - rgb1.r) * factor) + rgb1.r
          g = Math.round((rgb2.g - rgb1.g) * factor) + rgb1.g
          b = Math.round((rgb2.b - rgb1.b) * factor) + rgb1.b
          "rgb(#{r}, #{g}, #{b})"
        else
          r = 0x1000000 + 0x10000 * (Math.round((rgb2.r - rgb1.r) * factor) + rgb1.r)
          g = 0x100 * (Math.round((rgb2.g - rgb1.g) * factor) + rgb1.g)
          b = Math.round((rgb2.b - rgb1.b) * factor) + rgb1.b
          "##{(r + g + b).toString(16).slice(1)}"

      interpolate: (color, factor) ->
        if color.match(RGB_REGEX)
          blendedColor = if factor < 0 then 'rgb(0,0,0)' else 'rgb(255,255,255)'
        else if color.match(HEX_REGEX)
          blendedColor = if factor < 0 then '#000000' else '#ffffff'

        blend(color, blendedColor, factor) if blendedColor

      blend: blend

      lighten: interpolate

      darken: (color, factor) -> interpolate(color, -factor)

)(window, window.angular)
