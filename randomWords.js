class EasyToDrawWords {
  constructor() {
      this.words = [
          'apple', 'car', 'tree', 'house', 'sun',
          'cat', 'dog', 'flower', 'bird', 'banana',
          'fish', 'ball', 'moon', 'star', 'heart',
          'book', 'key', 'chair', 'table', 'hat',
          'duck', 'tree', 'house', 'sun', 'bird',
          'moon', 'star', 'heart', 'book', 'chair',
          'hat', 'sock', 'tree', 'sun', 'moon',
          'star', 'heart', 'book', 'house', 'cat',
          'dog', 'fish', 'car', 'apple', 'banana',
          'flower', 'bird', 'ball', 'key', 'chair',
          'table', 'hat', 'duck', 'sock', 'sun',
          'moon', 'star', 'heart', 'book', 'cat',
          'dog', 'fish', 'car', 'banana', 'flower',
          'bird', 'ball', 'key', 'chair', 'table',
          'hat', 'duck', 'sock', 'sun', 'moon',
          'star', 'heart', 'book', 'cat', 'dog',
          'fish', 'car', 'banana', 'flower', 'bird',
          'ball', 'key', 'chair', 'table', 'hat',
          'duck', 'sock', 'sun', 'moon', 'star',
          'heart', 'book',
          // Additional 200 words
          'pen', 'pencil', 'house', 'apple', 'flower',
          'tree', 'bird', 'sun', 'star', 'moon',
          'heart', 'boat', 'car', 'truck', 'dog',
          'cat', 'fish', 'banana', 'ball', 'hat',
          'table', 'chair', 'key', 'lock', 'door',
          'window', 'clock', 'cake', 'cupcake', 'ice cream',
          'pizza', 'burger', 'fries', 'hotdog', 'sandwich',
          'cookie', 'donut', 'cup', 'plate', 'fork',
          'spoon', 'knife', 'bowl', 'glass', 'jug',
          'guitar', 'drum', 'piano', 'violin', 'trumpet',
          'flute', 'xylophone', 'accordion', 'tambourine', 'keyboard',
          'brush', 'paint', 'canvas', 'easel', 'palette',
          'flowerpot', 'vase', 'plant', 'cactus', 'watering can',
          'hammer', 'screwdriver', 'saw', 'nail', 'screw',
          'wrench', 'pliers', 'tape', 'glue', 'scissors',
          'ruler', 'calculator', 'notebook', 'diary', 'journal',
          'puzzle', 'ball', 'kite', 'yo-yo', 'teddy bear',
          'doll', 'train', 'plane', 'boat', 'carriage',
          'rocket', 'robot', 'bicycle', 'scooter', 'skateboard',
          'roller skate', 'ice skate', 'swimming pool', 'beach', 'sandcastle',
          'bucket', 'spade', 'shovel', 'watermelon', 'grapes',
          'apple', 'orange', 'pear', 'kiwi', 'strawberry',
          'pineapple', 'watermelon', 'banana', 'grapefruit', 'cherry',
          'lemon', 'lime', 'blueberry', 'raspberry', 'blackberry',
          'cantaloupe', 'apricot', 'peach', 'plum', 'fig',
          'coconut', 'pomegranate', 'avocado', 'mango', 'papaya',
          'dragon fruit', 'lychee', 'passion fruit', 'guava', 'jackfruit',
          'kiwi', 'starfruit', 'nectarine', 'persimmon', 'tangerine',
          'cashew', 'almond', 'walnut', 'pecan', 'pistachio',
          'peanut', 'hazelnut', 'macadamia', 'chestnut', 'acorn'
      ];
      this.usedWords = [];
  }

  generateWord() {
      let randomIndex = Math.floor(Math.random() * this.words.length);
      let word = this.words[randomIndex];
      this.words.splice(randomIndex, 1);
      this.usedWords.push(word);
      return word;
  }

  generateWords(num) {
      if (num > this.words.length) {
          throw new Error("Not enough words available");
      }
      let selectedWords = [];
      for (let i = 0; i < num; i++) {
          selectedWords.push(this.generateWord());
      }
      return selectedWords;
  }
}

export default EasyToDrawWords


