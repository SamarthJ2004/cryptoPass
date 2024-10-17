// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TicketMarketplace is ERC1155, ReentrancyGuard{
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
        uint256 price;
        address owner;
        bool used;
    }

    event Working(string message, address sender);
    event TicketListedForResale(uint256 tokenId, uint256 price, address seller);
    event TicketSold(uint256 tokenId, address buyer);

    mapping(string => uint256) public bandEventCounts;
    mapping(uint256 => EventDetails) public events;
    mapping(uint256 => uint256) public ticketOriginalPrice;
    mapping(string => address) public eventCreator;
    mapping(uint256 => address) public tokenOwner;
    mapping(uint256 => Resell) public resellListings;
    mapping(uint256 => bool) public isTicketUsed;
    mapping(address => uint256) public buyCount;

    uint256 public totalEvents;
    uint256 public marketplaceFeePercent = 2;
    uint256 public royaltyFeePercent = 5;

    constructor() ERC1155("ipfs://<CID>/{id}.json") {}

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
        events[totalEvents] = EventDetails(bandId, newEventId, ticketType, maxTickets, ticketPrice, 0, eventTimestamp);

        _mintBatch(msg.sender, _generateTokenIds(bandId, newEventId, ticketType, maxTickets), _generateAmounts(maxTickets), "");
        eventCreator[bandId] = msg.sender;

        for (uint256 i = 0; i < maxTickets; i++) {
            uint256 ids = _generateTokenId(bandId, newEventId, ticketType, i);
            ticketOriginalPrice[ids] = ticketPrice;
            tokenOwner[ids] = msg.sender;
            setApprovalForAll(address(this), true);
        }
        emit Working("New event created", msg.sender);
    }

    function buyTicket(uint256 tokenId) public payable nonReentrant {
        require(buyCount[msg.sender] <= 10, "Max buy count reached");
        uint256 ticketPrice = ticketOriginalPrice[tokenId];
        address seller = tokenOwner[tokenId];
        require(seller != msg.sender, "You already own this ticket");
        require(msg.value >= ticketPrice, "Insufficient funds to buy the ticket");
        require(isApprovedForAll(seller, address(this)), "Marketplace not approved to transfer this ticket");

        _safeTransferFrom(seller, msg.sender, tokenId, 1, "");
        payable(seller).transfer(msg.value);
        tokenOwner[tokenId] = msg.sender;
        buyCount[msg.sender]++;

        emit Working("Ticket bought", msg.sender);
    }

    function buyResellTicket(uint256 tokenId) public payable nonReentrant {
        Resell memory resellInfo = resellListings[tokenId];
        require(resellInfo.seller != address(0), "This ticket is not for resale");
        require(msg.value >= resellInfo.price, "Insufficient funds to buy the resell ticket");
        require(resellInfo.seller != msg.sender, "You cannot buy your own resell ticket");

        _safeTransferFrom(address(this), msg.sender, tokenId, 1, "");

        uint256 marketplaceFee = (msg.value * marketplaceFeePercent) / 100;
        uint256 royaltyFee = (msg.value * royaltyFeePercent) / 100;
        payable(resellInfo.seller).transfer(msg.value - marketplaceFee - royaltyFee);
        payable(eventCreator[events[tokenId].bandId]).transfer(royaltyFee);

        tokenOwner[tokenId] = msg.sender;
        buyCount[msg.sender]++;

        delete resellListings[tokenId];

        emit TicketSold(tokenId, msg.sender);
    }

    function resellTicket(uint256 tokenId, uint256 resalePrice) public nonReentrant {
        require(balanceOf(msg.sender, tokenId) > 0, "You do not own this ticket");
        require(!isTicketUsed[tokenId], "Used tickets cannot be resold");
        uint256 originalPrice = ticketOriginalPrice[tokenId];
        require(resalePrice <= (originalPrice + (originalPrice * 10 / 100)), "Max resale price exceeded");

        _safeTransferFrom(msg.sender, address(this), tokenId, 1, "");

        resellListings[tokenId] = Resell(tokenId, resalePrice, msg.sender);
        emit TicketListedForResale(tokenId, resalePrice, msg.sender);
    }

    function validateTicket(uint256 tokenId) public {
        require(msg.sender == eventCreator[events[tokenId].bandId], "Only event creator can validate");
        require(!isTicketUsed[tokenId], "Ticket already used");
        isTicketUsed[tokenId] = true;

        emit Working("Ticket validated", msg.sender);
    }

    function getTicketDetails(uint256 tokenId) public view returns (TicketDetails memory) {
        (string memory _bandId, uint256 _eventNumber, string memory _ticketType, uint256 _seatNumber) = _decodeTokenId(tokenId);

        TicketDetails memory details = TicketDetails({
            bandId: _bandId,
            eventNumber: _eventNumber,
            ticketType: _ticketType,
            seatNumber: _seatNumber,
            price: ticketOriginalPrice[tokenId],
            owner: tokenOwner[tokenId],
            used: isTicketUsed[tokenId]
        });

        return details;
    }


    function _decodeTokenId(uint256 tokenId) internal pure returns (
        string memory bandId,
        uint256 eventNumber,
        string memory ticketType,
        uint256 seatNumber
    ) {
        bytes32 tokenHash = bytes32(tokenId);
        bandId = string(abi.encodePacked(tokenHash[0], tokenHash[1], tokenHash[2]));
        eventNumber = uint256(uint8(tokenHash[3]));
        ticketType = string(abi.encodePacked(tokenHash[4]));
        seatNumber = uint256(uint16(uint8(tokenHash[5])));
    }

    function _generateTokenId(
        string memory bandId,
        uint256 eventId,
        string memory ticketType,
        uint256 seatNumber
    ) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(bandId, eventId, ticketType, seatNumber)));
    }

    function _generateTokenIds(
        string memory bandId,
        uint256 eventId,
        string memory ticketType,
        uint256 count
    ) internal pure returns (uint256[] memory) {
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