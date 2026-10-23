import { quizBank } from '../src/data/quiz-bank.ts'
export function measureQuizzes() {
  const questions = Object.values(quizBank).flat(),
    positions = [0, 0, 0]
  let longest = 0,
    shortest = 0
  for (const q of questions) {
    const index = q.options.findIndex((o) => o.correct),
      lengths = q.options.map((o) => o.text.length)
    positions[index]++
    if (lengths[index] === Math.max(...lengths)) longest++
    if (lengths[index] === Math.min(...lengths)) shortest++
  }
  return {
    questions: questions.length,
    correctAmongLongest: longest,
    correctAmongShortest: shortest,
    positions,
  }
}
console.log(JSON.stringify(measureQuizzes(), null, 2))
