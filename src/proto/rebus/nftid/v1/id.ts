/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "rebus.nftid.v1";

export enum NftId {
  None = 0,
  Default = 1,
  UNRECOGNIZED = -1,
}

export function nftIdFromJSON(object: any): NftId {
  switch (object) {
    case 0:
    case "None":
      return NftId.None;
    case 1:
    case "Default":
      return NftId.Default;
    case -1:
    case "UNRECOGNIZED":
    default:
      return NftId.UNRECOGNIZED;
  }
}

export function nftIdToJSON(object: NftId): string {
  switch (object) {
    case NftId.None:
      return "None";
    case NftId.Default:
      return "Default";
    case NftId.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** A Id Records is the metadata of id data per type_organization_address */
export interface IdRecord {
  /** address of user */
  address: string;
  /** refers to the type enum */
  type: number;
  /** name of the organization responsible for the ID */
  organization: string;
  /** encryption key used to encrypt the private file image of the ID */
  encryptionKey: string;
  /** metadata url of file containing the information about the ID */
  metadataUrl: string;
  /** document number which is the sequence number of this id */
  documentNumber: number;
  /** id number which is the hash of the key type_organization_address */
  idNumber: string;
}

function createBaseIdRecord(): IdRecord {
  return {
    address: "",
    type: 0,
    organization: "",
    encryptionKey: "",
    metadataUrl: "",
    documentNumber: 0,
    idNumber: "",
  };
}

export const IdRecord = {
  encode(message: IdRecord, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
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
    if (message.documentNumber !== 0) {
      writer.uint32(48).int64(message.documentNumber);
    }
    if (message.idNumber !== "") {
      writer.uint32(58).string(message.idNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IdRecord {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIdRecord();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.type = reader.int32();
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
          message.documentNumber = longToNumber(reader.int64() as Long);
          break;
        case 7:
          message.idNumber = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IdRecord {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      type: isSet(object.type) ? Number(object.type) : 0,
      organization: isSet(object.organization) ? String(object.organization) : "",
      encryptionKey: isSet(object.encryptionKey) ? String(object.encryptionKey) : "",
      metadataUrl: isSet(object.metadataUrl) ? String(object.metadataUrl) : "",
      documentNumber: isSet(object.documentNumber) ? Number(object.documentNumber) : 0,
      idNumber: isSet(object.idNumber) ? String(object.idNumber) : "",
    };
  },

  toJSON(message: IdRecord): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.type !== undefined && (obj.type = Math.round(message.type));
    message.organization !== undefined && (obj.organization = message.organization);
    message.encryptionKey !== undefined && (obj.encryptionKey = message.encryptionKey);
    message.metadataUrl !== undefined && (obj.metadataUrl = message.metadataUrl);
    message.documentNumber !== undefined && (obj.documentNumber = Math.round(message.documentNumber));
    message.idNumber !== undefined && (obj.idNumber = message.idNumber);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IdRecord>, I>>(object: I): IdRecord {
    const message = createBaseIdRecord();
    message.address = object.address ?? "";
    message.type = object.type ?? 0;
    message.organization = object.organization ?? "";
    message.encryptionKey = object.encryptionKey ?? "";
    message.metadataUrl = object.metadataUrl ?? "";
    message.documentNumber = object.documentNumber ?? 0;
    message.idNumber = object.idNumber ?? "";
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
