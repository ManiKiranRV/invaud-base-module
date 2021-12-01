import express from 'express';
import asyncHandler from 'express-async-handler';
import { ProduceShipmentDataMessage } from '../config/kafka';

const router = express.Router();

const invaudTopic = getTopic();

router.post('/postShipmentData', asyncHandler(postShipmentDataToKafka));

async function postShipmentDataToKafka(
  request: express.Request,
  response: express.Response,
) {
  console.log('Incoming new shipment data to: ' + invaudTopic);
  try {
    await ProduceShipmentDataMessage(
      invaudTopic,
      request.body
    );
    response.send('New shipment data sent to kafka topic');
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
}

export default router;

function getTopic(): string {
  const topic = process.env.KAFKA_TOPIC;
  if (!topic) {
    throw new Error('Environmental variable KAFKA_TOPIC not set');
  }
  return topic;
}
