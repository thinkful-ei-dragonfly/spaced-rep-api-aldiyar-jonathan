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
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id
      )

      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      )

      let linkedList = new SinglyLinked();

      words.forEach(word => {
        linkedList.insertLast(word);
      })
      console.log(linkedList)
      let wordThatPoints;
      let newHead = linkedList.head.next;
      linkedList.head.next = newHead.next;
      newHead.next = linkedList.head;
      
      
      let memory = Math.min(words.length, originalHead.value.memory_value)
      function findWordThatPoints() {
        let currentNode = linkedList.head;
        for (i = 0; i < memory; i++) {
          
          wordThatPoints = currentNode;
          currentNode = currentNode.next;
          
        }
        return wordThatPoints;
      }
      wordThatPoints = findWordThatPoints();
      

      function findWordToPoint() {
        let currentNode = originalHead;
        // console.log(currentNode)
        for (i = 0; i <= memory; i++) {
          //first round i =0 current = originalHead(1) wordToPoint = originalHead.next(2) currentNode = originalHead.next(2);
          //secondRound i = 1 current = originalHead.next(2) wortToPoint = originalHead.next.next(3) current node = orignialHead.next.next(3)
          //thrirdRound i = 2 current = originalHead.next.next(3) wordToPoint = originalHead.next.next.next(4) current node = originalHead.next.netx.next(4)
          wordToPoint = currentNode;
          currentNode = currentNode.next;
        }

        return wordToPoint;
      }

      wordToPoint = findWordToPoint();
      

      linkedList.head = linkedList.head.next;
      originalHead.next = wordToPoint;
      wordThatPoints.next = originalHead;

      // let headWord = words.find(word => word.id === language.head)
      // let nextWord = words.find(word => word.id === headWord.next);
      if (guess !== originalHead.value.translation) {
        await LanguageService.resetMemoryValue(
          req.app.get('db'),
          originalHead
        )
        originalHead.memory_value = 1;
        on
        await LanguageService.changeHead(
          req.app.get('db'),
          req.language.id,
          linkedList.head
        )
        await LanguageService.moveWordThatPoints(
          req.app.get('db'),
          wordThatPoints,
          originalHead
        )
        await LanguageService.moveWordToPoint(
          req.app.get('db'),
          originalHead,
          wordToPoint
        )
        await LanguageService.updateIncorrectCount(
          req.app.get('db'),
          originalHead
        )
        res.status(200).send({
          nextWord: linkedList.head.value.original,
          totalScore: language.total_score,
          wordCorrectCount: linkedList.head.value.correct_count,
          wordIncorrectCount: linkedList.head.value.incorrect_count,
          answer: originalHead.value.translation,
          isCorrect: false
        })

        
      }
      // else {
      //   await LanguageService.doubleMemoryValue(
      //     req.app.get('db'),
      //     headWord
      //   )
      //   headWord.memory_value = headWord.memory_value*2

      //   await LanguageService.changeHead(
      //     req.app.get('db'),
      //     req.language.id,
      //     nextWord
      //   )
      //   await LanguageService.moveOldHeadPointer(
      //     req.app.get('db'),
      //     headWord,
      //     words
      //   )

      //   await LanguageService.moveNewHeadPointer(
      //     req.app.get('db'),
      //     headWord
      //   )
      //   await LanguageService.updateCorrectCount(
      //     req.app.get('db'),
      //     headWord
      //   )

      //   await LanguageService.updateTotalScore(
      //     req.app.get('db'),
      //     language
      //   )

      //   res.status(200).send({
      //     nextWord: nextWord.original,
      //     totalScore: language.total_score + 1,
      //     wordCorrectCount: nextWord.correct_count,
      //     wordIncorrectCount: nextWord.incorrect_count,
      //     answer: headWord.translation,
      //     isCorrect: true
      //   })

        
      // }
      next()
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter