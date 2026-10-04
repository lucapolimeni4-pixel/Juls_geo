# Geo BA

Prototipo de juego de geolocalización con 3 rondas.

## Cómo probarlo

Abrí `index.html` con Live Server desde VS Code.

## Cómo poner tus fotos

Reemplazá:
- images/lugar1.svg
- images/lugar2.svg
- images/lugar3.svg

por tus fotos, y cambiá las extensiones en `script.js` si usás JPG/PNG.

## Cómo poner las ubicaciones reales

En `script.js`, cada lugar tiene:
- `name`
- `lat`
- `lng`

Las coordenadas están en formato decimal.

El mapa usa Leaflet y teselas de OpenStreetMap con la atribución visible correspondiente.
