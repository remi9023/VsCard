document.addEventListener("DOMContentLoaded", function () {
  const emailElement = document.getElementById("emailValue");

  if (emailElement) {
    emailElement.title = "클릭하면 이메일이 복사됩니다.";

    emailElement.addEventListener("click", function () {
      const emailText = emailElement.textContent.trim();

      if (!emailText) {
        showToast("복사할 이메일을 찾을 수 없습니다.");
        return;
      }

      copyToClipboard(emailText);
    });
  }

  initCardEdgeGlow();
});

function initCardEdgeGlow() {
  const card = document.querySelector(".business-card");

  if (!card) return;

  const glow = document.createElement("div");
  glow.className = "card-edge-glow";
  document.body.appendChild(glow);

  const glowRange = 90;

  document.addEventListener("mousemove", function (event) {
    const rect = card.getBoundingClientRect();

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const isInsideX = mouseX >= rect.left && mouseX <= rect.right;
    const isInsideY = mouseY >= rect.top && mouseY <= rect.bottom;
    const isInsideCard = isInsideX && isInsideY;

    let glowX = mouseX;
    let glowY = mouseY;
    let distanceToBorder = 0;

    if (isInsideCard) {
      const distanceLeft = mouseX - rect.left;
      const distanceRight = rect.right - mouseX;
      const distanceTop = mouseY - rect.top;
      const distanceBottom = rect.bottom - mouseY;

      distanceToBorder = Math.min(
        distanceLeft,
        distanceRight,
        distanceTop,
        distanceBottom
      );

      if (distanceToBorder === distanceLeft) {
        glowX = rect.left;
        glowY = mouseY;
      } else if (distanceToBorder === distanceRight) {
        glowX = rect.right;
        glowY = mouseY;
      } else if (distanceToBorder === distanceTop) {
        glowX = mouseX;
        glowY = rect.top;
      } else {
        glowX = mouseX;
        glowY = rect.bottom;
      }
    } else {
      glowX = Math.min(Math.max(mouseX, rect.left), rect.right);
      glowY = Math.min(Math.max(mouseY, rect.top), rect.bottom);

      const distanceX = mouseX - glowX;
      const distanceY = mouseY - glowY;

      distanceToBorder = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    }

    if (distanceToBorder > glowRange) {
      glow.style.opacity = "0";
      return;
    }

    const glowPower = 1 - distanceToBorder / glowRange;
    const glowOpacity = 0.15 + glowPower * 0.85;

    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    glow.style.opacity = glowOpacity.toFixed(2);
  });

  document.addEventListener("mouseleave", function () {
    glow.style.opacity = "0";
  });

  window.addEventListener("blur", function () {
    glow.style.opacity = "0";
  });
}

function copyToClipboard(text) {
  if (!text) return;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        showToast("이메일이 복사되었습니다.");
      })
      .catch(function () {
        fallbackCopyToClipboard(text);
      });

    return;
  }

  fallbackCopyToClipboard(text);
}

function fallbackCopyToClipboard(text) {
  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand("copy");
    showToast("이메일이 복사되었습니다.");
  } catch (error) {
    showToast("이메일 복사에 실패했습니다.");
  }

  document.body.removeChild(textarea);
}

function showToast(message) {
  let toast = document.getElementById("copyToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "copyToast";
    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "28px";
    toast.style.transform = "translateX(-50%)";
    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "999px";
    toast.style.background = "#bf81f3";
    toast.style.color = "#ffffff";
    toast.style.fontSize = "14px";
    toast.style.fontWeight = "700";
    toast.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.35)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.25s ease, bottom 0.25s ease";
    toast.style.zIndex = "9999";

    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.bottom = "36px";

  setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.bottom = "28px";
  }, 1800);
}