export interface KafkaEvent {
  interchangeHeader: InterchangeHeader;
  messageType: string;
  messageHeader: MessageHeader;
  message: string;
}

export enum MessageType {
  Pickup = 'PICKUP',
  ProformaCreated = 'INV_PROFORMA_INVOICE',
  AdditionalChargeAdded = 'INV_ADDI_CHARGE_CREATE',
  AdditionalChargeApproved = 'INV_ADDI_CHARGE_APPR',
  AdditionalChargeRejected = 'INV_ADDI_CHARGE_REJ',
  AdditionalChargeUpdated = 'INV_ADDI_CHARGE_UPDATE',
}

export interface InterchangeHeader {
  sourceSystem: string;
  targetSystem: string;
  noOfMessages: string;
}

export interface MessageHeader {
  messageTrigger: string;
  dateTime: string;
  dateTimeOffset: string;
  sessionId: string;
  bodId: string;
  dataSource: string;
}
