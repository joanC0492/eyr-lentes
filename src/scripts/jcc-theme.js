(() => {
  "use strict";

  const MONEY_NODE_SELECTOR =
    "#minicard .money, .ajax_cart_money .money, .ajaxcart__footer .money";

  const FROM_SYMBOL = "$";
  const TO_SYMBOL = "S/";

  function normalizeText(value) {
    return (value ?? "").trim();
  }

  function replaceLeadingCurrencySymbol(text) {
    if (!text.startsWith(FROM_SYMBOL)) return text;
    return `${TO_SYMBOL}${text.slice(FROM_SYMBOL.length)}`;
  }

  function updateCurrencySymbols(scope = document) {
    const moneyNodes = scope.querySelectorAll(MONEY_NODE_SELECTOR);
    if (moneyNodes.length === 0) return false;

    moneyNodes.forEach((node) => {
      const currentText = normalizeText(node.textContent);

      if (!currentText) return;
      if (currentText.startsWith(TO_SYMBOL)) return;

      node.textContent = replaceLeadingCurrencySymbol(currentText);
    });

    return true;
  }

  function observeDomChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
          if (!(addedNode instanceof Element)) return;
          updateCurrencySymbols(addedNode);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function initCurrencySymbolUpdater() {
    updateCurrencySymbols(document);
    observeDomChanges();
  }

  document.addEventListener("DOMContentLoaded", initCurrencySymbolUpdater);
})();
