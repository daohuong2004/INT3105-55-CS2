// const amqp = require('amqplib');
// const { translate } = require("../utils/translate");

// const queueName = 'translate_queue';
// const nextQueue = 'pdf_queue';

// const connectAndConsume = async () => {
//   try {
//     const connection = await amqp.connect('amqp://user:password@rabbitmq:5672');
    
//     // const connection = await amqp.connect('amqp://localhost');
//     const channel = await connection.createChannel();
//     await channel.assertQueue(queueName, { durable: true });

//     console.log(`Waiting for messages in ${queueName}...`);
    
//     channel.consume(queueName, async (msg) => {
//       const text = msg.content.toString();
//       console.log(`Received message: ${text}`);

//       // Process the translation task
//       const translatedText = await translate(text);

//       // Send the result to the next queue (pdf_queue)
//       await channel.assertQueue(nextQueue, { durable: true });
//       channel.sendToQueue(nextQueue, Buffer.from(translatedText), { persistent: true });

//       // Acknowledge the message
//       channel.ack(msg);
//     });
//   } catch (error) {
//     console.error('Error in Translation worker:', error);
//   }
// };

// connectAndConsume();
const amqp = require('amqplib');
const { translate } = require("../utils/translate");

const queueName = 'translate_queue';
const nextQueue = 'pdf_queue';
  
const TranslateConnectAndConsume = async () => {
  try {
    const rabbitmqURL = "amqp://user:password@localhost:5673"
    const connection = await amqp.connect(rabbitmqURL);
    console.log("Connected Translate Filter successfully");
    
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    console.log(`Waiting for messages in ${queueName}...`);
    
    channel.consume(queueName, async (msg) => {
      const text = msg.content.toString();
      console.log(`Received message: ${text}`);

      // Process the translation task
      const translatedText = await translate(text);
      console.log("Translated Text: ", translatedText);
      
      // Send the result to the next queue (pdf_queue)
      await channel.assertQueue(nextQueue, { durable: true });
      channel.sendToQueue(nextQueue, Buffer.from(translatedText), { persistent: true });

      // Acknowledge the message
      channel.ack(msg);
    });
  } catch (error) {
    console.error('Error in Translation worker:', error);
  }
};
module.exports = {TranslateConnectAndConsume}
// connectAndConsume();
