(function(){
  app.rss = {};
  
  //var db = Ti.Database.open("tvoa");
  //db.close();
  //db.remove();
  
  var db = Ti.Database.open("tvoa");
  db.execute('CREATE TABLE IF NOT EXISTS rss(id INTEGER PRIMARY KEY, category TEXT, link TEXT, title TEXT, body TEXT,read INTEGER, download INTEGER, pubdate REAL,created_at REAL)');
  //db.execute('delete from rss');
  db.close();
  
  app.rss.getAll = function(category){
    
    var rss = [];
    var db = Ti.Database.open("tvoa");
    var rows = db.execute('SELECT id, link, title, category, read, download, pubdate, created_at FROM rss where category = ? order by pubdate desc limit '+save_maxnum,category);
    if (!rows.rowCount){
      return rss;
    }
    while(rows.isValidRow()){
      rss.push({
        id: rows.fieldByName('id'),
        pageid: rows.fieldByName('id'),
        link: rows.fieldByName('link'),
        title: rows.fieldByName('title'),
        read: rows.fieldByName('read'),
        download: rows.fieldByName('download'),
        pubdate: rows.fieldByName('pubdate'),
        created_at: rows.fieldByName('created_at'),
        color: '#000'
      });
      rows.next();
    }
    rows.close();
    
    db.close();
    
    return rss;
  };
  
  app.rss.get = function(pageid){
    
    var db = Ti.Database.open("tvoa");
    var rss;
    var rows = db.execute('SELECT * FROM rss where id = ?',pageid);
    if (!rows.rowCount){ 
      return;
    }
    while (rows.isValidRow()){
      rss = {
        id: rows.fieldByName('id'),
        link: rows.fieldByName('link'),
        title: rows.fieldByName('title'),
        read: rows.fieldByName('read'),
        download: rows.fieldByName('download'),
        pubdate: rows.fieldByName('pubdate'),
        created_at: rows.fieldByName('created_at'),
        body: rows.fieldByName('body')
      };
      rows.next();
    }
    rows.close();
    
    db.close();
    return rss;
  };
  
  // insert
  app.rss.add = function(rss){
    var pubdate = rss.pubdate;
    
    var db = Ti.Database.open("tvoa");
    var now = (new Date).getTime();
    
    var rows = db.execute('SELECT * FROM rss where id = ?',rss.pageid);
    if (!rows.rowCount){ 
      db.execute("INSERT OR REPLACE INTO rss (id, link, title, category, read, download, pubdate, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        rss.pageid ,rss.link , rss.title, rss.category, 0, 0, rss.pubdate ,now);
    }
    /*
    var rss = {
      id: db.lastInsertRowId,
      path: file.nativePath,
      latitude: options.latitude,
      longitude: options.longitude,
      created_at: now
    };
    */
    db.close();
    
    return rss;
  };
  
  app.rss.update = function(pageid,hash){
    //var now = (new Date).getTime();
    var db = Ti.Database.open("tvoa");
    
    var set = [];
    var param = [];
    for (var i in hash) {
      set.push( i + " = ?");
      param.push(hash[i]);
    }
    param.push(pageid);
    db.execute("UPDATE rss set " + set.join(",") + " where id = ?",param);
    db.close();
  };
  
  app.rss.gc = function(pageid,hash){
    var rss = [];
    var db = Ti.Database.open("tvoa");
    
    var category = db.execute('SELECT count(category) as count,category FROM rss group by category');
    if (!category.rowCount){
      return;
    }
    
    var soundDir = app.util.getPath('sound');
    
    while(category.isValidRow()){
      //var rows = db.execute('SELECT count(*) FROM rss where category = ? group by category');
      var cate = category.fieldByName('category');
      if ( category.fieldByName('count') > save_maxnum){
        
        var rows = db.execute('SELECT id FROM rss where category = ? order by pubdate desc limit '+ save_maxnum +',100',cate);
        while(rows.isValidRow()){
          var id = rows.fieldByName('id');
          db.execute('delete FROM rss where id = ?',id);
          var filePath = Ti.Filesystem.getFile(soundDir.nativePath , id + ".mp3");
          filePath.deleteFile();
          rows.next();
        }
        rows.close();
      }
      
      category.next();
    }
    category.close();
    
    db.close();
  };
  
})();
