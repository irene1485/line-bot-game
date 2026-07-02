const line = require('@line/bot-sdk');

// 這裡會自動讀取我們等一下在 Vercel 設定的密碼
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

// 這是 Vercel 的大門口，負責接收 LINE 傳來的訊息
module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).send('機器人伺服器正常運作中！🚀');
  }

  try {
    const events = req.body.events;
    // 將收到的訊息交給 handleEvent 處理
    await Promise.all(events.map(handleEvent));
    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

// 大腦邏輯區：根據玩家說的話，決定回傳什麼卡片
async function handleEvent(event) {
  // 如果不是文字訊息，就不理它
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userText = event.message.text; // 玩家傳送的文字
  let replyMessages = []; // 我們準備回傳的訊息陣列

  // 🔽🔽🔽 這裡就是你的劇本分流 (if / else) 🔽🔽🔽
  if (userText === '我要看結局') {
    
    // 把你原本 Make 裡面的 JSON 陣列 (從 { "type": "flex" ... 開始到結束) 貼到這裡！
    replyMessages = [
      {
        "type": "flex",
        "altText": "遊戲結算：不同的選擇，不同的未來",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "這是程式碼版的結局測試！",
                "weight": "bold",
                "size": "xl"
              }
            ]
          }
        }
      }
    ];

  } else {
    // 如果玩家打錯字，或者輸入沒有設定的關鍵字
    replyMessages = [
      {
        type: 'text',
        text: '請輸入「我要看結局」來測試極速版卡片！'
      }
    ];
  }
  // 🔼🔼🔼 劇本分流結束 🔼🔼🔼

  // 使用 LINE SDK 將訊息送出 (不需要再管什麼 replyToken 格式錯誤了，SDK 會幫你包裝好！)
  return client.replyMessage(event.replyToken, replyMessages);
}
