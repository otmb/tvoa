(function(){
  app.ui = {};
  
  app.ui.createApplicationTabGroup = function(){
    Ti.UI.setBackgroundColor('#000');
    
    var tabGroup = Ti.UI.createTabGroup();
    
    var tab1 = app.ui.createRssTab('Titanium VOA RSS', 'http://learningenglish.voanews.com/rss/?count=50');
    //var tab2 = app.ui.createRssTab('Q&A', 'http://developer.appcelerator.com/questions/feed/newest');
    
    tabGroup.addTab(tab1);
    return tabGroup;
  };
  
  app.ui.createRssTab = function(/* string */ _title, /* string */ _url) {
    var win = Ti.UI.createWindow({
      title: _title,
      backgroundColor: '#fff'
    });
    if (Ti.Platform.osname === 'android'){
      var icon ;
    } else {
      var icon = Titanium.UI.iPhone.SystemIcon.DOWNLOADS;
    }
    var tab = Ti.UI.createTab({
      title: _title,
      icon: icon,
      window: win
    });
   
    var tableView = Ti.UI.createTableView({
      data: []
    });
    win.add(tableView);
    
    // Rss Read
    win.addEventListener('open', function(){
      var query = String.format("select * from rss where url = '%s'",_url);
      Ti.Yahoo.yql(query,function(response){
        if (response.success === false){
          alert("Yahoo YQL error.");
          return;
        }
        response.data.item.forEach(function(item){
          var pageid = item.link.match(/[0-9]+.html$/)[0];
          link = 'http://m.voanews.com/learningenglish/' + pageid + '?show=full';
          pageid = pageid.match(/[0-9]+/)[0];
          tableView.appendRow({title: item.title, color: '#000', link: link, pageid: pageid, hasChild: true});
        });
      });
    });
    
    // List View Create
    tableView.addEventListener("click",function(evt){
      app.ui.webview = 0;
      app.ui.url = evt.rowData.link;
      // before sound remove
      var sound = app.ui.sound;
      
      if (Ti.Platform.osname === 'iphone'){
        var slider = Ti.UI.createSlider({
          top: 50,
          min: 0,
          //max: 100,
          width: '90%'
        });
      } else {
        var slider = Titanium.UI.createProgressBar({
          top: 50,
          width:"90%",
          height:'auto',
          min:0,
          //touchEnabled: true,
          style:Ti.UI.iPhone.ProgressBarStyle.PLAIN
        });
      }
      
      if (sound){
        sound.stop();
      }
      
      var view1 = Ti.UI.createView({
        //backgroundColor: 'red'
      });
      
      var view2 = Ti.UI.createView({
        //backgroundColor: 'blue'
      });
      
      //alert(event.rowData.title);
      var detailWin = Ti.UI.createWindow({
        title: evt.rowData.title,
        backgroundColor: "#fff"
      });
      
      // text download
      var xpath = '//p[@class="article_body_text"]';
      var query = String.format("select * from html where url = '%s' and xpath='%s'",evt.rowData.link,xpath);
      //console.log(query);
      Ti.Yahoo.yql(query,function(response){
        if (response.success === false){
          alert("Yahoo YQL error.");
          return;
        }
        // text scroll view add
        var contents = response.data.p.content;
        contents = contents.replace(/  /g,"");
        contents = contents.replace(/\n\n/g,"\n");
        //console.log(contents);
        var text = evt.rowData.title + "\n\n" + contents;
        var scrollView = Titanium.UI.createScrollView({
          contentWidth:'auto',
          contentHeight:'auto',
          bottom: 0,
          showVerticalScrollIndicator:true,
          showHorizontalScrollIndicator:true
        });
        if (Ti.Platform.osname === 'iphone')
        {
          scrollView.top = 80;
        } else {
          scrollView.top = 120;
        }
        
        var l1 = Titanium.UI.createLabel({
          text: text,
          width:"98%",
          height:"auto",
          top:0,
          color:'#000',
          textAlign:'left'
        });
        scrollView.add(l1);
        //scrollView.scrollTo("auto", "auto");
        view1.add(scrollView);
      });
      
      //Ti.API.info('directoryListing = ' + filePath.getParent().getDirectoryListing());
      createSound = function(filePath) {
        sound = Ti.Media.createSound({
          url: filePath,
          allowBackground: true
        });
        app.ui.sound = sound;
        
        var startStopButton = Ti.UI.createButton({
          title:'Start/Stop',
          top: 10,
          width:200,
          height:40
        });
        
        view1.add(startStopButton);
        var i;
        startStopButton.addEventListener("click",function() {
          if (sound.playing){
            sound.pause();
          } else {
            sound.play();
            slider.max = sound.duration;
            slider.value = sound.getTime();
            i  = setInterval(function()
            {
              if (sound.playing)
              {
                slider.value = sound.getTime();
              }
            },500);
          }
        });
        
        sound.addEventListener('complete', function()
        {
          sound.stop();
          clearInterval(i);
          /*
          if (Ti.Platform.osname === 'android')
          {
            sound.release();
          }
          */
        });
        if (Ti.Platform.osname === 'iphone'){
           slider.addEventListener('change', function(e) {
            if (e.value > sound.getTime() + 2 || e.value < sound.getTime() - 2 ){
              //sound.value = e.value;
              sound.setTime(e.value);
              //console.log("slide: " + e.value);
              //console.log("sound: " + sound.getTime());
            }
          });
        }
        view1.add(slider);
        
        detailWin.addEventListener('close',function() {
          sound.stop();
          clearInterval(i);
          if (Ti.Platform.osname === 'android')
          {
            sound.release();
          }
        });
      };
      
      // mp3 download
      var imageDir;
      var fname = evt.rowData.pageid + ".mp3";
       if (Ti.Platform.osname === 'android'){
        soundDir = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'sound');
      } else {
        soundDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'sound');
      }
      if (!soundDir.exists()) {
        soundDir.createDirectory();
      }
      var filePath = Ti.Filesystem.getFile(soundDir.nativePath , evt.rowData.pageid + ".mp3");
      console.log("SoundFile path is: " + filePath.resolve());
      if (filePath.exists()){
        createSound(filePath.nativePath);
      } else {
        var xpath = '//a[contains(text(), \"Listen to this article\")]/@href';
        var query = String.format("select * from html where url = '%s' and xpath='%s'",evt.rowData.link,xpath);
        Ti.Yahoo.yql(query,function(response){
          if (response.success === false){
            alert("Yahoo YQL error.");
            return;
          }
          
          var link = response.data.a.href;
          var mp3 = Ti.Network.createHTTPClient();
          mp3.open('GET',link);
          mp3.onload  = function() {
              filePath.write(this.responseData);
              createSound(filePath.nativePath);
          }
          mp3.send();
        });
      }
      
      var scrollView = Titanium.UI.createScrollableView({
        views: [view1,view2],
        showPagingControl: true,
        pagingControlHeight: 30,
        maxZoomScale: 2.0
      });
      detailWin.add(scrollView);
      
      scrollView.addEventListener('scroll', function(e){
        
        if (e.currentPage === 1 && app.ui.webview === 0){
          var webview = Titanium.UI.createWebView();
          //webview.url = "http://translate.google.co.jp/translate?twu=1&sl=en&tl=ja&hl=ja&sc=1&q=" 
          //webview.url = "http://translate.google.co.jp/#en|ja|" 
          webview.url = "http://translate.google.co.jp/translate?twu=1&sl=en&tl=ja&u="
            + encodeURIComponent(app.ui.url);
          webview.scalesPageToFit = true;
          webview.width = "100%";
          view2.add(webview);
          app.ui.webview = 1;
        }
        
      });
      tab.open(detailWin);
      
    });
    
    return tab;
  };
})();