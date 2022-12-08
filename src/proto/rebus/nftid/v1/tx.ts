/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { IdRecord, NftId, nftIdFromJSON, nftIdToJSON } from "./id";

export const protobufPackage = "rebus.nftid.v1";

/** MsgMintNftId defines a Msg to create or update an nft id record */
export interface MsgMintNftId {
  /** address of the user who is minting the nft id */
  address: string;
  /** type of the nft id */
  nftType: NftId;
  /** organization that the nft id belongs to */
  organization: string;
  /** encryption key for nft id encrypted by wallet */
  encryptionKey: string;
  /** Metadata url where the JSON file is stored with the info about the ID */
  metadataUrl: string;
  /** Minting fee for the nft id, min is 0.5 and max is 10 */
  mintingFee: Coin | undefined;
}

/** MsgMintNftIdResponse returns no fields */
export interface MsgMintNftIdResponse {
  idRecord: IdRecord | undefined;
}

function createBaseMsgMintNftId(): MsgMintNftId {
  return { address: "", nftType: 0, organization: "", encryptionKey: "", metadataUrl: "", mintingFee: undefined };
}

export const MsgMintNftId = {
  encode(message: MsgMintNftId, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.nftType !== 0) {
      writer.uint32(16).int32(message.nftType);
    }
    if (message.organization !== "") {
      writer.uint32(26).string(message.organization);
    }
    if (message.encryptionKey !== "") {
      writer.uint32(34).string(message.encryptionKey);
    }
    if (message.metadataUrl !== "") {
      writer.uint32(42).string(message.metadataUrl);
    }
    if (message.mintingFee !== undefined) {
      Coin.encode(message.mintingFee, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgMintNftId {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgMintNftId();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.nftType = reader.int32() as any;
          break;
        case 3:
          message.organization = reader.string();
          break;
        case 4:
          message.encryptionKey = reader.string();
          break;
        case 5:
          message.metadataUrl = reader.string();
          break;
        case 6:
          message.mintingFee = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgMintNftId {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      nftType: isSet(object.nftType) ? nftIdFromJSON(object.nftType) : 0,
      organization: isSet(object.organization) ? String(object.organization) : "",
      encryptionKey: isSet(object.encryptionKey) ? String(object.encryptionKey) : "",
      metadataUrl: isSet(object.metadataUrl) ? String(object.metadataUrl) : "",
      mintingFee: isSet(object.mintingFee) ? Coin.fromJSON(object.mintingFee) : undefined,
    };
  },

  toJSON(message: MsgMintNftId): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.nftType !== undefined && (obj.nftType = nftIdToJSON(message.nftType));
    message.organization !== undefined && (obj.organization = message.organization);
    message.encryptionKey !== undefined && (obj.encryptionKey = message.encryptionKey);
    message.metadataUrl !== undefined && (obj.metadataUrl = message.metadataUrl);
    message.mintingFee !== undefined &&
      (obj.mintingFee = message.mintingFee ? Coin.toJSON(message.mintingFee) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgMintNftId>, I>>(object: I): MsgMintNftId {
    const message = createBaseMsgMintNftId();
    message.address = object.address ?? "";
    message.nftType = object.nftType ?? 0;
    message.organization = object.organization ?? "";
    message.encryptionKey = object.encryptionKey ?? "";
    message.metadataUrl = object.metadataUrl ?? "";
    message.mintingFee = (object.mintingFee !== undefined && object.mintingFee !== null)
      ? Coin.fromPartial(object.mintingFee)
      : undefined;
    return message;
  },
};

function createBaseMsgMintNftIdResponse(): MsgMintNftIdResponse {
  return { idRecord: undefined };
}

export const MsgMintNftIdResponse = {
  encode(message: MsgMintNftIdResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.idRecord !== undefined) {
      IdRecord.encode(message.idRecord, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgMintNftIdResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgMintNftIdResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.idRecord = IdRecord.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgMintNftIdResponse {
    return { idRecord: isSet(object.idRecord) ? IdRecord.fromJSON(object.idRecord) : undefined };
  },

  toJSON(message: MsgMintNftIdResponse): unknown {
    const obj: any = {};
    message.idRecord !== undefined && (obj.idRecord = message.idRecord ? IdRecord.toJSON(message.idRecord) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgMintNftIdResponse>, I>>(object: I): MsgMintNftIdResponse {
    const message = createBaseMsgMintNftIdResponse();
    message.idRecord = (object.idRecord !== undefined && object.idRecord !== null)
      ? IdRecord.fromPartial(object.idRecord)
      : undefined;
    return message;
  },
};

/** Msg defines the nftid Msg service. */
export interface Msg {
  /** MintNftId mints a NFT ID on the blockchain. */
  MintNftId(request: MsgMintNftId): Promise<MsgMintNftIdResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "rebus.nftid.v1.Msg";
    this.rpc = rpc;
    this.MintNftId = this.MintNftId.bind(this);
  }
  MintNftId(request: MsgMintNftId): Promise<MsgMintNftIdResponse> {
    const data = MsgMintNftId.encode(request).finish();
    const promise = this.rpc.request(this.service, "MintNftId", data);
    return promise.then((data) => MsgMintNftIdResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
