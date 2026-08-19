// Afresh DC — cookie-consent.js
// Cookie lišta (vanilla-cookieconsent, vendor/cookieconsent/) napojená na Google Consent
// Mode v2 pro GTM (GTM-KNCDDDRK, viz inline skript v <head> na každé stránce). Dokud
// návštěvník nerozhodne, GTM běží s analytics_storage: 'denied' (výchozí stav nastavený
// tím inline skriptem ještě před načtením gtm.js) — Google tagy v GTM (např. GA4) tenhle
// stav respektují automaticky (built-in consent checks), takže bez souhlasu se nespustí.
// Jakmile návštěvník souhlas udělí nebo odvolá, pošleme aktualizovaný stav přes
// gtag('consent', 'update', …); knihovna se zároveň stará o uložení volby (localStorage)
// a smazání analytických cookies při odmítnutí/odvolání (viz "autoClear" v categories).
//
// Odkaz "Nastavení cookies" v patičce každé stránky lištu znovu otevře sám — element
// s atributem data-cc="show-preferencesModal" na klik naváže knihovna automaticky.
document.addEventListener('DOMContentLoaded', () => {
  if (typeof CookieConsent === 'undefined') return;

  const updateGtagConsent = () => {
    if (typeof gtag !== 'function') return;
    gtag('consent', 'update', {
      analytics_storage: CookieConsent.acceptedCategory('analytics') ? 'granted' : 'denied',
    });
  };

  CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: 'bar inline',
        position: 'bottom',
        equalWeightButtons: true,
        flipButtons: false,
      },
      preferencesModal: {
        layout: 'box',
        position: 'right',
        equalWeightButtons: true,
        flipButtons: false,
      },
    },
    categories: {
      necessary: {
        readOnly: true,
      },
      analytics: {
        autoClear: {
          cookies: [{ name: /^_ga/ }],
        },
      },
    },
    language: {
      default: 'cs',
      translations: {
        cs: {
          consentModal: {
            title: 'Používáme cookies',
            description:
              'Nezbytné cookies používáme vždy. Se souhlasem přidáme analytické (Google Analytics) — víc v <a href="/cookies.html">zásadách cookies</a>.',
            acceptAllBtn: 'Přijmout vše',
            acceptNecessaryBtn: 'Odmítnout',
            showPreferencesBtn: 'Podrobné nastavení',
          },
          preferencesModal: {
            title: 'Nastavení cookies',
            acceptAllBtn: 'Přijmout vše',
            acceptNecessaryBtn: 'Odmítnout vše',
            savePreferencesBtn: 'Uložit nastavení',
            closeIconLabel: 'Zavřít',
            serviceCounterLabel: 'Služba|Služby',
            sections: [
              {
                title: 'Nezbytně nutné cookies',
                description: 'Umožňují základní chod webu (např. zapamatování tvé volby v téhle liště) a nejde je vypnout.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Analytické cookies',
                description: 'Google Analytics 4 přes Google Tag Manager — pomáhá nám pochopit návštěvnost webu. Bez souhlasu se vůbec nenačte.',
                linkedCategory: 'analytics',
              },
              {
                title: 'Víc informací',
                description: 'Podrobnosti o jednotlivých cookies najdeš na stránce <a href="/cookies.html">Cookies</a> a v <a href="/gdpr.html">Ochraně osobních údajů</a>.',
              },
            ],
          },
        },
      },
    },
    onFirstConsent: updateGtagConsent,
    onConsent: updateGtagConsent,
    onChange: updateGtagConsent,
  });
});
