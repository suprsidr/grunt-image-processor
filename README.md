# grunt-imgproc

> Expanded from https://github.com/zauni/pngmin - Grunt plugin to compress png images with pngquant and jpg images with jpegtran. Also build resizes for jpg and png.",

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-imgproc --save
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-imgproc');
```

### Linux users
You also have to download pngquant if you are on a Linux system from their website: [pngquant.org](http://pngquant.org).
You can put the pngquant executable either somewhere in your `PATH` or in a folder in your project.
If you put it in a folder outside of the `PATH`, you have to specify the path to it with the `binary` option (see below).

Windows and Mac OSX is supported out of the box.

## The "imgproc" task

### Overview
In your project's Gruntfile, add a section named `imgproc` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  imgproc: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.binary
Type: `String`
Default value: `'pngquant'` in your `PATH` or `'bin/pngquant'`

Important for Linux users!
The pngquant executable which will be spawned. If the pngquant binary is not found in `PATH` the default fallback is `'bin/pngquant'`, but this option has always precedence.

#### options.concurrency
Type: `Number`
Default value: `4`

How many executables will be spawned in parallel.

#### options.colors
Type: `Number`
Default value: `256`

How many colors should be in the image after quantizing.

#### options.ext
Type: `String`
Default value: `'-fs8.png'`

The file extension after the quantization.

#### options.quality
Type: `String`, `Object` or `Array`
Default value: `null`

Instructs pngquant to use the least amount of colors required to meet or exceed the max quality.
If conversion results in quality below the min quality the image won't be saved.
Specify quality like that:
* String: `'min-max'`
* Object: `{min: min, max: max}`
* Array: `[min, max]`

min and max are numbers in range 0 (worst) to 100 (perfect), similar to JPEG.
For example as object: `{min: 60, max: 80}`.

#### options.force
Type: `Boolean`
Default value: `false`

Should existing files be overwritten by the optimized version? Be careful with this option if you need the original files!

#### options.speed
Type: `Number`
Default value: `3`

Speed/quality trade-off from 1 (brute-force) to 10 (fastest). Speed 10 has 5% lower quality, but is 8 times faster than the default.

#### options.iebug
Type: `Boolean`
Default value: `false`

Workaround for IE6, which only displays fully opaque pixels. pngquant will make almost-opaque pixels fully opaque and will avoid creating new transparent colors.

#### options.transbug
Type: `Boolean`
Default value: `false`

Transparent color will be placed at the end of the palette.

### Usage Examples

#### Default Options
In this example `image.png` will be optimized, copied to `dest` folder and renamed to `image-fs8.png`.

```js
grunt.initConfig({
  imgproc: {
    compile: {
      options: {},
      files: [
        {
          src: 'path/to/image.png',
          dest: 'dest/'
        }
      ]
    }
  }
});
```

#### Custom Options
In this example `image.png` will be optimized and copied to `dest` folder.

```js
grunt.initConfig({
  imgproc: {
    compile: {
      options: {
        ext: '.png'
      },
      files: [
        {
          src: 'path/to/image.png',
          dest: 'dest/'
        }
      ]
    }
  }
});
```

In this example `image.png` gets overwritten by the optimized version, so use force option carefully!

```js
grunt.initConfig({
  imgproc: {
    compile: {
      options: {
        ext: '.png',
        force: true
      },
      files: [
        {
          src: 'path/to/image.png',
          dest: 'path/to/'
        }
      ]
    }
  }
});
```

#### Example which is preserving the subfolder structure
In this example all images in the folder `path/to/images/` and its subfolders will be optimized and copied to `dest` while preserving the directory structure.
See http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically for more options.

```js
grunt.initConfig({
  imgproc: {
    compile: {
      options: {
        ext: '.png'
      },
      files: [
        {
          expand: true, // required option
          src: ['**/*.png'],
          cwd: 'path/to/images/', // required option
          dest: 'dest/'
        }
      ]
    }
  }
});
```

#### Complex example
This is a complex example with a lot of options set:

```js
grunt.initConfig({
  imgproc: {
    compile: {
      options: {
        binary: 'path/to/pngquant', // specify pngquant path if on Linux
        concurrency: 8,             // specify how many exucutables get spawned in parallel
        colors: 128,                // reduce colors to 128
        ext: '.png',                // use .png as extension for the optimized files
        quality: '65-80',           // output quality should be between 65 and 80 like jpeg quality
        speed: 10,                  // pngquant should be as fast as possible
        iebug: true                 // optimize image for use in Internet Explorer 6
      },
      files: [
        {
          src: 'path/to/images/*.png',
          dest: 'dest/'
        },
        {
          src: 'path/to/other/images/*.png',
          dest: 'another/dest/'
        }
      ]
    }
  }
});
```


## Release History
- 0.1.0: Initial release

