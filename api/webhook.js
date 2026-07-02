const line = require('@line/bot-sdk');

// 自動讀取 Vercel 裡的密碼
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
    await Promise.all(events.map(handleEvent));
    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

// 大腦邏輯區：根據玩家說的話，決定回傳什麼卡片
async function handleEvent(event) {
  // 🛡️ 防護罩：如果是 LINE 官方的假測試訊息，直接給予綠燈放行
  if (event.replyToken === '00000000000000000000000000000000' || event.replyToken === 'ffffffffffffffffffffffffffffffff') {
    return Promise.resolve(null);
  }

  // 如果不是文字訊息，就不理它
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userText = event.message.text;
  let replyMessages = [];

  // 💡 抓取玩家暱稱，並加上防呆機制 (萬一抓不到就叫他"玩家")
  let userName = "玩家";
  try {
    const profile = await client.getProfile(event.source.userId);
    userName = profile.displayName;
  } catch (error) {
    console.log("抓取暱稱失敗，使用預設稱呼");
  }

  // 🔽🔽🔽 劇本分流開始 🔽🔽🔽
  
  if (userText === '開始遊戲') {
    // 【Q1 劇情】
    replyMessages = [
      {
        "type": "text",
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
  
  else if (
    userText === '(也許他真的需要空間，讓他靜一靜)' || 
    userText === '怎麼了？還好嗎！' || 
    userText === '(心想：這人又在刷什麼存在感...)'
  ) {
    // 【Q2 劇情】
    replyMessages = [
      {
        "type": "flex",
        "altText": "情境：隔天...",
        "contents": {
          "type": "bubble",
          "size": "kilo",
          "body": {
            "type": "box",
            "layout": "vertical",
            "paddingAll": "xl",
            "contents": [
              {
                "type": "text",
                "text": "隔天，你收到了Rain傳來的訊息",
                "wrap": true,
                "weight": "bold",
                "color": "#888888",
                "align": "start"
              }
            ]
          }
        }
      },
      {
        "type": "text",
        "text": `${userName}\n我下禮拜還是不跟你們去吃飯了...`,
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "A 主動關心",
                "text": "為什麼？有什麼事情嗎？感覺你最近怪怪的"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "B 直接答應",
                "text": "喔！好吧"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "C 質疑朋友",
                "text": "蛤？我們不是都講好了嗎？餐廳也都訂位了耶 😩"
              }
            }
          ]
        }
      }
    ];
  }

  else if (userText === '為什麼？有什麼事情嗎？感覺你最近怪怪的') {
    // 【Q3-1 劇情】
    replyMessages = [
      {
        "type": "flex",
        "altText": "情境：已經過了很多天...",
        "contents": {
          "type": "bubble",
          "size": "kilo",
          "body": {
            "type": "box",
            "layout": "vertical",
            "paddingAll": "xl",
            "contents": [
              {
                "type": "text",
                "text": "Rain告知不參加聚會之後，就沒有再回覆任何訊息\n\n已經過了很多天...",
                "wrap": true,
                "weight": "bold",
                "color": "#888888",
                "align": "start"
              }
            ]
          }
        }
      },
      {
        "type": "flex",
        "altText": "請選擇你的下一步",
        "contents": {
          "type": "carousel",
          "contents": [
            {
              "type": "bubble",
              "hero": {
                "type": "image",
                "url": "https://i.postimg.cc/3WMy5T7r/Q2A-A.png",
                "size": "full",
                "aspectRatio": "1.54:1",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "A 有點生氣對方爽約",
                    "weight": "bold",
                    "size": "md",
                    "wrap": true
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "style": "primary",
                    "color": "#555555",
                    "action": {
                      "type": "message",
                      "label": "點擊選擇",
                      "text": "(他不回覆 我也不回覆)"
                    }
                  }
                ]
              }
            },
            {
              "type": "bubble",
              "hero": {
                "type": "image",
                "url": "https://i.postimg.cc/nVX0JGZN/Q2A-B.png",
                "size": "full",
                "aspectRatio": "1.54:1",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "B 直接撥通電話",
                    "weight": "bold",
                    "size": "md",
                    "wrap": true
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "style": "primary",
                    "color": "#555555",
                    "action": {
                      "type": "message",
                      "label": "點擊選擇",
                      "text": "嘟...嘟...嘟..."
                    }
                  }
                ]
              }
            },
            {
              "type": "bubble",
              "hero": {
                "type": "image",
                "url": "https://i.postimg.cc/kMLwXRgS/Q2A-C.png",
                "size": "full",
                "aspectRatio": "1.54:1",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "C 再次傳送訊息",
                    "weight": "bold",
                    "size": "md",
                    "wrap": true
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "style": "primary",
                    "color": "#555555",
                    "action": {
                      "type": "message",
                      "label": "點擊選擇",
                      "text": "有點擔心你...如果你有什麼事想跟我聊聊，我隨時都在哦！"
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ];
  }

  else if (userText === '喔！好吧') {
    // 【Q3-2 劇情】
    replyMessages = [
      {
        "type": "flex",
        "altText": "情境：已經過了很多天...",
        "contents": {
          "type": "bubble",
          "size": "kilo",
          "body": {
            "type": "box",
            "layout": "vertical",
            "paddingAll": "xl",
            "contents": [
              {
                "type": "text",
                "text": "Rain告知不參加聚會之後，就沒有再回覆任何訊息\n\n已經過了很多天...",
                "wrap": true,
                "weight": "bold",
                "color": "#888888",
                "align": "start"
              }
            ]
          }
        }
      },
      {
        "type": "flex",
        "altText": "請選擇你的下一步",
        "contents": {
          "type": "carousel",
          "contents": [
            {
              "type": "bubble",
              "hero": {
                "type": "image",
                "url": "https://i.postimg.cc/wTJ2tx1G/Q2B-A.png",
                "size": "full",
                "aspectRatio": "1:1",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "A 有點生氣對方爽約",
                    "weight": "bold",
                    "size": "md",
                    "wrap": true
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "style": "primary",
                    "color": "#555555",
                    "action": {
                      "type": "message",
                      "label": "點擊選擇",
                      "text": "(他不回覆 我也不回覆)"
                    }
                  }
                ]
              }
            },
            {
              "type": "bubble",
              "hero": {
                "type": "image",
                "url": "https://i.postimg.cc/Njc4RhTt/Q2B-B.png",
                "size": "full",
                "aspectRatio": "1:1",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "B 直接撥通電話",
                    "weight": "bold",
                    "size": "md",
                    "wrap": true
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "style": "primary",
                    "color": "#555555",
                    "action": {
                      "type": "message",
                      "label": "點擊選擇",
                      "text": "嘟...嘟...嘟..."
                    }
                  }
                ]
              }
            },
            {
              "type": "bubble",
              "hero": {
                "type": "image",
                "url": "https://i.postimg.cc/zvwkc0Y5/Q2B-C.png",
                "size": "full",
                "aspectRatio": "1:1",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "C 再次傳送訊息",
                    "weight": "bold",
                    "size": "md",
                    "wrap": true
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "style": "primary",
                    "color": "#555555",
                    "action": {
                      "type": "message",
                      "label": "點擊選擇",
                      "text": "有點擔心你...如果你有什麼事想跟我聊聊，我隨時都在哦！"
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ];
  }

  else if (userText === '蛤？我們不是都講好了嗎？餐廳也都訂位了耶 😩') {
    // 【Q3-3 劇情】
    replyMessages = [
      {
        "type": "flex",
        "altText": "情境：已經過了很多天...",
        "contents": {
          "type": "bubble",
          "size": "kilo",
          "body": {
            "type": "box",
            "layout": "vertical",
            "paddingAll": "xl",
            "contents": [
              {
                "type": "text",
                "text": "Rain告知不參加聚會之後，就沒有再回覆任何訊息\n\n已經過了很多天...",
                "wrap": true,
                "weight": "bold",
                "color": "#888888",
                "align": "start"
              }
            ]
          }
        }
      },
      {
        "type": "flex",
        "altText": "請選擇你的下一步",
        "contents": {
          "type": "carousel",
          "contents": [
            {
              "type": "bubble",
              "hero": {
                "type": "image",
                "url": "https://i.postimg.cc/gkDDySKs/Q2C-A.png",
                "size": "full",
                "aspectRatio": "1:1",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "A 繼續生氣對方爽約",
                    "weight": "bold",
                    "size": "md",
                    "wrap": true
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "style": "primary",
                    "color": "#555555",
                    "action": {
                      "type": "message",
                      "label": "點擊選擇",
                      "text": "(他不回覆 我也不回覆)"
                    }
                  }
                ]
              }
            },
            {
              "type": "bubble",
              "hero": {
                "type": "image",
                "url": "https://i.postimg.cc/K8pDw1w1/Q2C-B.png",
                "size": "full",
                "aspectRatio": "1:1",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "B 直接撥通電話",
                    "weight": "bold",
                    "size": "md",
                    "wrap": true
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "style": "primary",
                    "color": "#555555",
                    "action": {
                      "type": "message",
                      "label": "點擊選擇",
                      "text": "嘟...嘟...嘟..."
                    }
                  }
                ]
              }
            },
            {
              "type": "bubble",
              "hero": {
                "type": "image",
                "url": "https://i.postimg.cc/fb3fNwQX/Q2C-C.png",
                "size": "full",
                "aspectRatio": "1:1",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "C 再次傳送訊息",
                    "weight": "bold",
                    "size": "md",
                    "wrap": true
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "style": "primary",
                    "color": "#555555",
                    "action": {
                      "type": "message",
                      "label": "點擊選擇",
                      "text": "有點擔心你...如果你有什麼事想跟我聊聊，我隨時都在哦！"
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ];
  }

  else if (
    userText === '(他不回覆 我也不回覆)' || 
    userText === '嘟...嘟...嘟...' || 
    userText === '有點擔心你...如果你有什麼事想跟我聊聊，我隨時都在哦！'
  ) {
    // 【Q4 劇情】
    replyMessages = [
      {
