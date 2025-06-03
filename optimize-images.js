import ImageOptimizer from './src/js/modules/imageOptimizer.js';

const optimizer = new ImageOptimizer({
  inputFolder: 'src/imgs/',
  widths: [600, 1200, 1920],
  formats: ['webp', 'avif']
});

optimizer.optimizeAll();
