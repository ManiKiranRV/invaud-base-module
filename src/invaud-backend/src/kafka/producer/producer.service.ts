import { Inject, Injectable, Logger } from '@nestjs/common';
import { KafkaEvent, MessageType } from 'core';
import { ChargeLineDto } from '../../invoices/dto/charge-line.dto';
import { InvoiceDto } from '../../invoices/dto/invoice.dto';
import { KafkaService } from '../common/kafka.service';

const encodeBase64 = require('btoa');

@Injectable()
export class ProducerService {
  constructor(@Inject('Kafka_service') private client: KafkaService) {}

  private logger = new Logger(this.constructor.name);
  private topic = this.getTopic();

  public produceProformaCreatedEvent(invoice: InvoiceDto): void {
    this.sendMessageToTopic(this.topic, MessageType.ProformaCreated, invoice);
  }

  public produceAdditionalChargeAddedEvent(chargeLineDto: ChargeLineDto) {
    this.sendMessageToTopic(
      this.topic,
      MessageType.AdditionalChargeAdded,
      chargeLineDto,
    );
  }

  public produceAdditionalChargeApprovedEvent(chargeLineDto: ChargeLineDto) {
    this.sendMessageToTopic(
      this.topic,
      MessageType.AdditionalChargeApproved,
      chargeLineDto,
    );
  }

  public produceAdditionalChargeRejectedEvent(chargeLineDto: ChargeLineDto) {
    this.sendMessageToTopic(
      this.topic,
      MessageType.AdditionalChargeRejected,
      chargeLineDto,
    );
  }

  public produceAdditionalChargeUpdatedEvent(chargeLineDto: ChargeLineDto) {
    this.sendMessageToTopic(
      this.topic,
      MessageType.AdditionalChargeUpdated,
      chargeLineDto,
    );
  }

  private sendMessageToTopic(
    topic: string,
    messageType: MessageType,
    message: any,
  ) {
    this.logger.log(`Producting event of message type: ${messageType}`);
    const outGoingMessage = encodeBase64(JSON.stringify(message));

    const messageData = this.generateMessageData(messageType, outGoingMessage);

    this.client.send({
      topic: topic,
      messages: [
        {
          key: `${KafkaKey()}-key`,
          value: JSON.stringify(messageData),
        },
      ],
    });
  }

  private getTopic(): string {
    const topic = process.env.KAFKA_TOPIC;
    if (!topic) {
      throw new Error('Environmental variable KAFKA_TOPIC not set');
    }
    return topic;
  }

  // Placeholder
  private generateMessageData(
    messageType: MessageType,
    outGoingMessage: string,
  ): KafkaEvent {
    return {
      messageType: messageType,
      message: outGoingMessage,
      interchangeHeader: {
        sourceSystem: 'CW1',
        targetSystem: 'BLESS',
        noOfMessages: '1',
      },
      messageHeader: {
        messageTrigger: 'I DONT KNOW',
        dateTime: '2021-09-02 12:45:49',
        dateTimeOffset: '-06',
        sessionId: '6ec380f7-3c55-4e54-bce6-f347df525cce',
        bodId: 'c34f7db9-4eb9-4b3a-83fe-fcfdf486451a',
        dataSource: 'ForwardingConsol',
      },
    };
  }
}

const KafkaKey = () => '_' + Math.random().toString(36).substr(2, 9);
