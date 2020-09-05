const express = require('express');
const cors = require('cors');
const monk = require('monk');
const uuid = require('uuid');

const app = express();
const db = monk('localhost/testRest');
const apiData = db.get('apiData');

var invalidRec = '';

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  response.json({
    message: 'Hello World'
  });
});


function isValidData(inputData){
  var errorFound = false;

  invalidRec = '{"MessageWasProcessed":false,"Diagnostics":[';

  var SCR = inputData['ServiceCaseRequest'];
  for (var keyItem in SCR){
    var iValue = SCR[keyItem];
    //console.log(keyItem, iValue);
    if(iValue == '') {
      invalidRec = invalidRec + '{"Severity":"ERROR","Code":"INVALID-DATA","Description":"Invalid-data","Details":"' + keyItem + '","Language":"en"},';
      errorFound = true;
    }
  }
  
  var CST = inputData['Customer'];
  for (var keyItem in CST){
    var iValue = CST[keyItem];
    //console.log(keyItem, iValue);
    if(iValue == '') {
      invalidRec = invalidRec + '{"Severity":"ERROR","Code":"INVALID-DATA","Description":"Invalid-data","Details":"' + keyItem + '","Language":"en"},';
      errorFound = true; 
    }
  }

  var VEH = inputData['Vehicle'];
  for (var keyItem in VEH){
    var iValue = VEH[keyItem];
    //console.log(keyItem, iValue);
    if(iValue == '') {
      invalidRec = invalidRec + '{"Severity":"ERROR","Code":"INVALID-DATA","Description":"Invalid-data","Details":"' + keyItem + '","Language":"en"},';
      errorFound = true; 
    }
  }

  var VEHLOC = inputData['VehicleLocation'];
  for (var keyItem in VEHLOC){
    var iValue = VEHLOC[keyItem];
    //console.log(keyItem, iValue);
    if(iValue == '') {
      invalidRec = invalidRec + '{"Severity":"ERROR","Code":"INVALID-DATA","Description":"Invalid-data","Details":"' + keyItem + '","Language":"en"},';
      errorFound = true; 
    }
  }

  var BRK = inputData['Breakdown'];
  for (var keyItem in BRK){
    var iValue = BRK[keyItem];
    //console.log(keyItem, iValue);
    if(iValue == '') {
      invalidRec = invalidRec + '{"Severity":"ERROR","Code":"INVALID-DATA","Description":"Invalid-data","Details":"' + keyItem + '","Language":"en"},';
      errorFound = true; 
    }
  }

  var DRV = inputData['Driver'];
  for (var keyItem in DRV){
    var iValue = DRV[keyItem];
    //console.log(keyItem, iValue);
    if(iValue == '') {
      invalidRec = invalidRec + '{"Severity":"ERROR","Code":"INVALID-DATA","Description":"Invalid-data","Details":"' + keyItem + '","Language":"en"},';
      errorFound = true; 
    }
  }
  
  var TOW = inputData['TowDestination'];
  for (var keyItem in TOW){
    var iValue = TOW[keyItem];
    //console.log(keyItem, iValue);
    if(iValue == '') {
      invalidRec = invalidRec + '{"Severity":"ERROR","Code":"INVALID-DATA","Description":"Invalid-data","Details":"' + keyItem + '","Language":"en"},';
      errorFound = true; 
    }
  }
  
  // add end value to JSON error string
  invalidRec = invalidRec.replace(/,\s*$/, "") + ']}';
  
  if(errorFound !== true){
    invalidRec = '';
    
    var recDate = new Date();

    invalidRec = '{"CustomerSuccessResponse": {"ServiceCaseIdentification":'
      + '{"CustomerCaseReference":"' + inputData['ServiceCaseRequest']['CustomerCaseReference'] + '",'
      + '"AccountId":"' + inputData['ServiceCaseRequest']['AccountId'] + '",'
      + '"ProviderCaseId":"' + uuid.v4() + '",'
      + '"SchemeId":"' + inputData['ServiceCaseRequest']['SchemeId'] + '"'
		  + '},"ServiceCaseAcceptance":{"Priority": "1","RequestReceivedDateTime":"' + recDate.toISOString() + '"}}}';
      return true;
    } else {
      console.log('Invalid Rec :',invalidRec, ' - ', errorFound);
      return false;
  }
  //return inputData.name && inputData.name.toString().trim() !== '' &&
  //  inputData.content && inputData.content.toString().trim() !== '';
}

app.post('/test', (request, response) => {
  if(isValidData(request.body)) {
    // insert into database;
    const dbData = {
      //name: request.body.name.toString(),
      //content: request.body.content.toString(),
      //created: new Date()
      ServiceCaseRequest: request.body['ServiceCaseRequest'],
      Customer: request.body['Customer'],
      Vehicle: request.body['Vehicle'],
      VehicleLocation: request.body['VehicleLocation'],
      Breakdown: request.body['Breakdown'],
      Advisor: request.body['Advisor'],
      Driver: request.body['Driver'],
      TowDestination: request.body['TowDestination']
    };
    
    apiData
      .insert(dbData)
      .then(createdRec => {
        response.json(createdRec._id);
      })

    
    //console.log("Input : ", request.body['ServiceRequest']);
    //response.sendStatus(200);
    //response.status(200);
  } else {
    response.status(422);
    response.json({
      message: 'Invalid Data Input'
    });
  }
}); 

app.listen(5000, () => {
  console.log('Listening on http://localhost:5000');
});
