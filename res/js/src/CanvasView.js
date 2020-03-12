/* eslint-env browser */
/* global EventPublisher */
/* global swal */
/* global FontFaceObserver */
/* global fabric */
/* eslint prefer-arrow-callback: 0 */
/* eslint prefer-template: 0 */
/* eslint no-var: 0 */
/* eslint strict: 0 */

var DoMyDate = DoMyDate || {};
DoMyDate.CanvasView = function (canvasEl) {
  "use strict";

  var that = new EventPublisher();
  var textboxOptions = canvasEl.find("#textbox-options");
  var pictureOptions = canvasEl.find("#pictureOptions");
  var canvas;

  //Create a new textbox with the different fonts
  function createTextbox(textbox) {
    // Define an array with all fonts
    var fonts = ["Pacifico", "VT323", "Quicksand", "Inconsolata"];
    canvas = document.getElementById("c").fabric;
    showTextoptions();
    canvas.add(textbox).setActiveObject(textbox);
    fonts.unshift("Times New Roman");
    onChange();
  }

  // Apply selected font when clicked
  function onChange() {
    canvasEl.find("#font-family").change(function () {
      if (this.value !== "Times New Roman") {
        loadAndUse(this.value);
      } else {
        canvas.getActiveObject().set("fontFamily", this.value);
        canvas.requestRenderAll();
      }
    });
  }

  //Load the selected font
  function loadAndUse(font) {
    var myfont = new FontFaceObserver(font);
    myfont.load()
      .then(function () {
        canvas.getActiveObject().set("fontFamily", font);
        canvas.requestRenderAll();
      }).catch(function () {
        swal("font loading failed " + font);
      });
  }

  //Duplicate the selected element
  function duplicateElement() {
    $("#duplicateButton").click(function () {
      var object;
      var settingNumber = 10;
      if (typeof canvas.getActiveObject === "function") {
        object = fabric.util.object.clone(canvas.getActiveObject());
        object.set("top", object.top + settingNumber);
        object.set("left", object.left + settingNumber);
        canvas.add(object);
      } else {
        swal("You have not selected an object");
      }
    });
  }

  //Create the picture input via url
  function createPicture() {
    var link = canvasEl.find("#pictureInput").val();
    var canvas2 = document.getElementById("c").fabric;
    var scalenum = 0.5;
    if (link !== "" && link.includes("http") && (link.includes(".jpg") || link.includes(".png"))) {
      fabric.Image.fromURL(link, function (oImg) {
        oImg.scale(scalenum);
        canvas2.add(oImg);
      });
    } else {
      swal("Please enter a picture link!");
    }
  }

  //Hide the picture options when not clicked
  function hidePictureOptions() {
    const pictureInput = $("#pictureInput");
    pictureOptions.css("display", "none");
    pictureInput.val("");
    pictureInput.attr("placeholder", "Paste your link");
  }

  //Show the picture options when clicked
  function showPictureOptions() {
    pictureOptions.css("display", "block");
  }

  //Hide the text options when not clicked
  function hideTextoptions() {
    textboxOptions.css("display", "none");
  }

  //Show the text options when clicked
  function showTextoptions() {
    textboxOptions.css("display", "block");
  }

  //Create a canvas element
  function setCanvas() {
    clearEntry();
    canvas = $(document.createElement("canvas"));
    canvas.attr("id", "c");
    canvas.attr("class", "canvas");
    canvas.attr("width", "700");
    canvas.attr("height", "500");
    canvasEl.find("#canvas-column").append(canvas);
  }

  //Clear the entry screen, remove canvas and clear input
  function clearEntry() {
    const inputHeader = $("#input-header");
    inputHeader.val("");
    inputHeader.attr("placeholder", "Give your entry a headline");
    canvasEl.find(".canvas-container").remove();
  }

  //Delete the element when button is clicked
  function deleteElement() {
    $("#deleteButton").click(function () {
      var activeObject = canvas.getActiveObject();
      if (typeof canvas.getActiveObject === "function") {
        swal({
            title: "Are you sure?",
            text: "Once deleted, your element will be gone!",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              canvas.remove(activeObject);
              swal("Poof! Your element has been deleted!", {
                icon: "success",
              });
            } else {
              swal("Your element is still there!");
            }
          });
      } else {
        swal("You have not selected an object");
      }
    });
  }

  //Clear the canvas when clear button is clicked
  function clearCanvas() {
    canvas = document.getElementById("c").fabric;
    canvas.clear();
  }

  //Set the color of the textbox
  function setTextColor(color) {
    var activeObject = canvas.getActiveObject();
    activeObject.setColor(color);
  }

  that.duplicateElement = duplicateElement;
  that.deleteElement = deleteElement;
  that.setTextColor = setTextColor;
  that.clearCanvas = clearCanvas;
  that.setCanvas = setCanvas;
  that.hideTextoptions = hideTextoptions;
  that.showTextoptions = showTextoptions;
  that.createTextbox = createTextbox;
  that.hidePictureOptions = hidePictureOptions;
  that.showPictureOptions = showPictureOptions;
  that.createPicture = createPicture;
  return that;
};
