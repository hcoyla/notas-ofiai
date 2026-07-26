# Portal de Notas — OFIAI

Dashboard web para que tus estudiantes consulten sus notas desde cualquier
lugar (PC, laptop o Android), publicado en **GitHub Pages** y usando un
archivo del repositorio como base de datos.

- **Usuario:** correo electrónico del estudiante
- **Contraseña:** su número de DNI
- **Notas publicadas:** Nota de Asistencia, Nota del 1er Examen, Nota del
  1er Trabajo, Nota del 2do Examen, Nota del 2do Trabajo y Promedio Final
  (sobre 20), con el peso ponderado de cada una.

## 1. Estructura del proyecto

```
notas-dashboard/
├── index.html            → página de inicio de sesión
├── dashboard.html        → boleta de notas del alumno
├── css/style.css         → estilos
├── js/auth.js             → lógica de inicio de sesión
├── js/dashboard.js        → lógica para pintar las notas
├── data/estudiantes.json  → "base de datos" (generada del Excel)
├── generar_datos.py       → script para regenerar estudiantes.json
└── .nojekyll               → necesario para que GitHub Pages sirva el JSON tal cual
```

## 2. Cómo funciona el cálculo de notas

Se tomó como referencia tu Excel (hojas **NOTAS** y **Datos**) y los pesos
ponderados de su encabezado:

| Componente        | Escala original | Peso en el promedio final |
|--------------------|:---:|:---:|
| Asistencia          | 0–6  | 6 pts |
| Trabajo 1           | 0–30 | 3 pts |
| Trabajo 2           | 0–30 | 3 pts |
| Examen 1            | 0–40 | 4 pts |
| Examen 2            | 0–40 | 4 pts |
| **Promedio Final**  | —    | **/20** |

El **Promedio Final** que se publica es exactamente el que ya calculaba tu
Excel en la columna "PROM FIN" (incluye el bono de actitud/asistencia y el
redondeo que tú definiste), así que no hay que recalcular nada: solo se
copia tal cual está en tu archivo.

## 3. Publicarlo en GitHub Pages (paso a paso)

1. Crea una cuenta en [github.com](https://github.com) si no tienes una.
2. Crea un repositorio nuevo, público, por ejemplo `notas-ofiai`.
3. Sube **todo el contenido** de esta carpeta `notas-dashboard/` a la raíz
   de ese repositorio (puedes arrastrar los archivos desde la web de
   GitHub con "Add file → Upload files", o usar git):
   ```bash
   cd notas-dashboard
   git init
   git add .
   git commit -m "Publicar portal de notas"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/notas-ofiai.git
   git push -u origin main
   ```
4. En el repositorio, ve a **Settings → Pages**.
5. En "Build and deployment", selecciona **Deploy from a branch**, rama
   `main`, carpeta `/ (root)`. Guarda.
6. En un par de minutos tu portal estará disponible en:
   `https://TU-USUARIO.github.io/notas-ofiai/`
   Ese es el enlace que compartes con tus estudiantes — funciona igual
   desde una PC que desde un celular Android (o cualquier navegador).

## 4. Actualizar las notas más adelante

Cuando corrijas un examen o trabajo nuevo en tu Excel:

1. Actualiza tu archivo `Notas_OFIAI.xlsx` como siempre.
2. Ejecuta (con Python y `pip install openpyxl` instalados):
   ```bash
   python3 generar_datos.py Notas_OFIAI.xlsx
   ```
   Esto reescribe `data/estudiantes.json` con las notas más recientes.
3. Sube el cambio al repositorio:
   ```bash
   git add data/estudiantes.json
   git commit -m "Actualizar notas"
   git push
   ```
   También puedes reemplazar el archivo directamente desde la web de
   GitHub ("Add file → Upload files") si no usas la terminal.
4. La página se actualiza sola en unos minutos, sin tocar nada más.

Si agregas o retiras estudiantes, hazlo en tu Excel (hojas `Datos` y
`NOTAS`) y vuelve a correr el mismo script.

## 5. Privacidad y seguridad — léelo antes de publicar

Este portal es un sitio **100% estático** (no tiene servidor propio ni
base de datos real), así que es importante que sepas sus límites:

- El DNI **nunca** se guarda como texto plano: solo se guarda su huella
  digital SHA-256 en `estudiantes.json`. Aun así, como el DNI peruano
  solo tiene 8 dígitos, alguien con conocimientos técnicos que descargue
  ese archivo podría intentar adivinarlo por fuerza bruta. Esto **no es
  una contraseña criptográficamente segura**, es una barrera básica para
  que el DNI no quede expuesto directamente en el repositorio.
- Con una cuenta gratuita de GitHub, el repositorio y el sitio publicado
  deben ser **públicos** para poder usar GitHub Pages (GitHub no permite
  Pages en repositorios privados en el plan gratuito, y aunque compres el
  plan Pro, la página publicada sigue siendo accesible por cualquiera con
  el enlace, no solo por tus estudiantes). Por eso el archivo
  `estudiantes.json` — con nombres, correos y notas — es visible para
  cualquiera que conozca la URL o explore el repositorio.
- Por esa razón el script **no incluye el número de celular** de los
  estudiantes en el JSON publicado, aunque esté en tu Excel.
- Si necesitas que la información quede realmente privada (solo visible
  para cada alumno con su propio inicio de sesión, protegido en un
  servidor), lo recomendable es un sitio con backend real y
  autenticación de verdad — puedo ayudarte a diseñar esa versión si te
  interesa, aunque implica más que un sitio estático en GitHub Pages.

En resumen: esta solución es práctica y funcional para publicar boletas
de notas de forma simple y gratuita, similar a como muchos docentes
comparten notas hoy (por ejemplo, en una hoja de cálculo compartida),
pero no tiene el nivel de seguridad de un sistema institucional con
servidor propio.

## 6. Estudiantes cargados actualmente

| Nombre | Correo (usuario) |
|---|---|
| Acero Pari, Giuseppe | giusp.acero.96@gmail.com |
| Chambi Pari, Frank Ronaldo Emerson | zorotiburonch@gmail.com |
| Charca Huacasi, Grecia | greciachh.90@gmail.com |
| Hanco Pinto, Fiorela Rocio | hancopinto@gmail.com |
| Huaynasi Pari, Yony Ivan | 70761203@est.unap.edu.pe |
| Jibaja Suca, Henry Niel | thuk12henry@gmail.com |
| Mayanga Mamani, Jhordan Jesus | jhordanmayanga@est.unap.edu.pe |
| Ponce Llaqui, Bryan Gonzalo | brygonzalo15@gmail.com |
| Ramos Maron, Oliver | yordyoliramos@gmail.com |
| Campos Garcia, Jeanne Luisa | jeanny@gmail.com *(figura como retirada, sin notas)* |

## 7. Probarlo en tu computadora antes de publicar

Como el login usa una función del navegador que exige un sitio seguro,
no basta con abrir `index.html` haciendo doble clic. Para probarlo en tu
PC primero, abre una terminal dentro de la carpeta y ejecuta:

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000` en tu navegador.
