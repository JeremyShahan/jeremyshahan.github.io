let disable_scroll = document.getElementById("graph");


disable_scroll.addEventListener("mouseleave", function (event) {
  event.target.textContent = "mouse out";
  document.body.style.overflow = "";
}, false);


disable_scroll.addEventListener("mouseover", function (event) {
  event.target.textContent = "mouse in";
  document.body.style.overflow = "hidden";
}, false);
