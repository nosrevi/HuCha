(function () {

  // match *河蟹*
  var crab_catcher = new RegExp('\\*河蟹\\*', 'g');
  // match 王旭体, which is 一 个 汉 字 一 个 空 格 一 个 汉 字 一 个... 
  var wangxu_catcher = new RegExp('[\u4e00-\u9eff] [\u4e00-\u9eff] [\u4e00-\u9eff] [\u4e00-\u9eff] ', 'g');
  // match 约炮广告
  var GQ_catcher = new RegExp('http://www\.*\.GQ', 'g');

  // create a DOM tree walker
  var walk = document.createTreeWalker(  
    document.body, // set traversal root to document.body
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, // accept both element node and text node
    {acceptNode: function (node) {
        return NodeFilter.FILTER_ACCEPT;
    }},
    false
  );

  // works as a hash table to store Id of floors that have image
  var images = {};
  // store Id of floors that have 王旭体
  var wangxu = {};
  // store Id of floors that have *河蟹*
  var crabs = {};
  // store Id of floors that have yuepao AD
  var GQ = {};

  var settings;

  // react based on the settings we get
  chrome.runtime.sendMessage({method: 'getSettings'}, function(response) {
    settings = JSON.parse(response.settings);
    traverse();

    // removing yuepao AD by default
    for (var k in GQ) {
      if (GQ.hasOwnProperty(k)) {
        $('#'+k).remove('');
      }
    }
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
      // get images and push into array
      if (typeof node.tagName != 'undefined' && node.tagName === 'IMG') {
        // only hide images in main topic or floors
        if(settings.HP && floorId) {
          node.setAttribute('style', 'visibility:hidden');
          images[floorId] = 1;
        }
        continue;
      }

      if (typeof node.tagName != 'undefined' && node.tagName=='DIV' && node.getAttribute('class') == 'floor') {
        // get floor Id before crab searching
        floorId = node.getAttribute('id') || 'recommandBox'; // if no floor Id, it's in recommand box
        hasWangxu = false;
      }

      if (typeof node.tagName != 'undefined' && node.tagName=='A' && GQ_catcher.test(node.getAttribute('href'))) {
        GQ[floorId] = 1;
      }

      if (node.nodeName == '#text') {

        if (settings.WR && !hasWangxu && wangxu_catcher.test(node.nodeValue)) {
          hasWangxu = true;
          wangxu[floorId] = 1;
        }

        if (settings.CC && crab_catcher.test(node.nodeValue)) {
          if (prevFloorId != floorId) {
            crabs[floorId] = 1;
            prevFloorId = floorId;
          }
        }

      }
    }
  }

  // Hide Pictures 
  function hidePictures() {
    for (var k in images) {
      if (images.hasOwnProperty(k)) {
        if (k=='recommandBox') {
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
      for (var i in bl) {
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

    for (var k in crabs) {
      if (crabs.hasOwnProperty(k)) {
        // Highlight floor
        var liangFloorNode = $('div#readfloor').children('div.floor#'+k).find('td').first();
        // Regular floor
        var floorNode = $('div#t_main').children('div.floor#'+k).find('td').first();

        var articleId = (k == 'tpc') ? '0': '1';
        var floorContent = httpGet('http://bbs.hupu.com/get_quote.php?article='+articleId+'&tid='+tpcId+'&pid='+k);

        if(floorNode.children('blockquote').length) {
            //Keep quoted text as what it is
            floorNode.html('<blockquote>'+floorNode.children('blockquote').html()+'</blockquote>' + floorContent);
            liangFloorNode.html('<blockquote>'+liangFloorNode.children('blockquote').html()+'</blockquote>' + floorContent);
        } else {
            floorNode.html(floorContent);
            liangFloorNode.html(floorContent);
        }
      }
    }
  }

  // Wangxu Radar
  function wangxuRadar() {
    for (var k in wangxu) {
      if (wangxu.hasOwnProperty(k)) {
        var wxId = 'wx'+k;
        // Highlight floor
        var liangFloorNode = $('div#readfloor').children('div.floor#'+k).find('td').first();
        // Regular floor
        var floorNode = $('div#t_main').children('div.floor#'+k).find('td').first();

        var liangFloorContent = '<b>This could be Wangxu!!<a onclick="$(\'#l'+wxId+'\').css(\'display\', \'block\');">Click here</a> if you really want to see it:</b>';
        var floorContent = '<b>This could be Wangxu!! <a onclick="$(\'#'+wxId+'\').css(\'display\', \'block\');">Click here</a> if you really want to see it:</b>';

        liangFloorNode.html(liangFloorContent+'<div id="l'+wxId+'" style="display:none"><a onclick="$(\'#l'+wxId+'\').css(\'display\', \'none\');">Fold up</a>'+liangFloorNode.html()+'</div>');
        floorNode.html(floorContent+'<div id="'+wxId+'" style="display:none"><a onclick="$(\'#'+wxId+'\').css(\'display\', \'none\');">Fold up</a>'+floorNode.html()+'</div>');
      }
    }
  }

/*
 * Personal Settings
 * Removes sections I don't want to see
 *

  $('small').remove(); // "发送自..."
  $('div.sign').remove(); // signature
  $('#topPub').remove(); // top banner ad
  $('.c2c_ad').remove(); // top banner
  $('div#ad').remove(); // more ads
  $('.bbs-index-weixin').remove(); // right side ad 
  $('.pl_nav').remove(); // section nav
  $('.rss').remove(); // RSS subscrbtion
  $('.otherplate').remove(); // 友情版块
  $('.hp-footer').remove(); // footer

*/

}());
