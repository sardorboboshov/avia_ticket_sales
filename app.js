class WeightedGraph {
  constructor() {
    this.adjacencyList = {};
  }
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
  }
  addEdge(vertex1, vertex2, weight) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }
  Dijkstra(start, finish) {
    const nodes = new PriorityQueue();
    const distances = {};
    const previous = {};
    let path = []; //to return at end
    let smallest;
    //build up initial state
    for (let vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        nodes.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }
    // as long as there is something to visit
    while (nodes.values.length) {
      smallest = nodes.dequeue().val;
      if (smallest === finish) {
        //WE ARE DONE
        //BUILD UP PATH TO RETURN AT END
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }
      if (smallest || distances[smallest] !== Infinity) {
        for (let neighbor in this.adjacencyList[smallest]) {
          //find neighboring node
          let nextNode = this.adjacencyList[smallest][neighbor];
          //calculate new distance to neighboring node
          let candidate = distances[smallest] + nextNode.weight;
          let nextNeighbor = nextNode.node;
          if (candidate < distances[nextNeighbor]) {
            //updating new smallest distance to neighbor
            distances[nextNeighbor] = candidate;
            //updating previous - How we got to neighbor
            previous[nextNeighbor] = smallest;
            //enqueue in priority queue with new priority
            nodes.enqueue(nextNeighbor, candidate);
          }
        }
      }
    }
    path = [distances[finish], path.concat(smallest).reverse()];
    return path;
  }
}

class PriorityQueue {
  constructor() {
    this.values = [];
  }
  enqueue(val, priority) {
    let newNode = new Node(val, priority);
    this.values.push(newNode);
    this.bubbleUp();
  }
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.values[parentIdx];
      if (element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }
  dequeue() {
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }
      if (swap === null) break;
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }
}

class Node {
  constructor(val, priority) {
    this.val = val;
    this.priority = priority;
  }
}

const cities = [
  "TASHKENT",
  "MOSCOW",
  "LONDON",
  "NEW-DELHI",
  "NEW-YORK",
  "DUBAI",
];

var graph = new WeightedGraph(); //adding cities to graph
cities.forEach((city) => {
  //making them vertexes
  graph.addVertex(city);
});

// FLIGHTS FROM TASHKENT TO ANOTHER CITIES
graph.addEdge("TASHKENT", "MOSCOW", 200);
graph.addEdge("TASHKENT", "LONDON", 600);
graph.addEdge("TASHKENT", "NEW-DELHI", 800);
graph.addEdge("TASHKENT", "NEW-YORK", 5000);
graph.addEdge("TASHKENT", "DUBAI", 900);

//FLIGHTS FROM MOSCOW TO ANOTHER CITIES
graph.addEdge("MOSCOW", "LONDON", 300);
graph.addEdge("MOSCOW", "NEW-DELHI", 400);
graph.addEdge("MOSCOW", "NEW-YORK", 1000);
graph.addEdge("MOSCOW", "DUBAI", 350);

//FLIGHTS FROM LONDON TO ANOTHER CITIES
graph.addEdge("LONDON", "NEW-DELHI", 250);
graph.addEdge("LONDON", "NEW-YORK", 550);
graph.addEdge("LONDON", "DUBAI", 320);

//FLIGHTS FROM NEW DELHI TO ANOTHER CITIES
graph.addEdge("NEW-DELHI", "NEW-YORK", 1500);
graph.addEdge("NEW-DELHI", "DUBAI", 600);

//FLIGHT FROM NEW-YORK TO DUBAI
graph.addEdge("NEW-YORK", "DUBAI", 900);

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const clickEventHandler = () => {
  var simple_boolean = false;
  const price = document.querySelector(".price");
  const price_number = document.createElement("div");
  price_number.className = "price_number";
  const cities = document.querySelector(".order-of-cities");
  removeAllChildNodes(cities);
  removeAllChildNodes(price);
  let city1 = document.getElementById("fcity").value;
  let city2 = document.getElementById("scity").value;
  const order_of_cities = graph.Dijkstra(city1, city2)[1];
  price_number.innerHTML = `TOTAL PRICE IS: $ ${
    graph.Dijkstra(city1, city2)[0]
  }`;
  price.appendChild(price_number);
  order_of_cities.forEach((city) => {
    if (simple_boolean) {
      var arrow_symbol = document.createElement("div");
      arrow_symbol.innerHTML = "&#8594;";
      arrow_symbol.className = "arrow";
      cities.appendChild(arrow_symbol);
    } else {
      simple_boolean = true;
    }

    var city_html = document.createElement("div");
    city_html.innerHTML = `${city}`;
    city_html.className = "city";
    cities.appendChild(city_html);
  });
};
