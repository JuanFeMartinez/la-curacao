/* =====================================================================
   SCRIPTS GLOBALES — compartido por todas las páginas
   Todo con degradación elegante: si el JS falla, el sitio sigue viéndose
   bien y solo pierde el movimiento y los extras (WhatsApp, analítica).
   Lo que hay que configurar al lanzar está en CONFIG, justo abajo.
   ===================================================================== */

(function () {
  'use strict';

  /* ---- Configuración del sitio (lo único que hay que tocar al lanzar) ----
     GA_ID: ID de Google Analytics 4 (G-XXXXXXXXXX). Vacío = sin analítica,
            sin cookies y sin aviso de cookies.
     FORM_ENDPOINT: URL de la app web de Google Apps Script que recibe el
            formulario de contacto (termina en /exec). Vacío = el formulario
            abre el correo del visitante con el mensaje ya escrito.
     WHATSAPP: número del botón flotante, con indicativo y sin signos. */
  var CONFIG = {
    GA_ID: '',
    FORM_ENDPOINT: '',
    WHATSAPP: '573153570267'
  };

  var EN = document.documentElement.lang === 'en';
  var T = EN ? {
    wa: 'Message us on WhatsApp',
    waTexto: 'Hello, I would like more information about your solutions.',
    cookies: 'We use analytics cookies to understand how the site is used and improve it. You can accept or reject them.',
    cookiesMas: 'Privacy policy',
    aceptar: 'Accept', rechazar: 'Reject',
    enviando: 'Sending…',
    errorEnvio: 'We could not send your message. Please try again or write to us at info@curacao.com.co.',
    abrimosCorreo: 'We opened your email app with the message ready. Just press send.'
  } : {
    wa: 'Escríbenos por WhatsApp',
    waTexto: 'Hola, quiero más información sobre sus soluciones.',
    cookies: 'Usamos cookies de analítica para entender cómo se usa el sitio y mejorarlo. Puedes aceptarlas o rechazarlas.',
    cookiesMas: 'Política de privacidad',
    aceptar: 'Aceptar', rechazar: 'Rechazar',
    enviando: 'Enviando…',
    errorEnvio: 'No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos a info@curacao.com.co.',
    abrimosCorreo: 'Abrimos tu aplicación de correo con el mensaje listo. Solo tienes que enviarlo.'
  };

  function guardar(clave, valor) { try { localStorage.setItem(clave, valor); } catch (e) {} }
  function leer(clave) { try { return localStorage.getItem(clave); } catch (e) { return null; } }

  /* ---- Vista previa: que Google no indexe la copia de GitHub Pages ----
     El sitio real vive en curacao.com.co; la vista previa para la gerencia
     (github.io) no debe competir con él en los resultados de búsqueda. */
  if (/\.github\.io$/.test(location.hostname)) {
    var noindex = document.createElement('meta');
    noindex.name = 'robots';
    noindex.content = 'noindex, nofollow';
    document.head.appendChild(noindex);
  }

  /* ---- Analítica (Google Analytics 4) con consentimiento ----
     No se carga nada hasta que la persona acepta. La decisión se recuerda
     y se puede cambiar desde "Preferencias de cookies" en el pie. */
  var analiticaCargada = false;
  function cargarAnalitica() {
    if (analiticaCargada || !CONFIG.GA_ID) return;
    analiticaCargada = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', CONFIG.GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CONFIG.GA_ID);
    document.head.appendChild(s);
  }

  function medir(evento, datos) {
    if (analiticaCargada && window.gtag) window.gtag('event', evento, datos || {});
  }

  function borrarCookiesAnalitica() {
    document.cookie.split(';').forEach(function (c) {
      var nombre = c.split('=')[0].trim();
      if (/^_ga/.test(nombre)) {
        var dominio = location.hostname.replace(/^www\./, '');
        document.cookie = nombre + '=; Max-Age=0; path=/';
        document.cookie = nombre + '=; Max-Age=0; path=/; domain=.' + dominio;
      }
    });
  }

  function avisoCookies() {
    if (!CONFIG.GA_ID) return;
    var botonPie = document.querySelector('[data-cookies]');
    if (botonPie) botonPie.hidden = false;

    var decision = leer('lc-cookies');
    if (decision === 'aceptadas') cargarAnalitica();

    var aviso = null;
    function cerrar() {
      if (!aviso) return;
      aviso.classList.add('is-saliendo');
      var a = aviso; aviso = null;
      setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); }, 240);
      document.documentElement.classList.remove('con-aviso-cookies');
    }
    function mostrar() {
      if (aviso) return;
      var politica = document.querySelector('a[href$="politica-de-privacidad/"]');
      aviso = document.createElement('div');
      aviso.className = 'aviso-cookies';
      aviso.setAttribute('role', 'region');
      aviso.setAttribute('aria-label', 'Cookies');
      aviso.innerHTML =
        '<p>' + T.cookies + (politica ? ' <a href="' + politica.getAttribute('href') + '">' + T.cookiesMas + '</a>' : '') + '</p>' +
        '<div class="aviso-cookies__botones">' +
          '<button type="button" class="aviso-cookies__btn" data-decision="rechazadas">' + T.rechazar + '</button>' +
          '<button type="button" class="aviso-cookies__btn aviso-cookies__btn--primario" data-decision="aceptadas">' + T.aceptar + '</button>' +
        '</div>';
      aviso.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-decision]');
        if (!btn) return;
        var d = btn.getAttribute('data-decision');
        guardar('lc-cookies', d);
        if (d === 'aceptadas') cargarAnalitica(); else borrarCookiesAnalitica();
        cerrar();
      });
      document.body.appendChild(aviso);
      document.documentElement.classList.add('con-aviso-cookies');
      document.documentElement.style.setProperty('--alto-aviso', aviso.offsetHeight + 'px');
    }

    if (!decision) mostrar();
    if (botonPie) botonPie.addEventListener('click', mostrar);
  }

  /* ---- Clics de contacto (teléfono, correo, WhatsApp) como eventos ---- */
  function medirContactos() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (/^tel:/.test(href)) medir('clic_telefono', { numero: href.slice(4) });
      else if (/^mailto:/.test(href)) medir('clic_correo');
      else if (/wa\.me\//.test(href)) medir('clic_whatsapp');
    });

    // Página de gracias: la conversión solo cuenta si viene de un envío real
    if (document.body.classList.contains('pagina-gracias')) {
      var lead = null;
      try { lead = sessionStorage.getItem('lc-lead'); sessionStorage.removeItem('lc-lead'); } catch (e) {}
      if (lead) {
        var enviar = function () { medir('generate_lead', { formulario: 'contacto' }); };
        if (analiticaCargada) setTimeout(enviar, 300);
      }
    }
  }

  /* ---- Botón flotante de WhatsApp ---- */
  function botonWhatsApp() {
    if (!CONFIG.WHATSAPP) return;
    var a = document.createElement('a');
    a.className = 'whatsapp-flotante';
    a.href = 'https://wa.me/' + CONFIG.WHATSAPP + '?text=' + encodeURIComponent(T.waTexto);
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', T.wa);
    a.innerHTML = '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><path fill="currentColor" d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.54 1.74 6.52L3 29l6.65-1.74A13 13 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.8c-2 0-3.95-.54-5.65-1.55l-.4-.24-3.95 1.03 1.05-3.84-.26-.4A10.8 10.8 0 0 1 5.2 16c0-5.98 4.86-10.84 10.84-10.84S26.86 10.02 26.86 16 22 26.8 16.04 26.8Zm5.94-8.1c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.73.16-.22.33-.84 1.06-1.03 1.27-.19.22-.38.24-.71.08-.33-.16-1.38-.51-2.63-1.62-.97-.87-1.63-1.94-1.82-2.27-.19-.33-.02-.5.14-.67.15-.15.33-.38.49-.57.16-.19.22-.33.33-.54.11-.22.05-.41-.03-.57-.08-.16-.73-1.76-1-2.41-.26-.63-.53-.55-.73-.56h-.62c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.71s1.17 3.15 1.33 3.36c.16.22 2.3 3.5 5.56 4.91.78.34 1.38.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.41.19-1.55-.08-.13-.3-.21-.62-.38Z"/></svg>';
    document.body.appendChild(a);
  }

  /* ---- Formulario de contacto ----
     Validación del navegador + dos trampas para robots (un campo oculto
     que una persona nunca llena y el tiempo mínimo para escribir). Si el
     envío sale bien, lleva a la página de gracias, donde se mide la
     conversión. */
  function formularioContacto() {
    var form = document.querySelector('form.contacto-form');
    if (!form) return;
    var inicio = Date.now();
    var estado = form.querySelector('.contacto-form__estado');
    var boton = form.querySelector('button[type="submit"]');
    var textoBoton = boton ? boton.textContent : '';

    function avisar(msg, tipo) {
      if (!estado) return;
      estado.textContent = msg;
      estado.className = 'contacto-form__estado' + (tipo ? ' is-' + tipo : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var datos = new FormData(form);

      // Robot: llenó el campo trampa o envió en menos de 3 segundos.
      // Se le responde como si todo hubiera salido bien.
      if (datos.get('sitio_web') || Date.now() - inicio < 3000) {
        form.reset();
        avisar(EN ? 'Thank you.' : 'Gracias.', 'ok');
        return;
      }
      datos.set('idioma', EN ? 'en' : 'es');
      datos.set('pagina', location.href);
      datos.set('tiempo', String(Math.round((Date.now() - inicio) / 1000)));

      if (!CONFIG.FORM_ENDPOINT) {
        var cuerpo = ['nombre', 'correo', 'telefono', 'empresa', 'interes', 'mensaje'].map(function (k) {
          var el = form.elements[k];
          var etiqueta = el && el.labels && el.labels[0] ? el.labels[0].textContent.replace(/\s*\*$/, '') : k;
          return etiqueta + ': ' + (datos.get(k) || '-');
        }).join('\n');
        location.href = 'mailto:info@curacao.com.co?subject=' + encodeURIComponent((EN ? 'Website contact - ' : 'Contacto desde el sitio web - ') + datos.get('nombre')) +
          '&body=' + encodeURIComponent(cuerpo);
        avisar(T.abrimosCorreo, 'ok');
        medir('clic_correo', { origen: 'formulario' });
        return;
      }

      if (boton) { boton.disabled = true; boton.textContent = T.enviando; }
      avisar('');
      fetch(CONFIG.FORM_ENDPOINT, { method: 'POST', body: new URLSearchParams(datos) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res || !res.ok) throw new Error('rechazado');
          try { sessionStorage.setItem('lc-lead', '1'); } catch (err) {}
          location.href = 'gracias/';
        })
        .catch(function () {
          avisar(T.errorEnvio, 'error');
          if (boton) { boton.disabled = false; boton.textContent = textoBoton; }
        });
    });
  }

  /* ---- Año actual en el pie ---- */
  function anioActual() {
    var y = String(new Date().getFullYear());
    Array.prototype.forEach.call(document.querySelectorAll('[data-anio]'), function (el) { el.textContent = y; });
  }

  /* ---- 1. Carruseles en loop infinito ----
     La animación CSS desplaza el track un -50%, así que necesita que el
     contenido esté exactamente duplicado. Antes se duplicaba a mano en el
     HTML; aquí se clona solo. La clase 'is-looping' activa la animación:
     sin JS no se añade, el carrusel queda estático y no se ve roto. */
  function prepararCarruseles() {
    var tracks = document.querySelectorAll('.clients-track, .partners-track');

    Array.prototype.forEach.call(tracks, function (track) {
      var originales = Array.prototype.slice.call(track.children);
      if (!originales.length) return;

      var anchoJuego = track.scrollWidth;                                   // ancho de un juego de logos
      var anchoVisible = track.parentElement ? track.parentElement.clientWidth : 0;
      if (!anchoJuego) return;

      /* Repetimos el juego hasta que media pista cubra el ancho visible: con
         pocos logos (ej. 5 en Seguridad y defensa) un solo duplicado dejaba
         un hueco al final del ciclo. La pista siempre queda con 2 mitades
         idénticas, que es lo que necesita el translateX(-50%) del CSS. */
      var repeticiones = Math.max(1, Math.ceil(anchoVisible / anchoJuego));
      var copiasNecesarias = repeticiones * 2 - 1;

      for (var i = 0; i < copiasNecesarias; i++) {
        originales.forEach(function (nodo) {
          var copia = nodo.cloneNode(true);
          // Las copias son decorativas: no deben leerse dos veces
          copia.setAttribute('aria-hidden', 'true');
          if (copia.hasAttribute('alt')) copia.setAttribute('alt', '');
          track.appendChild(copia);
        });
      }

      track.classList.add('is-looping');
    });
  }

  /* ---- 2. Scroll suave al llegar con ancla ----
     Al navegar de otra página a home.html#servicios el navegador salta
     de golpe. Aquí lo devolvemos arriba al instante y bajamos animado. */
  function scrollSuaveDesdeAncla() {
    if (!location.hash) return;

    var destino;
    try {
      destino = document.querySelector(location.hash);
    } catch (e) {
      return; // hash no válido como selector
    }
    if (!destino) return;

    // Volver arriba de golpe. 'instant' ignora el scroll-behavior global;
    // alternar el estilo inline no era fiable (el reset no se aplicaba).
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Y ahora sí, bajar suave hasta la sección
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ---- 3. Menú hamburguesa (tablet / móvil) ----
     El toggle por checkbox (:checked ~ nav) resultó poco fiable en este
     combinador; en su lugar sincronizamos una clase .nav-open en el header,
     que el CSS usa para mostrar/ocultar el panel. */
  function menuMovil() {
    var toggle = document.querySelector('.nav-toggle');
    var header = document.querySelector('.site-header');
    if (!toggle || !header) return;

    function sincronizar() {
      header.classList.toggle('nav-open', toggle.checked);
    }
    toggle.addEventListener('change', sincronizar);
    sincronizar();

    // Cerrar el menú al tocar una opción (antes de navegar)
    header.querySelectorAll('nav a').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        toggle.checked = false;
        sincronizar();
      });
    });
  }

  /* ---- 4. Aparición al hacer scroll ----
     Cada bloque de contenido se desvanece hacia visible cuando entra en
     pantalla (IntersectionObserver). Solo opacidad (ver estilosGlobales.css).
     Si no hay soporte o el usuario prefiere menos movimiento, no se toca nada. */
  function aparicionAlScroll() {
    var prefiereReducido = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefiereReducido || !('IntersectionObserver' in window)) return;

    var SELECTORES = [
      '.services-intro > p', '.service-card', '.soporte-bar', '.how-we-work > h2',
      '.marcas-section > h2', '.marca-card',
      '.faq-item', '.how-we-work-img', '.who-grid',
      '.clients-header', '.clients-body', '.contact-strip-inner',
      '.page-intro > p', '.service-detail-grid', '.brands > h2', '.brand-item',
      '.capacidades > h2', '.capacidades-intro', '.capacidad',
      '.sectores > h2', '.sectores > p', '.sector-pill',
      '.support-services > h2', '.support-sub', '.support-card', '.track-order-card',
      '.about-grid', '.timeline-title', '.timeline-item', '.mv-grid', '.values > h2', '.values-col li',
      '.contact-lead > h2', '.contact-lead > p', '.contacto-form',
      '.contact-here > h2', '.contact-map', '.contact-pill',
      '.marca-galeria > h2', '.marca-galeria figure', '.marcas-rama-intro',
      '.eventos > h2', '.evento'
    ].join(',');

    var elementos = Array.prototype.slice.call(document.querySelectorAll(SELECTORES));
    if (!elementos.length) return;

    document.documentElement.classList.add('reveal-on');

    var vh = window.innerHeight || document.documentElement.clientHeight;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

    elementos.forEach(function (el) {
      el.classList.add('reveal');
      // Pequeño escalonado para los hermanos de un mismo grupo (fila de tarjetas)
      var hermanos = el.parentElement
        ? Array.prototype.filter.call(el.parentElement.children, function (h) { return h.matches(SELECTORES); })
        : [el];
      var i = hermanos.indexOf(el);
      if (i > 0) el.style.animationDelay = Math.min(i * 60, 300) + 'ms';

      // Lo que ya está en pantalla al cargar: mostrarlo de una (sin parpadeo)
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        el.classList.add('is-visible', 'sin-animar');
      } else {
        observer.observe(el);
      }
    });
  }

  /* ---- 5. Pantalla de carga ----
     Se oculta cuando la página terminó de cargar (incluidas las imágenes),
     así se evita el "pop-in" feo de elementos. Tope de seguridad por si
     algún recurso tarda demasiado. */
  function pantallaCarga() {
    var loader = document.getElementById('page-loader');
    if (!loader) return;

    var oculto = false;
    function ocultar() {
      if (oculto) return;
      oculto = true;
      loader.classList.add('is-hidden');
      // Arranca la entrada del hero y recuerda que la intro ya se vio en esta
      // sesión: las siguientes páginas entran sin pantalla de carga.
      if (!document.documentElement.classList.contains('sin-intro')) {
        document.documentElement.classList.add('hero-listo');
      }
      try { sessionStorage.setItem('lc-intro', '1'); } catch (e) {}
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 600);
    }

    if (document.readyState === 'complete') {
      ocultar();
    } else {
      window.addEventListener('load', ocultar);
    }
    // Nunca dejar el loader pegado más de 5s aunque algo falle en cargar
    setTimeout(ocultar, 5000);
  }

  /* ---- 6. Carrusel de aliados (Home): abre/cierra el panel de marcas ----
     El :checked ~ no reevalúa fiable en este combinador, así que
     sincronizamos una clase .aliados-open. El panel cubre el carrusel, por
     eso se cierra con clic fuera, en su fondo, o con Escape. */
  function menuAliados() {
    var toggle = document.getElementById('aliados-toggle');
    var partners = toggle ? toggle.closest('.partners') : null;
    if (!toggle || !partners) return;

    function sincronizar() {
      partners.classList.toggle('aliados-open', toggle.checked);
    }
    function cerrar() {
      if (!toggle.checked) return;
      toggle.checked = false;
      sincronizar();
    }
    toggle.addEventListener('change', sincronizar);

    document.addEventListener('mousedown', function (e) {
      if (toggle.checked && !partners.contains(e.target)) cerrar();
    });
    var menu = partners.querySelector('.aliados-menu');
    if (menu) {
      menu.addEventListener('click', function (e) {
        if (e.target === menu) cerrar();   // clic en el fondo del panel, no en un logo
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrar();
    });

    sincronizar();
  }

  /* ---- Logos que solo aparecen al interactuar ----
     Las versiones en color de los logos (marcas, aliados, tarjetas) están
     ocultas hasta que se abre o se pasa el mouse. Con carga diferida, el
     navegador recién las descargaba en ese momento y aparecían tarde.
     Al terminar de cargar la página se descargan y decodifican antes,
     así el primer cambio ya es instantáneo. */
  function precargarLogos() {
    function precargar() {
      var imgs = document.querySelectorAll('.brand-logo--color, .aliado-logo--color, .marca-card-logo--color');
      Array.prototype.forEach.call(imgs, function (img) {
        img.loading = 'eager';
        if (img.decode) img.decode().catch(function () {});
      });
    }
    if (document.readyState === 'complete') precargar();
    else window.addEventListener('load', precargar);
  }

  /* ---- Preguntas frecuentes: se abren con clic (o Enter / Espacio) ----
     Antes se abrían con hover y, al pasar el mouse por la lista, el
     contenido se movía debajo del cursor. Queda una abierta a la vez. */
  function preguntasFrecuentes() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    function cerrarTodas() {
      Array.prototype.forEach.call(items, function (it) {
        it.classList.remove('is-open');
        var q = it.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
    }

    Array.prototype.forEach.call(items, function (item) {
      var q = item.querySelector('.faq-question');
      if (!q) return;
      q.setAttribute('role', 'button');
      q.setAttribute('tabindex', '0');
      q.setAttribute('aria-expanded', 'false');

      function alternar() {
        var abrir = !item.classList.contains('is-open');
        cerrarTodas();
        if (abrir) {
          item.classList.add('is-open');
          q.setAttribute('aria-expanded', 'true');
        }
      }

      q.addEventListener('click', alternar);
      q.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alternar(); }
      });
    });
  }

  /* ---- 7. Idioma del sitio ----
     El sitio tiene páginas reales en inglés bajo /en/, generadas con
     .claude/generar-ingles.ps1 a partir de .claude/traducciones.json.
     El selector ESP/ENG del header son enlaces normales entre ambas
     versiones, así que no hace falta traducir nada en el navegador.
     Para cambiar un texto: edítalo en la página en español, actualiza su
     entrada en traducciones.json y vuelve a correr el generador. */

  /* ---- 8. Header inteligente ----
     Siempre visible arriba; al desplazarse hacia abajo se oculta hacia
     arriba y al subir reaparece. Además toma fondo compacto pasado un
     umbral. requestAnimationFrame evita reaccionar en cada evento de scroll. */
  function headerInteligente() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var ultimoY = window.pageYOffset || document.documentElement.scrollTop || 0;
    var UMBRAL = 40;   // desde aquí se compacta y puede ocultarse
    var DELTA = 6;     // movimiento mínimo para reaccionar (evita parpadeo)
    var pendiente = false;

    function actualizar() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      header.classList.toggle('is-scrolled', y > UMBRAL);

      // Con el menú móvil abierto, nunca ocultar el header
      if (header.classList.contains('nav-open')) {
        header.classList.remove('is-hidden');
        ultimoY = y;
        pendiente = false;
        return;
      }
      if (Math.abs(y - ultimoY) > DELTA) {
        if (y > ultimoY && y > UMBRAL) {
          header.classList.add('is-hidden');     // bajando -> ocultar
        } else {
          header.classList.remove('is-hidden');  // subiendo -> mostrar
        }
        ultimoY = y;
      }
      pendiente = false;
    }

    window.addEventListener('scroll', function () {
      if (!pendiente) {
        window.requestAnimationFrame(actualizar);
        pendiente = true;
      }
    }, { passive: true });

    actualizar();
  }

  /* ---- 9. Nombre de sección del header compacto -> volver al inicio ----
     Solo en las páginas normales (en las landing el identificador es el logo
     de la marca, que se deja no interactivo). */
  function inicioDesdeHeader() {
    var botones = document.querySelectorAll('button.header-section');
    Array.prototype.forEach.call(botones, function (btn) {
      btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  pantallaCarga();
  prepararCarruseles();
  scrollSuaveDesdeAncla();
  menuMovil();
  aparicionAlScroll();
  menuAliados();
  preguntasFrecuentes();
  precargarLogos();
  headerInteligente();
  inicioDesdeHeader();
  anioActual();
  avisoCookies();
  medirContactos();
  botonWhatsApp();
  formularioContacto();
})();
