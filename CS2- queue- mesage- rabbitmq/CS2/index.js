// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const ocr = require('./utils/ocr');
// const { translate } = require('./utils/translate');
// const { createPDF } = require('./utils/pdf');

// const app = express();
// const port = 3000;

// // Cấu hình multer
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'upload/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// });

// const upload = multer({
//     storage: storage,
//     fileFilter: function (req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//             return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
//         }
//         cb(null, true);
//     }
// });

// // Serve static files
// app.use(express.static('public'));

// // Route chính
// app.get('/', (req, res) => {
//     res.send(`
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <title>Image to PDF Translator</title>
//             <link rel="stylesheet" href="/css/style.css">
//         </head>
//         <body>
//             <div class="container">
//                 <h2>Upload ảnh để chuyển đổi sang PDF tiếng Việt</h2>
//                 <form class="upload-form" action="/convert" method="post" enctype="multipart/form-data">
//                     <div class="file-input">
//                         <input type="file" name="image" required accept="image/*">
//                     </div>
//                     <button class="submit-button" type="submit">Chuyển đổi sang PDF</button>
//                 </form>
//                 <div id="loading" class="loading">
//                     Đang xử lý, vui lòng đợi...
//                 </div>
//             </div>
//             <script>
//                 document.querySelector('form').onsubmit = function() {
//                     document.getElementById('loading').style.display = 'block';
//                     document.querySelector('.submit-button').disabled = true;
//                 }
//             </script>
//         </body>
//         </html>
//     `);
// });

// // Route xử lý upload
// app.post('/convert', upload.single('image'), async (req, res) => {
//     try {
//         if (!req.file) {
//             throw new Error('Vui lòng chọn file ảnh!');
//         }

//         const imagePath = req.file.path;
//         const text = await ocr.image2text(imagePath);
//         const viText = await translate(text);
//         const pdfPath = await createPDF(viText);

//         res.download(pdfPath, 'translated.pdf', (err) => {
//             if (err) {
//                 console.error('Lỗi khi tải file:', err);
//                 res.status(500).send('Có lỗi xảy ra khi tải file');
//             }

//             // Cleanup
//             fs.unlink(imagePath, (err) => {
//                 if (err) console.error('Lỗi khi xóa file ảnh tạm:', err);
//             });
//             fs.unlink(pdfPath, (err) => {
//                 if (err) console.error('Lỗi khi xóa file PDF tạm:', err);
//             });
//         });

//     } catch (error) {
//         console.error('Lỗi:', error);
//         res.status(500).send(`Có lỗi xảy ra: ${error.message}`);
//     }
// });

// // Error handling
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send(`Có lỗi xảy ra: ${err.message}`);
// });

// // Tạo thư mục cần thiết
// ['upload', 'output', 'public/css', 'font'].forEach(dir => {
//     if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir, { recursive: true });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server đang chạy tại http://localhost:${port}`);
// });
const ocr = require("./utils/ocr");
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createPDF } = require("./utils/pdf");
const { translate } = require("./utils/translate");
const app = express();
const port = 3000;

app.use('/output', express.static('output'));


// Cấu hình multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //đưa ảnh người dùng ném lên vào file upload bằng tên như thế này để không
    }
});

const upload = multer({
    storage: multer.memoryStorage(), // Lưu file vào bộ nhớ
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
        }
        cb(null, true);
    }
});



app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Chuyển đổi ảnh sang PDF</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }

                .container {
                    background-color: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                h2 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 30px;
                }

                .upload-form {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }

                .file-input {
                    border: 2px dashed #ccc;
                    padding: 20px;
                    width: 100%;
                    text-align: center;
                    border-radius: 4px;
                }

                .submit-button {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .submit-button:hover {
                    background-color: #45a049;
                }

                .submit-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .view-pdf-button {
                    background-color: #2196F3;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    text-decoration: none;
                    display: none;
                    margin-top: 20px;
                }
                
                .view-pdf-button:hover {
                    background-color: #1976D2;
                }

                .loading {
                    display: none;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Upload ảnh để chuyển đổi sang PDF tiếng Việt</h2>
                <form class="upload-form" action="/convert" method="post" enctype="multipart/form-data">
                    <div class="file-input">
                        <input type="file" name="image" required accept="image/*">
                    </div>
                    <button class="submit-button" type="submit">Chuyển đổi sang PDF</button>
                </form>
                <div id="loading" class="loading">
                    Đang xử lý, vui lòng đợi...
                </div>
                <div id="pdf-link-container" style="text-align: center;">
                    <a id="view-pdf-link" class="view-pdf-button" target="_blank">
                        Xem PDF trong cửa sổ mới
                    </a>
                </div>
            </div>
            <script>
                document.querySelector('form').onsubmit = function(e) {
                    e.preventDefault();
                    const formData = new FormData(this);
                    
                    // Hiển thị thông báo đang xử lý
                    document.getElementById('loading').style.display = 'block';
                    document.querySelector('.submit-button').disabled = true;
                    document.getElementById('view-pdf-link').style.display = 'none';
                    
                    fetch('/convert', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Ẩn thông báo đang xử lý
                        document.getElementById('loading').style.display = 'none';
                        document.querySelector('.submit-button').disabled = false;
                        
                        if (data.success && data.pdfUrl) {
                            const viewPdfLink = document.getElementById('view-pdf-link');
                            viewPdfLink.href = data.pdfUrl;
                            viewPdfLink.style.display = 'inline-block';
                        } else {
                            alert(data.error || 'Có lỗi xảy ra khi xử lý file');
                        }
                    })
                    .catch(error => {
                        console.error('Lỗi:', error);
                        document.getElementById('loading').style.display = 'none';
                        document.querySelector('.submit-button').disabled = false;
                        alert('Có lỗi xảy ra khi xử lý file');
                    });
                }
            </script>
        </body>
        </html>
    `);
});
// xử lí ảnh khi tải l
app.post('/convert', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('Vui lòng chọn file ảnh!');
        }

        // đoạn này để thêm file ảnh ng dùng ném lên vào file upload
        const imageBuffer = req.file.buffer;
        const filename = `temp_${Date.now()}.png`;
        const tempImagePath = `./upload/${filename}`;
        fs.writeFileSync(tempImagePath, imageBuffer);
        console.log(' tempImagePath là cái này : ', tempImagePath);
        // Lấy file đầu tiên để xử lý (hoặc bạn có thể chọn file cụ thể)
        const uploadFiles = fs.readdirSync('upload');
        const text = await ocr.image2text(tempImagePath)
        console.log("day la imgagePath", tempImagePath);
        const viText = await translate(text);
        const pdfPath = await createPDF(viText);
        const pdfFileName = path.basename(pdfPath);
        const pdfUrl = `/output/${pdfFileName}`;

        // Gửi URL của file PDF về client
        res.json({
            success: true,
            pdfUrl: pdfPath
        });
        fs.unlinkSync(tempImagePath);

    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).send(`Có lỗi xảy ra: ${error.message}`);
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`Có lỗi xảy ra: ${err.message}`);
});


app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
(async () => {
    try {
        const text = await ocr.image2text("./upload/sample1.png");
        console.log(text);
        const viText = await translate(text);
        console.log(viText);
        const pdfFile = createPDF(viText);
        console.log("This is PDF file: " + pdfFile)
    } catch (e) {
        console.log(e);
    }
})();
