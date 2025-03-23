# Reputation System  

### Description  

The process of buying and selling Bitcoin in the app has no restrictions, balance 
retention systems, or any mechanism that guarantees you will receive the satoshis 
you purchased in a sell order. Instead of implementing a balance retention system, 
the natural system of capitalism—Reputation—was chosen.  

`Reputation is basically people knowing what you have done in your history.`  

A system was designed in which, when a user buys Bitcoin from one of your orders, 
all users on the network connected to the same relays or at least one of them can see 
all the details. If any issue arises, or if you fail to send the sats you sold, everyone
will be able to see it and avoid buying from you in the future. This way, the incentives 
for growing as a P2P seller are solely tied to increasing your reputation.  

### Implementation  

To implement this system, events from [public lists](https://github.com/nostr-protocol/nips/blob/master/51.md) are used.  
All users who make purchases add the details to a list event. The event must include the 
tag **s**: "emptio_p2p" so that the app can list these events later. It must also 
contain the tag **r**: "reputation" to indicate that it is a list containing reputation data.  

A user can create as many lists as they want, but these lists must be nested, containing 
an **e** tag with the ID of the previous list.  

The list must also include the tag **p**: ["fdf46f77...", ..], which should contain the 
public keys of the referenced users. This allows reputation events mentioning a specific 
seller to be listed when verifying their reputation.  

**Example**:  

`
    {
      "kind": 10003,
      "created_at": 1675642635,
      "content": "arbitrary data",
      "tags": [
            ["s", "emptio_p2p"],
            ["r", "reputation"],
            ["p", "fdf46f77..."],
            ["e","b3e392b11f...", "wss://relay.example.com"],
      ],
      "pubkey": "...",
      "id": "..."
    }
`


