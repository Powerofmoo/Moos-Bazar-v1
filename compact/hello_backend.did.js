export const idlFactory = ({ IDL }) => {
  const OfferNumber = IDL.Nat;
  const Status = IDL.Variant({
    'Open' : IDL.Null,
    'Closed' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const Offer = IDL.Record({
    'url' : IDL.Opt(IDL.Text),
    'status' : Status,
    'offeredBy' : IDL.Principal,
    'isTransferable' : IDL.Bool,
    'description' : IDL.Text,
    'orangePrice' : IDL.Nat,
    'acquiredBy' : IDL.Opt(IDL.Principal),
    'isFinal' : IDL.Bool,
    'greenPrice' : IDL.Nat,
    'number' : OfferNumber,
  });
  const Account = IDL.Record({ 'orange' : IDL.Nat, 'green' : IDL.Nat });
  return IDL.Service({
    'acquireOffer' : IDL.Func([OfferNumber], [IDL.Bool], []),
    'adjust_balance' : IDL.Func(
        [IDL.Principal, IDL.Int, IDL.Int],
        [IDL.Bool],
        [],
      ),
    'announceOffer' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Text, IDL.Nat, IDL.Nat],
        [IDL.Opt(IDL.Nat)],
        [],
      ),
    'create_account' : IDL.Func([IDL.Principal], [], []),
    'getMyOffers' : IDL.Func([], [IDL.Vec(Offer)], []),
    'getOpenOffers' : IDL.Func([], [IDL.Vec(Offer)], []),
    'get_balance' : IDL.Func([IDL.Principal], [IDL.Opt(Account)], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'myId' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
