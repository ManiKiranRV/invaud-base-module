import { Kafka, Producer } from 'kafkajs';
import { KafkaEvent} from 'core';

const blessAckTopic = process.env.KAFKA_BLESS_ACK_TOPIC || 'cool-topic';

const encodeBase64 = require('btoa');
const decodeBase64 = require('atob');

const kafka = new Kafka({
  clientId: 'Bless',
  brokers: ['kafka1:9092'],
});

const consumer = kafka.consumer({ groupId: 'cool-group-mockbless' });

const producer: Producer = kafka.producer({
  maxInFlightRequests: 1,
  idempotent: true,
  transactionalId: `bless-invaud`,
});

export const start = async (): Promise<void> => {
  await producer.connect();

  await consumer.connect();
  await consumer.subscribe({ topic: blessAckTopic });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log('Incoming bless ack message with payload:');
      if (message.value) {
        const data = JSON.parse(message.value.toString());
        console.log('-' + decodeBase64(data.payloads[0]));
      }
    },
  });
};

export const shutdown = async (): Promise<void> => {
  await producer.disconnect();
};

export const ProduceShipmentDataMessage = async (
  topic: string,
  event: KafkaEvent,
): Promise<string> => {
  const transformedMessage = encodeBase64(JSON.stringify(event.message));

  await producer.connect();
  const messageData: KafkaEvent = {
    ...event,
    message: transformedMessage
  };


  try {
    await producer.send({
      topic: topic,
      messages: [
        {
          key: `${KafkaKey()}-key`,
          headers: { MESSAGE_CATEGORY: 'BUSINESS' },
          value: JSON.stringify(messageData),
        },
      ],
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
  return 'Sent';
};

const KafkaKey = () => '_' + Math.random().toString(36).substr(2, 9);
