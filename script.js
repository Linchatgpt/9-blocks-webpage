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
        footerEl.textContent = "Card " + card.id;

        cardEl.appendChild(headerEl);
        cardEl.appendChild(titleEl);
        cardEl.appendChild(taglineEl);
        cardEl.appendChild(listEl);
        cardEl.appendChild(footerEl);

        grid.appendChild(cardEl);
      });
    })
    .catch(function (err) {
      console.error(err);
      if (grid) {
        grid.innerHTML = "<p>載入卡片內容時發生問題，請稍後再試。</p>";
      }
    });
});
