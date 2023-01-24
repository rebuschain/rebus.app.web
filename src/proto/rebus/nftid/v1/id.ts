/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/v1beta1/coin";

export const protobufPackage = "rebus.nftid.v1";

export enum NftId {
  None = 0,
  v1 = 1,
  UNRECOGNIZED = -1,
}

export function nftIdFromJSON(object: any): NftId {
  switch (object) {
    case 0:
    case "None":
      return NftId.None;
    case 1:
    case "v1":
      return NftId.v1;
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
    case NftId.v1:
      return "v1";
    case NftId.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum PaymentType {
  Invalid = 0,
  Lifetime = 1,
  Lock = 2,
  UNRECOGNIZED = -1,
}

export function paymentTypeFromJSON(object: any): PaymentType {
  switch (object) {
    case 0:
    case "Invalid":
      return PaymentType.Invalid;
    case 1:
    case "Lifetime":
      return PaymentType.Lifetime;
    case 2:
    case "Lock":
      return PaymentType.Lock;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PaymentType.UNRECOGNIZED;
  }
}

export function paymentTypeToJSON(object: PaymentType): string {
  switch (object) {
    case PaymentType.Invalid:
      return "Invalid";
    case PaymentType.Lifetime:
      return "Lifetime";
    case PaymentType.Lock:
      return "Lock";
    case PaymentType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Payment {
  amount: Coin | undefined;
  timestamp: number;
  lockedAtAddress: string;
  canRefund: boolean;
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
  /** payment_Type is the form of payment needed to activate this id */
  paymentType: PaymentType;
  /** payments is the record of payments made for this id by this user */
  payments: Payment[];
  /** active status of the nft id, this turns to true when the payment is made */
  active: boolean;
}

function createBasePayment(): Payment {
  return { amount: undefined, timestamp: 0, lockedAtAddress: "", canRefund: false };
}

export const Payment = {
  encode(message: Payment, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(10).fork()).ldelim();
    }
    if (message.timestamp !== 0) {
      writer.uint32(16).int64(message.timestamp);
    }
    if (message.lockedAtAddress !== "") {
      writer.uint32(26).string(message.lockedAtAddress);
    }
    if (message.canRefund === true) {
      writer.uint32(32).bool(message.canRefund);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Payment {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePayment();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = Coin.decode(reader, reader.uint32());
          break;
        case 2:
          message.timestamp = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.lockedAtAddress = reader.string();
          break;
        case 4:
          message.canRefund = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Payment {
    return {
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      timestamp: isSet(object.timestamp) ? Number(object.timestamp) : 0,
      lockedAtAddress: isSet(object.lockedAtAddress) ? String(object.lockedAtAddress) : "",
      canRefund: isSet(object.canRefund) ? Boolean(object.canRefund) : false,
    };
  },

  toJSON(message: Payment): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
    message.timestamp !== undefined && (obj.timestamp = Math.round(message.timestamp));
    message.lockedAtAddress !== undefined && (obj.lockedAtAddress = message.lockedAtAddress);
    message.canRefund !== undefined && (obj.canRefund = message.canRefund);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Payment>, I>>(object: I): Payment {
    const message = createBasePayment();
    message.amount = (object.amount !== undefined && object.amount !== null)
      ? Coin.fromPartial(object.amount)
      : undefined;
    message.timestamp = object.timestamp ?? 0;
    message.lockedAtAddress = object.lockedAtAddress ?? "";
    message.canRefund = object.canRefund ?? false;
    return message;
  },
};

function createBaseIdRecord(): IdRecord {
  return {
    address: "",
    type: 0,
    organization: "",
    encryptionKey: "",
    metadataUrl: "",
    documentNumber: 0,
    idNumber: "",
    paymentType: 0,
    payments: [],
    active: false,
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
    if (message.paymentType !== 0) {
      writer.uint32(64).int32(message.paymentType);
    }
    for (const v of message.payments) {
      Payment.encode(v!, writer.uint32(74).fork()).ldelim();
    }
    if (message.active === true) {
      writer.uint32(80).bool(message.active);
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
        case 8:
          message.paymentType = reader.int32() as any;
          break;
        case 9:
          message.payments.push(Payment.decode(reader, reader.uint32()));
          break;
        case 10:
          message.active = reader.bool();
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
      paymentType: isSet(object.paymentType) ? paymentTypeFromJSON(object.paymentType) : 0,
      payments: Array.isArray(object?.payments) ? object.payments.map((e: any) => Payment.fromJSON(e)) : [],
      active: isSet(object.active) ? Boolean(object.active) : false,
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
    message.paymentType !== undefined && (obj.paymentType = paymentTypeToJSON(message.paymentType));
    if (message.payments) {
      obj.payments = message.payments.map((e) => e ? Payment.toJSON(e) : undefined);
    } else {
      obj.payments = [];
    }
    message.active !== undefined && (obj.active = message.active);
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
    message.paymentType = object.paymentType ?? 0;
    message.payments = object.payments?.map((e) => Payment.fromPartial(e)) || [];
    message.active = object.active ?? false;
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
