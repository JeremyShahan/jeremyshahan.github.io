var window_x_min = -10;
var window_x_max = 10;
var window_y_min = -10;
var window_y_max = 10;

var window_width = window.innerWidth;
var window_height = window.innerHeight;



generate_graph(window_x_min, window_x_max, window_y_min, window_y_max);








/******************************************************************************
* Function Name: generate_graph()
* Author: Jeremy Shahan
* Date: 08/28/2024
* Input: 4 floats
* Output: modified canvas element within the html window.
* Description: This function generates the graph at the specified window
               range. It also generates an image that is about 9 times larger
               than the browser area. This is to account for the dragging of
               the image. The image is only regenerated when the image is done
               being dragged. The image is large enough so that as it is
               dragged, it will not have to generate the graph on the fly. The
               window range is described by for floats: smallest and largest
               x-coordinates and smallest and largest y-coordinates.
******************************************************************************/
function generate_graph(window_x_min, window_x_max, window_y_min, window_y_max) {
  var canvas = document.getElementById('my_canvas');
  c = canvas.getContext('2d');


  // canvas.width = window_width*3+200;
  canvas.width = window_width*9;
  canvas.height = window_height*9;

  const card_back = document.getElementById('card_back');

  card_back.style.top = (-window_height*4) + 'px';
  card_back.style.left = (-window_width*4) + 'px';

  c.font = "15px serif";

  generate_axes(c, window_x_min, window_x_max, window_y_min, window_y_max);
  generate_function(c, window_x_min, window_x_max, window_y_min, window_y_max);
}





/******************************************************************************
* Function Name: generate_axes()
* Author: Jeremy Shahan
* Date: 08/28/2024
* Input: canvas object and 4 floats
* Output: modified canvas element within the html window.
* Description: This function generates the axes given a specific window range.
               This function will automatically determine a good number of
               ticks to use when displaying the axes. I.e., it tries to graph
               between 12 - 25 tick marks per axis. So if the window size were
               to change there is no need to manually determine how many ticks
               to use.
******************************************************************************/
function generate_axes(c, window_x_min, window_x_max, window_y_min, window_y_max) {

  var tick_length = 20;

  var tick_x_distance = window_width / (window_x_max - window_x_min);
  var tick_y_distance = window_height / (window_y_max - window_y_min);
  var origin = [-1 * window_x_min * tick_x_distance + window_width*4, window_y_max * tick_y_distance + window_height*4];


  var start, stop, num_ticks, index, tick_win_dist, window_size;
  var tick_x_locations, tick_y_locations;

  var tick_x_info = determine_tick_distance(window_x_max - window_x_min);
  var tick_y_info = determine_tick_distance(window_y_max - window_y_min);

  window_size = window_x_max - window_x_min;
  tick_win_dist = tick_x_info[0] * (10**tick_x_info[1]);
  start = nearest_multiple_of_ceil(window_x_min - window_size*3, tick_win_dist);
  stop = nearest_multiple_of_floor(window_x_max + window_size*3, tick_win_dist);
  num_ticks = Math.round((stop - start) / tick_win_dist) + 1;
  tick_x_locations = makeArrByCrd(start, stop, num_ticks);
  index = tick_x_locations.indexOf(0);
  if (index != -1) {
    tick_x_locations.splice(index, 1);
  }

  window_size = window_y_max - window_y_min;
  tick_win_dist = tick_y_info[0] * (10**tick_y_info[1]);
  start = nearest_multiple_of_ceil(window_y_min - window_size*3, tick_win_dist);
  stop = nearest_multiple_of_floor(window_y_max + window_size*3, tick_win_dist);
  num_ticks = Math.round((stop - start) / tick_win_dist) + 1;
  tick_y_locations = makeArrByCrd(start, stop, num_ticks);
  index = tick_y_locations.indexOf(0);
  if (index != -1) {
    tick_y_locations.splice(index, 1);
  }

  var coords, str, str_width;

  for (let i = 0; i < tick_x_locations.length; i++) {
    coords = convert_winCoords_to_pxCoords(tick_x_locations[i], 0, window_x_min, window_x_max, window_y_min, window_y_max);
    c.beginPath();
    c.lineTo(coords[0], origin[1] + tick_length/2);
    c.lineTo(coords[0], origin[1] - tick_length/2);
    c.stroke();

    str = get_exact_tick_str(tick_x_locations[i], tick_x_info[0], tick_x_info[1]);
    // str = tick_x_locations[i].toString();
    coords = convert_winCoords_to_pxCoords(tick_x_locations[i], 0, window_x_min, window_x_max, window_y_min, window_y_max);
    c.fillText(str, coords[0] - c.measureText(str).width/2, coords[1]+25);
  }

  for (let i = 0; i < tick_y_locations.length; i++) {
    coords = convert_winCoords_to_pxCoords(0, tick_y_locations[i], window_x_min, window_x_max, window_y_min, window_y_max);
    c.beginPath();
    c.lineTo(origin[0] + tick_length/2, coords[1]);
    c.lineTo(origin[0] - tick_length/2, coords[1]);
    c.stroke();


    // str = tick_y_locations[i].toString();
    str = get_exact_tick_str(tick_y_locations[i], tick_y_info[0], tick_y_info[1]);
    coords = convert_winCoords_to_pxCoords(0, tick_y_locations[i], window_x_min, window_x_max, window_y_min, window_y_max);
    c.fillText(str, coords[0] - c.measureText(str).width - 15, coords[1] + c.measureText(str).actualBoundingBoxAscent/2);
  }

  c.beginPath();
  c.lineTo(origin[0], 0);
  c.lineTo(origin[0], window_height*9);
  c.stroke();

  c.beginPath();
  c.lineTo(0, origin[1]);
  c.lineTo(window_width*9, origin[1]);
  c.stroke();
}





/******************************************************************************
* Function Name: get_exact_tick_str()
* Author: Jeremy Shahan
* Date: 08/28/2024
* Input: 1 float, 2 ints
* Output: string
* Description: This function takes the approximate tick value and determines
               the exact tick value and outputs the string corresponding to
               the exact value that the approximate tick value corresponds to.
               This function was only made to avoid weird rounding errors when
               trying to graph the numbers along the axes. Sometimes the tick
               value would be off by some order of machine epsilon which does
               not look right.
******************************************************************************/
function get_exact_tick_str(approx_tick_num, tick_type, mag) {
  if (mag >= 0) {
    return approx_tick_num.toString();
  }

  var integer, decimal;
  if (approx_tick_num > 0) {
    integer = Math.floor(approx_tick_num);
  }
  else if (approx_tick_num < 0) {
    integer = Math.ceil(approx_tick_num);
  }
  decimal = nearest_multiple((approx_tick_num % 1) * (10**(-mag)), tick_type);

  return integer.toString() + "." + decimal.toString();
}





/******************************************************************************
* Function Name: determine_tick_distance()
* Author: Jeremy Shahan
* Date: 08/28/2024
* Input: float
* Output: 2 ints
* Description: This function takes as input, one dimension of the size of the
               current graphing calculator window. Then using the size, this
               function essentially determines how many ticks to use on this
               axis corresponding to the same dimension as the input. There
               are 3 tick types: 1s, 2s, and 5s. Each tick has a value of
               tick_type * (10**mag). For example, given a window having a
               size of 30 units will use ticks that are spaced out by 2 units.
               I.e., you will see that the axis counts out ticks as
               ..., -4, -2, 0, 2, 4, ...

               A window having a size of 20 will use ticks that are spaced out
               by 1 unit each. So then the axis will read
               ..., -2, -1, 0, 1, 2, ...

               This pattern continues in the same way for different magnitudes
               as well. The result of the function is the tick type and the
               magnitude of the ticks.
******************************************************************************/
function determine_tick_distance(window_size) {

  var mag = Math.floor(Math.log10(window_size));
  var adj_window_size = window_size / (10**mag);
  var numticks, tick_win_dist, tick_type;

  if (adj_window_size < 1.3) {
    tick_type = 5;
    mag = mag-2;
  }
  else if (adj_window_size < 2.6) {
    tick_type = 1;
    mag = mag-1;
  }
  else if (adj_window_size < 5.6) {
    tick_type = 2;
    mag = mag-1;
  }
  else if (adj_window_size < 13) {
    tick_type = 5;
    mag = mag-1;
  }

  return [tick_type, mag];
}





/******************************************************************************
* Function Name: generate_function()
* Author: Jeremy Shahan
* Date: 08/28/2024
* Input: canvas object and 4 floats
* Output: modified canvas element within the html window.
* Description: This function graphs a hard coded function in the specified
               window range. The first input is the canvas object being
               modified, and the other 4 inputs are the window ranges.
******************************************************************************/
function generate_function(c, window_x_min, window_x_max, window_y_min, window_y_max) {
  var num_intervals = 100000;
  var window_x_size = window_x_max - window_x_min;
  var arr_x_points = makeArrByCrd(window_x_min - window_x_size*3, window_x_max + window_x_size*3, num_intervals*3 + 1);
  var arr_y_points = Array(num_intervals*3+1);

  c.beginPath()
  for (let i = 0; i < arr_y_points.length; i++) {
    arr_y_points[i] = Math.sin(40/arr_x_points[i]);
    coord = convert_winCoords_to_pxCoords(arr_x_points[i], arr_y_points[i], window_x_min, window_x_max, window_y_min, window_y_max);
    c.lineTo(coord[0], coord[1]);
  }
  c.stroke();
}





/******************************************************************************
* Function Name: makeArrByCrd()
* Author: Jeremy Shahan
* Date: 08/28/2024
* Input: 2 floats and 1 int
* Output: Array of floats
* Description: This function creates an array of floats that are between the
               first and second input and are evenly (linearly) spaced. The
               third input specifies the length of the array to generate. The
               first input is the starting value, the second input is the
               stopping value.
******************************************************************************/
function makeArrByCrd(startValue, stopValue, cardinality) {
  if (startValue == stopValue) {
    return [startValue];
  }
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}





/******************************************************************************
* Function Name: convert_winCoords_to_pxCoords()
* Author: Jeremy Shahan
* Date: 08/28/2024
* Input: 2 floats - (x,y) coords and 4 floats - window parameters
* Output: Array of 2 floats
* Description: This function takes the first two floats, which are in units of
               the graphing calculator window, and converts them to the pixel
               coordinates needed for canvas. This function then returns the
               coordinates as an array.
******************************************************************************/
function convert_winCoords_to_pxCoords(x, y, window_x_min, window_x_max, window_y_min, window_y_max) {
  var percentX = (x - window_x_min) / (window_x_max - window_x_min);
  var percentY = (window_y_max - y) / (window_y_max - window_y_min);

  var x_coord = (4+percentX) * window_width;
  var y_coord = (4+percentY) * window_height;

  return [x_coord, y_coord];
}





/******************************************************************************
* Function Name: nearest_multiple_of_floor()
* Author: Jeremy Shahan
* Date: 08/28/2024
* Input: 2 floats
* Output: float
* Description: Given the first input called num, it tries to find the nearest
               multiple of the second input called multiple. This function
               does this using the floor operator. This function returns the
               nearest multiple.
******************************************************************************/
function nearest_multiple_of_floor(num, multiple) {
  return multiple * Math.floor(num / multiple);
}





/******************************************************************************
* Function Name: nearest_multiple_of_ceil()
* Author: Jeremy Shahan
* Date: 08/28/2024
* Input: 2 floats
* Output: float
* Description: Given the first input called num, it tries to find the nearest
               multiple of the second input called multiple. This function
               does this using the ceil operator. This function returns the
               nearest multiple.
******************************************************************************/
function nearest_multiple_of_ceil(num, multiple) {
  return multiple * Math.ceil(num / multiple);
}





/******************************************************************************
* Function Name: nearest_multiple()
* Author: Jeremy Shahan
* Date: 08/28/2024
* Input: 2 floats
* Output: float
* Description: Given the first input called num, it tries to find the nearest
               multiple of the second input called multiple. This function
               does this using the round operator. This function returns the
               nearest multiple.
******************************************************************************/
function nearest_multiple(num, multiple) {
  return multiple * Math.round(num / multiple);
}







let newX = 0, newY = 0, startX = 0, startY = 0;

const card_front = document.getElementById('card_front');
// const card_back = document.getElementById('card_back');

// Translates graph when the mouse is dragging the image.
// Image is only regenerated when the mouse drops the image.
card_front.addEventListener('mousedown', (e) => {
  origX = e.clientX;
  origY = e.clientY;

  startX = e.clientX;
  startY = e.clientY;

  document.addEventListener('mousemove', move_image);
  document.addEventListener('mouseup', generate_image);
});


card_front.addEventListener('wheel', (e) => {
  var proportion = Math.pow(0.1, 0.1);
  var dx, dy;

  if (e.deltaY > 0) {
    // Zoom out
    dx = ((window_x_max - window_x_min) / 2) * (1-1/proportion);
    dy = ((window_y_max - window_y_min) / 2) * (1-1/proportion);
  }
  else {
    // Zoom in
    dx = ((window_x_max - window_x_min) / 2) * (1-proportion);
    dy = ((window_y_max - window_y_min) / 2) * (1-proportion);
  }
  window_x_min = window_x_min + dx;
  window_x_max = window_x_max - dx;
  window_y_min = window_y_min + dy;
  window_y_max = window_y_max - dy;

  generate_graph(window_x_min, window_x_max, window_y_min, window_y_max);
});






function move_image(e) {
  newX = startX - e.clientX;
  newY = startY - e.clientY;

  startX = e.clientX;
  startY = e.clientY;

  card_back.style.top = (card_back.offsetTop - newY) + 'px';
  card_back.style.left = (card_back.offsetLeft - newX) + 'px';
}


function generate_image(e) {
  newX = origX - e.clientX;
  newY = origY - e.clientY;

  var dx = ((window_x_max - window_x_min) / window_width) * newX;
  var dy = ((window_y_max - window_y_min) / window_height) * newY;

  window_x_min = window_x_min + dx;
  window_x_max = window_x_max + dx;
  window_y_min = window_y_min - dy;
  window_y_max = window_y_max - dy;

  generate_graph(window_x_min, window_x_max, window_y_min, window_y_max);

  document.removeEventListener('mousemove', move_image);
}





function remove_background_square(top_left, bottom_right) {

}
