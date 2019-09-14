var month = 01;
var day = 01;
var year = 1900;
var font = "DS-Digital Bold";
var font_size = 256;
var bodyWidth = 0;

var canvas;
var context;

window.onresize = function() {
  refreshFont();
  resizeCanvas();
  drawDate(canvas, context, font, month, day, year);
}

window.onload = function() {
  canvas = document.getElementById("myCanvas");
  resizeCanvas();
  context = canvas.getContext("2d");

  var monthUpArrow = document.getElementById("month-up-arrow");
  monthUpArrow.onclick = function() {
    month = (month < 12) ? month+1 : month;
    drawDate(canvas, context, font, month, day, year);
    saveDate();
  };
  var monthDownArrow = document.getElementById("month-down-arrow");
  monthDownArrow.onclick = function() {
    month = (month > 1) ? month-1 : month;
    drawDate(canvas, context, font, month, day, year);
    saveDate();
  };

  var dayUpArrow = document.getElementById("day-up-arrow");
  dayUpArrow.onclick = function() {
    day = (day < 31) ? day+1 : day;
    drawDate(canvas, context, font, month, day, year);
    saveDate();
  };
  var dayDownArrow = document.getElementById("day-down-arrow");
  dayDownArrow.onclick = function() {
    day = (day > 1) ? day-1 : day;
    drawDate(canvas, context, font, month, day, year);
    saveDate();
  };

  var yearUpArrow = document.getElementById("year-up-arrow");
  yearUpArrow.onclick = function() {
    year = (year < 2019) ? year+1 : year;
    drawDate(canvas, context, font, month, day, year);
    saveDate();
  };
  var yearDownArrow = document.getElementById("year-down-arrow");
  yearDownArrow.onclick = function() {
    year = (year > 1500) ? year-1 : year;
    drawDate(canvas, context, font, month, day, year);
    saveDate();
  };


  var travelBtn = document.getElementById("travel-btn");
  travelBtn.onclick = function(){
    var url = "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&titles="+year+"&format=json&callback=getWiki";
    console.log(url);

    var newScriptElement = document.createElement("script");
    newScriptElement.setAttribute("src", url);
    newScriptElement.setAttribute("id", "jsonP");
    var oldScriptElement = document.getElementById("jsonP");

    var head = document.getElementsByTagName("head")[0];
    if(oldScriptElement == null){
      head.appendChild(newScriptElement);
    }
    else{
      head.replaceChild(newScriptElement, oldScriptElement);
    }
  }

  refreshFont();
  recoverLastDate();
  drawDate(canvas, context, font, month, day, year);
};


function clearBackground(canvas, context, color) {
  context.fillStyle = color;
  context.fillRect(0,0, canvas.width, canvas.height);
}

function drawDate(canvas, context, font, month, day, year){
  clearBackground(canvas, context, "black");
  context.font = font_size + "px " + font;
  context.fillStyle = "white";
  // If you divide the current font_size by 4 the text
  // "strangely" gets positioned to the center *Research*
  var centerOffset = font_size/4;
  console.log(centerOffset);
  // Positions
  var xMonthPosition = ((bodyWidth/3)/2) - context.measureText(month).width/2;
  var yMonthPosition = (canvas.height/2) + centerOffset;

  var xDayPosition = (bodyWidth/2) - context.measureText(day).width/2;
  var yDayPosition = (canvas.height/2) + centerOffset;

  var xYearPosition = ((bodyWidth)/1.2) - context.measureText(year).width/2;
  var yYearPosition = (canvas.height/2) + centerOffset;

  //Draws

  // Draw month
  context.fillText(month, xMonthPosition, yMonthPosition);

  // Draw day
  context.fillText(day, xDayPosition, yDayPosition);

  // Draw year
  context.fillText(year, xYearPosition, yYearPosition);


  // Draw Dots
  context.fillStyle = "#ffc000";
  context.fillText(".", bodyWidth/3, yDayPosition);
  context.fillText(".", bodyWidth - (bodyWidth/2.5),yMonthPosition);
}

function refreshFont() {
  if(window.innerWidth > 1400){
    font_size = 256;
  }
  if(window.innerWidth <= 1400) {
    font_size = 164;
  }
  if(window.innerWidth <= 800) {
    font_size = 92;
  }
}

function resizeCanvas() {
  bodyWidth = document.getElementsByTagName("body")[0].offsetWidth-2;
  canvas.width = bodyWidth;
}

function saveDate() {
  var dateSelected = {
      "month": month,
      "day": day,
      "year": year
    };
    localStorage.setItem("dateSelected", JSON.stringify(dateSelected));

}

function recoverLastDate() {
  if(localStorage["dateSelected"]){
    var dateSelected = JSON.parse(localStorage["dateSelected"]);
    month = dateSelected.month;
    day = dateSelected.day;
    year = dateSelected.year;
  }
}
