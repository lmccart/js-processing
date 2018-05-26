var spec = {
  addons: ['p5.dom'],
  color: ['color_conversion', 'creating_reading', 'p5.Color', 'setting'],
  core: [
    '2d_primitives',
    'core',
    'curves',
    'element',
    'error_helpers',
    'graphics',
    'renderer',
    'structure'
  ],
  data: ['dictionary'],
  image: ['loading', 'pixels'],
  io: ['files_input', 'loadJSON', 'loadStrings', 'loadTable', 'loadXML'],
  math: ['calculation', 'noise', 'p5.Vector', 'random', 'trigonometry'],
  typography: ['loadFont'],
  utilities: ['array_functions', 'string_functions', 'time_date'],
  webgl: [
    'matrix',
    'p5.RendererGL',
    'p5.Shader',
    'p5.Texture',
    'pixels',
    'stroke'
  ]
};
Object.keys(spec).map(function(folder) {
  spec[folder].map(function(file) {
    var string = [
      '<script src="unit/',
      folder,
      '/',
      file,
      '.js" type="text/javascript" ></script>'
    ];
    document.write(string.join(''));
  });
});
