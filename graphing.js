var window_x_min = -10;
var window_x_max = 10;
var window_y_min = -10;
var window_y_max = 10;

generate_graph(window_x_min, window_x_max, window_y_min, window_y_max);

function generate_graph(window_x_min, window_x_max, window_y_min, window_y_max) {
  var width = window.innerWidth*3;
  var height = window.innerHeight*3;

  var window_x_size = (window_x_max - window_x_min);
  var window_y_size = (window_y_max - window_y_min);

  var canvas = document.getElementById('my_canvas');
  c = canvas.getContext('2d');

  canvas.width = width;
  canvas.style.width = width;
  canvas.height = height;
  canvas.style.height = height;

  const card_back = document.getElementById('card_back');

  card_back.style.top = (-height/3) + 'px';
  card_back.style.left = (-width/3) + 'px';

  var tick_x_distance = width / (3*(window_x_max - window_x_min));
  var tick_y_distance = height / (3*(window_y_max - window_y_min));
  var tick_length = 20;

  var origin = [-1 * window_x_min * tick_x_distance + width/3, window_y_max * tick_y_distance + height/3];
  var x, y;

  var tick_x_locations = makeArr(Math.ceil(window_x_min) - window_x_size, Math.floor(window_x_max) + window_x_size, Math.floor(window_x_max + window_x_size) - Math.ceil(window_x_min - window_x_size) + 1);
  var index = tick_x_locations.indexOf(0);
  tick_x_locations.splice(index, 1);

  var tick_y_locations = makeArr(Math.ceil(window_y_min) - window_y_size, Math.floor(window_y_max) + window_y_size, Math.floor(window_y_max + window_x_size) - Math.ceil(window_y_min - window_y_size) + 1);
  var index = tick_y_locations.indexOf(0);
  tick_y_locations.splice(index, 1);

  var coords;

  for (let i = 0; i < tick_x_locations.length; i++) {
    coords = convert_winCoords_to_pxCoords(tick_x_locations[i], 0, window_x_min, window_x_max, window_y_min, window_y_max);
    c.beginPath();
    c.lineTo(coords[0], origin[1] + tick_length/2);
    c.lineTo(coords[0], origin[1] - tick_length/2);
    c.stroke();
  }

  for (let i = 0; i < tick_y_locations.length; i++) {
    coords = convert_winCoords_to_pxCoords(0, tick_y_locations[i], window_x_min, window_x_max, window_y_min, window_y_max);
    c.beginPath();
    c.lineTo(origin[0] + tick_length/2, coords[1]);
    c.lineTo(origin[0] - tick_length/2, coords[1]);
    c.stroke();
  }

  c.beginPath();
  c.lineTo(origin[0], 0);
  c.lineTo(origin[0], height);
  c.stroke();

  c.beginPath();
  c.lineTo(0, origin[1]);
  c.lineTo(width, origin[1]);
  c.stroke();


  var num_intervals = 100000;
  var arr_x_points = makeArr(window_x_min - window_x_size, window_x_max + window_x_size, num_intervals*3 + 1);
  var arr_y_points = Array(num_intervals*3+1);



  c.beginPath()
  for (let i = 0; i < arr_y_points.length; i++) {
    arr_y_points[i] = Math.sin(1/arr_x_points[i]);
    coord = convert_winCoords_to_pxCoords(arr_x_points[i], arr_y_points[i], window_x_min, window_x_max, window_y_min, window_y_max);
    c.lineTo(coord[0], coord[1]);
  }
  c.stroke();


}


function makeArr(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

function convert_winCoords_to_pxCoords(x, y, window_x_min, window_x_max, window_y_min, window_y_max) {
  var percentX = (x - window_x_min) / (window_x_max - window_x_min);
  var percentY = (window_y_max - y) / (window_y_max - window_y_min);

  var x_coord = (1+percentX) * innerWidth;
  var y_coord = (1+percentY) * innerHeight;

  return [x_coord, y_coord];
}






let newX = 0, newY = 0, startX = 0, startY = 0;

const card_front = document.getElementById('card_front');
// const card_back = document.getElementById('card_back');

card_front.addEventListener('mousedown', mouseDown);

function mouseDown(e) {

  origX = e.clientX;
  origY = e.clientY;

  startX = e.clientX;
  startY = e.clientY;

  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', mouseUp);
}

function mouseMove(e) {
  newX = startX - e.clientX;
  newY = startY - e.clientY;

  startX = e.clientX;
  startY = e.clientY;

  card_back.style.top = (card_back.offsetTop - newY) + 'px';
  card_back.style.left = (card_back.offsetLeft - newX) + 'px';
}


function mouseUp(e) {
  newX = origX - e.clientX;
  newY = origY - e.clientY;

  var dx = ((window_x_max - window_x_min) / window.innerWidth) * newX;
  var dy = ((window_y_max - window_y_min) / window.innerHeight) * newY;

  // console.log(window_x_min + dx);
  // console.log(window_x_max + dx);
  // console.log(window_y_min - dy);
  // console.log(window_y_max - dy);

  window_x_min = window_x_min + dx;
  window_x_max = window_x_max + dx;
  window_y_min = window_y_min - dy;
  window_y_max = window_y_max - dy;

  // console.log(dx);
  // console.log(dy);

  generate_graph(window_x_min, window_x_max, window_y_min, window_y_max);


  document.removeEventListener('mousemove', mouseMove);
}

// const box = document.querySelector("#my_canvas");
// const pageX = document.getElementById("x");
// const pageY = document.getElementById("y");
//
// function updateDisplay(event) {
//   pageX.innerText = event.pageX;
//   pageY.innerText = event.pageY;
// }
//
// var id;
// window.onmousedown = () => {
//     console.log("holding...")//Since setInterval doesn’t start
//     //immediately and causes clearInterval to execute first
//
//     id=setInterval(()=>{
//         console.log("holding...")
//     },300)
//     window.onmouseup = () => {
//       clearInterval(id)
//       console.log("released...")
//     }
// }
