const fullImageViewer = document.getElementById("full-image-viewer");
const fullSizeImage = document.getElementById("full-size-image");
const helpMain = document.getElementById("help-main");

let imageTags = helpMain.getElementsByTagName("img");

fullImageViewer.onclick = function() {
  fullImageViewer.style.display = "none";
}

fullImageViewer.onclick = function() {
  fullImageViewer.style.display = "none";
}

for (let i = 0; i < imageTags.length; i++) {
  imageTags[i].onclick = function() {
    fullSizeImage.src = imageTags[i].src;
    fullImageViewer.style.display = "block";
  }
}