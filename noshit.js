//clean up packages + export class
var Tesseract = require('tesseract.js')
var gm = require('gm')
var request = require('request')
var fs = require('fs')
var ps = require('./stringmanip')

module.exports = {
  doit : function(imagelink){

var topresults ={ matches:{passType:0, passCode:0, familyName:0, firstName:0, passportNumber:0}
,                 results:{passportNumber : '', familyName : '', firstName: '',sex : '',
                  nationality : '' , birthDate : '', birthPlace : '',
                dateOfIssue : '' , dateOfExpiry : '', passCode : '', passType : '',authority:''} }
//var maximumMatches = 0
//var mostResults = 0
var bestThresholdIndex = -1

//detect weird chars to help knowing there are errors
//add decide data readable to modify threshold parameter and rescan(start with low value and go up)
//remove image with low threshold (if it doesnt appear with low values and it starts the sentence then it shall be ignored forever)
//detect language

//line length increase==> garbage

//var url = "http://localhost:5555/out.jpg"
//var url = "http://localhost:5555/15979018_10209707429095906_1466278318_n.jpg"
//var url = 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Mustermann_Reisepass_2007.jpg'
//var url = 'http://www.pyimagesearch.com/wp-content/uploads/2015/11/mrz_original.jpg'
//var url = 'http://www.maggio-kattar.com/sites/default/files/styles/large/public/field/image/jpnpassport.png'
//var url = 'http://3.bp.blogspot.com/_kJarVuKMPAQ/TGLyjIPmTFI/AAAAAAAANPQ/WlIgQmZ96fo/s400/bodenheimermi.jpg'
var url = imagelink

//var url = 'http://www.jason-ism.com/images/passport-2008.jpg'
var filename = 'pic.jpg'
var thresholdindex = 10
var thresholdincrement = 10

var writeFile = fs.createWriteStream(filename)
//now start with a loop to increment the thresholdindex

request(url).pipe(writeFile).on('close', function() {
  console.log(url, 'saved to', filename);
  //now start the loop to check for the best results
  var llo = 0;
  for (var i =thresholdindex ; i<150 ; i+=thresholdincrement){
    !function zehahaha(i){
  gm('pic.jpg').threshold(i).write('thresholde' + i + '.jpg' ,function(err){
    Tesseract.recognize('thresholde' + i + '.jpg',{lang:'eng'})
      //.progress(function  (p) { console.log('progress', p)  })
      .catch(err => console.error(err))
      .then(function (result) {
        var yo = ps.parse(result.text);
        //console.log(yo);
        topresults=ps.compare(topresults,yo);


        llo +=1
        //console.log("index was " + i)
        //console.log('###################################################')


        if (llo == 14)   {console.log(topresults.results);process.exit(0);}


     });
     })
        }(i);
 }//loop end

});

}
}
