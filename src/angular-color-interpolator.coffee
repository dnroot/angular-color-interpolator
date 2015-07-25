# Original inspiration (and much of the source) came from:
# http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors

((window, angular) ->

  HEX_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  RGB_REGEX = /^rgb\((?:\s*(\d{1,3})\s*,?){3}\)$/

  angular.module 'ngColorInterpolator', []
    .provider '$colorInterpolator', ->
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

      ###
       * Blends two colors together
       * @example
       * $colorInterpolator.blend('#a1c311', '#ec8d1c', 0.8)
       * @param c1 {string} HEX or RGB color
       * @param c2 {string} HEX or RGB color
       * @param factor {number} (optional) the weight which to blend the two colors together (between 0-1)
      ###
      @blend = (c1, c2, factor=0.5) ->
        throw "Invalid factor #{factor} - must be a numeric value" unless !isNaN(parseFloat(factor))
        throw "Invalid color: #{c1} - must be hex or rgb format" unless c1.match(RGB_REGEX) || c1.match(HEX_REGEX)
        throw "Invalid color: #{c2} - must be hex or rgb format" unless c2.match(RGB_REGEX) || c2.match(HEX_REGEX)

        factor = -factor if factor < 0
        rgb1 = splitRGB(c1)
        rgb2 = splitRGB(c2)

        return unless rgb1 && rgb2

        if c1.match(RGB_REGEX) && c2.match(RGB_REGEX)
          r = Math.round((rgb2.r - rgb1.r) * factor) + rgb1.r
          g = Math.round((rgb2.g - rgb1.g) * factor) + rgb1.g
          b = Math.round((rgb2.b - rgb1.b) * factor) + rgb1.b
          "rgb(#{r}, #{g}, #{b})"
        else if c1.match(HEX_REGEX) && c2.match(HEX_REGEX)
          r = 0x1000000 + 0x10000 * (Math.round((rgb2.r - rgb1.r) * factor) + rgb1.r)
          g = 0x100 * (Math.round((rgb2.g - rgb1.g) * factor) + rgb1.g)
          b = Math.round((rgb2.b - rgb1.b) * factor) + rgb1.b
          "##{(r + g + b).toString(16).slice(1)}"
        else
          throw "Color format mismatch - #{c1} and #{c2} are different formats"

      ###
       * Lighten a color by a given factor
       * @example
       * $colorInterpolator.lighten("#ececec", 0.5)
       * @param color {string} HEX or RGB color
       * @param factor {number} weight to lighten the color (between 0-1)
      ###
      @lighten = (color, factor) ->
        if color.match(RGB_REGEX)
          blendedColor = if factor < 0 then 'rgb(0,0,0)' else 'rgb(255,255,255)'
        else if color.match(HEX_REGEX)
          blendedColor = if factor < 0 then '#000000' else '#ffffff'
        else
          throw "Invalid color: #{color}\nMust be hex or rgb format"

        @blend(color, blendedColor, factor) if blendedColor

      ###
       * Darken a color by a given factor
       * @example
       * $colorInterpolator.darken("#ececec", 0.5)
       * @param color {string} HEX or RGB color
       * @param factor {number} weight to lighten the color (between 0-1)
      ###
      @darken = (color, factor) -> @lighten(color, -factor)

      @$get = -> @

      @

)(window, window.angular)
