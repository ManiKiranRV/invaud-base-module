import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payload } from '@nestjs/microservices';
import { InstanceType, KafkaEvent, MessageType } from 'core';
import { IHeaders } from 'kafkajs';
import { SubscribeTo } from '../common/kafka.decorator';
import { KafkaService } from '../common/kafka.service';
import { ForwarderConsumerService } from './forwarder-consumer/forwarder-consumer.service';
import { ShipperConsumerService } from './shipper-consumer/shipper-consumer.service';

const decodeBase64 = require('atob');
const topic = getTopic();

@Injectable()
export class ConsumerService implements OnModuleInit {
  constructor(
    @Inject('Kafka_service')
    private client: KafkaService,
    private readonly forwarderConsumerService: ForwarderConsumerService,
    private readonly shipperConsumerService: ShipperConsumerService,
    private configService: ConfigService,
  ) {}

  private logger = new Logger(this.constructor.name);
  private instanceType: InstanceType;

  @SubscribeTo(topic)
  async newInvoice(
    @Payload() event: string,
    headers: IHeaders,
    key: string,
    timestamp: string,
  ): Promise<void> {
    const kafkaEvent: KafkaEvent = JSON.parse(event);

    this.logger.log(`Handling event: ${kafkaEvent.messageType}`);

    const decodedMessage = decodeBase64(kafkaEvent.message);

    if (this.instanceType === InstanceType.Forwarder) {
      this.handleForwarderEvent(kafkaEvent, decodedMessage);
    } else if (this.instanceType === InstanceType.Shipper) {
      this.handleShipperEvent(kafkaEvent, decodedMessage);
    } else {
      throw new Error(
        'Cannot consume event. Instance type is not valid: ' +
          this.instanceType,
      );
    }
  }

  private async handleForwarderEvent(
    kafkaEvent: KafkaEvent,
    decodedMessage: string,
  ): Promise<void> {
    switch (kafkaEvent.messageType) {
      case MessageType.Pickup:
        this.forwarderConsumerService.handlePickupEvent(decodedMessage);
        break;
      case MessageType.AdditionalChargeApproved:
        this.forwarderConsumerService.handleAdditionalChargeApprovedEvent(
          decodedMessage,
        );
        break;
      case MessageType.AdditionalChargeRejected:
        this.forwarderConsumerService.handleAdditionalChargeRejectedEvent(
          decodedMessage,
        );
        break;
      default:
        this.logger.warn(
          'The message type ' +
            kafkaEvent.messageType +
            ' is not supported in event handler for ' +
            this.instanceType,
        );
        break;
    }
  }

  private async handleShipperEvent(
    kafkaEvent: KafkaEvent,
    decodedMessage: string,
  ): Promise<void> {
    switch (kafkaEvent.messageType) {
      case MessageType.ProformaCreated:
        this.shipperConsumerService.handleProformaCreatedEvent(decodedMessage);
        break;
      case MessageType.AdditionalChargeAdded:
        this.shipperConsumerService.handleAdditionalChargeAddedEvent(
          decodedMessage,
        );
      case MessageType.AdditionalChargeUpdated:
        this.shipperConsumerService.handleAdditionalChargeUpdatedEvent(
          decodedMessage,
        );
      default:
        this.logger.warn(
          'The message type ' +
            kafkaEvent.messageType +
            ' is not supported in event handler for ' +
            this.instanceType,
        );
        break;
    }
  }

  onModuleInit(): void {
    this.client.subscribeToResponseOf(topic, this);

    const instanceTypeConfiguration = this.configService.get('INSTANCE_TYPE');
    this.logger.log('InstanceType is ' + instanceTypeConfiguration);
    if (
      !instanceTypeConfiguration ||
      !Object.values(InstanceType).includes(instanceTypeConfiguration)
    ) {
      throw Error(
        'instance type not correctly set. Make sure it is set in the docker compose. Should be either shipper or forwarder. Currently:' +
          instanceTypeConfiguration,
      );
    }
    this.instanceType = instanceTypeConfiguration as InstanceType;
  }
}

function getTopic(): string {
  const topic = process.env.KAFKA_TOPIC;
  if (!topic) {
    throw new Error('Environmental variable KAFKA_TOPIC not set');
  }
  return topic;
}
