export class NextWayNode {
  constructor(index, value) {
    this.index = index;
    this.value = value;
    /**
     * @type {NextWayNode|TwoWayNode|null}
     */
    this.next = null;
  }
}

export class TwoWayNode extends NextWayNode {
  /**
   * @type {NextWayNode|TwoWayNode|null}
   */
  before = null;
}

export class LinkedList {
  constructor() {
    /**
     * @type {NextWayNode|TwoWayNode|null}
     */
    this.head = null;
    /**
     * @type {NextWayNode|TwoWayNode|null}
     */
    this.tail = null;
  }

  // insertBefore(index, value) {
  //   const newNode = new TwoWayNode(index, value);

  //   if (!this.head) {
  //     this.head = newNode;
  //     this.tail = newNode;
  //     return newNode;
  //   }

  //   if (index < this.head.index) {
  //     newNode.next = this.head;
  //     this.head = newNode;
  //     return newNode;
  //   }

  //   let current = this.head;
  //   while (current.next && current.index <= index) {
  //     newNode.before = current;
  //     current = current.next;
  //   }
  //   newNode.next = current;
  //   newNode.before.next = newNode;
  //   return newNode;
  // }
  insertAfter(index, value) {
    const newNode = new TwoWayNode(index, value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return newNode;
    }

    if (index < this.head.index) {
      newNode.next = this.head;
      this.head.before = newNode;
      this.head = newNode;
      return newNode;
    } else if (index > this.tail.index) {
      this.tail.next = newNode;
      newNode.before = this.tail;
      this.tail = newNode;
      return newNode;
    }

    let current = this.head;
    if (!current) {
      debugger;
    }
    while (current.next && current.index <= index) {
      current = current.next;
    }

    newNode.next = current;
    newNode.before = current.before;
    current.before = newNode;
    if (newNode.before) {
      newNode.before.next = newNode;
    }

    return newNode;
  }

  push(index, value) {
    const newNode = new NextWayNode(index, value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    this.tail.next = newNode;
    this.tail = newNode;
    return newNode;
  }

  /**
   *
   * @param {TwoWayNode} twoWayNode
   */
  remove(twoWayNode) {
    if (this.head == twoWayNode) {
      this.head = twoWayNode.next;
    }
    if (this.tail == twoWayNode) {
      this.tail = twoWayNode.before;
    }

    if (twoWayNode.before) {
      twoWayNode.before.next = twoWayNode.next;
    }
    if (twoWayNode.next instanceof TwoWayNode) {
      twoWayNode.next.before = twoWayNode.before;
    }
  }

  clear() {
    this.head = null;
    this.tail = null;
  }

  print() {
    let currentNode = this.head;
    let arr = [];
    let keys = [];

    while (currentNode) {
      arr.push(currentNode.value);
      keys.push(currentNode.index);
      currentNode = currentNode.next;
    }

    console.log(keys);
    console.log(arr);
  }
}
