# grunt-image-processor

> Expanded from https://github.com/zauni/pngmin - Grunt plugin to compress png images with pngquant and jpg images with jpegtran. Also build resizes for jpg and png.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install https://github.com/suprsidr/grunt-image-processor/archive/master.tar.gz --save
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-image-processor');
```

### Requires
For image resizing [ImageMagick](http://www.imagemagick.org/script/binary-releases.php#windows) binaries must be in your PATH


## Three included tasks:

```js
grunt.initConfig({
  pngmin: {
    compile: {
      options: {
        binary: 'bin/pngquant.exe', // specify pngquant path
        concurrency: 8,             // specify how many exucutables get spawned in parallel
        colors: 128,                // reduce colors to 128
        ext: '.png',                // use .png as extension for the optimized files default: -opt.png
        quality: '30-60',           // output quality should be between 65 and 80 like jpeg quality
        speed: 10,                  // pngquant should be as fast as possible
        force: false                // force overwrites if destination file exists - very expensive    
      },
      files: [
        {
          expand: true,
          src: ['**/*.png'],
          cwd: 'img-src/',
          dest: 'img/'
        }
      ]
    }
  },
  
  jpgmin: {
    compile: {
      options: {
        ext: '.jpg',                // use .jpg as extension for the optimized files default: -opt.jpg
        progressive: true,          // progressive jpg output
        force: false                // force overwrites if destination file exists - very expensive    
      },
      files: [
        {
          expand: true,
          src: ['**/*.{jpg,JPG}'],
          cwd: 'img-src/',
          dest: 'img/'
        }
      ]
    }
  },
  
  resizes: {
    compile: {
      options: {
        force: false,                // force overwrites if destination file exists - very expensive
        quality: 0.8,                // output quality
        progressive: true,           // progressive jpg
        strip: true,                 // strip metadata
        sizes: [250, 450, 650]       // array of resizes. images will be named image-250.jpg, image-450.jpg, image-650.jpg...
      },
      files: [
        {
          expand: true,
          src: ['**/*.{jpg,JPG,png}'],
          cwd: 'resize/',
          dest: 'img/'
        }
      ]
    }
  }
});
```

## Release History
- 0.1.0: Initial release

