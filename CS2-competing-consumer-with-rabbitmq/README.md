Chương trình:nhiệm vụ chuyển file ảnh tiếng Anh sang một file `pdf` tiếng Việt
Pattern áp dụng : competing consumer
Message queue áp dụng : ratbitmq
Đo hiệu suất :module tích hợp process.hrtime()của node.js ---> Hiển thị đo thời gian trong terminal bằng console.log.

Hướng dẫn cài đặt

# Cài đặt các gói liên quan

$ npm install

# Cài đặt RabbitMQ:

$ Chạy RabbitMQ trên localhost với user: guest, password: guest

# Lưu ý: Phải cd CS2-competing-consumer trước khi chạy

# Chạy producer: uploader.js

cd CS2-competing-consumer-with-rabbitmq
node src/producer/image-uploader/uploader.js

# Chạy 2-3 instances consumer: message-consumer.js

node src/consumer/message-consumer/message-consumer.js
(chạy ở 2 terminal khác nhau)

# Upload nhiều instance ảnh thông qua curl (mở 1 terminal khác) - với x là số lần bạn muốn ảnh dó được gửi

for ($i = 1; $i -le X; $i++) {
    curl.exe -X POST "http://localhost:3000/upload" -F "image=@src/producer/uploads/h.png"
}
ví dụ x=5
for ($i = 1; $i -le 15; $i++) {
curl.exe -X POST "http://localhost:3000/upload" -F "image=@src/producer/uploads/h.png"
}

curl.exe -X POST http://localhost:3000/upload/batch `  -F "images=@src/producer/uploads/h.png"`
-F "images=@src/producer/uploads/sample.png"

# Hướng dẫn đo hiệu suất
