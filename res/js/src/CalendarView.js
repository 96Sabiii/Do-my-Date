/* eslint-env browser */
/* global EventPublisher */
/* eslint no-var: 0 */
/* eslint strict: 0 */
/* global swal */
/* eslint prefer-arrow-callback: 0 */
/* eslint object-shorthand: 0 */
/* eslint no-unused-vars: 0 */

var DoMyDate = DoMyDate || {};
DoMyDate.CalendarView = function (calendarEl) {
  "use strict";

  var that = new EventPublisher();
  var canvasWrapper = $(".canvas-wrapper");
  var infoTabInner = $(".infoTab .inner");

  //Initialize fullcalendar application
  function initCalendar() {
    $(document).ready(function () {
      calendarEl.fullCalendar({
        selectable: true,
        header: {
          left: "prev, next ",
          center: "title",
          right: "today",
        },
        editable: true,
        droppable: true,
        dayClick: function (date) {
          hideCalendar();
          that.notifyAll("dayClicked", date);
        },
        select: function (startDate) {
          $(this).css("background-color", "lightblue");
        },
        eventClick: function (calEvent, jsEvent, view) {
          var desc = calEvent.description;
          var title = calEvent.title;
          var loadObject = [title, desc];
          document.getElementById("idOfEvent").innerHTML = calEvent.id;
          document.getElementById("dateOfEvent").innerHTML = calEvent.start;
          hideCalendar();
          that.notifyAll("loadEvent", loadObject);
        },
      });
    });
  }

  function createButton() {
    $("#createButton").click(function () {
      swal("Click on the day you want to make the entry!", {
        buttons: false,
        timer: 2000,
      });
    });
  }

  //Show the Help Text
  function showAboutText() {
    infoTabInner.css("left", "3em");
    infoTabInner.fadeIn("linear");
  }

  //Hide the Help Text
  function hideAboutText() {
    infoTabInner.css("left", "32em");
    infoTabInner.fadeOut("linear");
  }

  //Create the audio Element
  function initAudio() {
    var audioElement = $(document.createElement("audio"));
    audioElement.attr("src", "res/audio/page_turn.mp3");
    $("body").append(audioElement);
  }

  //Goes to the Calenderview and shows the new Entry
  function showNewEntry(entry) {
    showCalendar();
    calendarEl.fullCalendar("renderEvent", entry, true);
  }

  //Show the Calendar by fading in
  function showCalendar() {
    canvasWrapper.fadeOut("linear", function () {
      calendarEl.fadeIn("linear").css("display", "block");
    });
  }

  //Show the Canvas/ Entry Screen
  function hideCalendar() {
    calendarEl.fadeOut("linear", function () {
      canvasWrapper.fadeIn("linear").css("display", "block");
    });
  }

  //Change calenderview to listview
  function setToDoView() {
    showCalendar();
    calendarEl.fullCalendar("changeView", "listYear");
  }

  //Change listview to calenderview
  function setCalendarView() {
    showCalendar();
    calendarEl.fullCalendar("changeView", "month");
  }

  //Hide the welcome screen to view calendar
  function hideWelcomeScreen() {
    $(".hero").fadeOut("linear", function () {
      $("#wrap").fadeIn("linear").css("display", "block");
    });
  }

  that.initAudio = initAudio;
  that.setToDoView = setToDoView;
  that.setCalendarView = setCalendarView;
  that.createButton = createButton;
  that.showCalendar = showCalendar;
  that.initCalendar = initCalendar;
  that.showNewEntry = showNewEntry;
  that.hideWelcomeScreen = hideWelcomeScreen;
  that.showAboutText = showAboutText;
  that.hideAboutText = hideAboutText;
  return that;
};
