document.addEventListener("DOMContentLoaded", function () {
  const profileInput = document.getElementById("profileInput");
  const profileImage = document.getElementById("profileImage");
  const businessCard = document.querySelector(".business-card");

  // 프로필 이미지 업로드 기능
  if (profileInput && profileImage) {
    profileInput.addEventListener("change", function () {
      const file = this.files[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 선택할 수 있습니다.");
        return;
      }

      const reader = new FileReader();

      reader.onload = function (event) {
        profileImage.src = event.target.result;
      };

      reader.readAsDataURL(file);
    });
  }

  // 카드에 마우스를 올리면 부드럽게 떠오르는 효과
  if (businessCard) {
    businessCard.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
    businessCard.style.willChange = "transform";

    businessCard.addEventListener("mouseenter", function () {
      businessCard.style.transform = "translateY(-10px)";
      businessCard.style.boxShadow = "0 24px 60px rgba(191, 129, 243, 0.35)";
    });

    businessCard.addEventListener("mouseleave", function () {
      businessCard.style.transform = "translateY(0)";
      businessCard.style.boxShadow = "0 18px 45px var(--shadow)";
    });
  }

  // 이메일 요소 찾기
  const emailElement = findEmailElement();
  const emailButton = document.querySelector(".btn-mail");

  // 이메일 텍스트 클릭 시 복사
  if (emailElement) {
    emailElement.style.cursor = "pointer";
    emailElement.title = "클릭하면 이메일이 복사됩니다.";

    emailElement.addEventListener("click", function (event) {
      event.preventDefault();

      const emailText = getEmailText(emailElement);

      if (!emailText) {
        showToast("복사할 이메일을 찾을 수 없습니다.");
        return;
      }

      copyToClipboard(emailText);
    });
  }

  // 이메일 버튼 클릭 시 복사
  if (emailButton) {
    emailButton.addEventListener("click", function (event) {
      event.preventDefault();

      const emailText = getEmailText(emailElement) || getEmailText(emailButton);

      if (!emailText) {
        showToast("복사할 이메일을 찾을 수 없습니다.");
        return;
      }

      copyToClipboard(emailText);
    });
  }
});

// 이메일이 적힌 요소를 자동으로 찾는 함수
function findEmailElement() {
  const emailById = document.getElementById("emailValue") || document.getElementById("email");

  if (emailById) {
    return emailById;
  }

  const infoItems = document.querySelectorAll(".info-item");

  for (const item of infoItems) {
    const label = item.querySelector(".label");
    const value = item.querySelector(".value");

    if (!value) continue;

    const labelText = label ? label.textContent.trim().toLowerCase() : "";
    const valueText = value.textContent.trim();

    const isEmailLabel =
      labelText.includes("email") ||
      labelText.includes("mail") ||
      labelText.includes("이메일");

    const hasEmailText = extractEmail(valueText);

    if (isEmailLabel || hasEmailText) {
      return value;
    }
  }

  const mailLink = document.querySelector('a[href^="mailto:"]');

  if (mailLink) {
    return mailLink;
  }

  return null;
}

// 요소에서 이메일 텍스트만 추출하는 함수
function getEmailText(element) {
  if (!element) return "";

  const href = element.getAttribute("href");

  if (href && href.startsWith("mailto:")) {
    return href.replace("mailto:", "").split("?")[0].trim();
  }

  const text = element.textContent.trim();
  const email = extractEmail(text);

  return email || text;
}

// 이메일 형식만 추출하는 함수
function extractEmail(text) {
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const result = text.match(emailPattern);

  return result ? result[0] : "";
}

// 클립보드 복사 함수
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

// 구형 브라우저 대응용 복사 함수
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

// 복사 완료 안내 메시지
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