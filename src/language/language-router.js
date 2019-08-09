const express = require('express')
const LanguageService = require('./language-service')
const {
  requireAuth
} = require('../middleware/jwt-auth')
const SinglyLinked = require('../../linkedList');

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
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      )
      const wordList = LanguageService.fillList(
        req.app.get('db'),
        req.language,
        words
      )
      if (guess !== wordList.head.value.translation) {
        //modifying the linkedList
        wordList.head.value.incorrect_count++
        wordList.head.value.memory_value = 1
        let answer = wordList.head.value.translation
        wordList.moveHeadBy(wordList.head.value.memory_value)

        //modifying the database
        await LanguageService.updateDataBase(
          req.app.get('db'),
          wordList
        )
          res.status(200).send({
            nextWord: wordList.head.value.original,
            totalScore: wordList.total_score,
            wordCorrectCount: wordList.head.value.correct_count,
            wordIncorrectCount: wordList.head.value.incorrect_count,
            answer,
            isCorrect: false
          }) 
      }
      else {
        //modifying the linkedList
        wordList.head.value.correct_count++
        wordList.head.value.memory_value = Math.min(wordList.size()-1, wordList.head.value.memory_value * 2)
        wordList.total_score++
        wordList.moveHeadBy(wordList.head.value.memory_value)

        //modifying the database
        await LanguageService.updateDataBase(
          req.app.get('db'),
          wordList
        )
        res.status(200).send({
          nextWord: wordList.head.value.original,
          totalScore: wordList.total_score,
          wordCorrectCount: wordList.head.value.correct_count,
          wordIncorrectCount: wordList.head.value.incorrect_count,
          answer: guess,
          isCorrect: true
        }) 

        
      }
      next()
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter