const profileInput = document.getElementById("profileInput");
const profileImage = document.getElementById("profileImage");

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