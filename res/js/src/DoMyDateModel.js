/* eslint-env browser */
/* eslint prefer-arrow-callback: 0 */
/* eslint no-var: 0 */
/* eslint eqeqeq: 0 */
/* eslint dot-notation: 0 */
/* eslint no-param-reassign: 0 */
/* eslint strict: 0 */
/* global EventPublisher */
/* global fabric */
/* global swal */

var DoMyDate = DoMyDate || {};
DoMyDate.DoMyDateModel = function (bodyEl) {
  "use strict";

  var that = new EventPublisher();
  var itemsArray = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];
  var header = bodyEl.find("#input-header");
  var count = 1;
  var canvas;
  var entryColor;
  if (localStorage.getItem("id") > 0) {
    count = localStorage.getItem("id");
  }

  //Initialize the button elements
  function initCanvasButtons(date) {
    setSaveButton(date);
    setTextboxButton();
    setTextColorButton();
    setEventColorButton();
    setCancelButton();
    setClearButton();
    setPictureButton();
    setLinkButton();
    setDeleteButton();
  }

  //Set the button for the welcome screen function
  function setWelcomeButton() {
    bodyEl.find(".welcome").click(function () {
      that.notifyAll("welcomeButtonClicked");
    });
  }

  //Configure the audio
  function playAudio() {
    bodyEl.find("audio")[0].play();
  }

  //Set the navigation bar
  function setNavBar() {
    bodyEl.find("#todo-view").click(function () {
      that.notifyAll("toDoButtonClicked");
    });
    bodyEl.find("#calendar-view").click(function () {
      that.notifyAll("calendarButtonClicked");
    });
    initClearStorageButton();
    initAboutText();
  }

  //Initialize the canvas
  function initFabricCanvas() {
    canvas = new fabric.Canvas("c");
    document.getElementById("c").fabric = canvas;
  }

  //Set the cancel button to abort entries
  function setCancelButton() {
    bodyEl.find("#cancelButton").click(function () {
      that.notifyAll("cancelButtonClicked");
    });
  }

  //Set the textbox button to enter text
  function setTextboxButton() {
    bodyEl.find("#textboxButton").unbind("click").click(function () {
      const textbox = new fabric.Textbox("Double click to edit text", {
        left: 50,
        top: 50,
        width: 150,
        fontSize: 20,
      });
      that.notifyAll("createTextbox", textbox);
    });
  }

  //Set the save button to save your entry
  function setSaveButton(date) {
    bodyEl.find("#saveButton").unbind("click").click(function () {
      var idOfEvent = document.getElementById("idOfEvent").innerHTML;
      var dateOfEvent = document.getElementById("dateOfEvent").innerHTML;
      var allItems;
      var i;
      var myEvent;
      var JSONString;
      if (header.val() !== "") {
        if (dateOfEvent != 0) {
          date = dateOfEvent;
        }
        bodyEl.find("#calendar").fullCalendar("removeEvents", idOfEvent);
        JSONString = saveCanvas();
        myEvent = {
            title: header.val(),
            allDay: true,
            start: date,
            description: JSONString,
            color: entryColor,
            id: count++,
          };
        saveEntriesToStorage(myEvent);
        allItems = JSON.parse(localStorage.getItem("items"));
        for (i = 0; i < allItems.length; i++) {
          if (allItems[i]["id"] == idOfEvent) {
            localStorage.clear();
            allItems.splice(i, 1);
            localStorage.setItem("items", JSON.stringify(allItems));
          }
        }
        localStorage.setItem("id", count);
        document.getElementById("dateOfEvent").innerHTML = 0;
        that.notifyAll("showEntry", myEvent);
        swal("Your entry is saved!", {
          buttons: false,
          timer: 2000,
          icon: "success",
        });
      } else {
        swal("Please enter a headline!");
      }
    });
  }

  //Set the delete button to delete your entry
  function setDeleteButton() {
    bodyEl.find("#deleteEntryButton").click(function () {
      swal({
          title: "Do you really want to delete your entry?",
          text: "Your entry will be deleted!",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            that.notifyAll("deleteButtonClicked");
            swal("Poof! Entry has been deleted!", {
              buttons: false,
              timer: 2000,
            });
          } else {
            swal("Your entry is still there!");
          }
        });
    });
  }

  //Set the picture button to add a picture via URL
  function setPictureButton() {
    bodyEl.find("#pictureButton").click(function () {
      that.notifyAll("pictureButtonClicked");
    });
  }

  //Set the link button for the picture url
  function setLinkButton() {
    bodyEl.find("#linkInputButton").unbind("click").click(function () {
      that.notifyAll("linkButtonClicked");
    });
  }

  //Save the canvas elements to json objects
  function saveCanvas() {
    var canvasData = JSON.stringify(canvas.toDatalessJSON());
    return canvasData;
  }

  //Load the entry, especially the title and the canvas data
  function loadEntry(loadObject) {
    loadHeader(loadObject[0]);
    loadCanvas(loadObject[1]);
  }

  //Load the canvas elements from json objects
  function loadCanvas(eventJSONString) {
    var fabricC;
    initFabricCanvas();
    fabricC = document.getElementById("c").fabric;
    fabricC.loadFromDatalessJSON(eventJSONString, canvas.renderAll.bind(canvas));
  }

  //Load the header input
  function loadHeader(title) {
    header.val(title);
  }

  //Set the clear button to delete the canvas content
  function setClearButton() {
    bodyEl.find("#clearButton").click(function () {
      swal({
          title: "Do you really want to delete the content?",
          text: "All your elements will be deleted!",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            that.notifyAll("clearButtonClicked");
            swal("Poof! Your elements have been deleted!", {
              icon: "success",
            });
          } else {
            swal("Your elements are still there!");
          }
        });
    });
  }

  //Set the textcolor button to edit the color of the textbox
  function setTextColorButton() {
    var colorPicker = $("#textColorPicker");
    colorPicker.change(function () {
      var color = colorPicker.val();
      that.notifyAll("textColorChange", color);
    });
  }

  //Set the eventcolor button to edit the color of the headline
  function setEventColorButton() {
    var colorPicker = $("#eventColorPicker");
    colorPicker.change(function () {
      entryColor = colorPicker.val();
    });
  }

  //Load entries from storage
  function loadEntriesFromStorage() {
    localStorage.setItem("items", JSON.stringify(itemsArray));
    const data = JSON.parse(localStorage.getItem("items"));
    data.forEach(item => {
      that.notifyAll("newEntry", item);
    });
  }

  //Save entries to storage
  function saveEntriesToStorage(myEvent) {
    itemsArray.push(myEvent);
    localStorage.setItem("items", JSON.stringify(itemsArray));
  }

  // Initializes the clearing function for local storage when hitting the clear-button
  function initClearStorageButton() {
    bodyEl.find("#clear").click(() => {
      swal({
          title: "Are your sure?",
          text: "All your calendar entries will be deleted!",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            swal("Poof! Your entries have been deleted!", {
              icon: "success",
            });
            localStorage.clear();
            location.reload();
          } else {
            swal("Your entries are still there!");
          }
        });
    });
  }

  // Hides and unhides the Info-Tab with About Text
  function initAboutText() {
    bodyEl.find("#about").click(() => {
      const infoTabInner = bodyEl.find(".infoTab .inner");
      if (infoTabInner.css("display") === "none") {
        that.notifyAll("showAboutText");
      } else if (infoTabInner.css("display") === "block") {
        that.notifyAll("hideAboutText");
      }
      bodyEl.click((e) => {
        if (infoTabInner.css("display") === "block" && e.target.localName !== "a") {
          that.notifyAll("hideAboutText");
        }
      });
    });
  }

  //Set the delete function for entries
  function deleteEntry() {
    var idOfEvent = document.getElementById("idOfEvent").innerHTML;
    var allItems = JSON.parse(localStorage.getItem("items"));
    var i;
    bodyEl.find("#calendar").fullCalendar("removeEvents", idOfEvent);
    for (i = 0; i < allItems.length; i++) {
      if (allItems[i]["id"] == idOfEvent) {
        localStorage.clear();
        allItems.splice(i, 1);
        localStorage.setItem("items", JSON.stringify(allItems));
      }
    }
  }

  that.playAudio = playAudio;
  that.loadEntry = loadEntry;
  that.setNavBar = setNavBar;
  that.initFabricCanvas = initFabricCanvas;
  that.setWelcomeButton = setWelcomeButton;
  that.initCanvasButtons = initCanvasButtons;
  that.loadEntriesFromStorage = loadEntriesFromStorage;
  that.deleteEntry = deleteEntry;
  return that;
};
