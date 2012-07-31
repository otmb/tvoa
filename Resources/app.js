// app.js

if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');	  	
}

var app = {};

var save_maxnum = 50;

Ti.include(
  "app/util.js",
  "app/ui/ui.js",
  "app/model/rss.js"
);

var console = {
  log: function(msg) {
    Ti.API.debug(JSON.stringify(msg, null, 2));
  }
};
// garbage collection
app.rss.gc();

var tabGroup = app.ui.createApplicationTabGroup();
tabGroup.open();
