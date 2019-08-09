/* eslint-disable strict */
class _Node {
  constructor(value, next=null) {
    this.value = value;
    this.next = next;
  }
}

class SinglyLinked {
  constructor() {
    this.head = null;
  }

  insertFirst(value) {
    this.head = new _Node(value, this.head);
  }

  insertLast(value) {
    const node = new _Node(value);
    let currentNode = this.head;
    if (!currentNode) {
      this.head = node;
      return;
    }
    while (currentNode.next !== null) {
      currentNode = currentNode.next;
    }
    currentNode.next = node;
  }

  remove(item) {
    if(!this.head) return null;
    if (this.head.value === item) {
      this.head = this.head.next;
      return; 
    }
    let currNode = this.head;
    let prevNode = this.head;

    while((currNode !== null) && (currNode.value !== item)) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    if(currNode === null) {
      console.log('Item not found');
      return;
    }
    prevNode.next = currNode.next;
  }

  removeObj(item) {
    if(!this.head) return null;
    if (this.head.value.key === item) {
      this.head = this.head.next;
      return; 
    }
    let currNode = this.head;
    let prevNode = this.head;

    while((currNode !== null) && (currNode.value.key !== item)) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    if(currNode === null) {
      console.log('Item not found');
      return;
    }
    prevNode.next = currNode.next;
  }

  find(item) {
    let currNode = this.head;
    let result = '';

    while((currNode.value !== item) && (currNode.next !== null) ) {
      currNode = currNode.next;
    }
    result = currNode.value !== item ? 'Item not found' : `Result: ${JSON.stringify(currNode)}`;
    return result;
  }

  insertBefore(item, nodeVal) {
    const newNode = new _Node(item);

    if (this.head.next === null) {
      const temp = this.head;
      newNode.next = temp;
      this.head = newNode;
      return;
    }
    
    let currNode = this.head;
    while(currNode.next !== null && currNode.next.value !== nodeVal) {
      currNode = currNode.next;
    }

    const tail = currNode.next;
    currNode.next = newNode;
    newNode.next = tail;
  }

  insertAfter(item, nodeVal) {
    const newNode = new _Node(item);
    let currNode = this.head;
    
    while(currNode.next !== null && currNode.value !== nodeVal) {
      currNode = currNode.next;
    }
  
    const tail = currNode.next;
    currNode.next = newNode;
    newNode.next = tail;
  }
  insertAt(nthPosition, itemToInsert) {
    if (nthPosition < 0) {
      throw new Error('Position error');
    }
    if (nthPosition === 0) {
      this.insertFirst(itemToInsert);
    } else {
      // Find the node which we want to insert after
      const node = this._findNthElement(nthPosition - 1);
      const newNode = new _Node(itemToInsert, null);
      newNode.next = node.next;
      node.next = newNode;
    }
  }

  _findNthElement(position){
    let node = this.head
    for(let i = 0; i < position; i++){
      node = node.next
    }
    return node
  }
  display(){
    let result = [];
    let currentNode = this.head;
    while(currentNode !== null){
      result.push(currentNode.value);
      currentNode = currentNode.next;
    }
    return result;
  }
  
  size(){
    return this.display().length;
  }
  moveHeadBy(amount){
    let head = this.head
    this.head = this.head.next
    this.insertAt(amount, head.value)
  }
  forEach(cb){
    let node = this.head
    const arr = []
    while(node){
      arr.push(cb(node))
      node = node.next
    }
    return arr
  }
}

module.exports = SinglyLinked;
