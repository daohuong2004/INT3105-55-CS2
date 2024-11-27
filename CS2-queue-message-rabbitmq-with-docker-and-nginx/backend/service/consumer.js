// const { getChannel } = require('../config/rabbitmq');

// const consumeQueue = async (queueName, taskHandler) => {
//   const channel = getChannel();
//   await channel.assertQueue(queueName, { durable: true });

//   channel.consume(queueName, async (msg) => {
//     if (msg !== null) {
//       const content = JSON.parse(msg.content.toString());
//       console.log('Message received:', content);

//       await taskHandler(content);

//       channel.ack(msg);
//     }
//   });
// };

// module.exports = { consumeQueue };
const { getChannel } = require('../config/rabbitmq');

// Hàm tiêu thụ và xử lý các thông điệp từ queue
const consumeQueue = async (queueName, taskHandler) => {
  try {
    // Lấy kênh từ RabbitMQ
    const channel = getChannel();
    
    // Đảm bảo queue tồn tại
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages in queue: ${queueName}`);

    // Tiêu thụ thông điệp từ queue
    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        try {
          // Chuyển đổi nội dung tin nhắn từ buffer thành string
          const content = JSON.parse(msg.content.toString());
          console.log('Received message:', content);

          // Gọi hàm xử lý công việc (taskHandler)
          await taskHandler(content);

          // Xác nhận tin nhắn đã được xử lý
          channel.ack(msg);
          console.log(`Message processed and acknowledged:`, content);
        } catch (error) {
          // Xử lý lỗi nếu có trong quá trình xử lý tin nhắn
          console.error('Error processing message:', error);
          // Nếu có lỗi, có thể không ack tin nhắn và quyết định retry hoặc bỏ qua.
          channel.nack(msg, false, true); // Retry the message if needed
        }
      } else {
        console.log('No messages received');
      }
    });
  } catch (error) {
    console.error('Error in consumeQueue:', error);
  }
};

module.exports = { consumeQueue };
