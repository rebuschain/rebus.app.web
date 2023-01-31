/* eslint-disable */
import _m0 from "protobufjs/minimal";
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
}

/** MsgMintNftIdResponse returns the id record */
export interface MsgMintNftIdResponse {
  idRecord: IdRecord | undefined;
}

/** MsgCreateIdRecord defines a Msg to create the id record that holds the nft id (generates id number and document number) */
export interface MsgCreateIdRecord {
  /** address of the user who is minting the nft id */
  address: string;
  /** type of the nft id */
  nftType: NftId;
  /** organization that the nft id belongs to */
  organization: string;
}

/** MsgCreateIdRecordResponse returns the id record */
export interface MsgCreateIdRecordResponse {
  idRecord: IdRecord | undefined;
}

/** MsgActivateNftId defines a Msg to create or update an nft id record */
export interface MsgActivateNftId {
  /** address of the user who is activating the nft id */
  address: string;
  /** type of the nft id */
  nftType: NftId;
  /** organization that the nft id belongs to */
  organization: string;
  /** utc timestamp of current time */
  timestamp: string;
}

/** MsgActivateNftIdResponse returns the id record */
export interface MsgActivateNftIdResponse {
  idRecord: IdRecord | undefined;
}

/** MsgDeactivateNftId defines a Msg to create or update an nft id record */
export interface MsgDeactivateNftId {
  /** address of the user who is deactivating the nft id */
  address: string;
  /** type of the nft id */
  nftType: NftId;
  /** organization that the nft id belongs to */
  organization: string;
}

/** MsgDeactivateNftIdResponse returns the id record */
export interface MsgDeactivateNftIdResponse {
  idRecord: IdRecord | undefined;
}

function createBaseMsgMintNftId(): MsgMintNftId {
  return { address: "", nftType: 0, organization: "", encryptionKey: "", metadataUrl: "" };
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
    };
  },

  toJSON(message: MsgMintNftId): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.nftType !== undefined && (obj.nftType = nftIdToJSON(message.nftType));
    message.organization !== undefined && (obj.organization = message.organization);
    message.encryptionKey !== undefined && (obj.encryptionKey = message.encryptionKey);
    message.metadataUrl !== undefined && (obj.metadataUrl = message.metadataUrl);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgMintNftId>, I>>(object: I): MsgMintNftId {
    const message = createBaseMsgMintNftId();
    message.address = object.address ?? "";
    message.nftType = object.nftType ?? 0;
    message.organization = object.organization ?? "";
    message.encryptionKey = object.encryptionKey ?? "";
    message.metadataUrl = object.metadataUrl ?? "";
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

function createBaseMsgCreateIdRecord(): MsgCreateIdRecord {
  return { address: "", nftType: 0, organization: "" };
}

export const MsgCreateIdRecord = {
  encode(message: MsgCreateIdRecord, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.nftType !== 0) {
      writer.uint32(16).int32(message.nftType);
    }
    if (message.organization !== "") {
      writer.uint32(26).string(message.organization);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateIdRecord {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateIdRecord();
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
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateIdRecord {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      nftType: isSet(object.nftType) ? nftIdFromJSON(object.nftType) : 0,
      organization: isSet(object.organization) ? String(object.organization) : "",
    };
  },

  toJSON(message: MsgCreateIdRecord): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.nftType !== undefined && (obj.nftType = nftIdToJSON(message.nftType));
    message.organization !== undefined && (obj.organization = message.organization);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCreateIdRecord>, I>>(object: I): MsgCreateIdRecord {
    const message = createBaseMsgCreateIdRecord();
    message.address = object.address ?? "";
    message.nftType = object.nftType ?? 0;
    message.organization = object.organization ?? "";
    return message;
  },
};

function createBaseMsgCreateIdRecordResponse(): MsgCreateIdRecordResponse {
  return { idRecord: undefined };
}

export const MsgCreateIdRecordResponse = {
  encode(message: MsgCreateIdRecordResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.idRecord !== undefined) {
      IdRecord.encode(message.idRecord, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateIdRecordResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateIdRecordResponse();
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

  fromJSON(object: any): MsgCreateIdRecordResponse {
    return { idRecord: isSet(object.idRecord) ? IdRecord.fromJSON(object.idRecord) : undefined };
  },

  toJSON(message: MsgCreateIdRecordResponse): unknown {
    const obj: any = {};
    message.idRecord !== undefined && (obj.idRecord = message.idRecord ? IdRecord.toJSON(message.idRecord) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCreateIdRecordResponse>, I>>(object: I): MsgCreateIdRecordResponse {
    const message = createBaseMsgCreateIdRecordResponse();
    message.idRecord = (object.idRecord !== undefined && object.idRecord !== null)
      ? IdRecord.fromPartial(object.idRecord)
      : undefined;
    return message;
  },
};

function createBaseMsgActivateNftId(): MsgActivateNftId {
  return { address: "", nftType: 0, organization: "", timestamp: "" };
}

export const MsgActivateNftId = {
  encode(message: MsgActivateNftId, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.nftType !== 0) {
      writer.uint32(16).int32(message.nftType);
    }
    if (message.organization !== "") {
      writer.uint32(26).string(message.organization);
    }
    if (message.timestamp !== "") {
      writer.uint32(34).string(message.timestamp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgActivateNftId {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgActivateNftId();
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
          message.timestamp = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgActivateNftId {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      nftType: isSet(object.nftType) ? nftIdFromJSON(object.nftType) : 0,
      organization: isSet(object.organization) ? String(object.organization) : "",
      timestamp: isSet(object.timestamp) ? String(object.timestamp) : "",
    };
  },

  toJSON(message: MsgActivateNftId): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.nftType !== undefined && (obj.nftType = nftIdToJSON(message.nftType));
    message.organization !== undefined && (obj.organization = message.organization);
    message.timestamp !== undefined && (obj.timestamp = message.timestamp);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgActivateNftId>, I>>(object: I): MsgActivateNftId {
    const message = createBaseMsgActivateNftId();
    message.address = object.address ?? "";
    message.nftType = object.nftType ?? 0;
    message.organization = object.organization ?? "";
    message.timestamp = object.timestamp ?? "";
    return message;
  },
};

function createBaseMsgActivateNftIdResponse(): MsgActivateNftIdResponse {
  return { idRecord: undefined };
}

export const MsgActivateNftIdResponse = {
  encode(message: MsgActivateNftIdResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.idRecord !== undefined) {
      IdRecord.encode(message.idRecord, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgActivateNftIdResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgActivateNftIdResponse();
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

  fromJSON(object: any): MsgActivateNftIdResponse {
    return { idRecord: isSet(object.idRecord) ? IdRecord.fromJSON(object.idRecord) : undefined };
  },

  toJSON(message: MsgActivateNftIdResponse): unknown {
    const obj: any = {};
    message.idRecord !== undefined && (obj.idRecord = message.idRecord ? IdRecord.toJSON(message.idRecord) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgActivateNftIdResponse>, I>>(object: I): MsgActivateNftIdResponse {
    const message = createBaseMsgActivateNftIdResponse();
    message.idRecord = (object.idRecord !== undefined && object.idRecord !== null)
      ? IdRecord.fromPartial(object.idRecord)
      : undefined;
    return message;
  },
};

function createBaseMsgDeactivateNftId(): MsgDeactivateNftId {
  return { address: "", nftType: 0, organization: "" };
}

export const MsgDeactivateNftId = {
  encode(message: MsgDeactivateNftId, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.nftType !== 0) {
      writer.uint32(16).int32(message.nftType);
    }
    if (message.organization !== "") {
      writer.uint32(26).string(message.organization);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeactivateNftId {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeactivateNftId();
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
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDeactivateNftId {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      nftType: isSet(object.nftType) ? nftIdFromJSON(object.nftType) : 0,
      organization: isSet(object.organization) ? String(object.organization) : "",
    };
  },

  toJSON(message: MsgDeactivateNftId): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.nftType !== undefined && (obj.nftType = nftIdToJSON(message.nftType));
    message.organization !== undefined && (obj.organization = message.organization);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgDeactivateNftId>, I>>(object: I): MsgDeactivateNftId {
    const message = createBaseMsgDeactivateNftId();
    message.address = object.address ?? "";
    message.nftType = object.nftType ?? 0;
    message.organization = object.organization ?? "";
    return message;
  },
};

function createBaseMsgDeactivateNftIdResponse(): MsgDeactivateNftIdResponse {
  return { idRecord: undefined };
}

export const MsgDeactivateNftIdResponse = {
  encode(message: MsgDeactivateNftIdResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.idRecord !== undefined) {
      IdRecord.encode(message.idRecord, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeactivateNftIdResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeactivateNftIdResponse();
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

  fromJSON(object: any): MsgDeactivateNftIdResponse {
    return { idRecord: isSet(object.idRecord) ? IdRecord.fromJSON(object.idRecord) : undefined };
  },

  toJSON(message: MsgDeactivateNftIdResponse): unknown {
    const obj: any = {};
    message.idRecord !== undefined && (obj.idRecord = message.idRecord ? IdRecord.toJSON(message.idRecord) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgDeactivateNftIdResponse>, I>>(object: I): MsgDeactivateNftIdResponse {
    const message = createBaseMsgDeactivateNftIdResponse();
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
  /** CreateIdRecord creates a ID Record on the blockchain. */
  CreateIdRecord(request: MsgCreateIdRecord): Promise<MsgCreateIdRecordResponse>;
  /** Activates a NFT ID by paying some kind of fee */
  ActivateNftId(request: MsgActivateNftId): Promise<MsgActivateNftIdResponse>;
  /** Deactivates a NFT ID in the case a payment type is reversible, such as locking tokens */
  DeactivateNftId(request: MsgDeactivateNftId): Promise<MsgDeactivateNftIdResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "rebus.nftid.v1.Msg";
    this.rpc = rpc;
    this.MintNftId = this.MintNftId.bind(this);
    this.CreateIdRecord = this.CreateIdRecord.bind(this);
    this.ActivateNftId = this.ActivateNftId.bind(this);
    this.DeactivateNftId = this.DeactivateNftId.bind(this);
  }
  MintNftId(request: MsgMintNftId): Promise<MsgMintNftIdResponse> {
    const data = MsgMintNftId.encode(request).finish();
    const promise = this.rpc.request(this.service, "MintNftId", data);
    return promise.then((data) => MsgMintNftIdResponse.decode(new _m0.Reader(data)));
  }

  CreateIdRecord(request: MsgCreateIdRecord): Promise<MsgCreateIdRecordResponse> {
    const data = MsgCreateIdRecord.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateIdRecord", data);
    return promise.then((data) => MsgCreateIdRecordResponse.decode(new _m0.Reader(data)));
  }

  ActivateNftId(request: MsgActivateNftId): Promise<MsgActivateNftIdResponse> {
    const data = MsgActivateNftId.encode(request).finish();
    const promise = this.rpc.request(this.service, "ActivateNftId", data);
    return promise.then((data) => MsgActivateNftIdResponse.decode(new _m0.Reader(data)));
  }

  DeactivateNftId(request: MsgDeactivateNftId): Promise<MsgDeactivateNftIdResponse> {
    const data = MsgDeactivateNftId.encode(request).finish();
    const promise = this.rpc.request(this.service, "DeactivateNftId", data);
    return promise.then((data) => MsgDeactivateNftIdResponse.decode(new _m0.Reader(data)));
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
