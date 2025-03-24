# Sistema de ordens de venda

    Draft

Um usuário pode criar quantas ordens quiser, excluir e editar, para isso não podem ser utilizados 
eventos comuns, devem ser utilizados eventos replaceable, no caso foi ecolhido o evento de 
kind: 10002, onde cada vez que é publicado sobrescreve o anterior.

Uma ordem deve ter o seguinte formato:

```json
    {
        "currency": "BRL"
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



