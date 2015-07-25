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
    uglify:
      build:
        src: 'release/<%= pkg.name %>.js'
        dest: 'release/<%= pkg.name %>.min.js'

  grunt.loadNpmTasks('grunt-banner')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.registerTask('default', ['coffee', 'uglify', 'usebanner'])
