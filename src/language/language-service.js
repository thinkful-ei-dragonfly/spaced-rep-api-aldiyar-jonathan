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

  changeHead(db, language_id, nextWord) {
    return db
      .from('language')
      .where('id', language_id)
      .update({head: nextWord.id})
  },

  moveNewHeadPointer(db, oldHead) {
    return db
      .from('word')
      .where('id', (oldHead.next + oldHead.memory_value) - 1)
      .update({ next: oldHead.id })
  },

  moveOldHeadPointer(db, oldHead) {
    return db
      .from('word')
      .where('id', oldHead.id)
      .update({ next: (oldHead.next + oldHead.memory_value)})
  },

  updateIncorrectCount(db, wordToUpdate) {
    return db
      .from('word')
      .where('id', wordToUpdate.id)
      .update({ incorrect_count: (wordToUpdate.incorrect_count) + 1 })
    },

    updateCorrectCount(db, wordToUpdate){
      return db
      .from('word')
      .where('id', wordToUpdate.id)
      .update({ correct_count: (wordToUpdate.correct_count) + 1})
    },

    doubleMemoryValue(db, wordToUpdate){
      return db
      .from('word')
      .where('id', wordToUpdate.id)
      .update({ memory_value: wordToUpdate.memory_value*2})
    },

    resetMemoryValue(db, wordToUpdate){
      return db
      .from('word')
      .where('id', wordToUpdate.id)
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
