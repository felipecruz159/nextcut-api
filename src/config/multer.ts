import { randomBytes } from "crypto";
import { Request } from "express";
import { Options, diskStorage } from "multer";
import path from "path";
import fs from "fs";

type PathOptions = "barberShopBackground";

const modulesPathResolver = (pathTo: PathOptions) => {
   const basePath = ".";

   switch (pathTo) {
      case "barberShopBackground":
         return [basePath, "public", "barberShop"];
      default:
         throw new Error("Invalid path option");
   }
};

const ensureDirectoryExists = (dir: string) => {
   if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Diretório criado: ${dir}`);
   } else {
      console.log(`Diretório já existe: ${dir}`);
   }
};

const multerConfig: Options = {
   storage: diskStorage({
      destination: (req: Request, file, callback) => {
         const dirPath = path.join(
            ...modulesPathResolver(file.fieldname as PathOptions)
         );

         ensureDirectoryExists(dirPath);

         callback(null, dirPath);
      },

      filename: (req, file, callback) => {
         randomBytes(16, (err, hash) => {
            if (err) callback(err, file.filename);

            const fileName = `${hash.toString("hex")}-${file.originalname
               .normalize("NFD")
               .replace(/[\u0300-\u036f]/g, "")}`;

            callback(null, fileName);
         });
      },
   }),

   limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
   },

   fileFilter: (req: Request, file, callback) => {
      const allowedMimes = [
         "image/jpeg",
         "image/jpg",
         "image/png",
      ];

      if (allowedMimes.includes(file.mimetype)) {
         callback(null, true);
      } else {
         callback(
            new Error(
               `Formato de arquivo inválido. Apenas arquivos de imagem são aceitos.`
            )
         );
      }
   },
};

export default multerConfig;
