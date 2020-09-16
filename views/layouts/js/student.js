let val = localStorage.getItem("User");
if (val) {
  let data = JSON.parse(val);
  if (data.Taken) {
    console.log("Already Taken");
    document.querySelector("#Take").removeAttribute("href");
  } else {
    console.log("Not Taken");
  }
} else {
  console.log("Not Taken");
}
function getdata() {
  alert("Nandha");
  var obj = {
    user: "Nandha",
    Taken: "true",
  };
  localStorage.setItem("User", JSON.stringify(obj));
}
$(document).ready(function () {
  var elmnt = document.getElementsByTagName("BODY");
  var y = elmnt.scrollHeight;
  var x = elmnt.scrollWidth;
  console.log("H= " + y + "W= " + x);
});
