'use client';

import { wagmiAdapter, projectId, networks } from '../config/index';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { cookieToInitialState, WagmiProvider } from 'wagmi';

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Set up metadata (optional)
const metadata = {
  name: "appkit-example",
  description: "AppKit Example - EVM",
  url: "https://exampleapp.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"]
};

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: networks,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: true, // default to true
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
    emailShowWallets: true, // default to true
  },
  themeMode: 'light'
});

function ContextProvider({ children, cookies }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
