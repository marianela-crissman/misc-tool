const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

function saveToFiles(list, filename) {
  writeMapToCSV(list, `${filename}.csv`);
  fs.writeFile(`${filename}.json`, JSON.stringify(list, null, 2), (err) => {
    err
      ? console.error("Error writing JSON to file:", err)
      : console.log("JSON file has been saved.");
  });
}

async function writeMapToCSV(data, filePath) {
  // Convert Map to Array of Objects for csv-writer
  // const data = Object.values(map);
  // console.log("data", data);
  // Define the CSV structure
  const csvWriter = createCsvWriter({
    path: filePath, // The output CSV file path
    header: [
      { id: "providerDirect", title: "ProviderDirect" },
      { id: "clientId", title: "Client ID" },
      { id: "clientName", title: "Client Name" },
      { id: "testCfg", title: "UDP Schema test config" },
      { id: "udp_normalizedClientId", title: "UDP Normalized Client Id" },
      { id: "udp_clientId", title: "UDP Client ID" },
      { id: "udp_clientName", title: "UDP Client Name" },
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

async function readJsonFile(filename) {
  try {
    const data = await fs.promises.readFile(filename, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading the JSON file:", err);
  }
}

// helper methods

function leftPad(id, name) {
  const padded = id?.toString()?.padStart(5, "0");
  if (!padded) console.log({ name, id, padded });
  return padded;
}

function matchIdsFromUDP(idList, udpClientIdMap) {
  return idList
    .map((normalizedClientId) => [
      normalizedClientId,
      udpClientIdMap[normalizedClientId] ?? {
          ...udpClientIdMap[+normalizedClientId],
          normalizedClientIdProvidedByChadSpreadsheet: +normalizedClientId,
        } ??
        null,
    ])
    .reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[1] }), {});
}

function analyzeAhxSsmdClientIdList(udpClientIdMap, ahxIds, ssmdIds) {
  const ahx = matchIdsFromUDP(ahxIds, udpClientIdMap);
  fs.writeFile("ahx.json", JSON.stringify(ahx, null, 2), (err) => {
    err
      ? console.error("Error writing JSON to file:", err)
      : console.log("JSON file has been saved.");
  });
  const alphanumericAhxIds = ahxIds.map((id) => ahx[id]?.clientId);
  fs.writeFile(
    "ahx_ids.json",
    JSON.stringify({ old: ahxIds, new: alphanumericAhxIds }, null, 2),
    (err) => {
      err
        ? console.error("Error writing JSON to file:", err)
        : console.log("JSON file has been saved.");
    }
  );

  const ssmd = matchIdsFromUDP(ssmdIds, udpClientIdMap);
  fs.writeFile("ssmd.json", JSON.stringify(ssmd, null, 2), (err) => {
    err
      ? console.error("Error writing JSON to file:", err)
      : console.log("JSON file has been saved.");
  });
}

function processAndGenerateFinalCSV(
  pdClientIdLmMap,
  pdClientIdHwe1Map,
  pdClientIdHwe2Map,
  udpClientIdMap
) {
  const arrayWithAllClientsInProviderDirectSpreadSheet = [
    ...pdClientIdLmMap.map((item) => {
      const clientId = item["Client ID (Text)"];
      const udpRecord = udpClientIdMap[clientId];
      const udp_normalizedClientId = leftPad(udpRecord?.normalizedClientId);
      const udp_clientId =
        udpRecord?.normalizedClientId == udpRecord?.clientId
          ? udp_normalizedClientId
          : udpRecord?.clientId;
      return {
        providerDirect: item["ProviderDirect"],
        testCfg: item["UDP Schema test config"],
        clientId,
        clientName: item["Client Name"],
        udp_normalizedClientId,
        udp_clientName: udpRecord?.clientName,
        udp_clientId,
      };
    }),
    ...pdClientIdHwe1Map.map((item) => {
      const clientId = item["CAPIS/EM_CLNT_ID"];
      const udpRecord = udpClientIdMap[clientId];
      const udp_normalizedClientId = leftPad(udpRecord?.normalizedClientId);
      const udp_clientId =
        udpRecord?.normalizedClientId == udpRecord?.clientId
          ? udp_normalizedClientId
          : udpRecord?.clientId;
      return {
        providerDirect: item["ProviderDirect"],
        testCfg: item["UDP Schema test config"],
        clientId,
        clientName: item["Client Name"],
        udp_normalizedClientId,
        udp_clientName: udpRecord?.clientName,
        udp_clientId,
      };
    }),
    ...pdClientIdHwe2Map.map((item) => {
      const clientId = item["CAPIS/EM_CLNT_ID"];
      const udpRecord = udpClientIdMap[clientId];
      const udp_normalizedClientId = leftPad(udpRecord?.normalizedClientId);
      const udp_clientId =
        udpRecord?.normalizedClientId == udpRecord?.clientId
          ? udp_normalizedClientId
          : udpRecord?.clientId;
      return {
        providerDirect: item["ProviderDirect"],
        testCfg: item["UDP Schema test config"],
        clientId,
        clientName: item["Client Name"],
        udp_normalizedClientId,
        udp_clientName: udpRecord?.clientName,
        udp_clientId,
      };
    }),
  ].filter((row) => row.providerDirect);

  return arrayWithAllClientsInProviderDirectSpreadSheet;
}

const ahxFilter_clientIds = [
  "09852",
  "02233",
  "16730",
  "13481",
  "05154",
  "16595",
  "17485",
  "17672",
  "10050",
  "07471",
  "01924",
  "10226",
  "16593",
  "03111",
  "03437",
  "02360",
  "12314",
  "16558",
  "07930",
  "08673",
  "10542",
  "03102",
  "16399",
  "17499",
  "06607",
  "01727",
  "07755",
  "17495",
  "01656",
  "09235",
  "32137",
  "16986",
  "16650",
  "17563",
  "17667",
  "07434",
  "01146",
];
const ssmd_clientIds = ["5977", "1808", "00245"];

const pdClientIdLmListPath = "./pd_client_list_LM.csv";
const pdClientIdHwe1ListPath = "./pd_client_list_HWE1.csv";
const pdClientIdHwe2ListPath = "./pd_client_list_HWE2.csv";
const outputFilename = "output";

(async () => {
  try {
    const udpClientIdMap = await readJsonFile("./udp/udp.json");

    analyzeAhxSsmdClientIdList(
      udpClientIdMap,
      ahxFilter_clientIds,
      ssmd_clientIds
    );

    const pdClientIdLmList = await readCSV(pdClientIdLmListPath);
    const pdClientIdHwe1List = await readCSV(pdClientIdHwe1ListPath);
    const pdClientIdHwe2List = await readCSV(pdClientIdHwe2ListPath);

    /**
     * All clients in provider direct (enabled or not, regardless of the clientID)
     */
    const processedList = processAndGenerateFinalCSV(
      pdClientIdLmList,
      pdClientIdHwe1List,
      pdClientIdHwe2List,
      udpClientIdMap
    );
    saveToFiles(processedList, outputFilename);

    /**
     * Provider Direct = Y and UDP client id and normalized client id are different
     */
    const processedListEnabledClientsForPDAndDiffClientIds = processedList
      .filter((item) => item?.providerDirect === "Y")
      .filter(
        (item) =>
          item?.udp_clientId !== item?.udp_normalizedClientId ||
          !item?.udp_clientId ||
          !item?.udp_normalizedClientId
      );
    saveToFiles(
      processedListEnabledClientsForPDAndDiffClientIds,
      `${outputFilename}_pd_Y_normAndNonNormIDsAreDifferent`
    );
  } catch (error) {
    console.error("Error using the tool:", error);
  }
})();
