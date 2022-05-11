import { ETH } from '@hanchon/ethermint-address-converter'
import {
    decode,
    encode,
    fromWords,
    toWords,
  } from 'bech32';

  
  function makeBech32Encoder(prefix: string) {
    return (data: Buffer) => encode(prefix, toWords(data));
  }
  
  function makeBech32Decoder(currentPrefix: string) {
    return (data: string) => {
      const { prefix, words } = decode(data);
      if (prefix !== currentPrefix) {
        throw Error('Unrecognised address format');
      }
      return Buffer.from(fromWords(words));
    };
  }
  
  
  const bech32Chain = (name: string, prefix: string) => ({
    decoder: makeBech32Decoder(prefix),
    encoder: makeBech32Encoder(prefix),
    name,
  });
  
  
  export const REBUS = bech32Chain('REBUS', 'rebus');
  
  export const ethToRebus = (ethAddress:string) => {
    let data = ETH.decoder(ethAddress);
    return REBUS.encoder(data);
  }
  
  export const rebusToEth = (evmosAddress: string) => {
    let data = REBUS.decoder(evmosAddress);
    return ETH.encoder(data);
  };