suite('Filters', function() {
  var myp5;
  let img;
  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        myp5.createCanvas(10, 10);
        img = myp5.createImage(10, 10);
        myp5.pixelDensity(1);
        img.loadPixels();
        for (let i = 0; i < img.width; i++) {
          for (let j = 0; j < img.height; j++) {
            img.set(i, j, myp5.color(120, 20, 40));
          }
        }
        img.updatePixels();
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  test('threshold filter. less than threshold', function() {
    img.filter(myp5.THRESHOLD);
    myp5.image(img, 0, 0);
    myp5.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(myp5.pixels[i], 0);
      assert.strictEqual(myp5.pixels[i + 1], 0);
      assert.strictEqual(myp5.pixels[i + 2], 0);
    }
  });

  test('threshold filter. greater than threshold', function() {
    img.loadPixels();
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        img.set(i, j, myp5.color(211, 228, 250));
      }
    }
    img.updatePixels();
    img.filter(myp5.THRESHOLD);
    myp5.image(img, 0, 0);
    myp5.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(myp5.pixels[i], 255);
      assert.strictEqual(myp5.pixels[i + 1], 255);
      assert.strictEqual(myp5.pixels[i + 2], 255);
    }
  });

  test('gray filter', function() {
    img.filter(myp5.GRAY);
    myp5.image(img, 0, 0);
    myp5.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(myp5.pixels[i], myp5.pixels[i + 1]); // r, g, b values should be equal for gray
      assert.strictEqual(myp5.pixels[i + 1], myp5.pixels[i + 2]);
    }
  });

  test('opaque filter', function() {
    img.loadPixels();
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        img.set(i, j, myp5.color(120, 20, 40, 10));
      }
    }
    img.updatePixels();
    img.filter(myp5.OPAQUE);
    myp5.image(img, 0, 0);
    myp5.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(myp5.pixels[i + 3], 255); // 'a' value should be 255 after OPAQUE filter
    }
  });

  test('invert filter', function() {
    img.filter(myp5.INVERT);
    myp5.image(img, 0, 0);
    myp5.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(myp5.pixels[i], 135);
      assert.strictEqual(myp5.pixels[i + 1], 235);
      assert.strictEqual(myp5.pixels[i + 2], 215);
    }
  });

  test('replace color filter', function() {
    const oldColor = myp5.color(120, 20, 40);
    const newColor = myp5.color(
      myp5.random(255),
      myp5.random(255),
      myp5.random(255),
      myp5.random(127, 255) // Alpha less than 127 makes assertion difficult because it changes rgb values greater.
    );
    img.filter(myp5.REPLACE_COLOR, [oldColor, newColor]);
    myp5.image(img, 0, 0);
    myp5.loadPixels();
    const newR = newColor.levels[0];
    const newG = newColor.levels[1];
    const newB = newColor.levels[2];
    const newA = newColor.levels[3];
    for (let i = 0; i < img.width * img.height; i += 4) {
      // rgb values need to allow ±1 error for using alpha < 1
      assert.isAtLeast(myp5.pixels[i], newR - 1);
      assert.isAtMost(myp5.pixels[i], newR + 1);
      assert.isAtLeast(myp5.pixels[i + 1], newG - 1);
      assert.isAtMost(myp5.pixels[i + 1], newG + 1);
      assert.isAtLeast(myp5.pixels[i + 2], newB - 1);
      assert.isAtMost(myp5.pixels[i + 2], newB + 1);
      assert.strictEqual(myp5.pixels[i + 3], newA);
    }
  });
});
