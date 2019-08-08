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
    console.log(result);
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

  insertAt(item, index) {
    // 10
    //   5->null = 10-> 5-> null
    const newNode = new _Node(item);

    let count = 0;
    let prevNode = this.head;
    let currNode = this.head;

    while(currNode.next !== null && count !== index) {
      prevNode = currNode;
      currNode = currNode.next;
      count++;
    }
    if(count !== index) {
      console.log('No value found at that index');
      return;
    }

    if(this.head.next === null) {
      this.head = newNode;
      newNode.next = currNode;
      return;
    }
    
    prevNode.next = newNode;
    newNode.next = currNode;
  }
  size(list) {
    let counter = 0;
    while (list.head !== null) {
      counter++;
      list.head = list.head.next;
    }
    return;
  }
}

module.exports = SinglyLinked;
