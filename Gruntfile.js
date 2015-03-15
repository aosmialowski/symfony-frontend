"use strict";

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    appDir: 'web/assets',
    buildDir: 'web/assets-dist',

    requirejs: {
      main: {
        options: {
          mainConfigFile: '<%= appDir %>/js/main.js',
          appDir: '<%= appDir %>/js',
          baseUrl: '.',
          dir: '<%= buildDir %>/js',
          optimize: "none",
          modules: [
            {
              name: 'main',
              include: ['jquery', 'bootstrap']
            },
            {
              name: 'common',
              exclude: ['main']
            },
            {
              name: 'homepage',
              exclude: ['main']
            }
          ]
        }
      }
    },

    less: {
      dev: {
        files: {
          '<%= buildDir %>/css/main.css': '<%= appDir %>/less/main.less'
        },
        options: {
          cleancss: false,
          compress: false,
          relativeUrls: true
        }
      },
      dist: {
        files: {
          '<%= buildDir %>/css/main.min.css': '<%= appDir %>/less/main.less'
        },
        options: {
          cleancss: true,
          compress: true,
          relativeUrls: true
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: [{
          src: '<%= buildDir %>/js/**/*.js',
          dest: './',
          expand: true
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= appDir %>/js/**/*.js'
      ]
    },

    symlink: {
      main: {
        files: [
          {
            expand: true,
            overwrite: false,
            cwd: '<%= appDir %>',
            src: ['img', 'vendor'],
            dest: '<%= buildDir %>'
          }
        ]
      }
    },

    watch: {
      config: {
        files: ['Gruntfile.js'],
        tasks: ['jshint', 'requirejs'],
        options: {
          reload: true,
          spawn: false
        }
      },
      scripts: {
        files: ['<%= appDir %>/js/**/*.js'],
        tasks: ['jshint', 'requirejs'],
        options: {
          spawn: false
        }
      },
      less: {
        files: [
          '<%= appDir %>/less/*.less',
          '<%= appDir %>/less/**/*.less'
        ],
        tasks: ['less:dev', 'autoprefixer'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'requirejs', 'less:dev', 'symlink', 'watch']);
  grunt.registerTask('dist', ['jshint', 'requirejs', 'uglify', 'less:dist', 'symlink']);
};
