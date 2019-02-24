#target photoshop
app.bringToFront(); 
var originalUnit = preferences.rulerUnits; 
preferences.rulerUnits = Units.PIXELS;

//chouse root folder
var inputFolder = Folder.selectDialog("Select a folder of documents to process");
var outputFolder = Folder.selectDialog("Select a output folder");

//get all folders in root
var arrayFolder = inputFolder.getFiles().sort();
//count frame in animation
var countSlider = arrayFolder.length;
//size animation-pucture
var heightGlobal;
var widthGlobal;
var resolutionGlobal;
//current work_space
var doc;
//current doc name
var currentDocName;

//get first elements in first folder for property
var arrayElemens = arrayFolder[0].getFiles("*.png");
getSize (open(arrayElemens[0], OpenDocumentType.PNG));

for (var j=0; j<arrayElemens[0].length; j++){    
    if (arrayElemens[j]!=null){
        createDoc (arrayElemens[j]);  
        
        //open the file in other folders
        for (var i=0; i<countSlider; i++){
            var arrayElemens =arrayFolder[i].getFiles("*.png");
            var tmpDoc = open(File(getPathElem(i)));
            copyFrame (tmpDoc, i);
        }
        SaveFile(outputFolder);
    }
}
alert("Finish!");

//fill property for work_space
function getSize(activeDoc){
    widthGlobal = app.activeDocument.width.as("px")*countSlider;
    heightGlobal = app.activeDocument.height.as("px");
    resolutionGlobal = app.activeDocument.resolution;
    app.activeDocument.close();
}    
//return path root_folder/numb_animation/elem.png
function getPathElem(i){
    return inputFolder.path.toString()+"/"+inputFolder.name.toString()+"/"+(i+1)+"/"+currentDocName;;
}
//chouse select in work_space and past elem
function copyFrame(tmpDoc, i){
    tmpDoc.activeLayer.duplicate(doc);
    
    app.activeDocument = doc;
    
    app.activeDocument.activeLayer.translate(tmpDoc.width.value*i, 0);

    app.activeDocument = tmpDoc;
    app.activeDocument.close();
}
//set width and create work_space 
function createDoc(file){
     currentDocName = file.name;
     doc = app.documents.add (widthGlobal, heightGlobal, resolutionGlobal, currentDocName, NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
}
//save file
function SaveFile(outputFile) {
    var saveOptions = new PNGSaveOptions();
    try{
        app.activeDocument.saveAs(File(outputFile+"/"+currentDocName), saveOptions, true, Extension.LOWERCASE);
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    }
    catch(ex){
        alert(ex);
    }
}
