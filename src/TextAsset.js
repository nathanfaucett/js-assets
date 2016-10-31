var request = require("@nathanfaucett/request"),
    HttpError = require("@nathanfaucett/http_error"),
    Asset = require("./Asset");


var REQUEST_HEADERS = {
        "Content-Type": "text/plain"
    },
    TextAssetPrototype;


module.exports = TextAsset;


function TextAsset() {
    Asset.call(this);
}
Asset.extend(TextAsset, "assets.TextAsset");
TextAssetPrototype = TextAsset.prototype;

TextAssetPrototype.load = function(src, callback) {
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