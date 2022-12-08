// package: rebus.nftid.v1
// file: rebus/nftid/v1/id.proto

import * as jspb from "google-protobuf";
import * as gogoproto_gogo_pb from "../../../gogoproto/gogo_pb";

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
  }
}

export interface NftIdMap {
  NONE: 0;
  DEFAULT: 1;
}

export const NftId: NftIdMap;

