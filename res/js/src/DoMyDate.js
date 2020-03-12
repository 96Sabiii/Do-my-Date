/* eslint-env browser  */
/* eslint no-var: 0 */
/* eslint strict: 0 */

var DoMyDate = (function () {
  "use strict";

  var that = {};
	var model;
	var canvasView;
	var calendarView;

	//Initialize js files
  function init() {
    var bodyEl = $("body");
		var canvasEl = $(".canvas-wrapper");
		var calendarEl = $("#calendar");
    initCanvasView(canvasEl);
    initCalendarView(calendarEl);
    initModel(bodyEl);
  }

	//Initialize model file and functions
	function initModel(canvasEl) {
		model = new DoMyDate.DoMyDateModel(canvasEl);
		model.addEventListener("createTextbox", onCreateTextbox);
		model.addEventListener("showEntry", onShowEntry);
		model.addEventListener("cancelButtonClicked", onCancleButtonClicked);
		model.addEventListener("clearButtonClicked", onClearButtonClicked);
		model.addEventListener("pictureButtonClicked", onPictureButtonClicked);
		model.addEventListener("linkButtonClicked", onLinkButtonClicked);
		model.addEventListener("textColorChange", onTextColorChange);
		model.addEventListener("newEntry", newEntryAvailable);
		model.addEventListener("toDoButtonClicked", onToDoButtonClicked);
		model.addEventListener("calendarButtonClicked", onCalendarButtonClicked);
		model.addEventListener("welcomeButtonClicked", onWelcomeButtonClicked);
		model.addEventListener("hideAboutText", onHideAboutText);
		model.addEventListener("showAboutText", onShowAboutText);
    model.addEventListener("deleteButtonClicked", onDeleteButtonClicked);
		model.setNavBar();
		model.setWelcomeButton();
  }

	//Initialize canvas view file and functions
  function initCanvasView(canvasEl) {
    canvasView = new DoMyDate.CanvasView(canvasEl);
		canvasView.duplicateElement();
		canvasView.deleteElement();
  }

	//Initialize calendar view file and functions
  function initCalendarView(calendarEl) {
    calendarView = new DoMyDate.CalendarView(calendarEl);
    calendarView.addEventListener("dayClicked", onDayClicked);
    calendarView.addEventListener("loadEvent", onEventLoaded);
    calendarView.initCalendar();
    calendarView.initAudio();
		calendarView.createButton();
  }

	function onShowAboutText() {
		calendarView.showAboutText();
	}

	function onHideAboutText() {
		calendarView.hideAboutText();
	}

	function onWelcomeButtonClicked() {
		calendarView.hideWelcomeScreen();
		model.loadEntriesFromStorage();
	}

	function newEntryAvailable(event) {
		calendarView.showNewEntry(event.data);
  }

	function onToDoButtonClicked() {
		calendarView.setToDoView();
	}

	function onCalendarButtonClicked() {
		calendarView.setCalendarView();
	}

	function onTextColorChange(event) {
		canvasView.setTextColor(event.data);
	}

  function onClearButtonClicked() {
    canvasView.clearCanvas();
  }

  function onEventLoaded(event) {
    canvasView.setCanvas();
    canvasView.showTextoptions();
    model.initCanvasButtons();
    model.loadEntry(event.data);
    model.playAudio();
  }

  function onCancleButtonClicked() {
    canvasView.hidePictureOptions();
    canvasView.hideTextoptions();
    calendarView.showCalendar();
    model.playAudio();
  }

  function onDayClicked(event) {
    model.playAudio();
    canvasView.setCanvas();
    model.initFabricCanvas();
    model.initCanvasButtons(event.data);
  }

  function onShowEntry(event) {
    canvasView.hidePictureOptions();
    canvasView.hideTextoptions();
    calendarView.showNewEntry(event.data);
    model.playAudio();
  }

  function onCreateTextbox(event) {
    canvasView.createTextbox(event.data);
  }

  function onPictureButtonClicked() {
    canvasView.showPictureOptions();
  }

  function onLinkButtonClicked() {
    canvasView.createPicture();
  }

  function onDeleteButtonClicked() {
    canvasView.hidePictureOptions();
    canvasView.hideTextoptions();
    calendarView.showCalendar();
    model.deleteEntry();
    model.playAudio();
  }

  that.init = init;
  return that;
}());
