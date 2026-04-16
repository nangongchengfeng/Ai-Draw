// 词库系统 - 绘画词汇
export const wordCategories = {
  animals: {
    name: '动物',
    icon: '🐾',
    words: [
      '猫', '狗', '鸟', '鱼', '兔子', '老虎', '熊猫', '大象',
      '猴子', '狮子', '蛇', '马', '羊', '鸡', '鸭子', '鹅',
      '乌龟', '青蛙', '蝴蝶', '蜜蜂', '蜘蛛', '老鼠', '松鼠', '狐狸'
    ]
  },
  daily: {
    name: '日常用品',
    icon: '🏠',
    words: [
      '杯子', '桌子', '椅子', '床', '台灯', '手机', '电脑', '电视',
      '时钟', '书包', '雨伞', '钥匙', '眼镜', '帽子', '鞋子', '袜子',
      '书本', '笔', '橡皮擦', '尺子', '剪刀', '胶水', '订书机', '闹钟'
    ]
  },
  food: {
    name: '食物',
    icon: '🍔',
    words: [
      '苹果', '香蕉', '橙子', '西瓜', '草莓', '葡萄', '蛋糕', '冰淇淋',
      '汉堡', '披萨', '热狗', '薯条', '饺子', '面条', '米饭', '面包',
      '鸡蛋', '牛奶', '咖啡', '茶', '果汁', '糖葫芦', '包子', '月饼'
    ]
  },
  vehicles: {
    name: '交通工具',
    icon: '🚗',
    words: [
      '汽车', '自行车', '摩托车', '公交车', '火车', '飞机', '轮船', '火箭',
      '地铁', '出租车', '校车', '警车', '消防车', '救护车', '挖掘机', '推土机',
      '直升机', '热气球', '滑板', '溜冰鞋', '电动车', '马车', '帆船', '潜艇'
    ]
  },
  nature: {
    name: '自然',
    icon: '🌲',
    words: [
      '太阳', '月亮', '星星', '云朵', '彩虹', '雨滴', '雪花', '闪电',
      '山', '树', '花', '草', '叶子', '森林', '海洋', '河流',
      '湖泊', '瀑布', '火山', '沙漠', '沙滩', '岛屿', '蘑菇', '向日葵'
    ]
  },
  clothes: {
    name: '服饰',
    icon: '👕',
    words: [
      'T恤', '衬衫', '裙子', '裤子', '短裤', '毛衣', '外套', '羽绒服',
      '帽子', '围巾', '手套', '袜子', '鞋子', '靴子', '拖鞋', '高跟鞋',
      '领带', '蝴蝶结', '眼镜', '口罩', '背包', '手提包', '钱包', '皇冠'
    ]
  },
  sports: {
    name: '运动',
    icon: '⚽',
    words: [
      '足球', '篮球', '网球', '羽毛球', '乒乓球', '排球', '棒球', '高尔夫球',
      '游泳', '跑步', '跳高', '跳远', '自行车', '滑雪', '滑板', '冲浪',
      '跳绳', '毽子', '哑铃', '杠铃', '跑步机', '乒乓球拍', '羽毛球拍', '篮球框'
    ]
  },
  shapes: {
    name: '形状',
    icon: '🔷',
    words: [
      '圆形', '方形', '三角形', '长方形', '椭圆形', '星形', '心形', '菱形',
      '梯形', '五边形', '六边形', '月牙形', '箭头', '十字', '圆环', '半圆',
      '扇形', '螺旋', '波浪', '锯齿', '云朵形', '房子形', '树状', '闪电形'
    ]
  }
}

// 获取所有分类名
export const getCategoryNames = () => {
  return Object.keys(wordCategories)
}

// 从指定分类随机获取一个词
export const getRandomWordFromCategory = (category) => {
  const categoryData = wordCategories[category]
  if (!categoryData) return null
  const randomIndex = Math.floor(Math.random() * categoryData.words.length)
  return categoryData.words[randomIndex]
}

// 随机选择一个分类并获取一个词
export const getRandomWord = () => {
  const categories = getCategoryNames()
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  const word = getRandomWordFromCategory(randomCategory)
  return {
    word,
    category: randomCategory,
    categoryName: wordCategories[randomCategory].name,
    categoryIcon: wordCategories[randomCategory].icon
  }
}

// 获取多个随机词（不重复）
export const getRandomWords = (count) => {
  const result = []
  const usedWords = new Set()

  while (result.length < count) {
    const wordData = getRandomWord()
    if (!usedWords.has(wordData.word)) {
      usedWords.add(wordData.word)
      result.push(wordData)
    }
  }

  return result
}

// 简单的相似度匹配（基于关键词匹配）
export const isMatch = (aiGuess, targetWord) => {
  if (!aiGuess || !targetWord) return false

  // 直接匹配
  if (aiGuess.includes(targetWord)) return true

  // 目标词包含AI猜测（处理AI简化回答的情况）
  if (targetWord.includes(aiGuess)) return true

  // 常见同义词/相关词匹配
  const synonymMap = {
    '猫': ['猫咪', '小猫', '喵星人', '小猫咪'],
    '狗': ['狗狗', '小狗', '汪星人', '小狗狗'],
    '鸟': ['小鸟', '鸟儿', '飞鸟'],
    '鱼': ['小鱼', '鱼儿'],
    '兔子': ['小兔', '小兔子', '兔兔'],
    '太阳': ['日', '阳光'],
    '月亮': ['月', '月光'],
    '房子': ['屋子', '房屋', '家'],
    '汽车': ['车', '小车', '轿车'],
    '自行车': ['单车', '脚踏车']
  }

  const synonyms = synonymMap[targetWord] || []
  for (const synonym of synonyms) {
    if (aiGuess.includes(synonym)) return true
  }

  return false
}
