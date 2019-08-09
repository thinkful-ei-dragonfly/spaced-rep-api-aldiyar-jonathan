const SinglyLinked = require('../../linkedList')
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

  fillList(db, language, words){
    let wordList = new SinglyLinked()
    wordList.id = language.id
    wordList.name = language.name
    wordList.total_score = language.total_score
    let word = words.find(w => w.id === language.head)
    wordList.insertFirst({
      id: word.id,
      original: word.original,
      translation: word.translation,
      memory_value: word.memory_value,
      correct_count: word.correct_count,
      incorrect_count: word.incorrect_count
    })
    
    while(word.next){
      word = words.find(w => w.id === word.next)
      wordList.insertLast({
        id: word.id,
        original: word.original,
        translation: word.translation,
        memory_value: word.memory_value,
        correct_count: word.correct_count,
        incorrect_count: word.incorrect_count,
      })
    }
    return wordList
  },
  
  updateDataBase(db, linkedList_language){
    return db.transaction(transaction => 
      Promise.all([
        db('language')
        .transacting(transaction)
        .where('id', linkedList_language.id)
        .update({
          total_score: linkedList_language.total_score,
          head: linkedList_language.head.value.id
        }),
        ...linkedList_language.forEach(node =>
          db('word')
          .transacting(transaction)
          .where('id', node.value.id)
          .update({
            memory_value: node.value.memory_value,
            correct_count: node.value.correct_count,
            incorrect_count: node.value.incorrect_count,
            next: node.next ? node.next.value.id : null,
          }))
      ]))
  }
}


module.exports = LanguageService
