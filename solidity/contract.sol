// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract TicketMarketplace is ERC1155, ReentrancyGuard, IERC1155Receiver {
    struct EventDetails {
        string bandId;
        uint256 eventNumber;
        string ticketType;
        uint256 maxTickets;
        uint256 ticketPrice;
        uint256 ticketsSold;
        uint256 eventTimestamp;
    }

    struct Resell {
        uint256 tokenId;
        uint256 price;
        address seller;
    }

    struct TicketDetails {
        string bandId;
        uint256 eventNumber;
        string ticketType;
        uint256 seatNumber;
        bool used;
    }

    event EventCreated(uint256 eventId, string bandId, uint256 eventNumber, uint256 maxTickets, uint256 ticketPrice);
    event TicketListedForResale(uint256 tokenId, uint256 price, address seller);
    event TicketSold(uint256 tokenId, address buyer);
    event TicketValidated(uint256 tokenId, address validator);
    event TicketPurchased(uint256 tokenId, address buyer, uint256 price);

    mapping(string => uint256) public bandEventCounts;
    mapping(uint256 => EventDetails) public events;
    mapping(uint256 => uint256) public ticketOriginalPrice;
    mapping(uint256 => Resell) public resellListings;
    mapping(uint256 => bool) public isTicketUsed;
    mapping(address => uint256) public buyCount;
    mapping(uint256 => TicketDetails) private ticketDetails;
    mapping(uint256 => address) private eventCreators;
    mapping(uint256 => address) public tokenOwner;

    uint256 public totalEvents;
    uint256 public marketplaceFeePercent = 2;
    address public immutable owner;
    constructor() ERC1155("ipfs://<CID>/{id}.json") {
        owner=msg.sender;
    }

    function createEvent(
        string memory bandId,
        string memory ticketType,
        uint256 maxTickets,
        uint256 ticketPrice,
        uint256 eventTimestamp
    ) public {
        totalEvents++;
        uint256 newEventId = bandEventCounts[bandId] + 1;
        bandEventCounts[bandId]++;
        events[totalEvents] = EventDetails(
            bandId, 
            newEventId, 
            ticketType, 
            maxTickets, 
            ticketPrice, 
            0, 
            eventTimestamp
        );
        eventCreators[totalEvents] = msg.sender;

        _mintBatch(msg.sender, _generateTokenIds(bandId, newEventId, ticketType, maxTickets), _generateAmounts(maxTickets), "");
        setApprovalForAll(address(this), true);

        for (uint256 i = 0; i < maxTickets; i++) {
            uint256 tokenId = _generateTokenId(bandId, newEventId, ticketType, i);
            ticketOriginalPrice[tokenId] = ticketPrice;
            tokenOwner[tokenId]=msg.sender;
        }

        emit EventCreated(totalEvents, bandId, newEventId, maxTickets, ticketPrice);
    }

    function buyTicket(uint256 tokenId) public payable nonReentrant {
        require(buyCount[msg.sender] < 10, "Max buy count reached");
        uint256 ticketPrice = ticketOriginalPrice[tokenId];
        address seller = tokenOwner[tokenId];
        require(seller != msg.sender, "You already own this ticket");
        require(msg.value == ticketPrice, "Incorrect Amount Sent");
        require(isApprovedForAll(seller, address(this)), "Marketplace not approved");

        _safeTransferFrom(seller, msg.sender, tokenId, 1, "");
        payable(seller).transfer(msg.value);
        tokenOwner[tokenId] = msg.sender;
        buyCount[msg.sender]++;
    }

    function resellTicket(uint256 tokenId, uint256 resalePrice) public nonReentrant {
        require(tokenOwner[tokenId] == msg.sender, "You do not own this ticket");
        require(!isTicketUsed[tokenId], "Used tickets cannot be resold");
        uint256 originalPrice = ticketOriginalPrice[tokenId];
        require(resalePrice <= (originalPrice + (originalPrice * 10 / 100)), "Max resale price exceeded");

        approveMarketplace();
        require(isApprovedForAll(msg.sender, address(this)), "Approve the contract first");
        _safeTransferFrom(msg.sender, address(this), tokenId, 1, "");
        resellListings[tokenId] = Resell(tokenId, resalePrice, msg.sender);
        tokenOwner[tokenId] = address(this);

        emit TicketListedForResale(tokenId, resalePrice, msg.sender);
    }

    function approveMarketplace() private {
        setApprovalForAll(address(this), true);
    }

    function buyResellTicket(uint256 tokenId) public payable nonReentrant {
        Resell memory resellInfo = resellListings[tokenId];
        require(resellInfo.seller != address(0), "Ticket not for resale");
        require(msg.value == resellInfo.price, "Incorrect amount sent");
        require(resellInfo.seller != msg.sender, "Cannot buy your own ticket");

        _safeTransferFrom(address(this), msg.sender, tokenId, 1, "");

        uint256 marketplaceFee = (msg.value * marketplaceFeePercent) / 100;
        payable(resellInfo.seller).transfer(msg.value - marketplaceFee);
        payable(owner).transfer(marketplaceFee);

        buyCount[msg.sender]++;
        tokenOwner[tokenId] = msg.sender;
        delete resellListings[tokenId];

        emit TicketSold(tokenId, msg.sender);
    }

    function validateTicket(uint256 tokenId) public {
        require(msg.sender == eventCreators[events[tokenId].eventNumber], "Only event creator can validate");
        require(!isTicketUsed[tokenId], "Ticket already used");
        isTicketUsed[tokenId] = true;

        emit TicketValidated(tokenId, msg.sender);
    }

    function getTicketDetails(uint256 tokenId) public view returns (TicketDetails memory) {
        TicketDetails memory details = ticketDetails[tokenId];
        details.used = isTicketUsed[tokenId];
        return details;
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes memory data
    ) public override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) public override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function _generateTokenId(string memory bandId, uint256 eventId, string memory ticketType, uint256 seatNumber) internal returns (uint256) {
        uint256 tokenId = uint256(keccak256(abi.encodePacked(bandId, eventId, ticketType, seatNumber, block.timestamp)));

        ticketDetails[tokenId] = TicketDetails({
            bandId: bandId,
            eventNumber: eventId,
            ticketType: ticketType,
            seatNumber: seatNumber,
            used: false
        });

        return tokenId;
    }

    function _generateTokenIds(string memory bandId, uint256 eventId, string memory ticketType, uint256 count) internal returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            ids[i] = _generateTokenId(bandId, eventId, ticketType, i);
        }
        return ids;
    }

    function _generateAmounts(uint256 count) internal pure returns (uint256[] memory) {
        uint256[] memory amounts = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            amounts[i] = 1;
        }
        return amounts;
    }
}