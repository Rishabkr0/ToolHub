export interface KeywordCount {
  word: string
  count: number
  percentage: number
}

export interface DocumentStats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  readingTimeMinutes: string
  speakingTimeMinutes: string
  readingEaseScore: number
  readingEaseLabel: string
  topKeywords: KeywordCount[]
}

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
  "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
  "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
  "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
  "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor",
  "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out",
  "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
  "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
  "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to",
  "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
  "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's",
  "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've",
  "your", "yours", "yourself", "yourselves"
])

function countSyllables(word: string): number {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "")
  if (!cleaned) return 0
  if (cleaned.length <= 3) return 1
  const matches = cleaned.match(/[aeiouy]{1,2}/g)
  let count = matches ? matches.length : 1
  if (cleaned.endsWith("e") && !cleaned.endsWith("le")) {
    count = Math.max(1, count - 1)
  }
  return count
}

export function analyzeText(text: string): DocumentStats {
  const trimmed = text.trim()
  if (!trimmed) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeMinutes: "0 sec",
      speakingTimeMinutes: "0 sec",
      readingEaseScore: 100,
      readingEaseLabel: "Very Easy",
      topKeywords: []
    }
  }

  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, "").length
  
  // Word tokens
  const wordsArray = trimmed.split(/\s+/).filter(Boolean)
  const words = wordsArray.length

  // Sentences
  const sentenceMatches = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean)
  const sentences = Math.max(1, sentenceMatches.length)

  // Paragraphs
  const paragraphMatches = text.split(/\n+/).map(p => p.trim()).filter(Boolean)
  const paragraphs = Math.max(1, paragraphMatches.length)

  // Time calculations
  const readingSeconds = Math.ceil((words / 225) * 60)
  const readingTimeMinutes = readingSeconds < 60 
    ? `${readingSeconds} sec` 
    : `${Math.ceil(readingSeconds / 60)} min`

  const speakingSeconds = Math.ceil((words / 130) * 60)
  const speakingTimeMinutes = speakingSeconds < 60 
    ? `${speakingSeconds} sec` 
    : `${Math.ceil(speakingSeconds / 60)} min`

  // Syllables for Flesch Reading Ease
  let totalSyllables = 0
  const wordFrequencies: Record<string, number> = {}

  for (const rawWord of wordsArray) {
    const cleanWord = rawWord.toLowerCase().replace(/[^a-z0-9]/g, "")
    if (cleanWord) {
      totalSyllables += countSyllables(cleanWord)
      if (cleanWord.length > 2 && !STOP_WORDS.has(cleanWord) && !/^\d+$/.test(cleanWord)) {
        wordFrequencies[cleanWord] = (wordFrequencies[cleanWord] || 0) + 1
      }
    }
  }

  // Flesch Reading Ease Score
  const asl = words / sentences // Average Sentence Length
  const asw = words > 0 ? totalSyllables / words : 1 // Average Syllables per Word
  const rawScore = 206.835 - (1.015 * asl) - (84.6 * asw)
  const readingEaseScore = Math.max(0, Math.min(100, Math.round(rawScore)))

  let readingEaseLabel = "Standard"
  if (readingEaseScore >= 90) readingEaseLabel = "Very Easy (5th grade)"
  else if (readingEaseScore >= 80) readingEaseLabel = "Easy (6th grade)"
  else if (readingEaseScore >= 70) readingEaseLabel = "Fairly Easy (7th grade)"
  else if (readingEaseScore >= 60) readingEaseLabel = "Standard (8th-9th grade)"
  else if (readingEaseScore >= 50) readingEaseLabel = "Fairly Difficult (10th-12th grade)"
  else if (readingEaseScore >= 30) readingEaseLabel = "Difficult (College)"
  else readingEaseLabel = "Very Confusing (Graduate)"

  // Top Keywords
  const topKeywords: KeywordCount[] = Object.entries(wordFrequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word, count]) => ({
      word,
      count,
      percentage: Math.round((count / words) * 100)
    }))

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    readingTimeMinutes,
    speakingTimeMinutes,
    readingEaseScore,
    readingEaseLabel,
    topKeywords
  }
}
