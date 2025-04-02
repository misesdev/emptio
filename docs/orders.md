# Sales Order System  

`draft`  

A user can create as many orders as they want, delete, and edit them. However, common events 
should not be used; instead, replaceable events must be utilized. In this case, the chosen event
type is `kind: 10002`, where each time it is published, it overwrites the previous one. This 
`kind 10002` event is usually used for [relay list NIP 61](https://github.com/nostr-protocol/nips/blob/master/65.md), but we can use its tags 
to add sales orders. `This can be improved later`.  

An order should have the following format:  

```json
    {
        "id": "7902e7bd3ac2f29540662b172d63c07dcbd374dc89a71105cebe197b93f92de4",
        "currency": "USD",
        "price": 123456,
        "satoshis": 50000,
        "closure": 1675642635
    }
```

* `id` Should be the double sha256 of the creator user's public key concatenated with the order
creation date, the number of satoshis in the order, and the price. Example:  

```javascript 
    let price = numberToHex(1000) // 10.00
    let satoshis = numberToHex(1000000) // 1m sats
    let pubkey = "55472e9c01f37a35f6032b9b78dade386e6e4c57d80fd1d0646abb39280e5e27"
    let created_at = numberToHex(Math.floor(Date.now() / 1000))

    // generate an order id
    let id = sha256(sha256(pubkey+created_at+satoshis+price))
```

* `currency` Should contain the code of the local currency in which the satoshis are priced.  

* `price` Should contain the price in the local currency, formatted without decimal places. In
the app, prices will always be handled with two decimal places. Therefore, to eliminate decimal 
places, the price is multiplied by 100 and truncated.  

* `satoshis` Should contain the amount of satoshis for sale without formatting.  

* `closure` Should contain the expiration date of the sales order in a timestamp of seconds, just
like the `created_at` field of any event.  

The event must contain the tag `o` with the value `orders`, to indicate that it is an event 
containing sales orders and can be listed by the app. It should also contain in the `content`
field a serialized JSON object with the property `orders`, which holds a list of objects 
representing the sales orders.  

**Example**:  

```json
    {
        ...,
        "tags": [
            ["o", "orders"]
        ],
        "content": "{ \"orders\": [{\"currency\": \"USD\", ...}, {...}] }"
    }
```

The event should naturally contain the `r` tag, which includes the relays that are the purpose
of this type of event. This can be leveraged to improve communication between the seller and the 
buyer. Once you have access to a sales order, you also have access to the read and write relays 
used by the creator of the sales order.  

Example with the complete event:  

```json
    {
        "kind": 10002,
        "tags": [
            ["o", "orders"],
            ["r", "wss://alicerelay.example.com"],
            ["r", "wss://expensive-relay.example2.com", "write"],
            ["r", "wss://nostr-relay.example.com", "read"],
            ...
        ],
        "content": "{ \"orders\": [{\"currency\": \"USD\", ...}, {...}] }"
        // other fields...
    }
```
