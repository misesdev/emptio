# Sistema de ordens de venda

`draft`

Um usuário pode criar quantas ordens quiser, excluir e editar, para isso não podem ser utilizados 
eventos comuns, devem ser utilizados eventos replaceable, no caso foi ecolhido o evento de 
kind: 10002, onde cada vez que é publicado sobrescreve o anterior. Esse evento de kind 10002
normalmente é utilizado para [relay list NIP 61](https://github.com/nostr-protocol/nips/blob/master/65.md), mas podemos utilizar suas
tags para adicionar ordens de venda. `pode ser melhorado depois`.

Uma ordem deve ter o seguinte formato:

```json
    {
        "currency": "USD"
        "price": 123456,
        "satoshis": 50000,
        "term": 1675642635,
    }
```

* `currency` Deve conter o código da moeda local em que está precificado os satoshis.

* `price` Deve conter o preço na moeda local, formatado sem casas decimais. No app 
os preços seram tratados sempre com duas casas decimais, por tanto, para eliminar as 
casas decimais, o preço é multiplicado por 100 e truncado.

* `satoshis` Deve conter a quantidade de satoshis a venda sem formatação

* `term` Deve conter o prazo de validade da ordem de venda em timestamp de segundos, assim
como é o campo created_at de todo evento.


O evento deve conter a tag `o` com o valor `order`, para indicar que é um evento que possui ordens 
de venda, e poder ser listado pelo app. Deve também conter no `content` uma lista de objetos
serializados contendo as ordens de venda.

**Exemplo**:

```json
    {
        ...,
        "tags": [
            ["o", "order"],
        ],
        "content": "[{\"currency\": \"USD\", ...}, {...}]"
    }
```

O evento naturalmente deve conter a tag `r` que contem os relays que são o propósito da existencia
desse tipo de evento, e isso pode ser aproveitado para melhor comunicação entre vendedor e 
comprador, visto que uma vez com acesso a uma ordem de venda, você tem acesso aos relays de 
escrita e leitura do criador da ordem.

Exemplo com o evento completo:

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
