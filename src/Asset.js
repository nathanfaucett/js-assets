var Class = require("@nathanfaucett/class"),
    keys = require("@nathanfaucett/keys"),
    indexOf = require("@nathanfaucett/index_of"),
    isArray = require("@nathanfaucett/is_array"),
    isObject = require("@nathanfaucett/is_object"),
    isString = require("@nathanfaucett/is_string"),
    arrayForEach = require("@nathanfaucett/array-for_each"),
    objectForEach = require("@nathanfaucett/object-for_each"),
    isNullOrUndefined = require("@nathanfaucett/is_null_or_undefined");


var ClassPrototype = Class.prototype,
    AssetPrototype;


module.exports = Asset;


function Asset() {

    Class.call(this);

    this.assets = null;
    this.name = null;
    this.src = null;
    this.data = null;
}
Class.extend(Asset, "assets.Asset");
AssetPrototype = Asset.prototype;

AssetPrototype.construct = function(options) {

    ClassPrototype.construct.call(this);

    options = options || {};

    this.name = options.name || null;
    this.src = options.src || null;

    return this;
};

AssetPrototype.destructor = function() {

    ClassPrototype.destructor.call(this);

    this.assets = null;
    this.name = null;
    this.src = null;
    this.data = null;

    return this;
};

AssetPrototype.setSrc = function(src) {
    var assets = this.assets;

    this.src = src;

    if (!isNullOrUndefined(src) && assets && indexOf(assets._notLoaded, this) === -1) {
        assets._notLoaded.push(this);
    }

    return this;
};

AssetPrototype.parse = function(data) {
    return data;
};

AssetPrototype.loadSrc = function(src, callback) {
    callback(new Error("Asset.loadSrc(callback) is not defined for " + this));
    return this;
};

AssetPrototype.load = function(callback) {
    var _this = this,
        src = this.src;

    function finalCallback(error, data) {
        if (error) {
            _this.emit("error", error);
            callback(error);
        } else {
            _this.data = data;
            _this.emit("load");
            callback();
        }
    }

    if (isArray(src)) {
        Asset_loadArray(this, src, finalCallback);
    } else if (isObject(src)) {
        Asset_loadObject(this, src, finalCallback);
    } else if (isString(src)) {
        this.loadSrc(src, function onLoad(error, data) {
            if (error) {
                finalCallback(error);
            } else {
                finalCallback(undefined, _this.parse(data));
            }
        });
    } else {
        finalCallback(undefined, this.data);
    }

    return this;
};

function Asset_loadArray(_this, srcs, callback) {
    var length = srcs.length,
        data = new Array(length),
        index = 0,
        called = false;

    function done(error) {
        index += 1;
        if (error || index === length) {
            if (!called) {
                called = true;
                callback(error, data);
            }
        }
    }

    arrayForEach(srcs, function onEach(src, index) {
        _this.loadSrc(src, function onLoad(error, value) {
            if (error) {
                done(error);
            } else {
                data[index] = _this.parse(value);
                done();
            }
        });
    });
}

function Asset_loadObject(_this, srcs, callback) {
    var srcKeys = keys(srcs),
        length = srcKeys.length,
        data = {},
        index = 0,
        called = false;

    function done(error) {
        index += 1;
        if (error || index === length) {
            if (!called) {
                called = true;
                callback(error, data);
            }
        }
    }

    objectForEach(srcs, function onEach(src, key) {
        _this.loadSrc(src, function onLoad(error, value) {
            if (error) {
                done(error);
            } else {
                data[key] = _this.parse(value);
                done();
            }
        });
    });
}