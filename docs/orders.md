# Sell Order System

`draft`

A user can create as many orders as they want, delete, and edit them. For this, common events
cannot be used; replaceable events must be used. In this case, the chosen event is of 
kind: `10002`, where each time it is published, it overwrites the previous one. This kind `10002`
event is typically used for [relay list NIP 61](https://github.com/nostr-protocol/nips/blob/master/65.md), but we can use its tags to add
sell orders. `This can be improved later.`

An order should have the following format:

```json
    {
        "currency": "USD"
        "price": 123456,
        "satoshis": 50000,
        "term": 1675642635
    }
```

* `currency` Must contain the code of the local currency in which the satoshis are priced.

* `price` Must contain the price in the local currency, formatted without decimal places. In the app,  
prices will always be handled with two decimal places, so to eliminate decimal places,  
the price is multiplied by 100 and truncated.

* `satoshis` Must contain the amount of satoshis for sale without formatting.

* `term` Must contain the expiration date of the sell order in timestamp format (seconds),  
just like the `created_at` field in every event.

The event must contain the `o` tag with the value `order`, to indicate that it is an event containing  
sell orders and can be listed by the app. It must also contain in `content` a list of serialized objects  
containing the sell orders.

**Example**:

```json
    {
        ...,
        "tags": [
            ["o", "order"]
        ],
        "content": "[{\"currency\": \"USD\", ...}, {...}]"
    }
```

The event must naturally contain the `r` tag, which holds the relays that are the purpose of  
this type of event. This can be leveraged for better communication between seller and buyer,  
since once you have access to a sell order, you also have access to the creator's read and write relays.

Example with the complete event:

```json
    {
        "kind": 10002,
        "tags": [
            ["o", "order"],
            ["r", "wss://alicerelay.example.com"],
            ["r", "wss://expensive-relay.example2.com", "write"],
            ["r", "wss://nostr-relay.example.com", "read"],
            ...
        ],
        "content": "[{\"currency\": \"USD\", ...}, {...}]"
        // other fields...
    }
```
