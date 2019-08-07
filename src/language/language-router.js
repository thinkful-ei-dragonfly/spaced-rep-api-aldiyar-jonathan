const express = require('express')
const LanguageService = require('./language-service')
const {
  requireAuth
} = require('../middleware/jwt-auth')

const languageRouter = express.Router()
const jsonBodyParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id
      )

      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      )

      let headWord = words.find(word => word.id === language.head)

      res.json({
        nextWord: headWord.original,
        totalScore: language.total_score,
        wordCorrectCount: headWord.correct_count,
        wordIncorrectCount: headWord.incorrect_count
      })
      next()
    } catch (error) {
      next(error)
    }
  })


languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    const {
      guess
    } = req.body;
    if (!req.body.guess) {
      return res.status(400).json({
        error: `Missing 'guess' in request body`
      })
    }

    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id
      )

      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      )

      let headWord = words.find(word => word.id === language.head)
      let nextWord = words.find(word => word.id === headWord.next);
      let nextNextWord = words.find(word => word.id === nextWord.next);
      if (guess !== headWord.translation) {
        res.status(200).send({
          nextWord: nextWord.original,
          totalScore: language.total_score,
          wordCorrectCount: headWord.correct_count,
          wordIncorrectCount: headWord.incorrect_count,
          answer: headWord.translation,
          isCorrect: false
        })
        await LanguageService.changeHead(
          req.app.get('db'),
          req.language.id,
          nextWord.id
        )
        await LanguageService.moveNewHeadPointer(
          req.app.get('db'),
          headWord.id,
          nextWord.id
        )
        await LanguageService.moveOldHeadPointer(
          req.app.get('db'),
          headWord.id,
          nextNextWord.id
        )
        await LanguageService.updateIncorrectCount(
          req.app.get('db'),
          nextWord
        )

      }
      next()
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter