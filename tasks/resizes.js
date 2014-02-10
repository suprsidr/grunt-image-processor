/*
 * grunt-image-processor
 * https://github.com/suprsidr/grunt-image-processor
 *
 * Copyright (c) 2014 Wayne Patterson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var path = require('path'),
        fs   = require('fs'),
        tmp  = require('tmp'),
        filesize = require('filesize'),
        which = require('which'),
        im = require('node-imagemagick'),
        _ = grunt.util._,
        options,
        done;

    /**
     * Build resizes for one image
     * @param  {Object}   file     With src and dest properties
     * @param  {Function} callback Callback function
     */
    function compile(file, callback) {
      var src = file.src, ext = path.extname(src), dest, queue, i = 0;
      
      function build(){
        dest = path.join(file.dest, path.basename(src, ext) + '-' + options.sizes[i].toString() + ext)
        if (grunt.file.exists(dest) && !options.force) {
          grunt.log.writeln('Resizing skipped on ' + dest.cyan + ' because it exists already. (force option is false!)');
          if(i < options.sizes.length - 1){
            i++;
            build();
            return;
          } else {
            callback();
            return;
          }
        } else {
          // this simple line makes sure the destination exists
          grunt.file.write(dest, '', ['--no-write']);
        }
        
        grunt.log.writeln('Resizing: ' + src.cyan + ' to: ' + dest.cyan );
        im.resize({
          srcPath : src,
          dstPath : dest,
          quality : options.quality,
          progressive : options.progressive,
          strip: options.strip,
          width : options.sizes[i]
  
        }, function(err, stdout, stderr) {
          if (err) {
            callback(err);
            return;
          } else {
            if(i < options.sizes.length - 1){
              i++;
              build();
            } else {
              callback();
            }
          }
        });
      }
      build();
    }

    // resizes multi task
    grunt.registerMultiTask('resizes', 'Resize images with ImageMagick.', function() {
        var queue;
        done = this.async()

        // Merge task-specific and/or target-specific options with these defaults.
        options = this.options({
            progressive: false,
            force: false,
            quality: 0.8,
            strip: true,
            sizes: [150, 250, 450]
        });

        grunt.verbose.writeflags(options, 'Options');

        // every file will be pushed in this queue
        queue = grunt.util.async.queue(compile, 1);

        queue.drain = function() {
            done();
        };

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            var dest = f.dest;

            // if dest points to a file, or the files object is built dynamically
            // the dest property is transformed to a directory, because we expect that
            if(
                (grunt.file.exists(f.dest) && grunt.file.isFile(f.dest)) ||
                path.extname(f.dest) === '.jpg' ||
                path.extname(f.dest) === '.JPG' ||
                path.extname(f.dest) === '.PNG' ||
                f.orig.expand
            ) {
                dest = path.dirname(f.dest);
            }

            // Concat specified files.
            var files = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                }
                else {
                    return true;
                }
            }).map(function(filepath) {
                return {
                    src: filepath,
                    dest: dest
                };
            });

            if(files.length === 0) {
                grunt.log.writeln('No images were found in this path(s): ' + f.orig.src.join(', ').cyan);
            }

            queue.push(files);
        });

        if(queue.length() === 0) {
            grunt.verbose.writeln('No images were found to resize...');
            done();
        }
    });

};
