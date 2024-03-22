// document.getElementById("myForm").addEventListener("submit", function (e) {
//   e.preventDefault();
// 
//   console.log("here")
// 
//   var formData = new FormData(form);
//   // output as an object
//   console.log(Object.fromEntries(formData));
// 
//   // ...or iterate through the name-value pairs
//   for (var pair of formData.entries()) {
//     console.log(pair[0] + ": " + pair[1]);
//   }
// }); 


function getMathPage() {

  selectElement = document.querySelector('#select1');
  output = selectElement.value;

  console.log(output);

  window.location.href = './' + output;
}

