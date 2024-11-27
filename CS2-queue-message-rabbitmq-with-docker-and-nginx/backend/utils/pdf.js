const PDFDocument = require('pdfkit');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
/*
    T vẫn để code vì giữ cho m đối chiếu. còn sẽ không dùng nhu này.
     Lí do: m làm như này là mỗi lần user gửi requests là m sẽ lưu cái file gửi trên server.
      Tưởng tượng 100k users nó cùng làm như thế. nếu con server m ko đủ dung lượng,
     Sập là cái chắc, cho nên t sẽ trả về luôn cho phía client file đã convert. Hiểu vấn đề không, Lúc này server nó không phải chịu tải nữa.
    */ 
async function createPDF(text) {
    const uuid = uuidv4();
    const OUT_FILE = `./cache_output/${uuid}.pdf`;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(OUT_FILE));
    doc.font('font/Roboto-Regular.ttf')
        .fontSize(14)
        .text(text, 100, 100);
    doc.end();

    // delete uploaded files
    exec('node delete_upload.js', { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
        }
    
        if (stderr) {
            console.error(`Error output: ${stderr}`);
            return;
        }
    
        console.log(`Command output:\n${stdout}`);
    });

    return `${uuid}.pdf`
}

module.exports = {
    createPDF
}