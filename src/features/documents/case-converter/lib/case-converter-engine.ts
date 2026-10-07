export type CaseType =
  | "sentence"
  | "lower"
  | "upper"
  | "title"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "alternating"
  | "inverse"

const MINOR_WORDS = new Set([
  "and", "as", "but", "for", "if", "nor", "or", "so", "yet",
  "a", "an", "the", "at", "by", "in", "of", "off", "on", "per", "to", "up", "via"
])

function toWords(text: string): string[] {
  // Handle camelCase and delimiters
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-\.]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

export function convertCase(text: string, type: CaseType): string {
  if (!text) return ""

  switch (type) {
    case "lower":
      return text.toLowerCase()

    case "upper":
      return text.toUpperCase()

    case "sentence": {
      return text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, prefix, char) => {
        return prefix + char.toUpperCase()
      })
    }

    case "title": {
      const lines = text.split("\n")
      return lines
        .map(line => {
          const words = line.split(" ")
          return words
            .map((w, index) => {
              const lower = w.toLowerCase()
              if (index > 0 && index < words.length - 1 && MINOR_WORDS.has(lower)) {
                return lower
              }
              return w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""
            })
            .join(" ")
        })
        .join("\n")
    }

    case "camel": {
      const words = toWords(text)
      if (words.length === 0) return ""
      return words
        .map((w, i) => {
          const lower = w.toLowerCase()
          if (i === 0) return lower
          return lower.charAt(0).toUpperCase() + lower.slice(1)
        })
        .join("")
    }

    case "pascal": {
      const words = toWords(text)
      return words
        .map(w => {
          const lower = w.toLowerCase()
          return lower.charAt(0).toUpperCase() + lower.slice(1)
        })
        .join("")
    }

    case "snake": {
      const words = toWords(text)
      return words.map(w => w.toLowerCase()).join("_")
    }

    case "kebab": {
      const words = toWords(text)
      return words.map(w => w.toLowerCase()).join("-")
    }

    case "constant": {
      const words = toWords(text)
      return words.map(w => w.toUpperCase()).join("_")
    }

    case "alternating": {
      let isUpper = false
      return text
        .split("")
        .map(char => {
          if (/[a-zA-Z]/.test(char)) {
            const res = isUpper ? char.toUpperCase() : char.toLowerCase()
            isUpper = !isUpper
            return res
          }
          return char
        })
        .join("")
    }

    case "inverse": {
      return text
        .split("")
        .map(char => {
          if (char === char.toUpperCase()) return char.toLowerCase()
          return char.toUpperCase()
        })
        .join("")
    }

    default:
      return text
  }
}
