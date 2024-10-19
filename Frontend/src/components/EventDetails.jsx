import '../styles/EventDetails.css';
import Navbar from './Navbar';
import {ethers} from "ethers";
import cryptoPass from "../new.json";
import { contract } from '../config';

const EventDetailsPage = () => {

  const buyTicket=async()=>{
    try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const CryptoPassContract = new ethers.Contract(
            contract,
            cryptoPass,
            signer
          );

          const eventDate = new Date(dateTime).getTime() / 1000;

          const tx = await CryptoPassContract.createEvent(
            artistName.substring(0, 3).toUpperCase(),
            "R",
            ticketsAvailable,
            ticketPrice,
            eventDate
          );

          console.log("Transaction sent, waiting for confirmation...");
          const receipt = await tx.wait();

          console.log("Transaction confirmed!");

          setTimeout(async () => {
            await getCreateEvents(CryptoPassContract);
          }, 5000);
        } else {
          console.log("Ethereum object doesn't exist");
        }
      } catch (error) {
        console.error("Error:", error);
      }
  }

  const nft = {
    title: "Sur with Sunidhi",
    creator: "EDMinUrCity",
    owner: "CryptoEnthusiast",
    description: "A journey through the cosmos, capturing the essence of interstellar exploration in vibrant digital art.",
    price: "2.5 ETH",
    highestBid: "2.7 ETH",
    image: "/api/placeholder/600/400"
  };

  const relatedNFTs = [
    { id: 1, title: "Nebula Dreams", price: "1.8 ETH", image: "/api/placeholder/200/200" },
    { id: 2, title: "Quantum Leap", price: "3.2 ETH", image: "/api/placeholder/200/200" },
    { id: 3, title: "Digital Genesis", price: "2.0 ETH", image: "/api/placeholder/200/200" },
  ];

  return (
    <>
    <Navbar/>
    <div className="nft-details-page">
      <div className="header">
        <h1>{nft.title}</h1>
      </div>
      <div className="content">
        <div className="main-content">
          <div className="nft-image">
            <img src={nft.image} alt={nft.title} />
          </div>
          <div className="nft-info">
            <p className="creator">Created by <span>{nft.creator}</span></p>
            <p className="owner">Owned by <span>{nft.owner}</span></p>
            <p className="description">{nft.description}</p>
            <div className="price-section">
              <div className="current-price">
                <span className="label">Current Price</span>
                <span className="value" style={{color:'#ba20a6'}}>{nft.price}</span>
              </div>
              <div className="highest-bid">
                <span className="label" >Highest Bid</span>
                <span className="value" style={{color:'#ba20a6'}}>{nft.highestBid}</span>
              </div>
            </div>
            <button className="buy-button" onClick={buyTicket}>Buy Now</button>
            <button className="bid-button">Place Bid</button>
            
          </div>
        </div>
        <div className="related-nfts">
          <h2>Related NFTs</h2>
          <div className="related-nfts-grid">
            {relatedNFTs.map((relatedNFT) => (
              <div key={relatedNFT.id} className="related-nft-card">
                <img src={relatedNFT.image} alt={relatedNFT.title} />
                <h3>{relatedNFT.title}</h3>
                <p>{relatedNFT.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
    </>
  );
};

export default EventDetailsPage;