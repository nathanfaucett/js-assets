var eventListener = require("@nathanfaucett/event_listener"),
    HttpError = require("@nathanfaucett/http_error"),
    Asset = require("./Asset");


var ImageAssetPrototype;


module.exports = ImageAsset;


function ImageAsset() {
    Asset.call(this);
}
Asset.extend(ImageAsset, "assets.ImageAsset");
ImageAssetPrototype = ImageAsset.prototype;

ImageAssetPrototype.loadSrc = function(src, callback) {
    var image;

    if (typeof(Image) !== "undefined") {
        image = new Image();

        eventListener.on(image, "load", function onLoad() {
            eventListener.off(image, "load", onLoad);
            callback(undefined, image);
        });

        eventListener.on(image, "error", function onError(e) {
            var error = new HttpError(e.status, src);

            eventListener.off(image, "error", onError);

            callback(error, image);
        });

        image.src = src;
    } else {
        callback(undefined, image);
    }

    return this;
};