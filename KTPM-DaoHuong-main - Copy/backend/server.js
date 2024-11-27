const express = require('express')
const app = express()
const port = 3005
const path = require('path');
const multer = require('multer');
const { sendToQueue } = require('./controller/processStarter')
const {OCRConnectAndConsume} = require('./service/ocr_handler')
const {PDFConnectAndConsume} = require('./service/pdf_handler')
const {TranslateConnectAndConsume} = require('./service/translate_handler')
// import { OCRConnectAndConsume } from './service/ocr_handler';
// import { PDFConnectAndConsume } from './service/pdf_handler';
// import { TranslateConnectAndConsume } from './service/translate_handler';

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/template/index.html');
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Ensure unique filenames
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.array('files', 10), async (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  console.info(`Uploaded file: ${JSON.stringify(req.files)}`)
  req.files.forEach(async (file) => {
    await sendToQueue('ocr_queue', file.path)
  })
  await OCRConnectAndConsume();
  await TranslateConnectAndConsume();
  let dowload_path = await PDFConnectAndConsume();
  console.log(dowload_path, 'hehe');
  
  file_path = path.join(__dirname, 'cache_output', dowload_path)
  console.log(file_path);
  // res.sendFile(file_path, (err)=>{
  //   if(err) console.log(err);
  // })
  
  res.json({
    message: 'Processed successfully',
    files: req.files
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})