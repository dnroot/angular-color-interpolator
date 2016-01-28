

describe('ngColorInterpolator', function() {

  var provider;

  beforeEach(function() {
    provider = providerGetter('ngColorInterpolator', '$colorInterpolatorProvider')()
  });

  describe('lighten', function() {
    it('lightens 100% to white', function() {
      expect(provider.lighten('#aabbcc', 1)).toEqual('#ffffff')
    });

    it('lightens -100% to black', function() {
      expect(provider.lighten('#aabbcc', -1)).toEqual('#000000')
    });

    it('maxes > 100% to white', function() {
      expect(provider.lighten('#aabbcc', 1000)).toEqual('#ffffff')
    });

    it('maxes < -100% to black', function() {
      expect(provider.lighten('#aabbcc', -1000)).toEqual('#000000')
    });

    it('handles string factor', function() {
      expect(provider.lighten('#3f83a3', '0.1')).toEqual('#528fac')
    });

    angular.forEach(lightenSamples, function(values, key) {
      angular.forEach(values, function(value, index) {
        var factor = index / 10;
        it('lightens ' + key + ' at a factor of ' + factor, function() {
          expect(provider.lighten(key, factor)).toEqual(value);
        });
      })
    });

    angular.forEach(colorMappings, function(values, key) {
      angular.forEach(values, function(value) {
        it('parses ' + value + ' to be equivalent to ' + key, function() {
          expect(provider.lighten(value, 0.2)).toEqual(lightenSamples[key][2])
        });
      })
    });

    it('handles invalid factor', function() {
      expect(function() { provider.lighten('#aabbcc', 'junk') }).toThrow(new Error("Invalid factor junk - must be a numeric value"));
    });

    it('handles invalid color', function() {
      expect(function() { provider.lighten('#junk39', 0.1) }).toThrow(new Error("Invalid color: #junk39 - must be hex or rgb format"));
    });
  });

  describe('darken', function() {
    it('100% to black', function() {
      expect(provider.darken('#aabbcc', 1)).toEqual('#000000')
    });

    it('-100% to white', function() {
      expect(provider.darken('#aabbcc', -1)).toEqual('#ffffff')
    });

    it('maxes > 100% to black', function() {
      expect(provider.darken('#aabbcc', 1000)).toEqual('#000000')
    });

    it('maxes < -100% to white', function() {
      expect(provider.darken('#aabbcc', -1000)).toEqual('#ffffff')
    });

    angular.forEach(darkenSamples, function(values, key) {
      angular.forEach(values, function(value, index) {
        var factor = index / 10;
        it('darkens ' + key + ' at a factor of ' + factor, function() {
          expect(provider.darken(key, factor)).toEqual(value);
        });
      })
    });

    angular.forEach(colorMappings, function(values, key) {
      angular.forEach(values, function(value) {
        it('parses ' + value + ' to be equivalent to ' + key, function() {
          expect(provider.darken(value, 0.2)).toEqual(darkenSamples[key][2])
        });
      })
    });

    it('handles invalid factor', function() {
      expect( function(){ provider.darken('#aabbcc', 'junk') } ).toThrow(new Error("Invalid factor junk - must be a numeric value"));
    });

    it('handles invalid color', function() {
      expect(function() { provider.darken('#junk39', 0.1) }).toThrow(new Error("Invalid color: #junk39 - must be hex or rgb format"));
    });
  });
});
