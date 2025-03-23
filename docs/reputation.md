# Sistema de reputação 

### Descrição 

O processo de compra e venda de bitcoin no app não possui restrições, 
sistemas de retenção de saldos, ou qualquer tipo de sistema que garante que você receberá 
os satoshis que comprou em uma ordem de venda. Ao invéz de implementar
um sistema de retenção de saldos, foi esolhido o sistema natural do captalismo 'Reputação'.

`Reputação é basicamente as pessoas conhecerem oque você já fez em sua história`

Então, foi pensado um sistema em que, quando um usuário compra bitcoin em uma ordem sua,
todos os usuários na rede conectados aos mesmos relays ou a pelo menos um dos relays, poderá
ver todos os detalhes. De modo que se houver algum problema, ou você não enviar os sats que 
vendeu, todos poderão ver e não comprar mais de você, de modo que os incentívos para crescer como
vendedor P2P seja somente aumentando a sua reputação.

### Implementação

Para implementar tal sistema são utilizados eventos de [https://github.com/nostr-protocol/nips/blob/master/51.md).
Todos os usuários que realizam compras adicionam os detalhes a um evento de lista, no evento
deve ser adicionada a tag **s**: "emptio_p2p", para o app listar esses eventos mais tarde, deve
conter também uma tag **r**: "reputation", para indicar que se trata de uma lista com 
dados de reputação.

O usuário poderá criar quantas listas quiser, porém, essas listas devem estar aninhadas, contendo
uma tag **e** com o id da lista anterior.

A lista deve também conter a tag **p**: ["fdf46f77...", ..], que deve conter as chaves públicas 
dos usuários citados, de modo que, para verificar a reputação de um usuário vendedor específico
possam ser listados os eventos de reputação que o mencionam.

**Exemplo**:

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


