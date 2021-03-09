(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "axios"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var axios_1 = require("axios");
    var catURL = "https://api.thecatapi.com/v1/images/search";
    axios_1["default"]
        .get(catURL, {
        params: {
            breed_ids: "siam"
        }
    })
        .then(function (r) { return r.data; })
        .then(function (breeds) {
        console.log(breeds);
    });
    var theInput;
    var theButton;
    theInput = document.querySelector("#userInput > input[type=text]");
    theButton = document.querySelector("#userInput > button");
    console.log("hello");
    theButton === null || theButton === void 0 ? void 0 : theButton.addEventListener("click", function () {
        var _a;
        var inputLen = (_a = theInput === null || theInput === void 0 ? void 0 : theInput.value.length) !== null && _a !== void 0 ? _a : 0;
        console.log("hello");
        if (inputLen > 0) {
            console.log("You entered", theInput === null || theInput === void 0 ? void 0 : theInput.value);
        }
        else {
            console.log("Please enter some text");
        }
    });
});
