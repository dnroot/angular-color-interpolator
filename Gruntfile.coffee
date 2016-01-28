module.exports = (grunt) ->
  banner = """
/*
 * <%= pkg.name %>
 * https://github.com/dnroot/angular-color-interpolator
 * @version <%= pkg.version %> <<%= grunt.template.today("yyyy-mm-dd") %>>
 * @author Dan Root
 * @license MIT
 */
  """

  # Project configuration
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    usebanner:
      default:
        options:
          position: 'top'
          banner: banner
        files:
          src: ['release/*.js']
    coffee:
      compile:
        files:
          'release/<%= pkg.name %>.js': 'src/<%= pkg.name %>.coffee'
    coffeelint:
      app: ['src/*.coffee']
    uglify:
      build:
        src: 'release/<%= pkg.name %>.js'
        dest: 'release/<%= pkg.name %>.min.js'
    karma:
      unit:
        options:
          frameworks: ['jasmine']
          singleRun: true
          browsers: ['PhantomJS']
          files: [
            'bower_components/angular/angular.js'
            'bower_components/angular-mocks/angular-mocks.js'
            'release/angular-color-interpolator.js'
            'spec/helper.js'
            'spec/data.js'
            'spec/**/*.js'
          ]

  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.loadNpmTasks('grunt-banner')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-karma')
  grunt.registerTask('default', ['coffeelint', 'coffee', 'uglify', 'usebanner', 'karma'])
  grunt.registerTask('test', ['coffeelint', 'coffee', 'karma'])
