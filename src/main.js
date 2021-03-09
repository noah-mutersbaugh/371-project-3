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
