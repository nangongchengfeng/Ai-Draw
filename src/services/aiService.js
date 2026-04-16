import axios from 'axios'

const API_KEY = import.meta.env.VITE_LLM_API_KEY
const API_ENDPOINT = import.meta.env.VITE_LLM_API_ENDPOINT
const MODEL = import.meta.env.VITE_LLM_MODEL
const MAX_TOKENS = import.meta.env.VITE_LLM_MAX_TOKENS || 500
const TEMPERATURE = import.meta.env.VITE_LLM_TEMPERATURE || 0.7
const API_TYPE = import.meta.env.VITE_LLM_API_TYPE || 'openai'

// 重试配置
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1秒

// 自动补全硅基流动的API路径
const getFullApiEndpoint = () => {
  if (API_ENDPOINT.includes('siliconflow.cn') && !API_ENDPOINT.endsWith('/chat/completions')) {
    return API_ENDPOINT.replace(/\/$/, '') + '/chat/completions'
  }
  return API_ENDPOINT
}

// 延时函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 判断是否应该重试
const shouldRetry = (error) => {
  // 网络错误可以重试
  if (!error.response) {
    return true
  }
  // 429 请求太频繁可以重试
  if (error.response.status === 429) {
    return true
  }
  // 5xx 服务器错误可以重试
  if (error.response.status >= 500 && error.response.status < 600) {
    return true
  }
  return false
}

/**
 * 调用AI进行智能评分（带重试机制）
 * @param {string} base64Image - Canvas导出的Base64图片
 * @param {string} targetWord - 目标词汇
 * @param {number} timeLeft - 剩余时间（秒）
 * @returns {Promise<{score: number, guess: string, explanation: string, matched: boolean}>} AI的评分结果
 */
export const recognizeDrawing = async (base64Image, targetWord, timeLeft) => {
  if (!API_KEY) {
    throw new Error('请先在.env文件中配置VITE_LLM_API_KEY')
  }
  if (!API_ENDPOINT) {
    throw new Error('请先在.env文件中配置VITE_LLM_API_ENDPOINT')
  }

  let lastError = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`正在调用AI智能评分（尝试 ${attempt}/${MAX_RETRIES}），目标词:`, targetWord, '剩余时间:', timeLeft)

      // 移除base64前缀
      const imageData = base64Image.replace(/^data:image\/(png|jpeg);base64,/, '')
      const imageBase64 = `data:image/png;base64,${imageData}`

      // 构建提示词
      const systemPrompt = `你是"我画AI猜"游戏的专业AI裁判。你的任务是：

1. 观察用户的画作
2. 与目标词"${targetWord}"进行相似度对比
3. 给出0-100的相似度评分
4. 用1-3个词描述你看到的内容
5. 简短解释评分理由

评分标准：
- 90-100分：画作非常准确，几乎完美匹配目标词
- 70-89分：画作比较准确，核心特征明显
- 50-69分：画作有一定相似度，但特征不够清晰
- 30-49分：画作只有一点点相似，大部分特征缺失
- 0-29分：画作与目标词基本不相关

请严格以JSON格式返回，不要包含任何其他文字：
{
  "score": 相似度评分0-100,
  "guess": "你看到的内容描述",
  "explanation": "简短评分理由",
  "matched": true/false (相似度>=50就算匹配成功)
}`

      let requestData, headers

      // 根据不同API类型构造请求
      if (API_TYPE === 'openai') {
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
        requestData = {
          model: MODEL,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: systemPrompt },
                { type: 'image_url', image_url: { url: imageBase64 } }
              ]
            }
          ],
          max_tokens: parseInt(MAX_TOKENS),
          temperature: parseFloat(TEMPERATURE),
          response_format: { type: 'json_object' }
        }
      } else if (API_TYPE === 'aliyun') {
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
        requestData = {
          model: MODEL,
          input: {
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: systemPrompt },
                  { type: 'image_url', image_url: imageBase64 }
                ]
              }
            ]
          },
          parameters: {
            max_tokens: parseInt(MAX_TOKENS),
            temperature: parseFloat(TEMPERATURE)
          }
        }
      } else {
        throw new Error(`不支持的API类型: ${API_TYPE}，当前支持openai/aliyun`)
      }

      const fullEndpoint = getFullApiEndpoint()
      const response = await axios.post(fullEndpoint, requestData, {
        headers,
        timeout: 30000
      })

      console.log('API响应:', response.data)

      // 解析AI响应
      let aiResponse
      if (API_TYPE === 'openai') {
        aiResponse = response.data.choices[0].message.content.trim()
      } else if (API_TYPE === 'aliyun') {
        aiResponse = response.data.output.choices[0].message.content.trim()
      }

      // 尝试解析JSON
      try {
        const result = JSON.parse(aiResponse)

        // 计算最终得分：相似度分 × 时间系数
        // 时间系数：1.0 - 2.0，画得越快系数越高
        const maxTime = import.meta.env.VITE_GAME_DRAW_TIME || 60
        const timeBonus = 1 + (timeLeft / maxTime) // 1.0 - 2.0
        const finalScore = Math.round(result.score * timeBonus)

        return {
          score: Math.min(finalScore, 100), // 最高100分
          similarityScore: result.score,
          guess: result.guess || 'AI猜不出来',
          explanation: result.explanation || '',
          matched: result.matched || result.score >= 50,
          timeBonus: timeBonus.toFixed(2)
        }
      } catch (parseError) {
        console.error('JSON解析失败，尝试降级处理:', parseError)
        // 降级处理：如果AI没返回JSON，尝试简单匹配
        const simpleMatch = aiResponse.includes(targetWord) || targetWord.includes(aiResponse)
        return {
          score: simpleMatch ? Math.max(50, timeLeft) : 0,
          similarityScore: simpleMatch ? 70 : 20,
          guess: aiResponse.substring(0, 50),
          explanation: 'AI返回格式异常，使用简单匹配',
          matched: simpleMatch,
          timeBonus: '1.0'
        }
      }
    } catch (error) {
      lastError = error
      console.error(`尝试 ${attempt}/${MAX_RETRIES} 失败:`, error.message)

      // 如果是最后一次尝试，或者不应该重试，就抛出错误
      if (attempt === MAX_RETRIES || !shouldRetry(error)) {
        break
      }

      // 否则，等待后重试
      console.log(`等待 ${RETRY_DELAY}ms 后重试...`)
      await delay(RETRY_DELAY * attempt) // 每次重试增加延时
    }
  }

  // 所有重试都失败了，处理最终错误
  console.error('所有重试都失败:', lastError)

  if (lastError.response) {
    const status = lastError.response.status
    const errorMsg = lastError.response.data.error?.message ||
                    lastError.response.data.message ||
                    lastError.response.statusText

    if (status === 401) {
      throw new Error(`API密钥无效(401): ${errorMsg}，请检查VITE_LLM_API_KEY配置`)
    } else if (status === 404) {
      throw new Error(`API端点不存在(404): ${errorMsg}，请检查VITE_LLM_API_ENDPOINT配置`)
    } else if (status === 400) {
      throw new Error(`请求参数错误(400): ${errorMsg}，请检查模型名称、请求格式是否正确`)
    } else if (status === 429) {
      throw new Error(`请求太频繁(429): ${errorMsg}，请稍后再试`)
    } else {
      throw new Error(`API请求失败(${status}): ${errorMsg}`)
    }
  } else if (lastError.request) {
    throw new Error(`网络连接失败(已重试${MAX_RETRIES}次): 无法访问API端点，请检查网络连接和API地址是否正确`)
  } else {
    throw new Error(`请求出错: ${lastError.message}`)
  }
}
