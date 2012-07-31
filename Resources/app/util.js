(function(){
  
  app.util = {};
  
  app.util.getPath = function(folder){
    var path;
    if (Ti.Platform.osname === 'android'){
      path = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, folder);
    } else {
      path = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, folder);
    }
    if (!path.exists()) {
      path.createDirectory();
    }
    return path.nativePath;
  };
  
  app.util.getYql = function(url,xpath,option){
    
    var query = String.format("select * from html where url = '%s' and xpath='%s'",url,xpath);
    console.log(query);
    Ti.Yahoo.yql(query,function(response){
      if (response.success === false || !response.data){
        option.callback(false,option);
      }
      option.callback(response.data,option);
    });
  };
})();