import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  if (!Images.findOne()) {
    var fs = Meteor.npmRequire('fs');
    var files = fs.readdirSync('./assets/app/jsonfiles');
    var inserted_images = 0;
    // for (var i = 0; i < files.length; i++) {
    for (var i = 0; i < 1; i++) {
      var filename = 'jsonfiles/' + files[i];

      try {
        var content = JSON.parse(Assets.getText(filename));

        var single_features = {};
        var array_features = {};
        var string_features = {};

        // var img;
        // var source;
        // var name;

        var exif = content[0];
        for (var feature in exif) {
          console.log("type of "+ exif[feature]+ " is " +typeof(exif[feature]));
          // number type to single_features
          // if (typeof(exif[feature]) === "number") {
          //   single_features[feature] = exif[feature];
          // }
          // // array to array_features
          // if (typeof(exif[feature]) === "object" &&
          //   exif[feature].length != undefined) {
          //   array_features[feature] = exif[feature];
          // }
          // // string to string_features
          // if (typeof(exif[feature]) === "string") {
          //   string_features[feature] = exif[feature];
          // }
        }


        // img.single_features = single_features;
        // img.array_features = array_features;
        // img.string_features = string_features;

        console.log(image);

      } catch(e) {
        console.log("error parsing file "+ filename);
      }
    }
    console.log("inserted "+ inserted_images + " images...");
  }
  // console.log(JSON.parse(Assets.getText('jsonfiles/'+'lake.json')));
});

