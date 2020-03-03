var express = require('express');
var router = express.Router();
const {google} = require('googleapis');
const keys = require('YOUR_SHEET_JSON_FILE');
var qr = require('qr-image');
var User =require('../models').User


//Sheet
const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);
client.authorize((err,tokens)=>{
  if(err){
      console.log(err);
      return;
  }else{
      console.log('connected');
      // gsupdate(client);
      // gsrun(client);   
  }
})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.post('/', function(req, res, next) {
  User.create(req.body)
  .then(result=>{
    res.send(result);
    gsupdate(client,result);
  })
});
async function gsrun(cl){
    const gsapi = google.sheets({version:'v4', auth: cl});
    const opt = {
        spreadsheetId :'YOUR_GOOGLE_SHEET_ID',
        range : 'Sheet1!A2:C2'
    };
    let data = await gsapi.spreadsheets.values.get(opt);
    let result = data.data;
    const numRows = result.values ? result.values.length : 0;
    console.log(`${numRows} rows retrieved.`);
    console.log(data.data.values);
}


function gsupdate(cl,data){
    const gsapi = google.sheets({version:'v4', auth: cl});
    const opt = {
        spreadsheetId :'YOUR_GOOGLE_SHEET_ID',
        range : 'Sheet1!A2:C2'
    };
    let values = [
        [
          data.id,data.name,data.modelno,data.createdAt
        ],
      ];

      let resource = {
        values,
      };
      gsapi.spreadsheets.values.append({
        spreadsheetId :'YOUR_GOOGLE_SHEET_ID',
        range : 'Sheet1!A2:C2',
        valueInputOption:'USER_ENTERED',
        resource,
      }, (err, result) => {
        if (err) {
          // Handle error.
          console.log(err);
        } else {
        console.log(`${result.updates} cells appended`);
        }
      });
}


module.exports = router;
