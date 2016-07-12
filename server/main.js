import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  console.log(JSON.parse(Assets.getText('jsonfiles/'+'lake.json')));
});
