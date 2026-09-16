const collapsibles = document.getElementsByClassName("collapsible");

for (let i = 0; i < collapsibles.length; i++) {
  collapsibles[i].addEventListener("click", function() {
    let content = this.nextElementSibling;
    let arrow = this.querySelector(".arrow");

    if (arrow.classList.contains("down-arrow")) {
      arrow.classList.remove("down-arrow");
      arrow.classList.add("up-arrow");
    }
    else {
      arrow.classList.remove("up-arrow");
      arrow.classList.add("down-arrow");
    }

    this.classList.toggle("active");
    
    content.classList.toggle("open");

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    }
    else {
      content.style.maxHeight = content.scrollHeight + 20 + "px";
    } 
  });
}

window.addEventListener("resize", () => {
  for (let i = 0; i < collapsibles.length; i++) {
    if (collapsibles[i].classList.contains("active")) {
	    let content = collapsibles[i].nextElementSibling;
      content.style.maxHeight = content.scrollHeight + 20 + "px";
	  }
  }
});

document.addEventListener("DOMContentLoaded", function(event) {
   document.querySelectorAll('img').forEach(function(img){
  	img.onerror = function(){this.style.display='none';};
   })
});