var Class = require("@nathanfaucett/class"),
    indexOf = require("@nathanfaucett/index_of"),
    isNullOrUndefined = require("@nathanfaucett/is_null_or_undefined");


var ClassPrototype = Class.prototype,
    AssetsPrototype;


module.exports = Assets;


function Assets() {

    Class.call(this);

    this._notLoaded = [];
    this._array = [];
    this._hash = {};
}
Class.extend(Assets, "assets.Assets");
AssetsPrototype = Assets.prototype;

AssetsPrototype.construct = function() {

    ClassPrototype.construct.call(this);

    return this;
};

AssetsPrototype.destructor = function() {
    var array = this._array,
        hash = this._hash,
        i = -1,
        il = array.length - 1,
        asset, name;

    ClassPrototype.destructor.call(this);

    while (i++ < il) {
        asset = array[i];
        name = asset.name;
        asset.destructor();
        delete hash[name];
    }
    this._notLoaded.length = array.length = 0;

    return this;
};

AssetsPrototype.has = function(name) {
    return !!this._hash[name];
};

AssetsPrototype.get = function(name) {
    return this._hash[name];
};

AssetsPrototype.add = function() {
    var i = -1,
        il = arguments.length - 1;

    while (i++ < il) {
        Assets_add(this, arguments[i]);
    }

    return this;
};

function Assets_add(_this, asset) {
    var name = asset.name,
        hash = _this._hash,
        notLoaded = _this._notLoaded,
        array = _this._array;

    if (!hash[name]) {
        asset.assets = _this;
        hash[name] = asset;
        array[array.length] = asset;

        if (!isNullOrUndefined(asset.src)) {
            notLoaded[notLoaded.length] = asset;
        }
    } else {
        throw new Error("Assets add(...assets) Assets already has member named " + name);
    }
}

AssetsPrototype.remove = function() {
    var i = -1,
        il = arguments.length - 1;

    while (i++ < il) {
        Assets_remove(this, arguments[i]);
    }

    return this;
};

function Assets_remove(_this, asset) {
    var name = asset.name,
        hash = _this._hash,
        notLoaded = _this._notLoaded,
        array = _this._array,
        index;

    if (hash[name]) {
        asset.assets = null;
        delete hash[name];
        array.splice(indexOf(array, asset), 1);

        if ((index = indexOf(notLoaded, asset))) {
            notLoaded.splice(index, 1);
        }
    } else {
        throw new Error("Assets remove(...assets) Assets do not have a member named " + name);
    }
}

AssetsPrototype.load = function(callback) {
    var _this = this,
        notLoaded = this._notLoaded,
        length = notLoaded.length,
        i, il, called, done;

    if (length === 0) {
        callback();
    } else {
        i = -1;
        il = length - 1;
        called = false;

        done = function done(err) {
            if (called) {
                return;
            }
            if (err || --length === 0) {
                called = true;
                if (callback) {
                    callback(err);
                }
                _this.emit("load");
            }
        };

        while (i++ < il) {
            notLoaded[i].load(done);
        }
        notLoaded.length = 0;
    }

    return this;
};