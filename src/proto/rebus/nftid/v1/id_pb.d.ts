// package: rebus.nftid.v1
// file: rebus/nftid/v1/id.proto

import * as jspb from "google-protobuf";
import * as gogoproto_gogo_pb from "../../../gogoproto/gogo_pb";
import * as cosmos_base_v1beta1_coin_pb from "../../../cosmos/base/v1beta1/coin_pb";

export class Payment extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): cosmos_base_v1beta1_coin_pb.Coin | undefined;
  setAmount(value?: cosmos_base_v1beta1_coin_pb.Coin): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getLockedAtAddress(): string;
  setLockedAtAddress(value: string): void;

  getCanRefund(): boolean;
  setCanRefund(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Payment.AsObject;
  static toObject(includeInstance: boolean, msg: Payment): Payment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Payment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Payment;
  static deserializeBinaryFromReader(message: Payment, reader: jspb.BinaryReader): Payment;
}

export namespace Payment {
  export type AsObject = {
    amount?: cosmos_base_v1beta1_coin_pb.Coin.AsObject,
    timestamp: number,
    lockedAtAddress: string,
    canRefund: boolean,
  }
}

export class IdRecord extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  getType(): number;
  setType(value: number): void;

  getOrganization(): string;
  setOrganization(value: string): void;

  getEncryptionKey(): string;
  setEncryptionKey(value: string): void;

  getMetadataUrl(): string;
  setMetadataUrl(value: string): void;

  getDocumentNumber(): number;
  setDocumentNumber(value: number): void;

  getIdNumber(): string;
  setIdNumber(value: string): void;

  getPaymentType(): PaymentTypeMap[keyof PaymentTypeMap];
  setPaymentType(value: PaymentTypeMap[keyof PaymentTypeMap]): void;

  clearPaymentsList(): void;
  getPaymentsList(): Array<Payment>;
  setPaymentsList(value: Array<Payment>): void;
  addPayments(value?: Payment, index?: number): Payment;

  getActive(): boolean;
  setActive(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IdRecord.AsObject;
  static toObject(includeInstance: boolean, msg: IdRecord): IdRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IdRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IdRecord;
  static deserializeBinaryFromReader(message: IdRecord, reader: jspb.BinaryReader): IdRecord;
}

export namespace IdRecord {
  export type AsObject = {
    address: string,
    type: number,
    organization: string,
    encryptionKey: string,
    metadataUrl: string,
    documentNumber: number,
    idNumber: string,
    paymentType: PaymentTypeMap[keyof PaymentTypeMap],
    paymentsList: Array<Payment.AsObject>,
    active: boolean,
  }
}

export interface NftIdMap {
  NONE: 0;
  V1: 1;
}

export const NftId: NftIdMap;

export interface PaymentTypeMap {
  INVALID: 0;
  LIFETIME: 1;
  LOCK: 2;
}

export const PaymentType: PaymentTypeMap;

