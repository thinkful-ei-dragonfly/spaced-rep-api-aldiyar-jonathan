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

  changeHead(db, language_id, headWord_id) {
    return db
      .from('language')
      .where('id', language_id)
      .update({head: headWord_id})
  },

  moveNewHeadPointer(db, oldHead_id, newHead_id) {
    return db
      .from('word')
      .where('id', newHead_id)
      .update({ next: oldHead_id })
  },

  moveOldHeadPointer(db, oldHead_id, newHeadNext_id) {
    return db
      .from('word')
      .where('id', oldHead_id)
      .update({ next: newHeadNext_id })
  },

  updateIncorrectCount(db, wordToUpdate) {
    console.log(wordToUpdate)
    return db
      .from('word')
      .where('id', wordToUpdate.id)
      .update({ incorrect_count: (wordToUpdate.incorrect_count) + 1 })
    }
    
}


module.exports = LanguageService
