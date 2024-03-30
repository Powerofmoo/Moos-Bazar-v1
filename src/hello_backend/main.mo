import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import Buffer "mo:base/Buffer";

import TrieMap "mo:base/TrieMap";

actor {

    public func greet(name : Text) : async Text {
        return "Hello, " # name # "!";
    };

    type Account = {
        orange: Nat;
        green: Nat;
    };
    
    type OfferNumber = Nat;
    type Status = {#Open; #Closed; #Pending;}; // Define your statuses here
    type Offer = {
        number: OfferNumber;
        status : Status;
        offeredBy: Principal;
        acquiredBy: ?Principal;

        url: ?Text;
        description: Text;
        orangePrice: Nat;
        greenPrice: Nat;
        isFinal: Bool;
        isTransferable: Bool;
    };

    let MoosManager: Principal = Principal.fromText("xjrsd-n3wpz-iglf4-6ymqe-oj7k7-3ydid-77zbf-izlan-65mqd-trogz-nqe");
   
    var offerId : OfferNumber = 1;
    var accounts = TrieMap.TrieMap<Principal, Account>(Principal.equal, Principal.hash);
    var offers = TrieMap.TrieMap<OfferNumber, Offer>(Nat.equal, Hash.hash);

    private func transfer(from: Principal, to: Principal, orange: Nat, green: Nat) :  (Bool)
    {
        let fromValues = switch (accounts.get(from)) {
            case (null) { return false; };
            case (?values) { values };
        };

        if (fromValues.orange < orange or fromValues.green < green) {
            return false;
        };

        let toValues = switch (accounts.get(to)) {
            case (null) { {orange=0; green=0}; };
            case (?values) { values };
        };

        accounts.put(from, {orange=fromValues.orange - orange; green=fromValues.green - green});
        accounts.put(to, {orange=toValues.orange + orange; green=toValues.green + green});

        return true;
    }; 


    public shared (msg) func myId(): async (Principal)
    {
        return msg.caller;
    };

///////////////////////////////////////////////////////
//
// Offers
//
///////////////////////////////////////////////////////

    public shared (msg) func announceOffer( url: ?Text, description: Text, orangePrice: Nat, greenPrice: Nat) : async (?Nat) {
        let offer : Offer = {
            number = offerId; 
            status = #Open;
            offeredBy = msg.caller;
            acquiredBy = null;

            url = url;
            description = description;
            orangePrice = orangePrice;
            greenPrice = greenPrice;
            isFinal = true;
            isTransferable = false;
        };
        offers.put(offer.number, offer);
        offerId := offerId + 1;

        return ?offer.number;
    };

    public shared (msg) func acquireOffer(  offerNumber : OfferNumber) : async (Bool) {
        let offer = switch (offers.get(offerNumber)) {
            case (null) { return false; };
            case (?values) { values };
        };

        if (offer.status == #Open) {
            if (transfer(msg.caller, offer.offeredBy, offer.orangePrice, offer.greenPrice)) {
                var offer_update : Offer = {
                    number = offer.number;
                    status =  #Closed;
                    offeredBy = offer.offeredBy;
                    acquiredBy = ?msg.caller;

                    url = offer.url;
                    description = offer.description;
                    orangePrice = offer.orangePrice;
                    greenPrice = offer.greenPrice;
                    isFinal = offer.isFinal;
                    isTransferable=  offer.isTransferable;
                };

                offers.put(offerNumber, offer_update);
                return true;
            };
        };

        return false; 
    
    };

    public func getOpenOffers() : async [Offer] {
        let allOffers = offers.entries();
        let openOffers = Buffer.Buffer<Offer>(0);
        for ((_, offer) in allOffers) {
            switch (offer.status) {
                case (#Open) {
                    openOffers.add(offer);
                };
                case _ {};
            };
        };
        return Buffer.toArray(openOffers);
    };

    public shared (msg) func getMyOffers() : async [Offer] {
        let allOffers = offers.entries();
        let openOffers = Buffer.Buffer<Offer>(0);
        for ((_, offer) in allOffers) {
           switch (offer.acquiredBy) {
                case (?acquire) {
                    if (acquire == msg.caller) {
                        openOffers.add(offer);
                    }
                };
                case null {};
            };
        };
        return Buffer.toArray(openOffers);
    };

///////////////////////////////////////////////////////
//
// Coins
//
///////////////////////////////////////////////////////
    
    public func create_account(principal: Principal) : async () {
        if (null == accounts.get(principal)) {
            let account_new : Account = {
                orange = 0;
                green =  0;
            };
            accounts.put(principal, account_new);
        }
    };

    public func get_balance(principal: Principal) : async ?Account {
        await create_account(principal);  // Ensure account exists
        let account = accounts.get(principal);
        return account;
    };

    public shared (msg) func adjust_balance(principal: Principal, orangeAmount: Int, greenAmount: Int) : async Bool {
        if (false and not(msg.caller == MoosManager)) {
            return false; // Or throw an error
        };
        await create_account(principal);

        let account_old = accounts.get(principal);
        switch (account_old) {
            case (?account) {
                var orange : Int = account.orange + orangeAmount;
                if (orange < 0) { orange := 0; };
                var green : Int = account.green + greenAmount;
                if (green < 0) { green := 0; };
                let account_new = {
                    orange = Int.abs(orange);
                    green = Int.abs(green);
                };
                accounts.put(principal, account_new);
                return true;  
            };
            case null {
                return false;
            };
        };

    };
    

}