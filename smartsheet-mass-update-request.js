const client = require('smartsheet');
const token = process.env.SMARTSHEET_ACCESS_TOKEN_PROD; // scott.mcallister@smartsheet.com
const smartsheet = client.createClient({accessToken: token});
const sheetId = 2445328524830596;
let emailColumnId = '';

function createColumnMap(sheet) {
    return columnMap = sheet.columns.reduce((tempMap, column) => {
      tempMap[column.title] = column.id;
      return tempMap;
    }, {}); 
  }

function sendUpdateRequests(sheetId) {
    smartsheet.sheets.getSheet({ id: sheetId }).then(function(sheet) {
        const colMap = createColumnMap(sheet);
        
         sheet.rows.map(row => {
            // sendUpdate request
            var rowId = row.id;
            // Set body
            var body = {
                rowIds: [
                    row.id
                ],
                includeAttachments: false,
                includeDiscussions: false,
                columnIds: [colMap['Can Play Outdoor Wednesday Nights?']],
                sendTo: [
                {
                    email: row.cells
                                .filter(cell => cell.columnId === colMap['Email'])
                                .reduce((tempEmail, cell) => tempEmail = cell.displayValue, "")
                }
                ],
                subject: "Smartian Soccer: Can you play outdoor Wednesday evenings?",
                message: "Hi Smartian Team, \n\nIt looks like there is a lot of interest in starting a soccer team!\n\n "+ 
                    "The most compatible time to play seems to be Wednesday evening. We'll be playing outdoor in RATS "+
                    "(https://seattlerats.org/). \n\nWe need to have a team registered by June 2. Games will run from June 18 - Sept. 16.\n\n"+
                    "Before deciding how much everyone owes for league fees we need to know how many of you can commit to playing Wednesdays.\n\n "+
                    "Please provide your answer by this Friday, May 18. Thanks! --Scott"
            };
            
            // Set options
            var options = {
                sheetId: sheetId,
                body: body
            };
            if (body.sendTo[0].email != '') {
                console.log(body);
            
            // Create update request
            smartsheet.sheets.createUpdateRequest(options)
                .then(function(updatedRequest) {
                    console.log(updatedRequest);
                })
                .catch(function(error) {
                    console.log(error);
                });
            }
         });
        });
}

sendUpdateRequests(sheetId);
