/* =====================================================================
   SCRIPTS GLOBALES — compartido por todas las páginas
   Solo dos utilidades, ambas con degradación elegante (si el JS falla,
   el sitio sigue viéndose bien, solo pierde el movimiento/suavizado):

   1) Duplica el contenido de los carruseles para el loop infinito,
      así el HTML ya no lleva las imágenes repetidas a mano.
   2) Scroll suave al aterrizar en una página con ancla (ej. #servicios),
      que es lo único que el CSS no puede hacer entre páginas distintas.
   ===================================================================== */

(function () {
  'use strict';

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
      '.contact-lead > h2', '.contact-lead > p', '.contact-form-frame',
      '.contact-here > h2', '.contact-map', '.contact-pill'
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
        el.classList.add('is-visible');
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
      document.documentElement.classList.add('hero-listo');
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
  headerInteligente();
  inicioDesdeHeader();
})();
