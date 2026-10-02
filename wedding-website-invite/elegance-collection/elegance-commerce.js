(function () {
  "use strict";

  var root = "/wedding-website-invite/elegance-collection";
  var match = window.location.pathname.match(/\/websites\/(hindu|muslim|sikh|christian)\/(garden|palace|editorial|heritage|heirloom)\/?$/i);
  var isCollectionRoot = !match && window.location.pathname.replace(/\/$/, "") === root;
  var names = {
    garden: "The Secret Garden",
    palace: "The Royal Courtyard",
    editorial: "The Modern Heirloom",
    heritage: "The Burgundy Letter",
    heirloom: "The Moonlit Heirloom"
  };
  var previewData = {
    hindu: {
      names: "Ananya & Aarav",
      garden: "hindu-garden-hero-crisp-v2.png",
      palace: "palace-garden.webp",
      editorial: "hindu-couple.webp",
      heritage: "heritage-hindu-envelope.webp",
      heirloom: "heirloom-hindu-hero.webp"
    },
    muslim: {
      names: "Aaliya & Zayan",
      garden: "muslim-garden-hero-crisp.png",
      palace: "palace-garden.webp",
      editorial: "muslim-couple.webp",
      heritage: "heritage-muslim-envelope.webp",
      heirloom: "heirloom-muslim-hero.webp"
    },
    sikh: {
      names: "Simran & Arjun",
      garden: "sikh-garden-hero-crisp.png",
      palace: "palace-garden.webp",
      editorial: "sikh-couple.webp",
      heritage: "heritage-sikh-envelope.webp",
      heirloom: "heirloom-sikh-hero.webp"
    },
    christian: {
      names: "Isabelle & Gabriel",
      garden: "christian-garden-hero-crisp.png",
      palace: "palace-garden.webp",
      editorial: "christian-couple.webp",
      heritage: "heritage-christian-envelope.webp",
      heirloom: "heirloom-christian-hero.webp"
    }
  };
  var needsThemeReload = false;

  // The copied collection uses this flag to reveal the selected invitation.
  // Set it before the framework's first animation frame on direct theme loads.
  if (match) {
    try {
      needsThemeReload = sessionStorage.getItem("wedding-religion") !== match[1].toLowerCase();
      sessionStorage.setItem("wedding-religion", match[1].toLowerCase());
    } catch (error) {}
  }

  function titleCase(value) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  function addEntryGate() {
    if (!isCollectionRoot || document.querySelector(".elegance-entry-gate")) return;
    document.title = "Elegance Collection | Wedding Website Themes | LoveSolutions.in";
    var gate = document.createElement("main");
    gate.className = "elegance-entry-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-label", "Choose your religion and wedding theme");
    gate.innerHTML = '<header><p>LOVE, BEAUTIFULLY INVITED</p><h1>Elegance <em>Collection</em></h1><span>✧</span><h2>Rooted in tradition. Made for your forever.</h2><small>Choose your religion to discover five invitation themes.</small></header><div class="elegance-entry-options"></div><a class="elegance-entry-back" href="/wedding-website-invite/">Go back to all samples ↗</a>';
    var options = gate.querySelector(".elegance-entry-options");
    gate.addEventListener("click", function (event) {
      if (!event.target.closest(".elegance-change-religion")) return;
      event.preventDefault();
      event.stopPropagation();
      showReligions();
    }, true);
    showReligions();
    Array.prototype.forEach.call(document.body.children, function (child) {
      if (!child.matches("script, style, link")) {
        child.setAttribute("inert", "");
        child.setAttribute("aria-hidden", "true");
      }
    });
    document.body.appendChild(gate);
    document.body.classList.add("elegance-gate-open");

    function showReligions() {
      gate.classList.remove("elegance-themes-open");
      options.className = "elegance-entry-options";
      options.innerHTML = "";
      ["hindu", "muslim", "sikh", "christian"].forEach(function (religion) {
        var button = document.createElement("button");
        button.type = "button";
        button.innerHTML = '<img src="' + root + '/assets/elegance-' + religion + '-v1.png" alt=""><span><strong>' + titleCase(religion) + '</strong><small>Explore collection ↗</small></span>';
        button.addEventListener("click", function () { showThemes(religion); });
        options.appendChild(button);
      });
      gate.querySelector("header small").textContent = "Choose your religion to discover five invitation themes.";
    }

    function showThemes(religion) {
      try { sessionStorage.setItem("wedding-religion", religion); } catch (error) {}
      gate.classList.add("elegance-themes-open");
      options.className = "elegance-entry-themes";
      options.innerHTML = "";
      Object.keys(names).forEach(function (style) {
        var link = document.createElement("a");
        var preview = previewData[religion];
        link.href = root + "/websites/" + religion + "/" + style + "/";
        link.setAttribute("aria-label", "Open " + names[style] + " " + titleCase(religion) + " wedding sample");
        link.innerHTML = '<figure class="design-mini elegance-theme-preview"><img src="' + root + '/assets/' + preview[style] + '" alt="' + titleCase(religion) + ' ' + names[style] + ' wedding website preview" loading="lazy"></figure><span class="elegance-theme-name">' + names[style] + '</span><small>Open sample ↗</small>';
        options.appendChild(link);
      });
      var change = document.createElement("button");
      change.type = "button";
      change.className = "elegance-change-religion";
      change.textContent = "← Change religion";
      options.appendChild(change);
      gate.querySelector("header small").textContent = titleCase(religion) + " · Choose your theme";
    }
  }

  function addBackLink() {
    document.querySelectorAll(".collection-dialog .design-list").forEach(function (list) {
      if (list.querySelector(".elegance-all-samples")) return;
      var back = document.createElement("a");
      back.className = "elegance-all-samples";
      back.href = "/wedding-website-invite/";
      back.textContent = "Go back to all samples ↗";
      list.appendChild(back);
    });
  }

  function forceCollectionNavigation(event) {
    var anchor = event.target.closest("a[href]");
    if (!anchor) return;
    var url = new URL(anchor.href, window.location.href);
    if (!url.pathname.startsWith(root + "/websites/")) return;
    event.preventDefault();
    window.location.assign(url.href);
  }

  function addPurchaseDock() {
    if (!match || document.querySelector(".elegance-purchase-dock")) return;
    var religion = titleCase(match[1]);
    var theme = names[match[2].toLowerCase()] || titleCase(match[2]);
    var message = "Hi LoveSolutions.in! I would love to buy the “" + theme + "” theme from the Elegance Collection for a " + religion + " wedding. The price shown is ₹3,999/-. Please share the next steps.";
    var dock = document.createElement("aside");
    dock.className = "elegance-purchase-dock";
    dock.setAttribute("aria-label", "Buy " + theme);
    dock.innerHTML = '<div class="elegance-purchase-meta"><strong>' + theme + '</strong></div><button type="button">Choose theme</button><a target="_blank" rel="noopener noreferrer">Buy now</a>';
    dock.querySelector("button").addEventListener("click", function () {
      var chooser = document.querySelector(".design-chooser");
      if (chooser) chooser.click();
    });
    dock.querySelector("a").href = "https://wa.me/919183404002?text=" + encodeURIComponent(message);
    document.body.appendChild(dock);
  }

  document.addEventListener("click", forceCollectionNavigation, true);
  new MutationObserver(addBackLink).observe(document.documentElement, { childList: true, subtree: true });
  if (needsThemeReload) {
    window.location.replace(window.location.href);
    return;
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { addEntryGate(); addPurchaseDock(); addBackLink(); });
  } else {
    addEntryGate();
    addPurchaseDock();
    addBackLink();
  }
})();
