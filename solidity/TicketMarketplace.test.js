const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicketMarketplace", function () {
    let TicketMarketplace;
    let ticketMarketplace;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        TicketMarketplace = await ethers.getContractFactory("TicketMarketplace");
        ticketMarketplace = await TicketMarketplace.deploy();
        [owner, addr1, addr2] = await ethers.getSigners();
    });

    it("should create an event and mint tickets", async function () {
        const bandId = "BAND123";
        const ticketType = "VIP";
        const maxTickets = 10;
        const ticketPrice = ethers.utils.parseEther("0.1");
        const eventTimestamp = Math.floor(Date.now() / 1000) + 10000;

        await ticketMarketplace.createEvent(bandId, ticketType, maxTickets, ticketPrice, eventTimestamp);

        const eventDetails = await ticketMarketplace.events(1);
        expect(eventDetails.bandId).to.equal(bandId);
        expect(eventDetails.ticketType).to.equal(ticketType);
        expect(eventDetails.maxTickets).to.equal(maxTickets);
        expect(eventDetails.ticketPrice).to.equal(ticketPrice);
    });

    it("should allow users to buy tickets", async function () {
        const bandId = "BAND123";
        const ticketType = "VIP";
        const maxTickets = 10;
        const ticketPrice = ethers.utils.parseEther("0.1");
        const eventTimestamp = Math.floor(Date.now() / 1000) + 10000;

        await ticketMarketplace.createEvent(bandId, ticketType, maxTickets, ticketPrice, eventTimestamp);
        
        await ticketMarketplace.connect(addr1).buyTicket(1, { value: ticketPrice });

        const tokenOwner = await ticketMarketplace.tokenOwner(1);
        expect(tokenOwner).to.equal(addr1.address);
        expect(await ticketMarketplace.buyCount(addr1.address)).to.equal(1);
    });

    it("should allow users to resell tickets", async function () {
        const bandId = "BAND123";
        const ticketType = "VIP";
        const maxTickets = 10;
        const ticketPrice = ethers.utils.parseEther("0.1");
        const eventTimestamp = Math.floor(Date.now() / 1000) + 10000;

        await ticketMarketplace.createEvent(bandId, ticketType, maxTickets, ticketPrice, eventTimestamp);
        
        await ticketMarketplace.connect(addr1).buyTicket(1, { value: ticketPrice });

        const resalePrice = ethers.utils.parseEther("0.12");
        await ticketMarketplace.connect(addr1).resellTicket(1, resalePrice);

        const resellInfo = await ticketMarketplace.resellListings(1);
        expect(resellInfo.price).to.equal(resalePrice);
        expect(resellInfo.seller).to.equal(addr1.address);
    });

    it("should allow users to buy resold tickets", async function () {
        const bandId = "BAND123";
        const ticketType = "VIP";
        const maxTickets = 10;
        const ticketPrice = ethers.utils.parseEther("0.1");
        const eventTimestamp = Math.floor(Date.now() / 1000) + 10000;

        await ticketMarketplace.createEvent(bandId, ticketType, maxTickets, ticketPrice, eventTimestamp);
        
        await ticketMarketplace.connect(addr1).buyTicket(1, { value: ticketPrice });

        const resalePrice = ethers.utils.parseEther("0.12");
        await ticketMarketplace.connect(addr1).resellTicket(1, resalePrice);

        await ticketMarketplace.connect(addr2).buyResellTicket(1, { value: resalePrice });

        const newOwner = await ticketMarketplace.tokenOwner(1);
        expect(newOwner).to.equal(addr2.address);
        expect(await ticketMarketplace.buyCount(addr2.address)).to.equal(1);
    });

    it("should allow event creators to validate tickets", async function () {
        const bandId = "BAND123";
        const ticketType = "VIP";
        const maxTickets = 10;
        const ticketPrice = ethers.utils.parseEther("0.1");
        const eventTimestamp = Math.floor(Date.now() / 1000) + 10000;

        await ticketMarketplace.createEvent(bandId, ticketType, maxTickets, ticketPrice, eventTimestamp);
        
        await ticketMarketplace.connect(addr1).buyTicket(1, { value: ticketPrice });
        await ticketMarketplace.validateTicket(1);

        const ticketDetails = await ticketMarketplace.getTicketDetails(1);
        expect(ticketDetails.used).to.equal(true);
    });
});