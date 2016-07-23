import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function(){
  console.log("you hit / ");
  this.render("navbar", {
    to: "header"
  });
  this.render("home_page", {
    to: "main"
  });
});

Router.route('/imginfo', function() {
  console.log("you hit imginfo");
  this.render("navbar", {
    to: "header"
  });
  this.render("imginfo_panel", {
    to: "main"
  });
})

//////
/// helpers
//////

Template.imginfo_feature_select.helpers({
  get_feature_name: function(type){
    var feat_field;
    if (type == "single") {
      feat_field = "single_features";
    }
    image = Images.findOne();
    // console.log(image);
    if (image != undefined) {
      // console.log("image find one");
      // console.log(image[feat_field]);
      var features = Object.keys(image[feat_field]);
      // console.log(features);
      var features_a = new Array();
      for (var i=0; i<features.length;i++) {
        features_a[i] = {name: features[i]};
      }
      // console.log(features_a);
      return features_a;
    } else {
      return [];
    }
  }
});


Template.imginfo_feature_list.helpers({
  get_all_feature_values : function() {
    if (Session.get("feature") != undefined) {
      var images = Images.find();
      var features = new Array();
      var idx = 0;
      images.forEach(function(item) {
        features[idx] = {
          title:item["string_features"]["FileName"],
          value: item[Session.get("feature")["type"]][Session.get("feature")["name"]]
        };
        // console.log(idx);
        // console.log(features[idx]);
        idx++;
      });
      return features;
    } else {
      return [];
    }
  }
});


//////
/// EVENTS
//////

Template.imginfo_feature_select.events({
  'change .js-select-single-feature': function(event) {
    event.preventDefault();
    var feature = $(event.target).val();
    // console.log(feature);
    Session.set("feature", {name: feature, type: "single_features"});
  },
  'click .js-show-blobs': function(event){
    event.preventDefault();
    if (Session.get("feature") == undefined) return;
    initBlobVis();
  },
  'click .js-show-curve': function(event){
    event.preventDefault();
    if (Session.get("feature") == undefined) return;
    initCurveVis();
  },
  'click .js-show-timeline': function(event){
    event.preventDefault();
    if (Session.get("feature") == undefined) return;
    initTimelineVis();
  }
});

var visjsobj;

function initBlobVis(){
  // clear out the old visualisation if needed
  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  // find all songs from the Songs collection
  var images = Images.find({});
  var nodes = new Array();
  var edges = new Array();
  var make_all = new Array();
  var ind = 0;
  // iterate the images, converting each song into
  // a node object that the visualiser can understand
    images.forEach(function(item){
      // set up a label with the image filename
     var label = "ind: "+ind;
     if (item["string_features"]["FileName"]){// we have a title
          label = item["string_features"]["FileName"];
      }
      // figure out the value of this feature for this song
      var value = item[Session.get("feature")["type"]][Session.get("feature")["name"]];
      // create the node and store it to the nodes array
      nodes[ind] = {
        id:ind,
        label:label,
        value:value,
      };

      // edges link together by manufacturer

      var make_me = item["string_features"]["Make"];
      if (make_me != undefined) { // get make(manufacturer)
        for(var j=0;j<make_all.length;j++) {
          if (make_all[j] == make_me) {
            edges.push({
              from: ind,
              to: j
            });
          }
        }
      }
      make_all[ind] = make_me;

      ind ++;
    })

    // this data will be used to create the visualisation
    var data = {
      nodes: nodes,
      edges: edges
    };
    // options for the visualisation
     var options = {
      nodes: {
        shape: 'dot',
      }
    };
    // get the div from the dom that we'll put the visualisation into
    container = document.getElementById('visjs');
    // create the visualisation
    visjsobj = new vis.Network(container, data, options);
}

function initCurveVis(){
  // clear out the old visualisation if needed
  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  var images = Images.find({});
  var ind = 0;
  // generate an array of items
  // from the songs collection
  // where each item describes a song plus the currently selected
  // feature
  var items = new Array();
  // iterate the songs collection, converting each song into a simple
  // object that the visualiser understands
  images.forEach(function(item){
    console.log(item["string_features"]["CreateDate"]);
    if (item["string_features"]["CreateDate"] != undefined ){
      var label = "ind: "+ind;
      if (item["string_features"]["FileName"] != undefined){// we have a title
        label = item["string_features"]["FileName"];
      }
      var value = item[Session.get("feature")["type"]][Session.get("feature")["name"]];
      // console.log(item["string_features"]["CreateDate"].substr(0,10).replace(/:/g,'-'));
      var date = item["string_features"]["CreateDate"].substr(0,10).replace(/:/g,'-');
      console.log(date);
      // here we create the actual object for the visualiser
      // and put it into the items array
      items[ind] = {
        x: date,
        y: value,
        // slighlty hacky label -- check out the vis-label
        // class in song_data_viz.css
        label:{content:label, className:'vis-label', xOffset:-5},
      };
      ind ++ ;
  }
  });

  console.log(items);

  var dataset = new vis.DataSet(items);
  // set up the data plotter
  var options = {
    // style:'bar',
    // style:'surface',
  };
  // get the div from the DOM that we are going to
  // put our graph into
  var container = document.getElementById('visjs');
  // create the graph
  visjsobj = new vis.Graph2d(container, dataset, options);
  // tell the graph to set up its axes so all data points are shown
  visjsobj.fit();
}

function initTimelineVis() {
  if (visjsobj != undefined) {
    visjsobj.destroy();
  }

  var images = Images.find({});
  var ind = 0;
  // generate an array of items
  // from the songs collection
  // where each item describes a song plus the currently selected
  // feature
  var items = new Array();
  // iterate the songs collection, converting each song into a simple
  // object that the visualiser understands
  images.forEach(function(item){
    console.log(item["string_features"]["CreateDate"]);
    if (item["string_features"]["CreateDate"] != undefined ){
      var label = "ind: "+ind;
      if (item["string_features"]["FileName"] != undefined){// we have a title
        label = item["string_features"]["FileName"];
      }
      // console.log(item["string_features"]["CreateDate"].substr(0,10).replace(/:/g,'-'));
      var date = item["string_features"]["CreateDate"].substr(0,10).replace(/:/g,'-');
      console.log(date);
      // here we create the actual object for the visualiser
      // and put it into the items array
      items[ind] = {
        id: ind,
        content: label,
        start: date,
        // slighlty hacky label -- check out the vis-label
        // class in song_data_viz.css
        // label:{content:label, className:'vis-label', xOffset:-5},
      };
      ind ++ ;
  }
  });

  console.log(items);

  var dataset = new vis.DataSet(items);
  // set up the data plotter
  var options = {
  };
  // get the div from the DOM that we are going to
  // put our graph into
  var container = document.getElementById('visjs');
  // create the graph
  visjsobj = new vis.Timeline(container, dataset, options);
  // tell the graph to set up its axes so all data points are shown
}
