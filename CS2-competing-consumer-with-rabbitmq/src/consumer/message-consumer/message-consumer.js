
// import các thư viện 
// Các thư viện bên ngoài
const amqp = require('amqplib');
const path = require('path');
const fs = require('fs');

// Các module dịch vụ nội bộ
const ocrService = require('./services/ocr');
const translatorService = require('./services/translate');
const pdfGenerator = require('./services/pdf');
// Set đo hiệu suất trực tiếp 
let totalRequests = 0;
let cumulativeProcessingTime = 0;
let startTrackingTime = process.hrtime();


function logPerformanceMetrics() {
    
    const elapsedTime = process.hrtime(startTrackingTime); // Tính thời gian đã trôi qua
    const elapsedTimeInSeconds = elapsedTime[0] + elapsedTime[1] / 1e9; // seconds
    const requestsPerSecond = totalRequests / elapsedTimeInSeconds;
    const averageProcessingTime = totalRequests > 0
        ? (cumulativeProcessingTime / totalRequests).toFixed(2)
        : 0;

    console.log('Performance Metrics:');
    console.log(`- Requests per Second: ${requestsPerSecond.toFixed(2)}`);
    console.log(`- Average Processing Time: ${averageProcessingTime} ms`);
   

    // Ghi vào file log
    // fs.appendFileSync('performance.log', `${new Date().toISOString()} - ${logMessage}`);

    // Reset các biến thống kê
    totalRequests = 0;
    cumulativeProcessingTime = 0;
    startTrackingTime = process.hrtime() ;
}


// Chạy tracking mỗi 1 phút
// Đặt lịch thực thi hàm ghi lại hiệu suất mỗi phút
setInterval(logPerformanceMetrics, 60000);

let connection;
async function setupConsumer() {
    try {
        // Thiết lập kết nối đến RabbitMQ
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = 'image-processing-queue';
        // Tạo hàng đợi nếu chưa tồn tại
        await channel.assertQueue(queueName, { durable: true });
        // Chỉ nhận 1 message tại một thời điểm
        channel.prefetch(1);
        console.log(`[*] Waiting for messages in queue: ${queueName}`);
        // Xử lý các message từ hàng đợi
        channel.consume(queueName, async (message) => {
            if (message !== null) {
                const fileDetails = JSON.parse(message.content.toString());
                const startTime = process.hrtime(); // Đo thời gian bắt đầu
                console.log('Message received:', fileDetails.originalPath);
                try {
                    // Kiểm tra file tồn tại
                    if (!fs.existsSync(fileDetails.originalPath)) {
                        throw new Error(`Files do not exist: ${fileDetails.originalPath}`);
                    }
                    // 1. Thực hiện OCR để trích xuất văn bản từ ảnh
                    const extractedText = await ocrService.image2text(fileDetails.originalPath);
                    // 2. Dịch văn bản sang tiếng Việt
                    const translatedText = await translatorService.translate(extractedText);
                    // 3. Tạo file PDF từ văn bản đã dịch
                    const uniqueFileName = `${process.hrtime()[0]}-${Math.round(Math.random() * 1E9)}.pdf`;
                    const pdfOutputPath = path.join(__dirname, 'output', `${fileDetails.filename}-${uniqueFileName}`);
                    await pdfGenerator.createPDF(translatedText, pdfOutputPath);
                    channel.ack(message);
                    // Cập nhật thông số hiệu suất
                    const endTime = process.hrtime(startTime); // Tính thời gian kết thúc so với thời điểm bắt đầu
                    const processingTime = (endTime[0] * 1e3) + (endTime[1] / 1e6); // Chuyển đổi thành millisecond
                    totalRequests++;
                    cumulativeProcessingTime += processingTime;
                    console.log(`Successfully processed: ${fileDetails.filename}`);
                    console.log(`Processing time: ${processingTime} ms`);
                } catch (err) {
                    console.error('Error during message processing:', err);
                    // Nếu lỗi, đưa message trở lại hàng đợi để xử lý lại
                    channel.nack(message, false, true);
                }
            }
        }, { noAck: false });
    } catch (err) {
        console.error('Error setup consumer:', err);
    }
}

// Chạy consumer
setupConsumer().catch(console.error);

// Xử lý dừng ứng dụng an toàn
process.on('SIGINT', async () => {
    try {
        if (connection) await connection.close();
        process.exit(0);
    } catch (shutdownError) {
        console.error('Error during shutdown:', shutdownError);
        process.exit(1);
    }
});