(function () {

  var matcher = new RegExp('火箭', 'g');
  var crab_catcher = new RegExp('\\*河蟹\\*', 'g');
  var wangxu_catcher = new RegExp('[\u4e00-\u9eff] [\u4e00-\u9eff] [\u4e00-\u9eff] [\u4e00-\u9eff] ', 'g');

  var walk = document.createTreeWalker(  
    document.body,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    {acceptNode: function (node) {
        return NodeFilter.FILTER_ACCEPT;
    }},
    false
  );

  var images = {};
  var crabs = [];
  var wangxu = [];
  var floors = [];
  var settings;

  // React based on the settings we get
  chrome.runtime.sendMessage({method: 'getSettings'}, function(response) {
    settings = JSON.parse(response.settings);
    traverse();

    if (settings.CC) {
      crabCatcher();
    }
    if (settings.HP) {
      hidePictures();
    }
    if (settings.BL) {
      blackList();
    }
    if (settings.WR) {
      wangxuRadar();
    }
  });

  function traverse() {
    var node;
    var floorId;
    var prevFloorId = -1;
    var hasWangxu = false;

    while (node = walk.nextNode()) {
      // Get images and push into array
      if(typeof node.tagName != 'undefined' && node.tagName === 'IMG') {
        // Only hide images in main topic or floors
        if(settings.HP && floorId) {
          node.setAttribute('style', 'visibility:hidden');
          images[floorId] = 1;
        }
        continue;
      }

      if(typeof node.tagName != 'undefined' && node.tagName=='DIV' && node.getAttribute('class') == 'floor') {
        // Get floor Id before crab searching
        floorId = node.getAttribute('id') || 'recommandBox'; // if no floor Id, it's in recommand box
        hasWangxu = false;
      }

      if(node.nodeName == '#text'){
        // Keyword replace for text nodes
        node.nodeValue = node.nodeValue.replace(matcher, function () {
          return '傻逼火箭';
        });

        if (!hasWangxu && wangxu_catcher.test(node.nodeValue)) {
          hasWangxu = true;
          wangxu.push(floorId);
        }

        if(crab_catcher.test(node.nodeValue)) {
          if(prevFloorId != floorId) {
            floors.push(floorId);
            crabs.push(node);
            prevFloorId = floorId;
          }
        }
      }
    }
  }

  // Hide Pictures 
  function hidePictures() {
    for(var k in images) {
      if(images.hasOwnProperty(k)) {
        if(k=='recommandBox') {
          // Recommand Box
          $('div.l_w_reply').click( function(){
            $(this).find('img').css('visibility', ($(this).find('img').css('visibility') === 'hidden') ? 'visible' : 'hidden');
          });
        } else {
          // Highlight floor
          $('div#readfloor').children('div.floor#'+k).click( function(){ 
            $(this).find('img').css('visibility', ($(this).find('img').css('visibility') === 'hidden') ? 'visible' : 'hidden');
          });

          // Regular floor
          $('div#t_main').children('div.floor#'+k).click( function(){ 
            $(this).find('img').css('visibility', ($(this).find('img').css('visibility') === 'hidden') ? 'visible' : 'hidden');
          });
        }
      }
    }
  }

  // Black List
  function blackList() {

    chrome.runtime.sendMessage({method: 'getBlacklist'}, function(response) {
      var bl = JSON.parse(response.blacklist);

      // Remove reply in a topic
      $('div.floor').filter(function() {
        // check if author in BlackList array
        return bl.indexOf($(this).find('a.u').first().text()) >= 0;
      }).remove();

      // Remove topic
      for(var i in bl){
        $('td.p_author:contains("'+bl[i]+'")').parent().remove('');
      }
    });
  }

  function httpGet(theUrl) {
      var xmlHttp = null;

      xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", theUrl, false );
      xmlHttp.send( null );
      return xmlHttp.responseText;
  }

  // Crab Catcher
  function crabCatcher() {
    var tpcId = $('h1#j_data').attr('tid');

    for(var i=0; i<floors.length; i++) {
      var floorNode = $('div#'+floors[i]+' table tr td').first();
      var articleId = (floors[i] == 'tpc') ? '0': '1';
      var floorContent = httpGet('http://bbs.hupu.com/get_quote.php?article='+articleId+'&tid='+tpcId+'&pid='+floors[i]);
      if(floorNode.children('blockquote').length) {
        floorNode.html('<blockquote>'+floorNode.children('blockquote').html()+'</blockquote>' + floorContent);
      } else {
        floorNode.html(floorContent);
      }
    }
  }

  // Wangxu Radar
  function wangxuRadar() {
    for(var i=0; i<wangxu.length; i++) {
      var floorNode = $('div#'+wangxu[i]+' table tr td').first();
      var wxId = 'wx'+wangxu[i];
      var floorContent = '<b>检测到王旭体!! 请慎重点击<a onclick="$(\'#'+wxId+'\').css(\'display\', \'block\');">查看原文</a>:</b>';
      floorNode.html(floorContent+'<div id="'+wxId+'" style="display:none"><a onclick="$(\'#'+wxId+'\').css(\'display\', \'none\');">收起</a>'+floorNode.html()+'</div>');
    }
  }

  $('small').remove();
  $('div.sign').remove();
  //$('img').remove();
  $('#topPub').remove();
  $('.c2c_ad').remove();
  $('div#ad').remove();
  $('.bbs-index-weixin').remove();
  $('.pl_nav').remove();
  $('.rss').remove();
  $('.otherplate').remove(); // 友情版块
  $('.hp-footer').remove();
//  $('.hp-header').remove();

  //chrome.runtime.sendMessage(undefined, {replacedOccurences: count});
}());
