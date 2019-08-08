const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  changeHead(db, language_id, newHead) {
    return db
      .from('language')
      .where('id', language_id)
      .update({head: newHead.value.id})
  },

  moveWordThatPoints(db, wordThatPoints, originalHead) {
    return db
      .from('word')
      .where('id', wordThatPoints.value.id)
      .update({ next: originalHead.value.id })
  },

  moveWordToPoint(db, originalHead, wordToPoint) {
    return db
      .from('word')
      .where('id', originalHead.value.id)
      .update({ next: wordToPoint.value.id})
  },

  updateIncorrectCount(db, wordToUpdate) {
    return db
      .from('word')
      .where('id', wordToUpdate.value.id)
      .update({ incorrect_count: (wordToUpdate.value.incorrect_count) + 1 })
    },

    updateCorrectCount(db, wordToUpdate){
      return db
      .from('word')
      .where('id', wordToUpdate.value.id)
      .update({ correct_count: (wordToUpdate.value.correct_count) + 1})
    },

    doubleMemoryValue(db, wordToUpdate){
      return db
      .from('word')
      .where('id', wordToUpdate.value.id)
      .update({ memory_value: wordToUpdate.value.memory_value*2})
    },

    resetMemoryValue(db, wordToUpdate){
      return db
      .from('word')
      .where('id', wordToUpdate.value.id)
      .update({ memory_value: 1})
    },

    updateTotalScore(db, language){
      return db
      .from('language')
      .where('id', language.id)
      .update({ total_score: language.total_score+1 })
    }
    
}


module.exports = LanguageService
