# Publicar o site 075 Futsal

Este site e estatico. A pasta publicada pelo Render e:

```txt
outputs/site
```

## Render

Use a opcao de Static Site conectada ao repositorio do GitHub.

Configuracao:

```txt
Build Command: echo "Site estatico pronto para publicar"
Publish Directory: outputs/site
```

Se usar Blueprint, o Render le o arquivo `render.yaml` automaticamente.

## Atualizacoes

Depois que estiver conectado ao GitHub, toda alteracao enviada para a branch principal dispara uma nova publicacao no Render.
