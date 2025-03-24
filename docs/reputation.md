# Reputation System  

    Draft

### Description  

The process of buying and selling Bitcoin in the app has no restrictions,  
balance retention systems, or any system that guarantees you will receive  
the satoshis you purchased in a sell order. Instead of implementing  
a balance retention system, the natural system of capitalism was chosen: **Reputation**.  

    Reputation is basically people knowing what you have done in your history.  

Thus, a system was designed where, when a user buys Bitcoin from one of your orders,  
all users on the network connected to the same relays or at least one of the relays  
can see whether the buyer received the funds or not. If there is any issue,  
or if you do not send the sats you sold, everyone will see it and stop buying from you.  
This defines the incentives for growing as a P2P seller purely through a good reputation.  

![diagram](sources/reputation.png)  

The diagram above describes the process in which Alice, before purchasing from Bob’s order,  
checks his reputation with past buyers (User 1, User 2, User 3, and User 4).  
Note that three of them consider Bob a safe seller, while one considers him unsafe.  
Thus, Bob's reputation percentage can be calculated as follows:  

```math
    R = (100 / F) * S 
```

The simple formula above calculates the percentage of buyers who consider Bob unsafe  
out of the total number of buyers, where **F** is the total number of people who have bought from Bob,  
**S** is the number of buyers who consider Bob unsafe, and **R** is the percentage of buyers  
who consider Bob safe among all those who have bought from him.  

Applying the formula to Bob's data, where **F**=4 and **S**=3, we get a reputation score of 75.  
This means **Alice** can decide whether to buy from **Bob** based on his **75% trust rate**.  
Note that **User 1** has **F**=4 and **S**=4, resulting in a trust rate of **100%**,  
meaning all buyers consider him safe. So **Alice** may choose to buy from **User 1** instead.  

**The reputation system can also be applied to buyers, ensuring security for both parties.**  

#### Using the TimeChain to Validate Reputation  

To ensure no misconduct by either party, the information indicating whether  
the seller is safe or not is **not** added by the user themselves.  
Instead, it is **automatically added when the buyer receives the balance in their wallet**.  
To achieve this, the last mined block is used.  

When the buyer makes the payment, the system saves the **last mined block**  
and waits for the next block to be mined. Once the next block is mined,  
the system checks if it contains a transaction that sends the **sale order** balance to the buyer.  
If the transaction exists—meaning the buyer received the balance—  
the system adds the information to the **buyer’s reputation list**,  
stating that the seller is safe.  

For sellers, the same process applies using their payment processor.  
Once the balance from the **sale order** is received,  
the system **automatically adds the information** to the **seller’s reputation list**,  
indicating that the buyer is safe.  

Beyond verifying whether the seller is safe, the user can also leave a review.  
The same applies to the buyer.  

### Implementation  

To implement this system, [NIP 51 public lists](https://github.com/nostr-protocol/nips/blob/master/51.md) events are used.  
All users who make purchases add the details to a list event.  
The event must include the **r** tag: `"reputation"`,  
to indicate that the list contains reputation data.  

In addition to the **r** tag, an **reputation** tag must be added,  
which contains a list of serialized reputation data objects. Example:  

```json
    {
        ...,
        tags: [
            ["r", "reputation"],
            ["reputation", "[{ \"pubkey\": \"fdf46f77...\"... }","{...}]"]
        ]
    }    
```

The reputation data should follow this format:  

```json
    {
        "pubkey": "fdf46f77..",
        "safe_seller": true,
        "about": "Excellent service..."
    } 
```

The list must also include the **p** tag: `["fdf46f77...", ..]`,  
which should contain the public keys of the mentioned users.  
This allows querying reputation events that reference a specific seller.  

**Example:**  

```json
    {
      "kind": 10003,
      "created_at": 1675642635,
      "content": "arbitrary data",
      "tags": [
            ["r", "reputation"],
            ["reputation", "[{ \"pubkey\": \"fdf46f77...\"... }","{...}]"]
            ["p", "fdf46f77..."],
            ["e","b3e392b11f...", "wss://relay.example.com"],
      ],
      "pubkey": "...",
      "id": "..."
    }
```
