const amqp = require('amqplib');
const { createPDF } = require("../utils/pdf");

const queueName = 'pdf_queue';


const PDFConnectAndConsume = async () => {
  let file_path = ''
  try {
    console.log("Connecting to RabbitMQ...");

    const rabbitmqURL = "amqp://user:password@localhost:5673"
    const connection = await amqp.connect(rabbitmqURL);
    console.log("Connected to pdf filter successfully");
    
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    console.log(`Waiting for messages in ${queueName}...`);
    
    channel.consume(queueName, async (msg) => {
      data = msg.content.toString();
      console.log(`Received message: ${data}`);

      try {
        // Process the PDF creation task
        const result = await createPDF(data);
        console.log(`PDF created successfully: ${result}`);
        // Acknowledge the message
        channel.ack(msg);
        file_path = result
      } catch (error) {
        console.error('Error creating PDF:', error);
      }
    });
  } catch (error) {
    console.error('Error in PDF worker:', error);
  }
  return file_path
}

module.exports = {PDFConnectAndConsume}
// connectAndConsume();
