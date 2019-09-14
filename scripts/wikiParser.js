var monthsList = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December"
};

var singleParserRegex = /=== ?[A-Z]\w+ ?===/;

var rangedParserRegex = /=== [A-Z]\w+(&ndash;|\–)[A-Z]\w+ ===/;

// Callback for Wikipedia.
function getWiki(wikiObject) {
  var article = getWikiDateEvent(wikiObject);

  var modalTitle = document.getElementById("ModalCenterTitle");
  modalTitle.innerHTML = monthsList[month] + " " + day + ", " + year;

  var modalbody = document.getElementsByClassName("modal-body")[0];
  modalbody.innerHTML = article;
}

function getWikiDateEvent(wikiObject) {
  var wikiPages = wikiObject.query.pages;
  var wikiResponse = wikiPages[Object.keys(wikiPages)[0]].revisions[0]["*"]
  var birthStartIndex = wikiResponse.search(/(===?) ?Births ?(===?)/);
  wikiResponse = wikiResponse.slice(0, birthStartIndex);

  // Parser Single Regex /===[A-Z]\w+===/
  // Parser Mix Regex /=== [A-Z]\w+ndash;[A-Z]\w+===/

  //var isSingleParser = wikiResponse.search(/===[A-Z]\w+===/);
  var isMixParser = wikiResponse.search(rangedParserRegex);
  var dateInfo = ""

  console.log(wikiResponse);
  if(isMixParser == -1){
    var monthEvents = parserSingle(wikiResponse);
    dateInfo = getDateInfo(monthEvents, monthsList[month], day);
  } else {
    var monthEvents = parserRange(wikiResponse);
    dateInfo = getDateInfo(monthEvents, monthsList[month], day);
  }

  return dateInfo;
}
// Returns an array containing Month with Events.
// getDateInfo function can help for further parsing.
function parserSingle(wikiResponse){
  var firstMonthIndex = wikiResponse.search(singleParserRegex);
  var responseToSplit = wikiResponse.substr(firstMonthIndex, wikiResponse.length);
  var tidyMonthEvents = responseToSplit.split("===", 25);

    // Prepare an Array with key [Month] value [Content]
  var monthEvents = new Array();
  for(var i = 0; i < tidyMonthEvents.length; i+=2){
    if(tidyMonthEvents[i] == ""){
      i+=1;
    }
    var months = tidyMonthEvents[i].trim();
    var content = tidyMonthEvents[i+1];
    monthEvents[months] = content;
  }
  return monthEvents;
}

// TODO: Define events for months in a range ex: Jan-Apr you also need to add february and march,
// because they may have events
function parserRange(wikiResponse){
 

  console.log(wikiResponse);
  // &ndash; is the base character for this parser to work.
  var firstMonthIndex = wikiResponse.search(rangedParserRegex);
  var responseToSplit = wikiResponse.substr(firstMonthIndex, wikiResponse.length);
  var tidyMonthEvents = responseToSplit.split("===", 25);
  console.log(tidyMonthEvents);

  // Prepare an Array with key [Month] value [Content]
  var monthEvents = new Array();
  
  for(var i = 0; i < tidyMonthEvents.length; i+=2){
    if(tidyMonthEvents[i] == ""){
      i+=1;
    }
    var splitTo = "&ndash;";
    if(tidyMonthEvents[i].indexOf("&ndash;") == -1){
      splitTo = "–";
    }
    var months = tidyMonthEvents[i].trim().split(splitTo);
    var rangeFirstMonth = getObjKeyByVal(monthsList, months[0], 1);
    var rangeLastMonth = getObjKeyByVal(monthsList, months[1], 1);

    months = objectSliceByIndex(monthsList, rangeFirstMonth, rangeLastMonth);
    var content = tidyMonthEvents[i+1];

    for (prop in months) {
      monthEvents[months[prop]] = content;
    }
  }

  return monthEvents;
}

// Return the Article with the month and day specified.
function getDateInfo(monthEvents, month, day) {
  if(!(month in monthEvents)){
    return "Nothing happened in this month.";
  }
  var monthExist = monthEvents[month].search(month + " " + day + "]");
  if(monthExist < 0){
    return "Nothing has happened at this date!";
  }

  var monthEventsArray = monthEvents[month].replace(/[&\/\\#,+()$~%.'":?<>{}\[\]]/g, '')
                          .replace(/\* ?[A-Z]\w+ \d{1,2}(?!\w)/g, "~$&");

  monthEventsArray = monthEventsArray.split("~*");
  var article = "";

  for(var i = 1; i < monthEventsArray.length; i++)
  {
    var item = monthEventsArray[i];
    if(item.search(month + " " + day) != -1){
        article = item;
        break;
      }
  }

  dashIndex = article.indexOf(";");
  if(dashIndex == -1){
    dashIndex = article.indexOf("–");
  } if(dashIndex == -1) {
    dashIndex = article.indexOf("\n");
  }

  if(dashIndex != -1) {
    article = article.slice(dashIndex+1, article.length);
  }
  article = article.replace(/[&\/\\#,+()$~%.'":*?<>{}\[\]]/g, '');
  console.log(article[10]);
  return article;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function getObjKeyByVal(obj, val, offset=0) {
  var index = offset;
  for (var value in obj){
    if (obj[value] === val) {
      return index;
    }
    index++;
  }
  return false;
}

function objectSliceByIndex(obj, start, end) {
  var slicedObj = {};
  for(var i = start; i <= end; i++) {
    slicedObj[i] = obj[i];
  }
  return slicedObj;
}
