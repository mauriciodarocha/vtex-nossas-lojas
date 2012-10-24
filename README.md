vtex-nossas-lojas (beta)
========================

Código javascript para criação de página nossas lojas com google maps.

##Preparação

Preencha a planilha de excel com os dados de acordo com cada coluna.

**Importante saber:**

* os valores são agrupados por estados e cidades. Ou seja, SP é diferente de Sp e de sp, e São Paulo é diferente de SÃO PAULO e SãO PAULO. Ou seja, qualquer caracter diferente terá um agrupamento diferente. Dê preferência para tudo maiúsculas no estado, e maiúsculas e minúsculas em cidades. Ex. SP e São Paulo.
* o nome da loja deve ter um nome diferente em cada cidade, pois se houver duplicidade abrirá todos de mesmo nome. Se for o caso, pode-se utilizar o bairro ou qualquer outra informação. Mude no javascript (labels) de acordo. Ex. usando Bairro, mude Loja: para Bairro:
* o endereço utilizado para o mapa é o endereço cadastrado na coluna para a sugestão do google. O outro endereço é mostrado para o usuário. Isto foi feito pois havia casos que o cliente queria endereços como Av. 1 esquina com Rua 2 e o google não encontrava tal endereço. Este endereço é o ponto de marcação exato para o google e seu marcador.
* os campos lat e lng não são utilizados. (futuro)
* o marcador do mapa pode ser feito utilizando o psd anexo. Utilizar o nome pointer_icon.png e pointer_icon_shadow.png, ou renomeie no código.

##Exportar xml

Você deve exportar sua planilha em formato **xml**.

Para isso existe no excel uma aba **Desenvolvedor** (Developer) com uma opção exportar.

Senão houver está opção, procure em opções e ative esta aba.

**NÃO** utilize outra planilha. Está planilha está **mapeada** para exportar os campos em xml corretamente. Veja isto em uma coluna a direita em **Desenvolvedor > Código fonte**

##Crie um template para o xml

```html
<!DOCTYPE HTML>
<html lang="en-US" xmlns="http://www.w3.org/1999/xhtml" xmlns:vtex="http://www.vtex.com.br/2009/vtex-common" 
xmlns:vtex.cmc="http://www.vtex.com.br/2009/vtex-commerce">
<head></head>
<body>
    <vtex:contentPlaceHolder id="xml"/>
</body>
</html>
```


##Crie uma rota

1. Entre em **Páginas de Vitrines(v2)** no sistema admin da Vtex
2. Em **/** crie um folder chamado **nossas-lojas** (é o caminho utilizado pelo código, importante estar como no código)
3. Em **nossas-lojas** (que você acabou de criar), crie um outro folder chamado **dados** (também utilizado pelo código)
4. Crie um layout, o nome não é importante, sugiro **dados**. E aponte para o **template xml**
5. Cole o **xml** que você **exportou** dentro do **placeholder** que já existe neste template

##Crie um template para "Nossas lojas"

Crie um template como é feito normalmente.

Coloque as linhas abaixo em sua &lt;head&gt; juntamente com seus scripts, metatags e link tags:

```html
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
<script type="text/javascript" src="/arquivos/stores.js"></script>
```

Coloque as linhas abaixo em seu template.

```html
<div class="stores_selection_wrapper"></div>
<div class="stores_wrapper"></div>
```

É importante que seja mantido os nomes das classes e os divs aqui existentes.
Estes divs receberão os seletores e todos os mapas e informações.

##O terror da formatação (css)

É um pouco complicado a primeira vista, mas não é tão complicado assim. :)

O css é que comanda grande parte da aparência e de como o código vai se comportar.

O código adiciona classes como open, colapsed em divs para que eles sejam mostrados na tela.

Sem o css, tudo será mostrado de uma única vez.

Portanto, se houver dúvida em como montar o css. Verifique lojas que já tem o código funcionando. Ex. telhanorte.com.br, rihappy.com.br

##Futuro deste código

Este código funciona sem problemas e deve ser um facilitador no cadastro e mostragem de lojas para página no sistema VTEX.

Tenho planos de modificá-lo para se tornar um plugin.

