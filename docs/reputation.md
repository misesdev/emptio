# Sistema de reputação 

### Descrição 

O processo de compra e venda de bitcoin no app não possui restrições, 
sistemas de retenção de saldos, ou qualquer tipo de sistema que garante que você receberá 
os satoshis que comprou em uma ordem de venda, ao invéz de implementar
um sistema de retenção de saldos, foi esolhido o sistema natural do capitalismo: 'Reputação'.

`Reputação é basicamente as pessoas conhecerem oque você já fez em sua história`

Então, foi pensado um sistema em que, quando um usuário compra bitcoin em uma ordem sua,
todos os usuários na rede conectados aos mesmos relays ou a pelo menos um dos relays, poderá
ver se o comprador recebeu ou não. De modo que se houver algum problema, ou você não enviar 
os sats que vendeu, todos poderão ver e não comprar mais de você, definindo os incentívos 
para crescer como vendedor P2P seja somente através de uma boa reputação.

![exemplo](/sources/reputation.png)

O diagrama acima descreve o processo em que Alice, antes de realizar uma compra de uma ordem 
do Bob, consulta a sua reputação com seus compradores passados (user 1, user 2, user 3 e user 4).
Note que 3 deles consideram Bob um verndedor seguro, e um considera Bob um verndedor inseguro,
por tanto, pode-se calcular um ponto percentual da reputação de Bob:

    R = (100 / F) * S 

A formula simples acima calcula o percentual de compradores que consideram Bob inseguro
do total de compradores, onde **F** é a quantidade total de pessoas que já compraram de Bob, 
**S** é a quantidade decompradores que consideram Bob inseguro e **R** é o percentual de 
compradores que consideram Bob seguro dentre todas as pessoas que já compraram dele.



### Implementação

Para implementar tal sistema são utilizados eventos de [listas públicas](https://github.com/nostr-protocol/nips/blob/master/51.md).
Todos os usuários que realizam compras adicionam os detalhes a um evento de lista, no evento
deve ser adicionada a tag **r**: "reputation", para indicar que se trata de uma lista com 
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
            ["r", "reputation"],
            ["p", "fdf46f77..."],
            ["e","b3e392b11f...", "wss://relay.example.com"],
      ],
      "pubkey": "...",
      "id": "..."
    }
`


