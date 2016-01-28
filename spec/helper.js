function providerGetter(moduleName, providerName) {
  var provider;
  module(moduleName, [providerName, function(p) { provider = p; }]);
  return function() { inject(); return provider; }; // inject calls the above
}
