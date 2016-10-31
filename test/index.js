var tape = require("tape"),
    assets = require("..");


var Assets = assets.Assets,
    TextAsset = assets.TextAsset;


tape("Assets", function(assert) {
    var assets = Assets.create(),
        textAsset = TextAsset.create("text_asset", "http://localhost:9999/text.txt");

    assets.add(textAsset);
    assert.equals(assets.has(textAsset.name), true);

    assert.end();
});