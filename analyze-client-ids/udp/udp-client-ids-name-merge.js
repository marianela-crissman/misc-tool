const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

async function writeMapToCSV(map, filePath) {
  // Convert Map to Array of Objects for csv-writer
  const data = Object.values(map);

  // Define the CSV structure
  const csvWriter = createCsvWriter({
    path: filePath, // The output CSV file path
    header: [
      { id: "normalizedClientId", title: "Client ID (numeric)" },
      { id: "clientId", title: "Client ID (alphanumeric)" },
      { id: "clientName", title: "Client name" },
    ],
  });

  // Write data to CSV
  await csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
}

const readCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: "\t" }))
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      })
      .on("error", reject);
  });
};

const clientNameNormalizedIdPath = "./udp_clientName_normalizedClientId.csv";
const udpClientIdListPath = "./udp_alphanumeric_client_list.csv";

(async () => {
  try {
    console.log("reading csv files...");
    const udpClientIdList = await readCSV(udpClientIdListPath);
    const udpClientNameAndNormalizedIdList = await readCSV(
      clientNameNormalizedIdPath
    );
    console.log(udpClientIdListPath, " size: ", udpClientIdList.length);
    console.log(clientNameNormalizedIdPath, " size: ", udpClientNameAndNormalizedIdList.length);
    
    console.log("create a map with normalized client id and employer name...");
    const udpClientNameMap = udpClientNameAndNormalizedIdList.reduce(
      (previous, current) => ({
        ...previous,
        [current["normalizedClientId"]]: current,
      }),
      {}
    );
    console.log("udpClientNameMap size: ", Object.values(udpClientNameMap).length);

    console.log("merging with alphanumeric client ids...");
    const udpClientIdMap = udpClientIdList.reduce(
      (previous, current) => ({
        ...previous,
        [current["normalizedClientId"]]: {
          ...current,
          clientName:
            udpClientNameMap[current["normalizedClientId"]]?.employerName ??
            null,
        },
      }),
      {}
    );
    console.log("udpClientIdMap size: ", Object.values(udpClientIdMap).length);

    // save udp data into json file
    fs.writeFile("udp.json", JSON.stringify(udpClientIdMap, null, 2), (err) => {
      err
        ? console.error("Error writing JSON to file:", err)
        : console.log("JSON file has been saved.");
    });

    writeMapToCSV(udpClientIdMap, "udp.csv");
  } catch (error) {
    console.error("Error reading CSV files:", error);
  }
})();
