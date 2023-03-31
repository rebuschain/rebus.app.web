// package: evmos.erc20.v1
// file: evmos/erc20/v1/tx.proto

import * as jspb from "google-protobuf";
import * as google_api_annotations_pb from "../../../google/api/annotations_pb";
import * as gogoproto_gogo_pb from "../../../gogoproto/gogo_pb";
import * as cosmos_base_v1beta1_coin_pb from "../../../cosmos/base/v1beta1/coin_pb";

export class MsgConvertCoin extends jspb.Message {
  hasCoin(): boolean;
  clearCoin(): void;
  getCoin(): cosmos_base_v1beta1_coin_pb.Coin | undefined;
  setCoin(value?: cosmos_base_v1beta1_coin_pb.Coin): void;

  getReceiver(): string;
  setReceiver(value: string): void;

  getSender(): string;
  setSender(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgConvertCoin.AsObject;
  static toObject(includeInstance: boolean, msg: MsgConvertCoin): MsgConvertCoin.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MsgConvertCoin, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgConvertCoin;
  static deserializeBinaryFromReader(message: MsgConvertCoin, reader: jspb.BinaryReader): MsgConvertCoin;
}

export namespace MsgConvertCoin {
  export type AsObject = {
    coin?: cosmos_base_v1beta1_coin_pb.Coin.AsObject,
    receiver: string,
    sender: string,
  }
}

export class MsgConvertCoinResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgConvertCoinResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgConvertCoinResponse): MsgConvertCoinResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MsgConvertCoinResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgConvertCoinResponse;
  static deserializeBinaryFromReader(message: MsgConvertCoinResponse, reader: jspb.BinaryReader): MsgConvertCoinResponse;
}

export namespace MsgConvertCoinResponse {
  export type AsObject = {
  }
}

export class MsgConvertERC20 extends jspb.Message {
  getContractAddress(): string;
  setContractAddress(value: string): void;

  getAmount(): string;
  setAmount(value: string): void;

  getReceiver(): string;
  setReceiver(value: string): void;

  getSender(): string;
  setSender(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgConvertERC20.AsObject;
  static toObject(includeInstance: boolean, msg: MsgConvertERC20): MsgConvertERC20.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MsgConvertERC20, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgConvertERC20;
  static deserializeBinaryFromReader(message: MsgConvertERC20, reader: jspb.BinaryReader): MsgConvertERC20;
}

export namespace MsgConvertERC20 {
  export type AsObject = {
    contractAddress: string,
    amount: string,
    receiver: string,
    sender: string,
  }
}

export class MsgConvertERC20Response extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgConvertERC20Response.AsObject;
  static toObject(includeInstance: boolean, msg: MsgConvertERC20Response): MsgConvertERC20Response.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MsgConvertERC20Response, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgConvertERC20Response;
  static deserializeBinaryFromReader(message: MsgConvertERC20Response, reader: jspb.BinaryReader): MsgConvertERC20Response;
}

export namespace MsgConvertERC20Response {
  export type AsObject = {
  }
}

