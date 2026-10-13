# Lista de cierre — sitio de La Curaçao

Estado al 13 de octubre de 2026. ✅ = hecho en el código · 🔧 = lo haces tú (pasos abajo) · ⚖️ = requiere revisión de alguien más.

| # | Punto | Estado |
|---|---|---|
| 1 | Espaciado consistente | ✅ Una sola escala en todo el sitio: secciones 88 px (72 en tablet, 56 en celular), títulos de 40 px y 30 px, título→párrafo 20 px, título→contenido 40 px. Secciones seguidas con el mismo fondo no duplican el espacio. |
| 2 | Aviso legal | ✅ `/aviso-legal/` (ES y EN) · ⚖️ revisión del área legal |
| 3 | Política de privacidad | ✅ `/politica-de-privacidad/` según la Ley 1581 de 2012 · ⚖️ revisión del área legal |
| 4 | Aviso de cookies | ✅ Aparece solo cuando Analytics está configurado; permite aceptar o rechazar y cambiar la decisión desde "Preferencias de cookies" al pie. |
| 5 | Forzar HTTPS | ✅ En `.htaccess` (DreamHost). En GitHub Pages ya es automático. |
| 6 | Meta títulos y descripciones | ✅ Únicos por página, en español e inglés. |
| 7 | Datos estructurados | ✅ Organización y negocio local (con redes), preguntas frecuentes, migas de pan en cada página y "Servicio" en cada unidad de negocio. |
| 8 | Sitemap y robots.txt | ✅ `sitemap.xml` con 22 URLs (ES + EN enlazadas) y `robots.txt` apuntando a él. |
| 9 | Ficha de Google | 🔧 Paso 5 |
| 10 | Favicon | ✅ (ya estaba) |
| 11 | Texto alternativo | ✅ Los 17 logos de clientes tenían "Cliente 1, 2…"; ahora tienen su nombre real. Las imágenes decorativas llevan alt vacío a propósito. |
| 12 | Imágenes comprimidas | ✅ WebP al tamaño real en que se muestran: de 7,2 MB a 1,6 MB. |
| 13 | Velocidad de carga | ✅ Imágenes ligeras, carga diferida, conexión anticipada a las fuentes, caché y compresión en `.htaccess`. Medir tras el lanzamiento en pagespeed.web.dev. |
| 14 | Contraste de colores | ✅ Todo el texto cumple WCAG AA. En Broadcast y Soporte las zonas grandes conservan un tono claro (`#5690fc`, `#dc7b00`) y solo el menú, los botones y las etiquetas usan uno más profundo (`#3870e3`, `#c05600`); botones de LiveU `#d63600`. |
| 15 | Se ve bien en móvil | ✅ Revisado en 390 px. |
| 16 | Página 404 personalizada | ✅ `404.html` (bilingüe, funciona en cualquier ruta). |
| 17 | Enlaces rotos | ✅ 0 rotos en 1.202 enlaces internos. Externos: todos responden (Sony, Bollé y Facebook bloquean robots, pero abren en el navegador). |
| 18 | Formularios contra spam | ✅ Campo trampa invisible, tiempo mínimo, filtro de enlaces, límite por correo y validación en el servidor · 🔧 Paso 1 para activarlo |
| 19 | Botón de WhatsApp | ✅ Flotante en todas las páginas, con mensaje inicial en el idioma de la página: +57 315 357 0267. |
| 20 | Analítica | ✅ Lista en el código · 🔧 Paso 2 (falta el ID) |
| 21 | Una sola llamada a la acción | ✅ Ver nota A. |
| 22 | Quitar el noindex | ✅ El sitio no tenía noindex. La vista previa de GitHub se marca sola como "no indexar" para no competir con curacao.com.co; en el dominio real no aplica. |
| 23 | Search Console | 🔧 Paso 3 |
| 24 | Bing Webmaster Tools | 🔧 Paso 4 |
| 25 | Teléfono y correo tocables | ✅ En el pie de todas las páginas (teléfono, correo y dirección con mapa), en formato internacional `+57`. |
| 26 | Redes sociales reales | ✅ Instagram, YouTube y Facebook. LinkedIn retirado hasta tener la URL. |
| 27 | Redirecciones 301 | ✅ En `.htaccess`: cada página del WordPress anterior va a su equivalente nueva; el contenido de prueba responde 410. |
| 28 | Una sola versión de dominio | ✅ `https://curacao.com.co` (sin www) en `.htaccess`, canonical y sitemap. |
| 29 | URLs canónicas | ✅ Cada página declara la suya y su par en el otro idioma. |
| 30 | URLs limpias | ✅ `/nosotros/`, `/broadcast/`, `/seguridad-y-defensa/`, `/soporte/`, `/contacto/`, `/nuevos-negocios/`, `/marcas/sony/`, `/marcas/liveu/` (antes `/NOSOTROS/nosotros.html`…). |
| 31 | Jerarquía de enlaces internos | ✅ Inicio → unidades → marcas; menú, pie con todas las secciones y migas de pan. |
| 32 | Una página por intención de búsqueda | ✅ Ver nota B. |
| 33 | Vista previa al compartir | ✅ Imagen propia de 1200×630 por página, en español e inglés. |
| 34 | Caché configurado | ✅ En `.htaccess`. |
| 35 | SSL con renovación automática | 🔧 Paso 6 (DreamHost lo hace solo si está activado) |
| 36 | Copias de seguridad automáticas | 🔧 Paso 7 |
| 37 | Aviso si la web se cae | 🔧 Paso 8 |
| 38 | Contenido de prueba borrado | ✅ Enlace vacío de AMPED, "Cliente 1…17", tildes ("Contactanos", "Compañia", "areas"…), "Echale/Hecha un ojo". En el WordPress viejo, las entradas "Nulla imperdiet…" quedan como eliminadas (410). |
| 39 | Probar en varios navegadores | ✅ Chrome/Edge revisados · 🔧 Paso 9 (Safari y Firefox en dispositivos reales) |
| 40 | Página de gracias | ✅ `/contacto/gracias/` (no indexable). |
| 41 | Medir conversiones | ✅ Evento `generate_lead` al llegar a gracias tras un envío real, más `clic_whatsapp`, `clic_telefono` y `clic_correo` · 🔧 Paso 2 para marcarlas |

---

## Lo que tienes que hacer tú

Los únicos valores por pegar están al inicio de `scriptsGlobales.js`, en `CONFIG`:

```js
var CONFIG = {
  GA_ID: '',            // Paso 2
  FORM_ENDPOINT: '',    // Paso 1
  WHATSAPP: '573153570267'
};
```

Mientras `FORM_ENDPOINT` esté vacío, el formulario abre el correo de la persona con el mensaje ya escrito, así que nunca se pierde un contacto.

### 1. Activar el formulario (Google Apps Script) — 10 minutos
1. Con la cuenta de Google de la empresa, crea una hoja de cálculo "Contactos sitio web".
2. En la hoja: **Extensiones → Apps Script**. Borra lo que haya y pega todo `lanzamiento/formulario-contacto.gs`. Guarda.
3. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como: **Yo**. Acceso: **Cualquier usuario**. Autoriza los permisos.
4. Copia la URL que termina en `/exec` y pégala en `FORM_ENDPOINT`.
5. Prueba: envía el formulario de `/contacto/`. Debe llegar el correo a info@curacao.com.co y aparecer una fila en la hoja.

### 2. Google Analytics 4 — 10 minutos
1. En analytics.google.com: **Administrar → Crear propiedad** "La Curaçao", zona horaria Colombia, moneda COP. Crea un flujo **Web** con `https://curacao.com.co`.
2. Copia el **ID de medición** (`G-XXXXXXXXXX`) y pégalo en `GA_ID`. Desde ese momento aparece el aviso de cookies.
3. Cuando lleguen los primeros datos (24–48 h): **Administrar → Eventos** y marca como **evento clave** `generate_lead` (y si quieres, `clic_whatsapp` y `clic_telefono`).
4. En Analytics, en **Vínculos de productos**, enlaza Search Console (Paso 3).

### 3. Google Search Console — 10 minutos
1. search.google.com/search-console → **Agregar propiedad → Dominio** → `curacao.com.co`.
2. Verifica con el registro TXT que te da Google, agregándolo en el DNS del dominio (panel de DreamHost → Websites → DNS).
3. **Sitemaps** → envía `https://curacao.com.co/sitemap.xml`.
4. Después del lanzamiento, en **Inspección de URLs** pide indexar la página de inicio.

### 4. Bing Webmaster Tools — 3 minutos
bing.com/webmasters → **Importar desde Google Search Console**. Trae el sitio y el sitemap.

### 5. Ficha de Google (Perfil de Empresa) — 15 minutos + verificación
1. business.google.com → busca "La Curaçao" o "Compañía Comercial Curacao de Colombia" para ver si ya existe una ficha y reclamarla; si no, créala.
2. Usa exactamente los mismos datos del sitio: Diagonal 36 Bis No. 20-74, Parkway de La Soledad, Bogotá · (601) 877 0070 · https://curacao.com.co · lunes a viernes, 8:00 a. m.–5:30 p. m.
3. Categoría principal sugerida: "Proveedor de equipos audiovisuales"; secundarias: "Empresa de integración de sistemas" y "Servicio técnico de equipos electrónicos".
4. Sube logo, foto de la sede y fotos de proyectos. Google verifica por video, llamada o carta.

### 6. Lanzamiento en DreamHost (cuando la gerencia apruebe)
1. **Respaldo del WordPress actual**: Panel → Websites → Backups (archivos y base de datos). Guárdalo.
2. Sube el contenido del sitio a la carpeta de curacao.com.co: todo **menos** `.git`, `.claude`, `.impeccable`, `assets-originales` y `lanzamiento`. **Incluye `.htaccess`.**
3. Retira los archivos de WordPress de esa carpeta (quedan en el respaldo).
4. Panel → Websites → **Secure Certificates**: confirma que el certificado Let's Encrypt está activo. DreamHost lo renueva solo.
5. Comprueba (en una terminal):
   - `curl -I http://www.curacao.com.co/` → 301 a `https://curacao.com.co/`
   - `curl -I https://curacao.com.co/quienes-somos/` → 301 a `/nosotros/`
   - `curl -I https://curacao.com.co/no-existe/` → 404 con la página personalizada
6. Prueba la vista previa al compartir en developers.facebook.com/tools/debug y en linkedin.com/post-inspector.
7. Valida los datos estructurados en search.google.com/test/rich-results.

### 7. Copias de seguridad
- El código completo vive en GitHub (`JuanFeMartinez/la-curacao`) y en tu equipo: cada cambio queda guardado con su historial.
- En DreamHost, revisa que los respaldos automáticos estén activos (Panel → Backups).
- Los mensajes del formulario quedan en la hoja de Google: Drive tiene historial de versiones.

### 8. Aviso si la web se cae — 5 minutos
uptimerobot.com (gratis) → **Add New Monitor → HTTP(s)** → `https://curacao.com.co/` cada 5 minutos → alerta a tu correo (y a la app móvil si quieres).

### 9. Prueba en navegadores
Revisado en Chrome/Edge. Falta una pasada en dispositivos reales con: Safari en iPhone y Mac, Firefox y Chrome en Android. Qué revisar: menú móvil, formulario, botón de WhatsApp, aviso de cookies y las tarjetas de marcas.
Los efectos más nuevos (transición entre páginas, entrada de algunos elementos) simplemente no aparecen en navegadores antiguos; el sitio funciona igual.

---

## Nota A — Una sola llamada a la acción
La acción principal de todo el sitio es **escribirnos**: los botones "Contáctanos" y "Hablemos de tu proyecto" llevan al formulario de `/contacto/`. El teléfono y WhatsApp son canales de apoyo para quien prefiere hablar ya. Los demás botones ("Ver soluciones", "Ver marca", "Conócenos más") son navegación, no compiten con ella. En las páginas de marca, "Sitio oficial" usa un estilo secundario a propósito.

## Nota B — Una página por intención de búsqueda
Cada página debe responder a **una** búsqueda distinta, para que dos páginas del sitio no compitan entre sí en Google. Así quedó:

| Página | Lo que busca la persona |
|---|---|
| `/` | Quién es La Curaçao: integrador de tecnología en Colombia |
| `/broadcast/` | Integración de estudios, salas de control y transmisión |
| `/seguridad-y-defensa/` | Tecnología para el sector seguridad y defensa |
| `/soporte/` | Soporte técnico y reparación de equipos audiovisuales |
| `/marcas/sony/` | Distribuidor o representante de SONY en Colombia |
| `/marcas/liveu/` | Distribuidor o representante de LiveU en Colombia |
| `/nuevos-negocios/` | Alianzas y nuevas tecnologías |
| `/nosotros/` | Historia y trayectoria de la empresa |
| `/contacto/` | Cómo contactar a La Curaçao |

## Mantenimiento
- Cambios de texto: edita la página en español, agrega la traducción en `.claude/traducciones.json` y corre `.claude/generar-ingles.ps1` y `.claude/generar-sitemap.ps1`.
- Los textos legales llevan fecha de "Última actualización": cámbiala cuando se modifiquen.
