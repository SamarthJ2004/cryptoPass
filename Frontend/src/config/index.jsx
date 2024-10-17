import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { cookieStorage, createStorage } from "wagmi";
import { mainnet, arbitrum,  polygonAmoy } from '@reown/appkit/networks'

const projectId = "cb3aec7b3ca028313612ea423d52a498";

const networks = [mainnet, arbitrum,  polygonAmoy]
console.log(projectId);
console.log(process.env.REACT_APP_PROJECT_ID);


if (!projectId) throw new Error("Project ID is not defined");

// Set up the Wagmi Adapter (config)
const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  networks,
  projectId
})

export {projectId, networks, wagmiAdapter}