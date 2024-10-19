import { useState,useEffect } from 'react';
import '../styles/MainContent.css';
import {useNavigate} from 'react-router-dom';
import {ethers} from "ethers";
import { contract } from '../config';
import cryptoPass from "../TicketMarketplace.json";
import getPrice from '../logic.js';

const MainContent = () => {
  const navigate=useNavigate();
  const [events,setEvents]=useState(null);
  const [price,setPrice]=useState(null);
  const [isOriginalPrice, setIsOriginalPrice] = useState(true);

  const getCreateEvents = async()=>{
    try {
      const {ethereum} =window;
      if (ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer= provider.getSigner();
        const CryptoPassContract = new ethers.Contract(
          contract,cryptoPass.abi,signer
        );
        console.log("Getting Events");
        const events = await CryptoPassContract.queryFilter("EventCreated");
        setEvents(events);
      }else{
        console.log("Ethereum object not found");
      }
    } catch (error) {
      console.log("Error: ",error);
    }
  }

  useEffect(() => {
    console.log("Getting events: ");
    getCreateEvents();
  }, []);

  useEffect(() => {
      const fetchPrice = async () => {
        const currentPrice = await getPrice();
        setPrice(currentPrice);
      };

      fetchPrice();

      const interval = setInterval(fetchPrice, 5000);

      return () => clearInterval(interval);
    }, []);

  const renderEvents=({eventId,bandId,eventNumber,maxTickets,ticketPrice,tokenIds})=>{
    return(
      <div className="event-details" key={eventId}>
          <ul>
            <li><strong>Event ID:</strong> {eventId.toString()}</li>
            <li><strong>Band ID:</strong> {bandId}</li>
            <li><strong>Event Number:</strong> {eventNumber.toString()}</li>
            <li><strong>Max Tickets:</strong> {maxTickets.toString()}</li>
            <li><strong>Ticket Price:</strong> {isOriginalPrice?ticketPrice.toString():(ticketPrice.toString()/price).toFixed(8)}{isOriginalPrice?" dollars":" ETH"} <button className="styled-button" onClick={()=>setIsOriginalPrice(!isOriginalPrice)}>Get Exc</button></li>
            <li><strong>Token IDs:</strong> {tokenIds.map(id => id.toString()).join('\n ')}</li>
          </ul>
          <button className='styled-button' onClick={()=>buyTicket(tokenIds,ticketPrice)}>Buy Ticket</button>
      </div>
    )
  }

  const buyTicket=async(tokenIds)=>{
    
  }

  return (
    <>

    <div className="converter-container" style={{ padding: "20px", textAlign: "center" }}>
      <h1>ETH to USD Converter</h1>
      <div>
        <h2>ETH/USD Price: {price ? `$${price}` : "Loading..."}</h2>
      </div>
    </div>
    
    {events && events.map((eve) => renderEvents(eve.args))}
    </>
  );
}

export default MainContent;