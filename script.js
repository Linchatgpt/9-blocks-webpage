// 解析文字中的第一個 URL
function extractURL(text) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
}

// 把文字中的 URL 拿掉，只留下要顯示的部分
function removeURLFromText(text) {
  if (!text) return "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let cleaned = text.replace(urlRegex, "");

  // 把結尾可能多餘的分隔符號去掉（｜ | : ： - 空白）
  cleaned = cleaned.replace(/[\s｜|:：-]+$/, "");
  return cleaned.trim();
}

// 將 @primary 這類 token 轉成實際色碼
function resolveColor(value, palette) {
  if (typeof value !== "string") return value;
  if (value.startsWith("@")) {
    const key = value.slice(1);
    return palette && palette[key] ? palette[key] : value;
  }
  return value;
}

document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid");

  if (!grid) {
    console.error("找不到 #grid 容器");
    return;
  }

  fetch("content.json")
    .then(function (res) {
      if (!res.ok) {
        throw new Error("無法載入 content.json");
      }
      return res.json();
    })
    .then(function (data) {
      // ========= 0. 基本結構檢查 =========
      if (!data || !data.cards || !Array.isArray(data.cards)) {
        throw new Error("content.json 結構錯誤：缺少 cards 陣列");
      }

      const pageTitleEl = document.querySelector(".page-title");
      const pageSubtitleEl = document.querySelector(".page-subtitle");
      const palette =
        data.meta && data.meta.colorPalette ? data.meta.colorPalette : {};

      // ========= 1. 標題與副標題（顯示方式 C：隱形連結） =========
      if (data.meta) {
        // ---- 主標題 ----
        if (pageTitleEl && typeof data.meta.title === "string") {
          const rawTitle = data.meta.title;
          const titleURL = extractURL(rawTitle);
          const displayTitle = removeURLFromText(rawTitle) || rawTitle;

          pageTitleEl.textContent = displayTitle;
          document.title = displayTitle || document.title;

          if (titleURL) {
            pageTitleEl.style.cursor = "pointer";
            pageTitleEl.addEventListener("click", function () {
              window.open(titleURL, "_blank", "noopener");
            });
          }
        }

        // ---- 副標題 ----
        if (pageSubtitleEl && typeof data.meta.subtitle === "string") {
          const rawSubtitle = data.meta.subtitle;
          const subtitleURL = extractURL(rawSubtitle);
          const displaySubtitle =
            removeURLFromText(rawSubtitle) || rawSubtitle;

          pageSubtitleEl.textContent = displaySubtitle;

          if (subtitleURL) {
            pageSubtitleEl.style.cursor = "pointer";
            pageSubtitleEl.addEventListener("click", function () {
              window.open(subtitleURL, "_blank", "noopener");
            });
          }
        }

        // ========= 2. 依 meta.styles + colorPalette 產生動態 CSS =========
        if (data.meta.styles && typeof data.meta.styles === "object") {
          const styles = data.meta.styles;
          let cssText = "";

          // 2-0. 全局背景與卡片預設背景
          if (palette.background) {
            cssText += "body{background:" + palette.background + ";}";
          }
          if (palette.cardBackground) {
            cssText += ".card{background:" + palette.cardBackground + ";}";
          }

          // 2-1. 主標題樣式
          if (styles.pageTitle) {
            cssText += ".page-title{";
            if (styles.pageTitle.fontSize) {
              cssText += "font-size:" + styles.pageTitle.fontSize + ";";
            }
            if (styles.pageTitle.color) {
              cssText +=
                "color:" +
                resolveColor(styles.pageTitle.color, palette) +
                ";";
            }
            if (styles.pageTitle.fontFamily) {
              cssText +=
                "font-family:" + styles.pageTitle.fontFamily + ";";
            }
            cssText += "}";
          }

          // 2-2. 副標題樣式
          if (styles.pageSubtitle) {
            cssText += ".page-subtitle{";
            if (styles.pageSubtitle.fontSize) {
              cssText += "font-size:" + styles.pageSubtitle.fontSize + ";";
            }
            if (styles.pageSubtitle.color) {
              cssText +=
                "color:" +
                resolveColor(styles.pageSubtitle.color, palette) +
                ";";
            }
            if (styles.pageSubtitle.fontFamily) {
              cssText +=
                "font-family:" + styles.pageSubtitle.fontFamily + ";";
            }
            cssText += "}";
          }

          // 2-3. 卡片區塊：上方小標（section）
          if (styles.cardSection) {
            cssText += ".card-header{";
            if (styles.cardSection.fontSize) {
              cssText +=
                "font-size:" + styles.cardSection.fontSize + ";";
            }
            if (styles.cardSection.color) {
              cssText +=
                "color:" +
                resolveColor(styles.cardSection.color, palette) +
                ";";
            }
            if (styles.cardSection.backgroundColor) {
              cssText +=
                "background-color:" +
                resolveColor(
                  styles.cardSection.backgroundColor,
                  palette
                ) +
                ";";
            }
            if (styles.cardSection.fontFamily) {
              cssText +=
                "font-family:" + styles.cardSection.fontFamily + ";";
            }
            if (styles.cardSection.borderColor) {
              cssText +=
                "border-color:" +
                resolveColor(styles.cardSection.borderColor, palette) +
                ";";
            }
            if (styles.cardSection.borderWidth) {
              cssText +=
                "border-width:" + styles.cardSection.borderWidth + ";";
              cssText += "border-style:solid;";
            }
            cssText += "}";
          }

          // 2-4. 卡片主標題
          if (styles.cardTitle) {
            cssText += ".card-title{";
            if (styles.cardTitle.fontSize) {
              cssText +=
                "font-size:" + styles.cardTitle.fontSize + ";";
            }
            if (styles.cardTitle.color) {
              cssText +=
                "color:" +
                resolveColor(styles.cardTitle.color, palette) +
                ";";
            }
            if (styles.cardTitle.fontFamily) {
              cssText +=
                "font-family:" + styles.cardTitle.fontFamily + ";";
            }
            cssText += "}";
          }

          // 2-5. 卡片副標 / 說明
          if (styles.cardTagline) {
            cssText += ".card-tagline{";
            if (styles.cardTagline.fontSize) {
              cssText +=
                "font-size:" + styles.cardTagline.fontSize + ";";
            }
            if (styles.cardTagline.color) {
              cssText +=
                "color:" +
                resolveColor(styles.cardTagline.color, palette) +
                ";";
            }
            if (styles.cardTagline.fontFamily) {
              cssText +=
                "font-family:" + styles.cardTagline.fontFamily + ";";
            }
            cssText += "}";
          }

          // 2-6. 卡片條列點
          if (styles.cardPoint) {
            cssText += ".card-list li{";
            if (styles.cardPoint.fontSize) {
              cssText +=
                "font-size:" + styles.cardPoint.fontSize + ";";
            }
            if (styles.cardPoint.color) {
              cssText +=
                "color:" +
                resolveColor(styles.cardPoint.color, palette) +
                ";";
            }
            if (styles.cardPoint.fontFamily) {
              cssText +=
                "font-family:" + styles.cardPoint.fontFamily + ";";
            }
            cssText += "}";
          }

          // 2-7. 卡片容器（邊框、圓角、陰影）
          if (styles.cardContainer) {
            cssText += ".card{";
            if (styles.cardContainer.borderColor) {
              cssText +=
                "border-color:" +
                resolveColor(
                  styles.cardContainer.borderColor,
                  palette
                ) +
                ";";
            }
            if (styles.cardContainer.borderWidth) {
              cssText +=
                "border-width:" +
                styles.cardContainer.borderWidth +
                ";border-style:solid;";
            }
            if (styles.cardContainer.borderRadius) {
              cssText +=
                "border-radius:" +
                styles.cardContainer.borderRadius +
                ";";
            }
            if (styles.cardContainer.boxShadow) {
              cssText +=
                "box-shadow:" + styles.cardContainer.boxShadow + ";";
            }
            cssText += "}";
          }

          if (cssText.length > 0) {
            const styleEl = document.createElement("style");
            styleEl.textContent = cssText;
            document.head.appendChild(styleEl);
          }
        }
      }

      // ========= 3. 產生卡片 HTML =========
      grid.innerHTML = ""; // 先清空

      data.cards.forEach(function (card) {
        const cardEl = document.createElement("article");
        cardEl.className = "card";

        // 3-1. section / 類別
        const headerEl = document.createElement("div");
        headerEl.className = "card-header";
        headerEl.textContent = card.section || "";

        // 3-2. 卡片主標題
        const titleEl = document.createElement("h2");
        titleEl.className = "card-title";
        titleEl.textContent = card.title || "";

        // 3-3. 卡片 tagline / 短句
        const taglineEl = document.createElement("p");
        taglineEl.className = "card-tagline";
        taglineEl.textContent = card.tagline || "";

        // 3-4. 條列重點
        const listEl = document.createElement("ul");
        listEl.className = "card-list";

        if (Array.isArray(card.points)) {
          card.points.forEach(function (pt) {
            const li = document.createElement("li");
            li.textContent = pt;
            listEl.appendChild(li);
          });
        }

        // 3-5. 卡片 footer
        const footerEl = document.createElement("div");
        footerEl.className = "card-footer";

        const footerLeft = document.createElement("span");
        footerLeft.textContent = card.id ? String(card.id) : "";

        const footerHint = document.createElement("span");
        footerHint.className = "card-footer-hint";
        footerHint.textContent = "點一下展開 / 收合";

        footerEl.appendChild(footerLeft);
        footerEl.appendChild(footerHint);

        // 組合卡片
        cardEl.appendChild(headerEl);
        cardEl.appendChild(titleEl);
        cardEl.appendChild(taglineEl);
        cardEl.appendChild(listEl);
        cardEl.appendChild(footerEl);

        grid.appendChild(cardEl);
      });

      // ========= 4. 手機版卡片展開 / 收合 =========
      const cards = Array.prototype.slice.call(
        document.querySelectorAll(".card")
      );
      const mql = window.matchMedia("(max-width: 640px)");

      function handleCardClick(event) {
        // 只在手機寬度時啟用展開 / 收合
        if (!mql.matches) {
          return;
        }

        const cardEl = event.currentTarget;
        const isOpen = cardEl.classList.contains("is-open");

        // 先把其他卡片收起來（單一展開模式）
        cards.forEach(function (c) {
          c.classList.remove("is-open");
        });

        if (!isOpen) {
          cardEl.classList.add("is-open");
        }
      }

      // 綁定 click 事件
      cards.forEach(function (cardEl) {
        cardEl.addEventListener("click", handleCardClick);
      });
    })
    .catch(function (err) {
      console.error(err);
      if (grid) {
        grid.innerHTML =
          "<p>載入卡片內容時發生問題，請稍後再試。</p>";
      }
    });
});
