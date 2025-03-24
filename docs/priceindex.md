# Price Index

Considering the functioning of [sales orders](reputation.md), it is possible to obtain an average price index.  
To do this, simply list the orders from the last 1 minute or another time period depending on  
the number of orders and calculate the average price among the listed orders. This describes  
a more realistic and P2P price index.

At least initially, while the user base is still small, the price index can be calculated using  
orders created in the last 5 minutes or less if not displayed. This period will decrease as the  
user base grows and the average number of orders created in such a period reaches a reasonable amount.  
It can also be a variable period calculated according to the increase or decrease in listed orders,  
which is the ideal method.

The events containing the sell orders can be listed using the following filter:

```javascript
    // note that since contains a timestamp in seconds, with a 60-second delay
    let since = (Date.now() / 1000) - 60

    let filter = { "#o": ["orders"], "limit": 100, "since": since }

    const events = await fetchEvents(filter)

    const user_list = events.map(event => {
        let orders = JSON.parser(event.content)
        return { pubkey: event.pubkey, orders }
    }).flat()
```

After obtaining the events and grouping the orders for each user, we can then calculate the average.  
For this, we should not use all orders to prevent a single user from having too much influence on  
the average price. If all listed orders are used, a user could manipulate the index by publishing  
multiple orders with very high or very low prices.  

Imagine a user wants to buy bitcoin cheaply; they could create multiple orders with very low prices,  
influencing other users to create sell orders at that average price. The malicious user then buys  
bitcoin at a lower price. The same applies to selling at a higher price.  

For this reason, one order per user created within a given time frame should be selected.

We randomly obtain one order from each user within the chosen 1-minute period:

```javascript
    let orders = [], index = 0
    for(let user of user_list) {
        let filteredOrders = user.orders.filter(o => o.created_at >= since)
        if(filteredOrders.length) {
            orders[index] = filteredOrders[Math.floor(Math.random() * filteredOrders.length)]
        }
    }
```

Once we have the orders in the example above, we can then calculate the average bitcoin price on the P2P network.

```javascript
    let totalPrice = orders.reduce((sum, order) => sum + order.price, 0)
    let totalSats = orders.reduce((sum, order) => sum + order.satoshis, 0)

    let mediaPrice = totalPrice / orders.length
    let mediaSats = totalSats / orders.length
```

We need the price per unit of bitcoin. We have the average price and the average quantity related.  
So, to obtain the average price per unit, we need to calculate the average price per satoshi:

```javascript
    let mediaPriceForSat = mediaSats / mediaPrice
```

Now that we have the average cost per unit of satoshi, we just need to multiply it by the number of  
satoshis in one bitcoin, which is one hundred million.

```javascript 
    let mediaPriceForBitcoin = mediaPriceForSat * 100000000
```

Note that, given the data formatting described in [sell orders](orders.md), `mediaPriceForBitcoin` still  
does not contain the actual average cost. Remember that the `price` field in the order contains the  
value without decimal places and uses the formula *n * 100* to remove decimal places. Therefore,  
to get the actual price, we need to divide `mediaPriceForBitcoin` by 100 and restore the decimal places.

```javascript
    mediaPriceForBitcoin = mediaPriceForBitcoin / 100
```

That's it! We have a fully decentralized, censorship-resistant bitcoin unit price index.
