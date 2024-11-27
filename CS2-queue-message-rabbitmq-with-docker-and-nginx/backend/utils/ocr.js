const tesseract = require("node-tesseract-ocr")

async function image2text(path){
  try {
    return await tesseract.recognize(path, {
      lang: "eng"
    })
  }
  catch(error) {
    console.log(error);
    
  }
}

module.exports = {
  image2text
}

