import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Corrige __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ImageOptimizer {
  constructor({ inputFolder, widths, formats }) {
    this.inputFolder = path.resolve(__dirname, '../../../', inputFolder);
    this.outputFolder = this.inputFolder; // ✅ agora otimiza no mesmo lugar
    this.widths = widths;
    this.formats = formats;
  }

  async optimizeImage(filePath, fileName) {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    for (const width of this.widths) {
      if (metadata.width < width) continue;

      for (const format of this.formats) {
        const outputFileName = `${path.parse(fileName).name}-${width}.${format}`;
        const outputPath = path.join(this.outputFolder, outputFileName);

        await image
          .resize({ width })
          .toFormat(format)
          .toFile(outputPath);

        console.log(`✅ ${outputFileName} gerado.`);
      }
    }
  }

  async optimizeAll() {
    if (!fs.existsSync(this.outputFolder)) {
      fs.mkdirSync(this.outputFolder, { recursive: true });
    }

    const files = fs.readdirSync(this.inputFolder);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

      const filePath = path.join(this.inputFolder, file);
      await this.optimizeImage(filePath, file);
    }
  }
}
