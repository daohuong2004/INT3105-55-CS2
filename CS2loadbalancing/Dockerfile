FROM node:14-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy mã nguồn vào container
COPY . .

# Mở cổng cho server
EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "server.js"]
