import { LoremIpsum } from 'lorem-ipsum'

// https://www.npmjs.com/package/lorem-ipsum
export const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
})
