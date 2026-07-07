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
  let userName = "";
  try {
    const profile = await client.getProfile(event.source.userId);
    userName = profile.displayName;
  } catch (error) {
    console.log("抓取暱稱失敗，留空處理");
  }

  // 🔽🔽🔽 劇本分流開始 🔽🔽🔽
  
  if (userText === '開始遊戲') {
    // 【Q1 劇情】
    replyMessages = [
      {
        "type": "text",
        "text": userName ? `欸欸${userName}\n你有看到Rain的限動嗎？`: "欸欸，你有看到Rain的限動嗎？" 
      },
      {
        "type": "image",
        "originalContentUrl": "https://i.postimg.cc/0yYSvbzK/xian-dong-shi-yi-tu.jpg",
        "previewImageUrl": "https://i.postimg.cc/0yYSvbzK/xian-dong-shi-yi-tu.jpg"
      },
      {
        "type": "flex",
        "altText": "你打算去Instagram看一下",
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
        "altText": "隔天...",
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
        "text": userName ? `${userName}\n我下禮拜還是不跟你們去吃飯了...` : "我下禮拜還是不跟你們去吃飯了...",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "A 主動關心並詢問",
                "text": "為什麼？有什麼事情嗎？感覺你最近怪怪的"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "B 不疑有他，直接答應",
                "text": "喔！好吧"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "C 對方爽約，應該質問他",
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
        "altText": "已經過了很多天...",
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
        "altText": "已經過了很多天...",
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
                "url": "https://i.postimg.cc/Njc4RhTt/Q2B-B.png",
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
                "url": "https://i.postimg.cc/zvwkc0Y5/Q2B-C.png",
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

  else if (userText === '蛤？我們不是都講好了嗎？餐廳也都訂位了耶 😩') {
    // 【Q3-3 劇情】
    replyMessages = [
      {
        "type": "flex",
        "altText": "已經過了很多天...",
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
                "aspectRatio": "1.54:1",
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
                "url": "https://i.postimg.cc/fb3fNwQX/Q2C-C.png",
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

  else if (
    userText === '(他不回覆 我也不回覆)' || 
    userText === '嘟...嘟...嘟...' || 
    userText === '有點擔心你...如果你有什麼事想跟我聊聊，我隨時都在哦！'
  ) {
    // 【Q4 劇情】(接續 Q3 的三個選項)
    replyMessages = [
      {
        "type": "flex",
        "altText": "幾天後...",
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
                "text": "又過了幾天...\n你發現Rain主動私訊\n你點開查看",
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
        "text": "最近發生很多事 心情好亂",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "A 給他很多建議",
                "text": "你昨天是不是太晚睡了？不要一直在家裡，多去外面走一走呀～"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "B 先聽他說，陪他聊",
                "text": "你會想跟我說說看發生了什麼事嗎？"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "C 試著轉移話題",
                "text": "我覺得你只是太久沒打遊戲放鬆一下了啦~要不要來一場？"
              }
            }
          ]
        }
      }
    ];
  }

  else if (
    userText === '你昨天是不是太晚睡了？不要一直在家裡，多去外面走一走呀～' || 
    userText === '你會想跟我說說看發生了什麼事嗎？' || 
    userText === '我覺得你只是太久沒打遊戲放鬆一下了啦~要不要來一場？'
  ) {
    // 【Q5 劇情】(接續 Q4 的三個選項)
    replyMessages = [
      {
        "type": "text",
        "text": "我覺得我好像有點撐不住了..."
      },
      {
        "type": "text",
        "text": "我覺得好累...",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "A 陪他一起找幫助",
                "text": "還是你需要我陪你去諮商看看嗎？不管你的決定是什麼，我都在😊"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "B 讓他想開一點",
                "text": "事情沒有那麼嚴重啦！你真的想太多了"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "C 不知道怎麼回就放著",
                "text": "(已讀不回)"
              }
            }
          ]
        }
      }
    ];
  }

  else if (userText === '還是你需要我陪你去諮商看看嗎？不管你的決定是什麼，我都在😊') {
    // 【結局 A：陪伴與求援 (Good Ending)】
    replyMessages = [
      {
        "type": "flex",
        "altText": "遊戲結算：不同的選擇，不同的未來",
        "contents": {
          "type": "bubble",
          "size": "mega",
          "hero": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "EPILLOGUE",
                "margin": "xl",
                "size": "xxs",
                "offsetStart": "xxl",
                "color": "#9fb8aa",
                "weight": "bold"
              }
            ]
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "不同的選擇，不同的未來",
                "weight": "bold",
                "size": "xl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "你選擇陪伴Rain，並和他一起尋求專業協助。原來，Rain最近經歷人生第一次分手，在心理師的陪伴下，漸漸從悲傷中復原，開始願意與朋友出門走走。",
                    "wrap": true,
                    "size": "sm",
                    "color": "#666666",
                    "margin": "lg"
                  },
                  {
                    "type": "separator",
                    "margin": "xl"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "🚩守護四部曲",
                    "margin": "xl",
                    "color": "#4D908E",
                    "weight": "bold",
                    "size": "md"
                  },
                  {
                    "type": "text",
                    "text": "當身邊的人發出求救訊號時，你可以嘗試這四個步驟：",
                    "size": "xs",
                    "color": "#888888",
                    "margin": "md",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "1. 覺察",
                    "margin": "lg",
                    "size": "sm",
                    "color": "#FCBA56",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": "留意周遭親友的情緒與行為改變。任何徵兆都值得被注意，如情緒低落、作息異常、對事物失去興趣。",
                    "size": "sm",
                    "wrap": true,
                    "margin": "sm",
                    "color": "#666666"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "2. 詢問",
                    "margin": "sm",
                    "size": "sm",
                    "color": "#FCBA56",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": "當發現親友有異樣時，應主動關心並詢問。可以盡量讓對方感受到關心，而不是直接給出建議或批評。",
                    "margin": "sm",
                    "size": "sm",
                    "color": "#666666",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "3. 傾聽",
                    "margin": "sm",
                    "size": "sm",
                    "color": "#FCBA56",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": "耐心地聆聽對方的想法與感受，不打斷、不批判，讓他們感受到被理解與支持。即使對方選擇沉默，也應告訴他們，當他們需要幫助時，自己會在身邊。",
                    "wrap": true,
                    "color": "#666666",
                    "margin": "sm",
                    "size": "sm"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "4. 求援",
                    "margin": "sm",
                    "size": "sm",
                    "color": "#FCBA56",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": "協助對方尋求專業身心醫療服務（如精神科、心理諮商），或求助於學校輔導室、諮商中心，讓他們知道自己並不孤單、困難有機會得到緩解。",
                    "wrap": true,
                    "color": "#666666",
                    "margin": "sm",
                    "size": "sm"
                  }
                ]
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
                "style": "primary",
                "action": {
                  "type": "message",
                  "label": "完成遊戲，去抽獎",
                  "text": "我要抽獎！"
                },
                "color": "#4D908E"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "重新開始",
                  "text": "開始遊戲"
                },
                "style": "link",
                "color": "#888888"
              }
            ]
          }
        }
      }
    ];
  }

  else if (
    userText === '事情沒有那麼嚴重啦！你真的想太多了' || 
    userText === '(已讀不回)'
  ) {
    // 【結局 B & C：失去聯繫 (Bad Ending)】
    replyMessages = [
      {
        "type": "flex",
        "altText": "遊戲結算：不同的選擇，不同的未來",
        "contents": {
          "type": "bubble",
          "size": "mega",
          "hero": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "EPILLOGUE",
                "margin": "xl",
                "size": "xxs",
                "offsetStart": "xxl",
                "color": "#9fb8aa",
                "weight": "bold"
              }
            ]
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "不同的選擇，不同的未來",
                "weight": "bold",
                "size": "xl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "自從那次的對話之後，你和Rain就不再有任何聯繫了。\n許久之後的某一天，你又想起那時Rain的樣子，不禁好奇如果當時做了不一樣的選擇，現在會是如何...？",
                    "wrap": true,
                    "size": "sm",
                    "color": "#666666",
                    "margin": "lg"
                  },
                  {
                    "type": "separator",
                    "margin": "xl"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "🚩守護四部曲",
                    "margin": "xl",
                    "color": "#4D908E",
                    "weight": "bold",
                    "size": "md"
                  },
                  {
                    "type": "text",
                    "text": "當身邊的人發出求救訊號時，你可以嘗試這四個步驟：",
                    "size": "xs",
                    "color": "#888888",
                    "margin": "md",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "1. 覺察",
                    "margin": "lg",
                    "size": "sm",
                    "color": "#FCBA56",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": "留意周遭親友的情緒與行為改變。任何徵兆都值得被注意，如情緒低落、作息異常、對事物失去興趣。",
                    "size": "sm",
                    "wrap": true,
                    "margin": "sm",
                    "color": "#666666"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "2. 詢問",
                    "margin": "sm",
                    "size": "sm",
                    "color": "#FCBA56",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": "當發現親友有異樣時，應主動關心並詢問。可以盡量讓對方感受到關心，而不是直接給出建議或批評。",
                    "margin": "sm",
                    "size": "sm",
                    "color": "#666666",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "3. 傾聽",
                    "margin": "sm",
                    "size": "sm",
                    "color": "#FCBA56",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": "耐心地聆聽對方的想法與感受，不打斷、不批判，讓他們感受到被理解與支持。即使對方選擇沉默，也應告訴他們，當他們需要幫助時，自己會在身邊。",
                    "wrap": true,
                    "color": "#666666",
                    "margin": "sm",
                    "size": "sm"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "4. 求援",
                    "margin": "sm",
                    "size": "sm",
                    "color": "#FCBA56",
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": "協助對方尋求專業身心醫療服務（如精神科、心理諮商），或求助於學校輔導室、諮商中心，讓他們知道自己並不孤單、困難有機會得到緩解。",
                    "wrap": true,
                    "color": "#666666",
                    "margin": "sm",
                    "size": "sm"
                  }
                ]
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
                "style": "primary",
                "action": {
                  "type": "message",
                  "label": "完成遊戲，去抽獎",
                  "text": "我要抽獎！"
                },
                "color": "#4D908E"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "重新開始",
                  "text": "開始遊戲"
                },
                "style": "link",
                "color": "#888888"
              }
            ]
          }
        }
      }
    ];
  }

  // 🔽🔽🔽 新增這段：官方後台專用關鍵字（消音區） 🔽🔽🔽
  else if (
    userText === '心衛中心據點' || 
    userText === '臺北市心理衛生資源' || 
    userText === '心理衛生專線' || 
    userText === '我要抽獎！'
  ) {
    // 當玩家輸入這些關鍵字時，程式直接回傳 null (什麼都不做)，讓 LINE 官方後台去接手！
    return Promise.resolve(null);
  }
  // 🔼🔼🔼 消音區結束 🔼🔼🔼
    
  else {
// 【防呆機制】玩家亂打字時
replyMessages = [
{
"type": "text",
"text": "這個選擇似乎不在命運的安排中... 請點擊選單或按鈕繼續遊戲喔！"
}
];
}

// 🔼🔼🔼 劇本分流結束 🔼🔼🔼

// 回傳訊息給玩家
return client.replyMessage(event.replyToken, replyMessages);
}
