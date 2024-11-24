# Tất cả các worker sẽ được đóng gói thành container.
# Sử dụng Node.js làm base image
FROM node:16

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Cài đặt các dependency
RUN npm install

# Expose cổng để phục vụ (không bắt buộc nếu chỉ xử lý queue)
EXPOSE 3000

# Lệnh chạy worker
CMD ["node", "service/orc_handler.js"]