# Base image nhỏ gọn hơn
# FROM node:14-slim
FROM node:16-slim

# Set biến môi trường
ENV NODE_ENV=production

# Tạo thư mục làm việc
WORKDIR /app

# Copy và cài đặt dependencies
COPY package*.json ./
RUN npm install --only=production || cat /root/.npm/_logs/*.log

# Copy mã nguồn
COPY . .

# Tạo thư mục uploads nếu chưa có
RUN mkdir -p uploads

# Mở cổng server
EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "server.js"]
