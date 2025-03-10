function quickSort(arr) {     //If we every time choose maimal or minimal element then it will have n^2 complexity
    if (arr.length < 2) return arr;
    let min = 1;
    let max = arr.length - 1;
    let rand = Math.floor(min + Math.random() * (max + 1 - min));
    let pivot = arr[rand];
    const left = [];
    const right = [];
    arr.splice(arr.indexOf(pivot), 1);
    arr = [pivot].concat(arr);    //Concat will unite the arrays
    for (let i = 1; i < arr.length; i++) {
      if (pivot > arr[i]) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    return quickSort(left).concat(pivot, quickSort(right));
}

//-------------------------------------------------------------------

function merge(left, right) {
    let resultArray = [],
        leftIndex = 0,
        rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            resultArray.push(left[leftIndex]);
            leftIndex++;
        } else {
            resultArray.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return resultArray
        .concat(left.slice(leftIndex))
        .concat(right.slice(rightIndex));
}

function mergeSort(array) {
    if (array.length === 1) {
        return array;
    }

    const middle = Math.floor(array.length / 2); 
    const left = array.slice(0, middle); 
    const right = array.slice(middle); 

    return merge(
        mergeSort(left), 
        mergeSort(right) 
    );
}

//-------------------------------------------------------------------

function swap(array, index1, index2) {
    [array[index1], array[index2]] = [array[index2], array[index1]];
}

function heapify(array, index, length = array.length) {
    let largest = index,
        left = index * 2 + 1,
        right = index * 2 + 2;

    if (left < length && array[left] > array[largest]) {
        largest = left;
    }
    if (right < length && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== index) {
        swap(array, index, largest);

        heapify(array, largest, length);
    }

    return array;
}

function heapSort(array) {
    let arr = [...array]; 

    for (let i = Math.floor(arr.length / 2); i >= 0; i--) {
        heapify(arr, i);
    }

    for (let i = arr.length - 1; i > 0; i--) {
        swap(arr, 0, i);
        heapify(arr, 0, i);
    }

    return arr;
}

//-------------------------------------------------------------------

function sortWithBST(array) {
    class Node {
        constructor(data) {
            this.data = data;
            this.left = null;
            this.right = null;
        }
    }

    class BST {
        constructor() {
            this.root = null;
        }

        insert(data) {
            let newNode = new Node(data);
            if (this.root === null) {
                this.root = newNode;
            } else {
                this.insertNode(this.root, newNode);
            }
        }

        insertNode(node, newNode) {
            if (newNode.data < node.data) {
                if (node.left === null) {
                    node.left = newNode;
                } else {
                    this.insertNode(node.left, newNode);
                }
            } else {
                if (node.right === null) {
                    node.right = newNode;
                } else {
                    this.insertNode(node.right, newNode);
                }
            }
        }

        inOrder(node, result) {
            if (node !== null) {
                this.inOrder(node.left, result);
                result.push(node.data);
                this.inOrder(node.right, result);
            }
        }

        getSortedArray() {
            let result = [];
            this.inOrder(this.root, result);
            return result;
        }
    }

    let bst = new BST();
    for (let i = 0; i < array.length; i++) {
        bst.insert(array[i]);
    }
    
    return bst.getSortedArray();
}

//-------------------------------------------------------------------

function measureExecutionTime(sortFunction, array) {
    let start = performance.now();
    sortFunction([...array]); 
    let end = performance.now();
    return end - start;
}

function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
}

const sizes = [100, 500, 1000, 5000, 10000, 20000, 100000];
const results = {
    quickSort: [],
    mergeSort: [],
    heapSort: [],
    sortWithBST: []
};

sizes.forEach(size => {
    const arr = generateRandomArray(size);
    results.quickSort.push(measureExecutionTime(quickSort, arr));
    results.mergeSort.push(measureExecutionTime(mergeSort, arr));
    results.heapSort.push(measureExecutionTime(heapSort, arr));
    results.sortWithBST.push(measureExecutionTime(sortWithBST, arr));
});

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("performanceChart");
    const ctx = canvas.getContext("2d");

    function drawGraph() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const marginLeft = 50;
        const marginBottom = 50;
        const marginTop = 30;
        const marginRight = 20;
        const graphWidth = canvas.width - marginLeft - marginRight;
        const graphHeight = canvas.height - marginBottom - marginTop;
    
        let maxTime = Math.max(...Object.values(results).flat());
        let scaleX = graphWidth / (sizes.length - 1);
        let scaleY = graphHeight / maxTime;
    
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(marginLeft, marginTop);
        ctx.lineTo(marginLeft, canvas.height - marginBottom);
        ctx.stroke();
    
        ctx.beginPath();
        ctx.moveTo(marginLeft, canvas.height - marginBottom);
        ctx.lineTo(canvas.width - marginRight, canvas.height - marginBottom);
        ctx.stroke();
    
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
    
        let stepY = Math.ceil(maxTime / 5);
        for (let i = 0; i <= 5; i++) {
            let yValue = stepY * i;
            let y = canvas.height - marginBottom - yValue * scaleY;
            ctx.fillText(yValue.toFixed(0) + " ms", 5, y);
            
            ctx.beginPath();
            ctx.moveTo(marginLeft - 5, y);
            ctx.lineTo(marginLeft + graphWidth, y);
            ctx.strokeStyle = "#ddd";
            ctx.stroke();
        }
    
        ctx.textAlign = "center";
        sizes.forEach((size, i) => {
            let x = marginLeft + i * scaleX;
            ctx.fillText(size, x, canvas.height - marginBottom + 20);
        });
    
        const colors = { quickSort: "red", mergeSort: "blue", heapSort: "green", sortWithBST: "purple" };
        
        Object.entries(results).forEach(([name, times]) => {
            ctx.beginPath();
            ctx.strokeStyle = colors[name];
            ctx.lineWidth = 2;
            
            times.forEach((time, i) => {
                let x = marginLeft + i * scaleX;
                let y = canvas.height - marginBottom - time * scaleY;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        });
    
        ctx.font = "18px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("Sorting Algorithm Performance", canvas.width / 2, marginTop - 5);
    }
    
    drawGraph();
});

//-------------------------------------------------------------------
 
const visualizationCanvas = document.getElementById('visualizationCanvas');
visualizationCanvas.width = 800;
visualizationCanvas.height = 400;
document.body.insertBefore(visualizationCanvas, document.getElementById('visualization_section'));
const vizCtx = visualizationCanvas.getContext('2d');

let isSorting = false;
let currentArray = [];
let animationDelay = 50;  
function drawVisualization(array, highlights = {}) {
    vizCtx.clearRect(0, 0, visualizationCanvas.width, visualizationCanvas.height);
    const barWidth = visualizationCanvas.width / array.length;
    const maxHeight = Math.max(...array);
    const scale = (visualizationCanvas.height * 0.7) / maxHeight;  // Уменьшение масштаба для большего отступа
    const textOffset = 35; // Увеличьте отступ для большего пространства под текст

    vizCtx.font = "12px Arial";
    vizCtx.textAlign = "right"; 
    vizCtx.fillStyle = "#000000"; 

    array.forEach((value, i) => {
        vizCtx.fillStyle = highlights[i] || '#2196f3';
        const x = i * barWidth;
        const barHeight = value * scale;
        const y = visualizationCanvas.height - barHeight - textOffset;

        vizCtx.fillRect(x, y, barWidth - 1, barHeight);

        vizCtx.save();
        vizCtx.translate(x + barWidth / 2, visualizationCanvas.height - 25);  // Увеличиваем отступ для текста
        vizCtx.rotate(-Math.PI / 2); 
        vizCtx.fillText(value, 0, 0);
        vizCtx.restore();
    });
}



 
async function quickSortVisualization(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = await partitionVisualization(arr, low, high);
        await quickSortVisualization(arr, low, pi - 1);
        await quickSortVisualization(arr, pi + 1, high);
    }
}

async function partitionVisualization(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            drawVisualization(arr, { [i]: '#ff5722', [j]: '#4caf50' });
            await new Promise(resolve => setTimeout(resolve, animationDelay));
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    drawVisualization(arr, { [i + 1]: '#ff5722', [high]: '#4caf50' });
    await new Promise(resolve => setTimeout(resolve, animationDelay));
    return i + 1;
}
 
async function mergeSortVisualization(array) {
    if (array.length <= 1) return array;

    const middle = Math.floor(array.length / 2);
    const left = await mergeSortVisualization(array.slice(0, middle));
    const right = await mergeSortVisualization(array.slice(middle));
    
    return mergeVisualization(left, right);
}

async function mergeVisualization(left, right) {
    let result = [];
    let li = 0, ri = 0;
    
    while (li < left.length && ri < right.length) {
        if (left[li] < right[ri]) {
            result.push(left[li++]);
        } else {
            result.push(right[ri++]);
        }
        currentArray = [...result, ...left.slice(li), ...right.slice(ri)];
        drawVisualization(currentArray, { [result.length - 1]: '#ff5722' });
        await new Promise(resolve => setTimeout(resolve, animationDelay));
    }
    
    return result.concat(left.slice(li)).concat(right.slice(ri));
}
 
async function heapSortVisualization(array) {
    let arr = [...array];
    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapifyVisualization(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        drawVisualization(arr, { 0: '#ff5722', [i]: '#4caf50' });
        await new Promise(resolve => setTimeout(resolve, animationDelay));
        await heapifyVisualization(arr, i, 0);
    }
    return arr;
}

async function heapifyVisualization(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        drawVisualization(arr, { [i]: '#ff5722', [largest]: '#4caf50' });
        await new Promise(resolve => setTimeout(resolve, animationDelay));
        await heapifyVisualization(arr, n, largest);
    }
}
 
function createVisualizationControls() {
    const controls = document.getElementById('viz_controls');
    controls.style.margin = '20px';
    
    const algorithms = {
        'Quick Sort': quickSortVisualization,
        'Merge Sort': mergeSortVisualization,
        'Heap Sort': heapSortVisualization,
        'BST Sort': async () => {
            const sorted = sortWithBST(currentArray);
            for (let i = 0; i < sorted.length; i++) {
                currentArray[i] = sorted[i];
                drawVisualization(currentArray, { [i]: '#ff5722' });
                await new Promise(resolve => setTimeout(resolve, animationDelay));
            }
        }
    };

    Object.entries(algorithms).forEach(([name, func]) => {
        const btn = document.createElement('button');
        btn.textContent = name;
        btn.style.margin = '0 10px';
        btn.addEventListener('click', async () => {
            if (isSorting) return;
            isSorting = true;
            currentArray = generateRandomArray(50);
            drawVisualization(currentArray);
            await func(currentArray);
            isSorting = false;
        });
        controls.appendChild(btn);
    });

    document.body.insertBefore(controls, visualizationCanvas);
}
 
createVisualizationControls();
// Add this code after your existing visualization code

// Create performance metrics display
function createPerformanceMetricsDisplay() {
    const metricsContainer = document.createElement('div');
    metricsContainer.id = 'performance_metrics';
    metricsContainer.style.margin = '20px';
    metricsContainer.style.padding = '15px';
    metricsContainer.style.border = '1px solid #ddd';
    metricsContainer.style.borderRadius = '5px';
    metricsContainer.style.backgroundColor = '#f5f5f5';
    
    const title = document.createElement('h3');
    title.textContent = 'Algorithm Performance Metrics';
    title.style.marginTop = '0';
    metricsContainer.appendChild(title);
    
    const metricsTable = document.createElement('table');
    metricsTable.style.width = '100%';
    metricsTable.style.borderCollapse = 'collapse';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Algorithm', 'Array Size', 'Execution Time (ms)', 'Comparisons', 'Swaps'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.padding = '8px';
        th.style.borderBottom = '2px solid #ddd';
        th.style.textAlign = 'left';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    metricsTable.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    tbody.id = 'metrics_body';
    metricsTable.appendChild(tbody);
    
    metricsContainer.appendChild(metricsTable);
    
    // Insert after visualization canvas
    document.body.insertBefore(metricsContainer, document.getElementById('visualization_section'));
}

// Initialize metrics counters
let comparisons = 0;
let swaps = 0;

// Update the metrics table with new data
function updateMetricsTable(algorithm, arraySize, executionTime) {
    const tbody = document.getElementById('metrics_body');
    const row = document.createElement('tr');
    
    // Add data cells
    [algorithm, arraySize, executionTime.toFixed(2), comparisons, swaps].forEach(text => {
        const td = document.createElement('td');
        td.textContent = text;
        td.style.padding = '8px';
        td.style.borderBottom = '1px solid #ddd';
        row.appendChild(td);
    });
    
    // Add to table (at the beginning for most recent results on top)
    if (tbody.firstChild) {
        tbody.insertBefore(row, tbody.firstChild);
    } else {
        tbody.appendChild(row);
    }
    
    // Limit table to 10 rows
    while (tbody.children.length > 10) {
        tbody.removeChild(tbody.lastChild);
    }
}

// Modify the existing visualization controls to track performance
function enhanceVisualizationControls() {
    const controls = document.getElementById('viz_controls');
    // Clear existing buttons to recreate them with performance tracking
    controls.innerHTML = '';
    
    // Modified algorithm implementations with performance tracking
    const algorithms = {
        'Quick Sort': async (arr) => {
            comparisons = 0;
            swaps = 0;
            const start = performance.now();
            await quickSortVisualizationWithMetrics(arr);
            const end = performance.now();
            updateMetricsTable('Quick Sort', arr.length, end - start);
            return arr;
        },
        'Merge Sort': async (arr) => {
            comparisons = 0;
            swaps = 0;
            const start = performance.now();
            currentArray = await mergeSortVisualizationWithMetrics(arr);
            const end = performance.now();
            updateMetricsTable('Merge Sort', arr.length, end - start);
            return currentArray;
        },
        'Heap Sort': async (arr) => {
            comparisons = 0;
            swaps = 0;
            const start = performance.now();
            await heapSortVisualizationWithMetrics(arr);
            const end = performance.now();
            updateMetricsTable('Heap Sort', arr.length, end - start);
            return arr;
        },
        'BST Sort': async (arr) => {
            comparisons = 0;
            swaps = 0;
            const start = performance.now();
            const sorted = await bstSortVisualizationWithMetrics(arr);
            const end = performance.now();
            updateMetricsTable('BST Sort', arr.length, end - start);
            return sorted;
        }
    };

    // Array size selector
    const sizeLabel = document.createElement('label');
    sizeLabel.textContent = 'Array Size: ';
    sizeLabel.style.marginRight = '5px';
    controls.appendChild(sizeLabel);
    
    const sizeSelect = document.createElement('select');
    sizeSelect.id = 'array_size';
    [20, 50, 100, 200].forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        if (size === 50) option.selected = true;
        sizeSelect.appendChild(option);
    });
    sizeSelect.style.marginRight = '20px';
    controls.appendChild(sizeSelect);
    
    // Speed selector
    const speedLabel = document.createElement('label');
    speedLabel.textContent = 'Animation Speed: ';
    speedLabel.style.marginRight = '5px';
    controls.appendChild(speedLabel);
    
    const speedSelect = document.createElement('select');
    speedSelect.id = 'animation_speed';
    [
        {value: 200, text: 'Slow'},
        {value: 50, text: 'Medium'},
        {value: 10, text: 'Fast'},
        {value: 1, text: 'Very Fast'}
    ].forEach(option => {
        const optEl = document.createElement('option');
        optEl.value = option.value;
        optEl.textContent = option.text;
        if (option.value === 50) optEl.selected = true;
        speedSelect.appendChild(optEl);
    });
    speedSelect.style.marginRight = '20px';
    speedSelect.addEventListener('change', () => {
        animationDelay = parseInt(speedSelect.value);
    });
    controls.appendChild(speedSelect);
    
    // Algorithm buttons
    Object.entries(algorithms).forEach(([name, func]) => {
        const btn = document.createElement('button');
        btn.textContent = name;
        btn.style.margin = '0 10px';
        btn.style.padding = '5px 10px';
        btn.addEventListener('click', async () => {
            if (isSorting) return;
            isSorting = true;
            const size = parseInt(document.getElementById('array_size').value);
            currentArray = generateRandomArray(size);
            drawVisualization(currentArray);
            await func(currentArray);
            isSorting = false;
        });
        controls.appendChild(btn);
    });
}

// Modified algorithm implementations with metrics tracking
async function quickSortVisualizationWithMetrics(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = await partitionVisualizationWithMetrics(arr, low, high);
        await quickSortVisualizationWithMetrics(arr, low, pi - 1);
        await quickSortVisualizationWithMetrics(arr, pi + 1, high);
    }
    return arr;
}

async function partitionVisualizationWithMetrics(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        comparisons++;
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            swaps++;
            drawVisualization(arr, { [i]: '#ff5722', [j]: '#4caf50' });
            await new Promise(resolve => setTimeout(resolve, animationDelay));
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    swaps++;
    drawVisualization(arr, { [i + 1]: '#ff5722', [high]: '#4caf50' });
    await new Promise(resolve => setTimeout(resolve, animationDelay));
    return i + 1;
}

async function mergeSortVisualizationWithMetrics(array) {
    if (array.length <= 1) return array;

    const middle = Math.floor(array.length / 2);
    const left = await mergeSortVisualizationWithMetrics(array.slice(0, middle));
    const right = await mergeSortVisualizationWithMetrics(array.slice(middle));
    
    return mergeVisualizationWithMetrics(left, right);
}

async function mergeVisualizationWithMetrics(left, right) {
    let result = [];
    let leftCopy = [...left];   // Create copies to prevent modifying the originals
    let rightCopy = [...right]; // during visualization
    
    // For tracking position in visualization
    let originalLeft = left.length;
    let originalRight = right.length;
    
    while (leftCopy.length && rightCopy.length) {
        comparisons++;
        
        if (leftCopy[0] < rightCopy[0]) {
            result.push(leftCopy.shift());
        } else {
            result.push(rightCopy.shift());
        }
        swaps++; // Count each merge operation as a "swap"
        
        // Visualize current state - create a combined array for visualization
        const visualArray = [...result, ...leftCopy, ...rightCopy];
        
        // Calculate the correct highlighting index
        const highlightIndex = result.length - 1;
        
        // Create highlighting object with special coloring for left and right parts
        const highlights = { [highlightIndex]: '#ff5722' };
        
        // Optionally highlight the remaining portions differently
        for (let i = result.length; i < result.length + leftCopy.length; i++) {
            highlights[i] = 'rgba(0, 100, 255, 0.5)'; // Light blue for left portion
        }
        
        for (let i = result.length + leftCopy.length; i < visualArray.length; i++) {
            highlights[i] = 'rgba(0, 255, 100, 0.5)'; // Light green for right portion
        }
        
        currentArray = visualArray;
        drawVisualization(currentArray, highlights);
        await new Promise(resolve => setTimeout(resolve, animationDelay));
    }
    
    // Add any remaining elements
    const combined = [...result, ...leftCopy, ...rightCopy];
    
    // One final visualization of the completed merge
    currentArray = combined;
    drawVisualization(currentArray);
    await new Promise(resolve => setTimeout(resolve, animationDelay));
    
    return combined;
}

async function heapSortVisualizationWithMetrics(array) {
    let arr = [...array];
    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapifyVisualizationWithMetrics(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        swaps++;
        drawVisualization(arr, { 0: '#ff5722', [i]: '#4caf50' });
        await new Promise(resolve => setTimeout(resolve, animationDelay));
        await heapifyVisualizationWithMetrics(arr, i, 0);
    }
    return arr;
}

async function heapifyVisualizationWithMetrics(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
        comparisons++;
        if (arr[left] > arr[largest]) largest = left;
    }
    
    if (right < n) {
        comparisons++;
        if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        swaps++;
        drawVisualization(arr, { [i]: '#ff5722', [largest]: '#4caf50' });
        await new Promise(resolve => setTimeout(resolve, animationDelay));
        await heapifyVisualizationWithMetrics(arr, n, largest);
    }
}

async function bstSortVisualizationWithMetrics(array) {
    class Node {
        constructor(data) {
            this.data = data;
            this.left = null;
            this.right = null;
        }
    }

    class BST {
        constructor() {
            this.root = null;
        }

        insert(data) {
            let newNode = new Node(data);
            if (this.root === null) {
                this.root = newNode;
            } else {
                this.insertNode(this.root, newNode);
            }
        }

        insertNode(node, newNode) {
            comparisons++;
            if (newNode.data < node.data) {
                if (node.left === null) {
                    node.left = newNode;
                    swaps++; // Count as a "swap" when we assign a node
                } else {
                    this.insertNode(node.left, newNode);
                }
            } else {
                if (node.right === null) {
                    node.right = newNode;
                    swaps++; // Count as a "swap" when we assign a node
                } else {
                    this.insertNode(node.right, newNode);
                }
            }
        }

        inOrder(node, result) {
            if (node !== null) {
                this.inOrder(node.left, result);
                result.push(node.data);
                this.inOrder(node.right, result);
            }
        }

        getSortedArray() {
            let result = [];
            this.inOrder(this.root, result);
            return result;
        }
    }

    let bst = new BST();
    for (let i = 0; i < array.length; i++) {
        bst.insert(array[i]);
    }
    
    const sorted = bst.getSortedArray();
    
    // Visualize the sorted array
    for (let i = 0; i < sorted.length; i++) {
        currentArray[i] = sorted[i];
        drawVisualization(currentArray, { [i]: '#ff5722' });
        await new Promise(resolve => setTimeout(resolve, animationDelay));
    }
    
    return sorted;
}

// Initialize performance metrics display
document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById('performance_metrics')) {
        createPerformanceMetricsDisplay();
        enhanceVisualizationControls();
    }
});

// Replace the existing createVisualizationControls function call
// with this enhanced version
document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById('viz_controls')) {
        createVisualizationControls = enhanceVisualizationControls;
    }
});
let metricsHistory = [];

// Update the metrics table and save to history
function updateMetricsTableAndHistory(algorithm, arraySize, executionTime) {
    const metricEntry = {
        algorithm,
        arraySize,
        executionTime: executionTime.toFixed(2),
        comparisons,
        swaps,
        timestamp: new Date().toISOString()
    };
    
    // Add to history
    metricsHistory.push(metricEntry);
    
    // Update the metrics table
    updateMetricsTable(algorithm, arraySize, executionTime);
    
    // Update history display
    updateHistoryDisplay();
    
    // Save to localStorage
    saveHistoryToLocalStorage();
}

// Load history from localStorage
function loadHistoryFromLocalStorage() {
    const savedHistory = localStorage.getItem('sortingAlgorithmMetricsHistory');
    if (savedHistory) {
        try {
            metricsHistory = JSON.parse(savedHistory);
            updateHistoryDisplay();
        } catch (e) {
            console.error('Error loading history from localStorage:', e);
        }
    }
}

// Save history to localStorage
function saveHistoryToLocalStorage() {
    try {
        // Limit history size in localStorage (keep last 100 entries)
        const historyToSave = metricsHistory.slice(-100);
        localStorage.setItem('sortingAlgorithmMetricsHistory', JSON.stringify(historyToSave));
    } catch (e) {
        console.error('Error saving history to localStorage:', e);
    }
}

// Create history display section
function createHistoryDisplay() {
    const historyContainer = document.createElement('div');
    historyContainer.id = 'metrics_history';
    historyContainer.style.margin = '20px';
    historyContainer.style.padding = '15px';
    historyContainer.style.border = '1px solid #ddd';
    historyContainer.style.borderRadius = '5px';
    historyContainer.style.backgroundColor = '#f5f5f5';
    
    // Header with controls
    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.justifyContent = 'space-between';
    headerContainer.style.alignItems = 'center';
    headerContainer.style.marginBottom = '15px';
    
  
    // Initialize with any saved history
    loadHistoryFromLocalStorage();
}

// Update the history display
function updateHistoryDisplay() {
    const tbody = document.getElementById('history_body');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Display the latest 30 entries (limit for performance)
    const displayHistory = metricsHistory.slice(-30).reverse();
    
    // Add rows for each history entry
    displayHistory.forEach(entry => {
        const row = document.createElement('tr');
        
        // Format timestamp
        const date = new Date(entry.timestamp);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
        // Add data cells
        [formattedDate, entry.algorithm, entry.arraySize, entry.executionTime, entry.comparisons, entry.swaps].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            td.style.padding = '8px';
            td.style.borderBottom = '1px solid #ddd';
            row.appendChild(td);
        });
        
        tbody.appendChild(row);
    });
    
    // Update statistics
    updatePerformanceStatistics();
}

// Update performance statistics
function updatePerformanceStatistics() {
    const statsSection = document.getElementById('performance_statistics');
    if (!statsSection || metricsHistory.length === 0) return;
    
    // Group by algorithm
    const algorithmStats = {};
    
    metricsHistory.forEach(entry => {
        if (!algorithmStats[entry.algorithm]) {
            algorithmStats[entry.algorithm] = {
                count: 0,
                totalTime: 0,
                totalComparisons: 0,
                totalSwaps: 0,
                minTime: Infinity,
                maxTime: -Infinity,
                sizePerformance: {}
            };
        }
        
        const stats = algorithmStats[entry.algorithm];
        const time = parseFloat(entry.executionTime);
        
        stats.count++;
        stats.totalTime += time;
        stats.totalComparisons += entry.comparisons;
        stats.totalSwaps += entry.swaps;
        stats.minTime = Math.min(stats.minTime, time);
        stats.maxTime = Math.max(stats.maxTime, time);
        
        // Track performance by array size
        const size = entry.arraySize;
        if (!stats.sizePerformance[size]) {
            stats.sizePerformance[size] = {
                count: 0,
                totalTime: 0
            };
        }
        stats.sizePerformance[size].count++;
        stats.sizePerformance[size].totalTime += time;
    });
    
    // Create statistics HTML
    let statsHTML = '<h4 style="margin-top: 0;">Performance Statistics</h4>';
    
    Object.entries(algorithmStats).forEach(([algorithm, stats]) => {
        statsHTML += `<div style="margin-bottom: 10px;"><strong>${algorithm}</strong>: `;
        statsHTML += `Avg Time: ${(stats.totalTime / stats.count).toFixed(2)}ms, `;
        statsHTML += `Min: ${stats.minTime.toFixed(2)}ms, Max: ${stats.maxTime.toFixed(2)}ms, `;
        statsHTML += `Avg Comparisons: ${Math.round(stats.totalComparisons / stats.count)}, `;
        statsHTML += `Avg Swaps: ${Math.round(stats.totalSwaps / stats.count)}`;
        
        // Add size-specific stats
        statsHTML += '<ul style="margin: 5px 0;">';
        Object.entries(stats.sizePerformance).forEach(([size, sizeStats]) => {
            statsHTML += `<li>Size ${size}: Avg ${(sizeStats.totalTime / sizeStats.count).toFixed(2)}ms (${sizeStats.count} runs)</li>`;
        });
        statsHTML += '</ul></div>';
    });
    
    statsSection.innerHTML = statsHTML;
}

// Clear history
function clearHistory() {
    if (confirm('Are you sure you want to clear all performance history?')) {
        metricsHistory = [];
        localStorage.removeItem('sortingAlgorithmMetricsHistory');
        updateHistoryDisplay();
    }
}

// Modify the enhanced visualization controls to use the new history function
function enhanceVisualizationControlsWithHistory() {
    const algorithms = {
        'Quick Sort': async (arr) => {
            comparisons = 0;
            swaps = 0;
            const start = performance.now();
            await quickSortVisualizationWithMetrics(arr);
            const end = performance.now();
            updateMetricsTableAndHistory('Quick Sort', arr.length, end - start);
            return arr;
        },
        'Merge Sort': async (arr) => {
            comparisons = 0;
            swaps = 0;
            const start = performance.now();
            currentArray = await mergeSortVisualizationWithMetrics(arr);
            const end = performance.now();
            updateMetricsTableAndHistory('Merge Sort', arr.length, end - start);
            return currentArray;
        },
        'Heap Sort': async (arr) => {
            comparisons = 0;
            swaps = 0;
            const start = performance.now();
            await heapSortVisualizationWithMetrics(arr);
            const end = performance.now();
            updateMetricsTableAndHistory('Heap Sort', arr.length, end - start);
            return arr;
        },
        'BST Sort': async (arr) => {
            comparisons = 0;
            swaps = 0;
            const start = performance.now();
            const sorted = await bstSortVisualizationWithMetrics(arr);
            const end = performance.now();
            updateMetricsTableAndHistory('BST Sort', arr.length, end - start);
            return sorted;
        }
    };
    
    // Replace the algorithm functions in the existing enhanceVisualizationControls
    enhanceVisualizationControls = function() {
        const controls = document.getElementById('viz_controls');
        controls.innerHTML = '';
        
        // Array size selector
        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Array Size: ';
        sizeLabel.style.marginRight = '5px';
        controls.appendChild(sizeLabel);
        
        const sizeSelect = document.createElement('select');
        sizeSelect.id = 'array_size';
        [20, 50, 100, 200].forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            if (size === 50) option.selected = true;
            sizeSelect.appendChild(option);
        });
        sizeSelect.style.marginRight = '20px';
        controls.appendChild(sizeSelect);
        
        // Speed selector
        const speedLabel = document.createElement('label');
        speedLabel.textContent = 'Animation Speed: ';
        speedLabel.style.marginRight = '5px';
        controls.appendChild(speedLabel);
        
        const speedSelect = document.createElement('select');
        speedSelect.id = 'animation_speed';
        [
            {value: 200, text: 'Slow'},
            {value: 50, text: 'Medium'},
            {value: 10, text: 'Fast'},
            {value: 1, text: 'Very Fast'}
        ].forEach(option => {
            const optEl = document.createElement('option');
            optEl.value = option.value;
            optEl.textContent = option.text;
            if (option.value === 50) optEl.selected = true;
            speedSelect.appendChild(optEl);
        });
        speedSelect.style.marginRight = '20px';
        speedSelect.addEventListener('change', () => {
            animationDelay = parseInt(speedSelect.value);
        });
        controls.appendChild(speedSelect);
        
        // Algorithm buttons
        Object.entries(algorithms).forEach(([name, func]) => {
            const btn = document.createElement('button');
            btn.textContent = name;
            btn.style.margin = '0 10px';
            btn.style.padding = '5px 10px';
            btn.addEventListener('click', async () => {
                if (isSorting) return;
                isSorting = true;
                const size = parseInt(document.getElementById('array_size').value);
                currentArray = generateRandomArray(size);
                drawVisualization(currentArray);
                await func(currentArray);
                isSorting = false;
            });
            controls.appendChild(btn);
        });
    };
}

// // Initialize performance history display
// document.addEventListener("DOMContentLoaded", () => {
//     if (!document.getElementById('metrics_history')) {
//         createHistoryDisplay();
//         enhanceVisualizationControlsWithHistory();
//     }
// });



