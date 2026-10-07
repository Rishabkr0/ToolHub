import { Metadata } from "next"
import { WordCounterTool } from "@/features/documents/word-counter/components/word-counter-tool"

export const metadata: Metadata = {
  title: "Word Counter & Text Analyzer | ToolHub",
  description: "Count words, characters, sentences, paragraphs, reading time, and readability score in real-time.",
}

export default function WordCounterPage() {
  return <WordCounterTool />
}
