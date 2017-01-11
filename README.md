npm install #within the directory of the project
npm start

#How it works?
#It downloads the passport image from a specified url.
#And then applies a Threshold filter to with a bruteforceable coefficient(going from 10 to 150).
#That way we produce about 15 images and tesseract.js scans all of them and my algorithm later choses the best results.
#Algorithm priorities with the choice: 
#most filled fields > number of elements that match with the mrz(the zone with lots of "<<<") > shorter fields in term of less image noise.

