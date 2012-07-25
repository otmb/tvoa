(function(){
  app.rss = {};
  
  var db = Ti.Database.open("tvoa");
  db.execute('CREATE TABLE IF NOT EXISTS rss(id INTEGER PRIMARY KEY, category TEXT, link TEXT, title TEXT, body TEXT,read INTEGER, download INTEGER, pubdate REAL,created_at REAL)');
  db.close();
  
  // 
  app.rss.getAll = function(){
    var rss = [];
    var db = Ti.Database.open("tvoa");
    var rows = db.execute('SELECT id, link, title, category, read, download, pubdate, created_at FROM rss');
    if (!rows){
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
    if (!rows){
      return;
    }
    if (rows.isValidRow()){
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
      //rows.next();
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
    db.execute("INSERT INTO rss (id, link, title, category, read, download, pubdate, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      rss.id ,rss.link , rss.title, rss.category, 0, 0, rss.pubdate ,now);
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
  
})();
