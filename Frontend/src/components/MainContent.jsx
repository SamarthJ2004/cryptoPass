import Card from './Card.jsx';
import { useState,useEffect } from 'react';
import kanikaKapoor from '../images/KanikaKapoor.jpg';
import shreyaGhosal from '../images/shreyaGhosal.jpg';
import badshah from '../images/badshah.jpg';
import sanam from '../images/Sanam.webp';
import arijitSingh from '../images/arijitSingh.jpeg';
import darshanRaval from '../images/darshanRaval.jpeg';
import jonitaGandhi from '../images/jonitaGandhi.jpeg';
import mohitChauhan from '../images/mohitChauhan.jpeg';
import monaliThakur from '../images/monaliThakur.jpg';
import '../styles/MainContent.css';
import {useNavigate} from 'react-router-dom';
import {ethers} from "ethers";
import { contract } from '../config';
import cryptoPass from "../TicketMarketplace.json";

const MainContent = () => {
  const navigate=useNavigate();
  const [events,setEvents]=useState(null);

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

  useEffect(()=>{
    console.log("Getting events: ");
    getCreateEvents();
  },[]);

  const renderEvents=({eventId,bandId,eventNumber,maxTickets,ticketPrice,tokenIds})=>{
    return(
      <div className="event-details" key={eventId}>
          <ul>
            <li><strong>Event ID:</strong> {eventId.toString()}</li>
            <li><strong>Band ID:</strong> {bandId}</li>
            <li><strong>Event Number:</strong> {eventNumber.toString()}</li>
            <li><strong>Max Tickets:</strong> {maxTickets.toString()}</li>
            <li><strong>Ticket Price:</strong> {ticketPrice.toString()}</li>
            <li><strong>Token IDs:</strong> {tokenIds.map(id => id.toString()).join(', ')}</li>
          </ul>
      </div>
    )
  }

  return (
    <>
    <div className="main-content">
      <Card 
        className="cards"
        title="Concert Event"
        image={kanikaKapoor}
        description="Join us for an unforgettable night of live music!"
        buttonText="Buy Ticket"
        onButtonClick={() => navigate("/event-detail")}
      />
      <Card 
        className="cards"
        title="Concert Event"
        image={badshah}
        description="Join us for an unforgettable night of live music!"
        buttonText="Buy Ticket"
        onButtonClick={() => navigate("/event-detail")}
      />
      <Card 
        className="cards"
        title="Concert Event"
        image={shreyaGhosal}
        description="Join us for an unforgettable night of live music!"
        buttonText="Buy Ticket"
        onButtonClick={() => navigate("/event-detail")}
      />
      <Card 
        className="cards"
        title="Concert Event"
        image={sanam}
        description="Join us for an unforgettable night of live music!"
        buttonText="Buy Ticket"
        onButtonClick={() => navigate("/event-detail")}
      />
      <Card 
        className="cards"
        title="Concert Event"
        image={arijitSingh}
        description="Join us for an unforgettable night of live music!"
        buttonText="Buy Ticket"
        onButtonClick={() => navigate("/event-detail")}
      />
      <Card 
        className="cards"
        title="Concert Event"
        image={darshanRaval}
        description="Join us for an unforgettable night of live music!"
        buttonText="Buy Ticket"
        onButtonClick={() => navigate("/event-detail")}
      />
      <Card 
        className="cards"
        title="Concert Event"
        image={mohitChauhan}
        description="Join us for an unforgettable night of live music!"
        buttonText="Buy Ticket"
        onButtonClick={() => navigate("/event-detail")}
      />
      <Card 
        className="cards"
        title="Concert Event"
        image={jonitaGandhi}
        description="Join us for an unforgettable night of live music!"
        buttonText="Buy Ticket"
        onButtonClick={() => navigate("/event-detail")}
      />
      <Card 
        className="cards"
        title="Concert Event"
        image={monaliThakur}
        description="Join us for an unforgettable night of live music!"
        buttonText="Buy Ticket"
        onButtonClick={() => navigate("/event-detail")}
      />
    </div>
    
    {events && events.map((eve) => renderEvents(eve.args))}
    </>
  );
}

export default MainContent;