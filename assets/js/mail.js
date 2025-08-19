(function () {
  const TO_EMAIL = "hello@beamy.works"; 

  function sanitizeText(t) {
    return t.replace("❌", "").trim();
  }

  function buildBodyText(lines) {
    return (
      "Kedves beamy.works,\r\n\r\n" +
      "Az alábbi termékek iránt érdeklődök:\r\n\r\n" +
      lines.map((v, i) => `${i + 1}. ${v}`).join("\r\n") +
      "\r\n\r\nKöszönettel,\r\n"
    );
  }

  function updateMailLink() {
    const items = Array.from(document.querySelectorAll("#productList li"));
    const header = document.getElementById("selectedProductsHeader");
    const mailLink = document.getElementById("mailLink");
    const copyLink = document.getElementById("copyLink");

    if (!header || !mailLink || !copyLink) return;

    if (items.length === 0) {
      header.textContent = "Nincs kiválasztott termék.";
      mailLink.style.display = "none";
      copyLink.style.display = "none";
      return;
    }

    header.textContent = "Kiválasztott termékek:";

    const lines = items.map(li => sanitizeText(li.textContent));
    const subjectText = "Megrendelés – kiválasztott termékek";
    const bodyText = buildBodyText(lines);

    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(bodyText);
    const href = `mailto:${encodeURIComponent(TO_EMAIL)}?subject=${subject}&body=${body}`;

    // Mailto visible only if not too long
    if (href.length > 1800) {
      mailLink.style.display = "none";
    } else {
      mailLink.href = href;
      mailLink.style.display = "inline";
    }

    // Always show copy link when items exist
    copyLink.style.display = "inline";
    copyLink.setAttribute("href", "javascript:void(0)");
    copyLink.setAttribute("role", "button");

    // Tiny, non-intrusive feedback (text swap for 1.5s)
    copyLink.onclick = async (e) => {
      e.preventDefault();
      const text = `${bodyText}`;

      // Try modern clipboard first
      let copied = false;
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        // Fallback for non-secure contexts
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try { copied = document.execCommand("copy"); } catch {}
        document.body.removeChild(ta);
      }

      // Swap text briefly if copied (no popup)
      if (copied) {
        const original = copyLink.textContent;
        copyLink.textContent = "✓ Másolva";
        if (copyLink._timer) clearTimeout(copyLink._timer);
        copyLink._timer = setTimeout(() => {
          copyLink.textContent = original;
          copyLink._timer = null;
        }, 1500);
      }
    };
  }

  // Expose globally for cart.js and run once on load
  window.updateMailLink = updateMailLink;
  document.addEventListener("DOMContentLoaded", updateMailLink);
})();
