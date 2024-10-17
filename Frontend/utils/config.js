import { PinataSDK } from "pinata-web3";

const usePinata = () => {
  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_GATEWAY_URL
  });

  return pinata;
};

export default usePinata;
