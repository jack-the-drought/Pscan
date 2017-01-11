module.exports = {
parse : function(ss){

/*var str = "P D CDWXODUéH\n\nMUSTERMANN\n\nERIKA\n\nDEUTSCH 12.08.1964\n\nF BERLIN\n\n\
01.11.2007 31.10.2017\nSTADT KOLN K. M 4 4\n\ng ,r /\n(Wk/q ’/>//gf/ n/IW,\n\nP<D<<\
  MUSTERMANN<<ERIKA<<<<<<<<<<<<<<<<<<<<<<\nCO’IXOOOéH’ID<<6408W25FW710319<<<<<<<<<<<<<<<0\n\n"
*/


//Now define what's readable a-->z A-->Z 0-->9 plus spaces and refuse lines containing other staff

function isAlphanum(str) { return /^\w+$/.test(str); }

str = ss.replace(/\n\n/g,"\n")
  //console.log(str)
emptyres = { matches:{passType:0, passCode:0, familyName:0, firstName:0, passportNumber:0}
,                 results:{passportNumber : '', familyName : '', firstName: '',sex : '',
                  nationality : '' , birthDate : '', birthPlace : '',
                dateOfIssue : '' , dateOfExpiry : '', passCode : '', passType : '',authority:''} };


  var primresult = str.split("\n")
if (((primresult[0].split(' ')).length)!=3) primresult=primresult.slice(1);
  //console.log(primresult)
  if (primresult.length<7) {
    //console.log("unrecongnizable");
    return emptyres;
  }
//P is the Type , D is the Code
var resultsdict = {passportNumber : '', familyName : '', firstName: '',sex : '',
                  nationality : '' , birthDate : '', birthPlace : '',
                dateOfIssue : '' , dateOfExpiry : '', passCode : '', passType : '',authority:''}


var j = 0;
lineone = primresult[0].split(' ')
if (lineone.length==3) {
  //console.log('line one legit');
   resultsdict['passType'] = lineone[0];
   resultsdict['passCode'] = lineone[1];
   resultsdict['passportNumber'] = lineone[2];
 }
else {
  //console.log('not clear');
  return emptyres;
  };
 ;

if (isAlphanum(primresult[1].replace(/ /g,''))) {
resultsdict['familyName'] = primresult[1]
};
if (isAlphanum(primresult[2].replace(/ /g,''))) {
resultsdict['firstName'] = primresult[2];
}

linefour = primresult[3].split(' ')


  if (isAlphanum(linefour[0].replace(/ /g,''))) {
//now check the validity of nationality
resultsdict['nationality'] = linefour[0];
}

resultsdict['birthDate'] = linefour.slice(1).join(); // check if valid date


linefive = primresult[4].split(' ');
if (linefive.length==2){

  if (['M','F'].indexOf(linefive[0]))

{
    //console.log('legit sex')
    resultsdict['sex'] = linefive[0];//check if M or F
}

    if (isAlphanum(linefive.slice(1).join())){
    resultsdict['birthPlace'] = linefive.slice(1).join();//check place validity
}

}


linesix = primresult[5].split(' ');
if (linesix.length==2) {
resultsdict['dateOfIssue'] = linesix[0] ;
resultsdict['dateOfExpiry'] = linesix[1] ;
}

resultsdict['authority'] = primresult[6] ;//filter garbage from this later

var j;
for(var i=0;i<primresult.length;i++)
{
  if (primresult[i].indexOf('<')!=-1){
    j = i;
    break;
  }
}

var k;
for (i = j;i<primresult.length;i++)
{
  if (primresult[i].indexOf('<')==-1){
    k = i;
    break;
  }

}

//console.log("j is " + j +" **** k is " + k);

mrz = primresult.slice(j,k)

mrz = mrz.join()

/*
mrz = mrz.split('<')
mrz = mrz.filter(function(n){ return n != "" });
*/
//just go through mrz string and check for results elements existence in it
//elements to check are passType, passCode, familyName, firstName,passportNumber
//just seperate the first element as the type and do indexof for the remaining elements
//return (a.name < b.name) ? -1 : 1
//javascript map array with function
var matches = {passType:0, passCode:0, familyName:0, firstName:0, passportNumber:0}

var matchingCount = 0;

matches['passType'] = (mrz.split('<')[0] != resultsdict['passType']) ? 0:1;
matches['passCode'] = mrz.indexOf(resultsdict['passCode'])==-1 ? 0:1;
matches['familyName'] = mrz.indexOf(resultsdict['familyName'])==-1 ? 0:1;
matches['firstName'] = mrz.indexOf(resultsdict['firstName'])==-1 ? 0:1;
matches['passportNumber'] = mrz.indexOf(resultsdict['passportNumber'])==-1 ? 0:1;
//check if date is valid and if country is valid
//support other date formats (like 14 may 2013) and add filters to check country validity for both birthplace and nationality
//date validity check later

//filter some results from here and let the rest for the other prog to check wich has the most matches
//if two fields at least are empty count as fail
//filter non alphanumeric results
return {'matches':matches, 'results':resultsdict};

} ,

compare : function(lone,ltwo){
/*
{ passportNumber: 'CDWXODUéH',
     familyName: 'MUSTERMANN',
     firstName: 'ERIKA',
     sex: 'F',
     nationality: 'DEUTSCH',
     birthDate: '12.08.1964',
     birthPlace: 'BERLIN',
     dateOfIssue: '01.11.2007',
     dateOfExpiry: '31.10.2017',
     passCode: 'D',
     passType: 'P',
     authority: 'STADT KOLN K. M 4 4' }


*/
//start by comparing the number of filled items
var filledone = 0;
var filledtwo = 0;


for (var i in lone.results) {if (lone.results[i].length>0) filledone+=1}
for (var i in ltwo.results) {if (ltwo.results[i].length>0) filledtwo+=1}
//console.log('filledone====> ', filledone, "||| filledtwo====> ",filledtwo)
if (filledtwo>filledone) return ltwo;
else if (filledtwo<filledone) return lone;

//then compare number of matches
var sumone = 0;
var sumtwo = 0;


for (var i in lone.matches) {sumone+=lone.matches[i]}
for (var i in ltwo.matches) {sumtwo+=ltwo.matches[i]}
//console.log('sumone '+ sumone + ' sumtwo ' + sumtwo)

if (sumtwo>sumone) return ltwo;
else if (sumtwo<sumone) return lone;

//then check for shorter fields

//The one with the most filled fields and shorter fields will be chosen as best and more matches of course
//shorter fields usually mean less  noise


var betterlengths = [];
//here if it is still equal we dont mind returning any of the results
for (var i in lone.results) { betterlengths.push((lone.results[i]<ltwo.results[i]) ? 'lone':'ltwo')}

var oneisshorter = betterlengths.reduce(function(n,v){return n+(v==='lone');},0);
var twoisshorter = betterlengths.reduce(function(n,v){return n+(v==='ltwo');},0);

return (oneisshorter>twoisshorter) ? lone:ltwo;

//later return choice;


}





}
