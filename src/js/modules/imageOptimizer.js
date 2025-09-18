import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Corrige __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseFolder = path.resolve(__dirname, "../../../src/imgs");

async function optimizeFolder(folderPath) {
  const folderName = path.basename(folderPath);
  const files = fs.readdirSync(folderPath);

  let count = 1;
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const filePath = path.join(folderPath, file);
    const outputFileName = `${folderName}-${count}.webp`;
    const outputPath = path.join(folderPath, outputFileName);

    try {
      // Pega metadados da imagem
      const metadata = await sharp(filePath).metadata();
      const isHorizontal = metadata.width >= metadata.height;

      // Ajuste: tamanhos maiores
      const resizeOptions = isHorizontal
        ? { width: 3000, withoutEnlargement: true }   // horizontais até 3000px
        : { height: 2000, withoutEnlargement: true }; // verticais até 2000px

      await sharp(filePath)
        .resize(resizeOptions)
        .webp({ quality: 80 })
        .toFile(outputPath);

      console.log(`✅ ${outputFileName} gerado em ${folderName}`);

      // Apaga o arquivo original
      fs.unlinkSync(filePath);

      count++;
    } catch (err) {
      console.error(`❌ Erro ao otimizar ${file}:`, err);
    }
  }
}

export async function optimizeAll() {
  const folders = fs.readdirSync(baseFolder);

  for (const folder of folders) {
    const folderPath = path.join(baseFolder, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
      await optimizeFolder(folderPath);
    }
  }
}
