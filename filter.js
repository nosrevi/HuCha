(function () {
  var matcher = new RegExp('火箭', 'g');
  var crab_catcher = new RegExp('\\*河蟹\\*', 'g');
  var walk = document.createTreeWalker(  
    document.body,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    {acceptNode: function (node) {
        return NodeFilter.FILTER_ACCEPT;
    }},
    false
  );

  var count = 0;
  var node;
  var images = {};
  var crabs = [];
  var floors = [];
  var floorId;
  var prevFloorId = -1;
  var tpcId;
  tpcId = $('h1#j_data').attr('tid');

  while (node = walk.nextNode()) {
    // Get images and push into array
    if(typeof node.tagName != 'undefined' && node.tagName === 'IMG') {
        // Only hide images in main topic or floors
        if(floorId) {
          node.setAttribute('style', 'visibility:hidden');
          images[floorId] = 1;
        }
        //node.addEventListener("mouseout", rehide, false);
        //node.parentNode.removeChild(node);
        continue;
    }

    if(typeof node.tagName != 'undefined' && node.tagName=='DIV' && node.getAttribute('class') == 'floor') {
        // Get floor Id before crab searching
        floorId = node.getAttribute('id');
    }
    // Keyword replace for text nodes
    if(node.nodeName == '#text'){
        node.nodeValue = node.nodeValue.replace(matcher, function () {
        count += 1;
        return '傻逼火箭';
        });
        if(crab_catcher.test(node.nodeValue)) {
            if(prevFloorId != floorId) {
                floors.push(floorId);
                crabs.push(node);
                prevFloorId = floorId;
            }
        }
    }
  }

  function httpGet(theUrl)
  {
      var xmlHttp = null;

      xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", theUrl, false );
      xmlHttp.send( null );
      return xmlHttp.responseText;
  }

  // Toggle images
  for(var k in images) {
    if(images.hasOwnProperty(k)) {
      // Highlight floor
      $('div#readfloor').children('div.floor#'+k).click( function(){ 
        //if($(this).find('img').css('visibility') === 'hidden') {
          $(this).find('img').css('visibility', ($(this).find('img').css('visibility') === 'hidden') ? 'visible' : 'hidden');
        //}
      });

      // Regular floor
      $('div#t_main').children('div.floor#'+k).click( function(){ 
        //if($(this).find('img').css('visibility') === 'hidden') {
          $(this).find('img').css('visibility', ($(this).find('img').css('visibility') === 'hidden') ? 'visible' : 'hidden');
        //}
      });
    }
  }

  $('div.floor').filter(function() {
    return $(this).find('a.u').text() == 'HPWP';
  }).remove();

  for(var i=0; node = crabs[i]; i++) {
    var floorNode = $('div#'+floors[i]+' table tr td').first();
    var articleId = (floors[i] == 'tpc') ? '0': '1';
    var floorContent = httpGet('http://bbs.hupu.com/get_quote.php?article='+articleId+'&tid='+tpcId+'&pid='+floors[i]);
    if(floorNode.children('blockquote').length) {
      floorNode.html('<blockquote>'+floorNode.children('blockquote').html()+'</blockquote>' + floorContent);
    } else {
      floorNode.html(floorContent);
      //console.log(node.nodeValue);
      //node.nodeValue = httpGet('http://bbs.hupu.com/get_quote.php?article=4&tid=11217335&pid='+floors[i]);
    }
  }

  $('small').remove();
  $('div.sign').remove();
  //$('img').remove();
  $('td.p_author:contains("wanghuanchen")').parent().remove('');
  $('#topPub').remove();
  $('.c2c_ad').remove();
  $('div#ad').remove();
  $('.bbs-index-weixin').remove();
  $('.pl_nav').remove();
  $('.rss').remove();
  
  $('.otherplate').remove(); // 友情版块
  $('.hp-footer').remove();
//  $('.hp-header').remove();

  chrome.runtime.sendMessage(undefined, {replacedOccurences: count});
}());
