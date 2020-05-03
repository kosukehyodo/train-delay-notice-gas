function sendLinePost() {
  // 遅延情報を取得
  var titles = fetchDelayInfo();

  for (var i = 0; i < titles.length; i++) {
    // 遅延を確認したい路線
    var myTrain = "ディズニーリゾートライン";

    // 部分一致
    var result = titles[i].indexOf(myTrain);

    // 遅延情報があるのみlineで通知
    if (result !== -1) {
      // LINEのメッセージ内容
      textMessage = titles[i] + "が現在遅延しています。";

      // 発行された LINE Notify アクセストークン
      var token = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

      var options = {
        method: "post",
        payload: { message: textMessage },
        headers: { Authorization: "Bearer " + token },
      };

      UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
    }
  }
}

function fetchDelayInfo() {
  //　関東の路線情報url
  var url = "https://transit.yahoo.co.jp/traininfo/area/4/";

  // urlのコンテンツを取得
  var html = UrlFetchApp.fetch(url).getContentText();

  var content = Parser.data(html)
    .from('<div class="elmTblLstLine trouble">')
    .to("</div>")
    .build();

  // 正規表現を使い、aタグの部分のみ抽出
  var url = content.match(/<a(?: .+?)?>.*?<\/a>/g);

  var items = [];

  for (var i = 0; i < url.length; i++) {
    // urlのみ抽出
    var itemURL = url[i].replace('<a href="', "").replace(/">.*/g, "");
    items.push(itemURL);
  }

  var titles = [];

  for (var i = 0; i < items.length; i++) {
    // 遅延路線詳細urlにアクセス
    var itemContent = UrlFetchApp.fetch(items[i]).getContentText();

    // 戻り値は配列。配列の0番目の要素に、マッチした文字列が入っている。
    var title = itemContent
      .match(/<title>.*?<\/title>/)[0]
      .replace("<title>", "")
      .replace("の運行情報 - Yahoo!路線情報</title>", "");

    //　配列に格納
    titles.push(title);
  }

  return titles;
}
