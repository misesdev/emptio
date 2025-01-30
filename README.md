# Emptio P2P

A project to allow the purchase and sale of bitcoin p2p in a decentralized way through nostr

### About 

This application utilizes **Nostr** as a communication protocol to connect users from anywhere, pseudo-anonymously, for the buying and selling of Bitcoin P2P in any scenario. 
It uses **mempool.space** for communication with the Bitcoin network to perform transactions and list Bitcoin wallet data, and finally, it utilizes the repository 
from a profile called emptiopubda to list the initial data given the nature of Nostr not enabling a user listing equivalent to the "following" tab on social media platforms.

To facilitate the buying and selling of Bitcoin, it will also utilize payment processing services that will be configured by the user wishing to sell Bitcoin.

### Features in development and completed

- [x] Create a Nostr account or log in with the npub nip19.
- [x] List users to follow and add users to friends.
- [x] Managing the Nostr relays, adding and removing relays.
- [ ] Create session for developers, donations, trusted sellers, and other related items.
- [x] Create, delete and import wallet to receive and send bitcoin.
- [x] Integrate with mempool.space to send Bitcoin transactions and list transactions.
- [ ] Create and list sell orders.
- [ ] Add and manage payment processor to receive feat currency and send bitcoins.
- [ ] Create a chat for buyers and sellers to negotiate or resolve issues interactively.

... More features will emerge according to demand.

## Build and Run it

```bash
  git clone https://github.com/emptioapp/emptio.git
  npm install
  npm run start
``` 

## Run Tests

```
  npm run test 
```
