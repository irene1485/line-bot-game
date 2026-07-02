else if (userText === '開始遊戲') { // 這裡替換成你要觸發 Q1 的玩家輸入文字
    
    // 💡 程式碼專屬密技：跟 LINE 索取玩家的個人資料（取代 Make 的變數）
    const profile = await client.getProfile(event.source.userId);
    const userName = profile.displayName; // 把玩家暱稱存進 userName 這個變數裡

    replyMessages = [
      {
        "type": "text",
        // 注意這裡是用「反引號 (`)」包起來，這樣裡面才能用 ${} 塞入剛剛拿到的變數喔！
        "text": `欸欸${userName}\n你有看到Rain的限動嗎？` 
      },
      {
        "type": "image",
        "originalContentUrl": "https://i.postimg.cc/0yYSvbzK/xian-dong-shi-yi-tu.jpg",
        "previewImageUrl": "https://i.postimg.cc/0yYSvbzK/xian-dong-shi-yi-tu.jpg"
      },
      {
        "type": "flex",
        "altText": "選項：你打算去Instagram看一下",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "你打算去Instagram看一下",
                "wrap": true,
                "weight": "bold",
                "color": "#555555",
                "size": "lg"
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
              {
                "type": "button",
                "style": "secondary",
                "action": {
                  "type": "message",
                  "label": "A 不回覆動態",
                  "text": "(也許他真的需要空間，讓他靜一靜)"
                }
              },
              {
                "type": "button",
                "style": "secondary",
                "action": {
                  "type": "message",
                  "label": "B 關心一下",
                  "text": "怎麼了？還好嗎！"
                }
              },
              {
                "type": "button",
                "style": "secondary",
                "action": {
                  "type": "message",
                  "label": "C 滑掉不理會",
                  "text": "(心想：這人又在刷什麼存在感...)"
                }
              }
            ]
          }
        }
      }
    ];

  }
