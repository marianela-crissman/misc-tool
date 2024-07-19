# Analyze-client-ids

## Problem
Standalone app was failing to create an Alight Person session token with the clientID it was receiving.
YBR is sending via HFIM a client id that is known as a 'normalized client id' in UDP.
The session token needs to have the non normalized client id.

## Solution
HFIM will do a mapping and replace the normalized by grabbing the non normalized.


## Tool

### Get started
In order to create the mapping. You should do the following:

1. Install dependencies:
    ```
    npm i
    ```
2. Generate the UDP mapping json. This may take a few seconds:
    ```
    cd udp/
    node .\udp-client-ids-name-merge.js
    cd ..
    ```
3. Run the analysis tool:
    ```
    npm start
    ```

Observe the output files that get created: `output.csv` and `output.json`.  
Both files contain the mappings for all clients that use provider direct, just different formats.

### Required files

#### UDP  
`udp_alphanumeric_client_list.csv` is a subset of clients that live in UDP but that are used by YBR.  
`udp_clientName_normalizedClientId.csv` is a list of all employers in UDP.

Sources:  
1. [UdpListOfEmployerNames-PU](https://alightsolutionsllc-my.sharepoint.com/:x:/r/personal/chad_tarantino_alight_com/Documents/UDP/UdpListOfEmployerNames-PU20240701.xlsx?d=w0f03767d2857487fb29e56222332174b&csf=1&web=1&e=T5CgzJ&nav=MTVfezRCODM1NDkxLTcxMUYtNEYxOS04RjgwLTVCRDQ0N0FDMDVGOX0) owned by Chad Tarantino.  
2. [UdpCountByNormalizedClientIdClientIdSourceSchemaNameSystemInstanceIdAndPlatformType-PU20240701](https://alightsolutionsllc-my.sharepoint.com/:x:/r/personal/chad_tarantino_alight_com/Documents/UDP/UdpCountByNormalizedClientIdClientIdSourceSchemaNameSystemInstanceIdAndPlatformType-PU20240701.xlsx?d=wd38cfc9c64f043d0b0601a1baea5e37c&csf=1&web=1&e=cdrowW) owned by Chad Tarantino.


#### Provider Direct:  
`pd_client_list_HWE1.csv`  
`pd_client_list_HWE2.csv`  
`pd_client_list_LM.csv`  

Are copied from tabs in [UDP schema test cfg PD clients](https://alightsolutionsllc.sharepoint.com/:x:/r/sites/uct/Client%20Deployment%20Documents/01.%20UPoint%20Feature%20Deployment/HW/Provider%20Search/2024%20ProviderDirect%20rebuild/UDP%20schema%20test%20cfg%20PD%20clients.xlsx?d=w15299880357249a88023c51e3b7a220d&csf=1&web=1&e=XhgQ0Q) owned by Annalise Herman.


### Output
`output.csv` file generated can be imported in spreadsheet and shared with HFIM.

> Gotcha: When importing the contents of the file into a spreadsheet, need to specify two things, (1) select comma as delimiter and (2) client id columns must be specified as text, otherwise Excel will interpret them as numbers and leading zeros wont be shown.

Analysis spreadsheet can be found in https://alightsolutionsllc-my.sharepoint.com/:x:/r/personal/marianela_crissman_alight_com/Documents/Analysis%20client%20IDs%20-%20UDP%20schema%20test%20cfg%20PD%20clients.xlsx?d=w5ab2889c2e1e44188eb515d527e4981c&csf=1&web=1&e=dDxaS2