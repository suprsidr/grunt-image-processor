/*
 * grunt-jpgmin
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
        jpegtran = require('jpegtran-bin').path,
        _ = grunt.util._,
        totalPercent,
        totalSize,
        options;

    /**
     * Optimizes one picture
     * @param  {Object}   file     With src and dest properties
     * @param  {Function} callback Callback function
     */
    function optimize(file, callback) {
        var src = file.src,
            realDest = path.join(file.dest, path.basename(src, path.extname(src)) + options.ext);
        grunt.log.writeln(src, realDest);

        if(grunt.file.exists(realDest) && !options.force) {
            grunt.log.writeln('Optimization skipped on ' + src.cyan + ' because it exists in destination. (force option is false!)');
            totalPercent.push(0);
            callback();
            return;
        }

        // optimize a temporary file
        tmp.tmpName({ postfix: '.jpg' }, function(error, tmpDest) {
            if(error) {
                callback(error);
                return;
            }

            grunt.file.copy(src, tmpDest);

            var args = ['-copy', 'none', '-optimize'];
            
            if (options.progressive) {
                args.push('-progressive');
            }
            grunt.util.spawn({
                cmd: jpegtran,
                args: args.concat(['-outfile', tmpDest, src])
            }, function(error, result, code) {
                if(error) {
                    callback(error);
                    return;
                }

                var oldFile = fs.statSync(src).size,
                    newFile = fs.statSync(tmpDest).size,
                    savings = Math.floor((oldFile - newFile) / oldFile * 100);

                grunt.file.copy(tmpDest, realDest);
                grunt.file.delete(tmpDest, {force: true});

                if(savings >= 0) {
                    grunt.log.writeln('Optimized ' + realDest.cyan +
                                      ' [saved ' + savings + ' % - ' + filesize(oldFile, 1, false) + ' → ' + filesize(newFile, 1, false) + ']');
                    totalPercent.push(savings);
                    totalSize += oldFile - newFile;
                }
                else {
                    grunt.file.copy(src, realDest);
                    grunt.log.writeln('Optimization would increase file size by ' + (savings * -1) + ' % so optimization was skipped on file ' + src.yellow);
                    totalPercent.push(0);
                }

                callback();
            });
        });
    }



    // jpgmin multi task

    grunt.registerMultiTask('jpgmin', 'Optimize jpg images with jpegtran.', function() {
        var done = this.async(),
            queue;

        // Merge task-specific and/or target-specific options with these defaults.
        options = this.options({
            ext: '-opt.jpg',
            progressive: false,
            force: false,
            concurrency: 4
        });

        // reset
        totalPercent = [];
        totalSize = 0;

        grunt.verbose.writeflags(options, 'Options');

        // every file will be pushed in this queue
        queue = grunt.util.async.queue(optimize, options.concurrency);

        queue.drain = function() {
            var sum = totalPercent.reduce(function(a, b) { return a + b; }),
                avg = Math.floor(sum / totalPercent.length);

            grunt.log.writeln('Overall savings: ' + (avg + ' %').green + ' | ' + filesize(totalSize, 1, false).green);
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
            grunt.verbose.writeln('No images were found at all...');
            done();
        }
    });

};
