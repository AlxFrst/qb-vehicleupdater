const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const readline = require("readline");

const parser = new xml2js.Parser();
console.log(
  "-----------------------------------------------------------------------------------------------"
);
console.log("Version 1.0.0 by Alx");
console.log(
  "-----------------------------------------------------------------------------------------------"
);
console.log("QBCore - Cars update tool");
console.log(
  "Cet outil met à jour toutes les voitures importées et les ajoute au fichier vehicles.lua"
);
console.log(
  "-----------------------------------------------------------------------------------------------"
);

function findVehicleMetaFiles(directory) {
  const vehicleMetaFiles = [];

  function searchFiles(currentDir) {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        searchFiles(filePath);
      } else if (file === "vehicles.meta") {
        vehicleMetaFiles.push(filePath);
      }
    }
  }

  searchFiles(directory);
  return vehicleMetaFiles;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Veuillez entrer le chemin vers votre dossier de ressources : ",
  function (folderPath) {
    const vehicleMetaFiles = findVehicleMetaFiles(folderPath);

    console.log(
      "Nombre de fichiers vehicle.meta trouvés : " + vehicleMetaFiles.length
    );

    const modelNames = [];

    vehicleMetaFiles.forEach((filePath, index) => {
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          console.error(`Erreur de lecture du fichier ${filePath}: ${err}`);
          return;
        }

        const modelNameMatch = data.match(/<modelName>(.*?)<\/modelName>/);
        if (modelNameMatch) {
          const modelName = modelNameMatch[1];
          console.log(`${index + 1}. ${modelName}`);
          modelNames.push(modelName);
        } else {
          console.error(
            `Le fichier ${filePath} ne contient pas de balise <modelName></modelName> valide.`
          );
        }

        if (index === vehicleMetaFiles.length - 1) {
          rl.question(
            "Voulez-vous mettre à jour le fichier vehicles.lua ? (Oui/Non) : ",
            function (answer) {
              if (answer.toLowerCase() === "oui") {
                const qbCoreFolders = findQbCoreFolder(folderPath);

                if (qbCoreFolders.length > 0) {
                  // Au moins un dossier qb-core a été trouvé, vous pouvez maintenant mettre à jour le fichier vehicles.lua
                  // ...
                } else {
                  console.log(
                    "Le dossier qb-core n'a pas été trouvé dans le dossier de ressources."
                  );
                  console.log(
                    "La mise à jour du fichier vehicles.lua ne peut pas être effectuée."
                  );
                  rl.close();
                }
              } else {
                console.log(
                  "Aucune mise à jour du fichier vehicles.lua n'a été effectuée."
                );
                rl.close();
              }
            }
          );
        }
      });
    });
  }
);
