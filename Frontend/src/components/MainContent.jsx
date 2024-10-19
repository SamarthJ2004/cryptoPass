import { useState, useEffect } from 'react';
import '../styles/MainContent.css';
import { useNavigate } from 'react-router-dom';
import { ethers } from "ethers";
import { contract } from '../config';
import cryptoPass from "../new.json";
import getPrice from '../logic.js';

const MainContent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(null);
  const [price, setPrice] = useState(null);
  const [isOriginalPrice, setIsOriginalPrice] = useState(true);
  const [owners, setOwners] = useState(null);
  const [creators, setCreators] = useState({});

  const getCreateEvents = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const CryptoPassContract = new ethers.Contract(
          contract, cryptoPass, signer
        );
        console.log("Getting Events");
        const events = await CryptoPassContract.queryFilter("EventCreated");
        setEvents(events);

        const creatorPromises = events.map(async (event) => {
          const creator = await CryptoPassContract.getEventCreator(event.args.eventId);
          return { id: event.args.eventId, creator };
        });

        const creatorResults = await Promise.all(creatorPromises);
        const creatorMap = creatorResults.reduce((acc, { id, creator }) => {
          acc[id.toString()] = creator;
          return acc;
        }, {});

        setCreators(creatorMap);

        const ownerPromises = events.flatMap(event =>
          event.args.tokenIds.map(async (id) => {
            const owner = await CryptoPassContract.getTokenOwner(id);
            return { id, owner };
          })
        );

        const ownerResults = await Promise.all(ownerPromises);
        const ownerMap = ownerResults.reduce((acc, { id, owner }) => {
          acc[id.toString()] = owner;
          return acc;
        }, {});

        setOwners(ownerMap);
      } else {
        console.log("Ethereum object not found");
      }
    } catch (error) {
      console.log("Error: ", error);
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

  const renderEvents = ({ eventId, bandId, eventNumber, maxTickets, ticketPrice, tokenIds }) => {
    return (
      <div className="event-details" key={eventId}>
        <ul>
          <li><strong>Event ID:</strong> {eventId.toString()}</li>
          <li><strong>Band ID:</strong> {bandId}</li>
          <li><strong>Event Number:</strong> {eventNumber.toString()}</li>
          <li><strong>Event Creator: </strong>{creators[eventId.toString()]?.toString() || "Loading..."}</li>
          <li><strong>Max Tickets:</strong> {maxTickets.toString()}</li>
          <li><strong>Ticket Price:</strong> {isOriginalPrice ? ticketPrice.toString() : (ticketPrice.toString() / price).toFixed(8)} {isOriginalPrice ? "dollars" : "ETH"} <button className="styled-button" onClick={() => setIsOriginalPrice(!isOriginalPrice)}>Get Exc</button></li>
          <li><strong>Token IDs and Owner:</strong>
            {tokenIds.map(id => (
              <span key={id}>
                {id.toString().slice(0, 8) + '... '} --&#x3E; {owners && owners[id.toString()].toString().slice(0,8)+'....' || "Loading..."} <br />
              </span>
            ))}
          </li>
        </ul>
        <button className='styled-button' onClick={() => navigate("/event-detail")}>Buy Ticket</button>
      </div>
    )
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