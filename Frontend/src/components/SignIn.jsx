"use client";
import { useAccount } from "wagmi";
import {useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-gray-300 px-8 py-0 pb-12 flex-1 flex flex-col items-center">
      <header className="w-full py-4 flex justify-between items-center">
        {/* <div className="flex items-center">
          <img src="/walletconnect.png" alt="logo" className="w-10 h-10 mr-2" />
          <div className="hidden sm:inline text-xl font-bold">Reown - AppKit + EVM</div>
        </div> */}
      </header>
      {/* <h2 className="my-8 text-2xl font-bold leading-snug text-center">Examples</h2> */}
      <div className="max-w-4xl">
        <div className="grid bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <h3 className="text-sm font-semibold bg-gray-100 p-2 text-center">Connect your wallet</h3>
          <div className="flex justify-center items-center p-4">
          <w3m-button />
          </div>
        </div> 
        <br></br>
        {isConnected && (
          <>
          <div className="grid bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <h3 className="text-sm font-semibold bg-gray-100 p-2 text-center">Network selection button</h3>
            <div className="flex justify-center items-center p-4">
              <w3m-network-button />
            </div>
          </div>
          <button className="mt-10 bg-black font-bold text-white px-5 py-2 rounded-xl" onClick={()=>navigate("/")}>Go To Home</button>
          </>
        )}
      </div>
    </main>
  );
}