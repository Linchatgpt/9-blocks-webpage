document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid");

  fetch("content.json")
    .then(function (res) {
      if (!res.ok) {
        throw new Error("無法載入 content.json");
      }
      return res.json();
    })
    .then(function (data) {
      if (!data.cards || !Array.isArray(data.cards)) {
        throw new Error("content.json 結構錯誤：缺少 cards 陣列");
      }

      data.cards.forEach(function (card) {
        const cardEl = document.createElement("article");
        cardEl.className = "card";

        const headerEl = document.createElement("div");
        headerEl.className = "card-header";
        headerEl.textContent = card.section || "";

        const titleEl = document.createElement("h2");
        titleEl.className = "card-title";
        titleEl.textContent = card.title || "";

        const taglineEl = document.createElement("p");
        taglineEl.className = "card-tagline";
        taglineEl.textContent = card.tagline || "";

        const listEl = document.createElement("ul");
        listEl.className = "card-list";

        if (Array.isArray(card.points)) {
          card.points.forEach(function (pt) {
            const li = document.createElement("li");
            li.textContent = pt;
            listEl.appendChild(li);
          });
        }

        const footerEl = document.createElement("div");
        footerEl.className = "card-footer";

        const footerLeft = document.createElement("span");
        footerLeft.textContent = "Card " + card.id;

        const footerHint = document.createElement("span");
        footerHint.className = "card-footer-hint";
        footerHint.textContent = "點一下展開 / 收合";

        footerEl.appendChild(footerLeft);
        footerEl.appendChild(footerHint);

        cardEl.appendChild(headerEl);
        cardEl.appendChild(titleEl);
        cardEl.appendChild(taglineEl);
        cardEl.appendChild(listEl);
        cardEl.appendChild(footerEl);

        grid.appendChild(cardEl);
      });

      // 手機端：點擊卡片展開 / 收合
      const mql = window.matchMedia("(max-width: 640px)");

      function setupMobileToggle(e) {
        const isMobile = e.matches;

        const cards = document.querySelectorAll(".card");
        cards.forEach(function (cardEl) {
          // 清掉舊 listener，避免重複綁定
          cardEl.replaceWith(cardEl.cloneNode(true));
        });

        const refreshedCards = document.querySelectorAll(".card");

        if (isMobile) {
          refreshedCards.forEach(function (cardEl) {
            cardEl.addEventListener("click", function () {
              const isOpen = cardEl.classList.contains("is-open");
              // 先把其他卡片收起來（單一展開）
              refreshedCards.forEach(function (c) {
                c.classList.remove("is-open");
              });
              if (!isOpen) {
                cardEl.classList.add("is-open");
              }
            });
          });
        }
        // 桌機端不需要特別處理，一律全展開
      }

      // 初次判斷一次
      setupMobileToggle(mql);
      // 當視窗寬度改變（例如旋轉手機）時重新設定
      mql.addEventListener("change", setupMobileToggle);
    })
    .catch(function (err) {
      console.error(err);
      if (grid) {
        grid.innerHTML = "<p>載入卡片內容時發生問題，請稍後再試。</p>";
      }
    });
});
