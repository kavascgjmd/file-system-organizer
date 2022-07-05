let inputArr = process.argv.slice(2);
let fs = require("fs");
const { type } = require("os");
let path = require("path");
let command = inputArr[0];
let types = {
    media : ["mp4" , "mkv"],
    archives :[ 'zip' , '7z' , 'rar' , 'tar' , 'gz' , 'ar', 'iso' , 'xz'],
    documents: ['docs', 'doc', 'pdf', 'xlsx', 'xls', 'odt' , 'ods' , 'odp' , 'odg' , 'txt' , 'ps' , 'tex'],
    app : ['exe' , 'dmg', 'pkg', 'deb'],
    photos : ['jpeg', 'PNG', 'jpg', 'png']
}
switch(command){
    case "tree":
        treefn(inputArr[1]);
        break;
    case "organize":
        organizefn(inputArr[1]);
        break;
        
    case "help":
        helpfn(inputArr[1]);
        break;
        
     default :
     console.log("Please input right path (use -> node main.js help dirpath ")
     break;   
        
}
function treeHelper(dirpath , incedent ){
 let isFile = fs.lstatSync(dirpath).isFile();
 if(isFile){
    let filename = path.basename(dirpath);
    console.log(incedent+"|-"+filename);
    return;
 }
 else {
    let dirname = path.basename(dirpath);
    console.log(incedent+"|__"+dirname);
    let children = fs.readdirSync(dirpath);
    for(let i = 0; i<children.length; i++){
        let childpath = path.join(dirpath , children[i]);
        treeHelper(childpath, incedent+"\t");
    }
 }

}
function treefn(dirpath){

    if(dirpath == undefined){
        console.log("enter the right path and enter path in double inverted comma");
        return ;
    }
    else {

  let isPath = fs.existsSync(dirpath);
  if(isPath){
   treeHelper(dirpath, "");

  }
}


}
function getcategoryname(name){
    let ext = path.extname(name);
    ext = ext.slice(1);
    for(let key in types){
       let ctypearr = types[key];
       for(let i = 0; i<ctypearr.length ; i++ ){
 
          if(ext == ctypearr[i]){
            return key;
          }
       }
      
    }
    return "other";
}
function sendfiles(filepath, des, categoryname){
    let specifcfolder = path.join(des, categoryname);
    let checkfolder = fs.existsSync(specifcfolder);
    if(checkfolder == false){
        fs.mkdirSync(specifcfolder);
    }
    let filename = path.basename(filepath);
    let catergoryfilepath = path.join(specifcfolder, filename);
    fs.copyFileSync(filepath, catergoryfilepath);
    fs.unlinkSync(filepath);
    console.log(filename , "copied to", categoryname);
}
function organizeHelper(src, des){
    let childnames = fs.readdirSync(src);
    for(let i = 0; i<childnames.length; i++){
        let filepath = path.join(src, childnames[i]);
        let isFile = fs.lstatSync(filepath);
        if(isFile){
          let categoryname = getcategoryname(filepath);
          sendfiles (filepath, des, categoryname);
        }
    }
}
function organizefn(dirpath){
    if(dirpath == undefined){
        console.log("enter the right path and enter path in double inverted comma");
        return ;
    }
    else {
  let despath ;
  let isPath = fs.existsSync(dirpath);
  if(isPath){
     despath = path.join(dirpath, "organize");
     if(fs.existsSync(despath) == false){
        fs.mkdirSync(despath);
     }
     organizeHelper(dirpath , despath );
  }
}
}

function helpfn(){
    console.log(`
    node main.js tree "dirpath"
    node main.js organize "dirpath"
    node main.js help "dirpath" `)
}