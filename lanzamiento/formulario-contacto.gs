/**
 * FORMULARIO DE CONTACTO — curacao.com.co
 *
 * Recibe los mensajes del formulario de /contacto/, los guarda en esta
 * hoja de cálculo (pestaña "Mensajes") y avisa por correo.
 *
 * Instalación (una sola vez):
 *  1. Crea una hoja de cálculo en Google Drive con la cuenta de la empresa,
 *     por ejemplo "Contactos sitio web".
 *  2. En la hoja: Extensiones > Apps Script. Borra lo que haya y pega este
 *     archivo completo. Guarda.
 *  3. Implementar > Nueva implementación > tipo "Aplicación web".
 *       Ejecutar como: Yo
 *       Quién tiene acceso: Cualquier usuario
 *     Autoriza los permisos (hoja de cálculo y envío de correo).
 *  4. Copia la URL que termina en /exec y pégala en scriptsGlobales.js,
 *     en CONFIG.FORM_ENDPOINT.
 *
 * Si cambias este código: Implementar > Gestionar implementaciones >
 * editar (lápiz) > Versión: "Nueva versión". Así la URL no cambia.
 */

const CORREO_DESTINO = 'info@curacao.com.co';
const PESTANA = 'Mensajes';
const MAX_ENVIOS_POR_HORA = 5;

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Robots: llenaron el campo oculto o enviaron en menos de 3 segundos.
  // Se les responde "ok" para que no insistan.
  if (p.sitio_web || Number(p.tiempo || 0) < 3) return responder({ ok: true });

  const d = {
    nombre: limpiar(p.nombre, 120),
    correo: limpiar(p.correo, 160),
    telefono: limpiar(p.telefono, 40),
    empresa: limpiar(p.empresa, 160),
    interes: limpiar(p.interes, 80),
    mensaje: limpiar(p.mensaje, 3000),
    autorizo: p.autorizo === 'si',
    idioma: limpiar(p.idioma, 5),
    pagina: limpiar(p.pagina, 300)
  };

  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo);
  if (!d.nombre || !correoValido || !d.telefono || !d.mensaje || !d.autorizo) {
    return responder({ ok: false, error: 'datos' });
  }

  // Spam típico: mensajes llenos de enlaces
  if ((d.mensaje.match(/https?:\/\//gi) || []).length > 2) return responder({ ok: true });

  // Máximo de envíos por correo en una hora
  const cache = CacheService.getScriptCache();
  const clave = 'envios_' + d.correo.toLowerCase();
  const enviados = Number(cache.get(clave) || 0);
  if (enviados >= MAX_ENVIOS_POR_HORA) return responder({ ok: false, error: 'limite' });
  cache.put(clave, String(enviados + 1), 3600);

  hoja().appendRow([
    new Date(), seguro(d.nombre), seguro(d.correo), seguro(d.telefono), seguro(d.empresa),
    seguro(d.interes), seguro(d.mensaje), d.autorizo ? 'Sí' : 'No', d.idioma, seguro(d.pagina)
  ]);

  MailApp.sendEmail({
    to: CORREO_DESTINO,
    replyTo: d.correo,
    subject: 'Nuevo mensaje del sitio web: ' + d.nombre + (d.empresa ? ' (' + d.empresa + ')' : ''),
    body: [
      'Nombre: ' + d.nombre,
      'Correo: ' + d.correo,
      'Teléfono: ' + d.telefono,
      'Empresa: ' + (d.empresa || '-'),
      'Interés: ' + (d.interes || '-'),
      'Idioma: ' + (d.idioma || '-'),
      '',
      d.mensaje,
      '',
      '— Enviado desde ' + (d.pagina || 'curacao.com.co') + '. Autorizó el tratamiento de datos personales.',
      'Para responder, usa "Responder": el correo va directo a la persona.'
    ].join('\n')
  });

  return responder({ ok: true });
}

// Abrir la URL /exec en el navegador muestra esto: sirve para comprobar que está activa
function doGet() {
  return ContentService.createTextOutput('Formulario de contacto de La Curaçao: activo.');
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function limpiar(valor, max) {
  return String(valor || '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ' ').trim().slice(0, max);
}

// Evita que un texto que empieza por = + - @ se interprete como fórmula en la hoja
function seguro(valor) {
  return /^[=+\-@]/.test(valor) ? "'" + valor : valor;
}

function hoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let h = libro.getSheetByName(PESTANA);
  if (!h) {
    h = libro.insertSheet(PESTANA);
    h.appendRow(['Fecha', 'Nombre', 'Correo', 'Teléfono', 'Empresa', 'Interés', 'Mensaje', 'Autorizó datos', 'Idioma', 'Página']);
    h.setFrozenRows(1);
  }
  return h;
}
