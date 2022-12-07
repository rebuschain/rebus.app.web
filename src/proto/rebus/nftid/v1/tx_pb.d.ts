// package: rebus.nftid.v1
// file: rebus/nftid/v1/tx.proto

import * as jspb from "google-protobuf";
import * as google_api_annotations_pb from "../../../google/api/annotations_pb";
import * as gogoproto_gogo_pb from "../../../gogoproto/gogo_pb";
import * as rebus_nftid_v1_id_pb from "../../../rebus/nftid/v1/id_pb";

export class MsgMintNftId extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  getNftType(): rebus_nftid_v1_id_pb.NftIdMap[keyof rebus_nftid_v1_id_pb.NftIdMap];
  setNftType(value: rebus_nftid_v1_id_pb.NftIdMap[keyof rebus_nftid_v1_id_pb.NftIdMap]): void;

  getOrganization(): string;
  setOrganization(value: string): void;

  getEncryptionKey(): string;
  setEncryptionKey(value: string): void;

  getMetadataUrl(): string;
  setMetadataUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgMintNftId.AsObject;
  static toObject(includeInstance: boolean, msg: MsgMintNftId): MsgMintNftId.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MsgMintNftId, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgMintNftId;
  static deserializeBinaryFromReader(message: MsgMintNftId, reader: jspb.BinaryReader): MsgMintNftId;
}

export namespace MsgMintNftId {
  export type AsObject = {
    address: string,
    nftType: rebus_nftid_v1_id_pb.NftIdMap[keyof rebus_nftid_v1_id_pb.NftIdMap],
    organization: string,
    encryptionKey: string,
    metadataUrl: string,
  }
}

export class MsgMintNftIdResponse extends jspb.Message {
  hasIdRecord(): boolean;
  clearIdRecord(): void;
  getIdRecord(): rebus_nftid_v1_id_pb.IdRecord | undefined;
  setIdRecord(value?: rebus_nftid_v1_id_pb.IdRecord): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgMintNftIdResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgMintNftIdResponse): MsgMintNftIdResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MsgMintNftIdResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgMintNftIdResponse;
  static deserializeBinaryFromReader(message: MsgMintNftIdResponse, reader: jspb.BinaryReader): MsgMintNftIdResponse;
}

export namespace MsgMintNftIdResponse {
  export type AsObject = {
    idRecord?: rebus_nftid_v1_id_pb.IdRecord.AsObject,
  }
}

