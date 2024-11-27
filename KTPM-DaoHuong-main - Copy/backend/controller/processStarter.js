const amqp = require('amqplib');

const sendToQueue = async (queueName, message) => {
    try {
        console.log(`Sending message to queue: ${message}`); // Debug log

        // Cập nhật địa chỉ kết nối tới RabbitMQ
        //amqp://user:password@localhost:15672
        const rabbitmqURL = "amqp://user:password@localhost:5673"
        const connection = await amqp.connect(rabbitmqURL);
        console.log("Rabbit MQ connection established"); // Debug log
        
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });

        // Ensure message is valid
        if (typeof message !== 'string' || !message) {
            throw new Error('Invalid message');
        }

        channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
        console.log(`Message sent to ${queueName}:`, message);

    } catch (error) {
        console.error('Error sending message:', error);
    }
};

module.exports = { sendToQueue };
