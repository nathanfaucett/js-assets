var request = require("@nathanfaucett/request"),
    HttpError = require("@nathanfaucett/http_error"),
    Asset = require("./Asset");


var REQUEST_HEADERS = {
        "Content-Type": "application/json"
    },
    JSONAssetPrototype;


module.exports = JSONAsset;


function JSONAsset() {
    Asset.call(this);
}
Asset.extend(JSONAsset, "assets.JSONAsset");
JSONAssetPrototype = JSONAsset.prototype;

JSONAssetPrototype.load = function(src, callback) {
    request.get(src, {
        requestHeaders: REQUEST_HEADERS,
        success: function onSuccess(response) {
            callback(undefined, response.data);
        },
        error: function onError(response) {
            var error = new HttpError(response.statusCode, src);
            callback(error);
        }
    });
    return this;
};