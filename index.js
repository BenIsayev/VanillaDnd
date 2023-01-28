let data = [];
const container = document.querySelector('.container');
const containerRect = container.getBoundingClientRect();
const divsInRow = 5;
const divMargin = 12;
const divWidth = containerRect.width / divsInRow - divMargin;

for (let i = 0; i < 15; i++) {
  data.push({
    content: getLoremIpsum(rndInt(30, 100)),
    id: rndInt(30, 100),
  });
}

init();

function init() {
  data.forEach((obj, idx) => {
    const div = document.createElement('div');
    div.innerHTML = obj.content;
    div.id = obj.id;
    div.classList.add('draggable');
    div.style.width = divWidth + 'px';
    div.style.transform = getDivPosition(idx);
    div.draggable = true;
    container.appendChild(div);
  });
  setListeners();
}

function setListeners() {
  const draggables = document.querySelectorAll('.draggable');

  draggables.forEach((d) => {
    d.addEventListener('dragstart', () => {
      d.classList.add('dragging');
    });

    d.addEventListener('dragend', () => {
      d.classList.remove('dragging');
    });
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggable = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(container, e.clientY, e.clientX);
    if (afterElement) {
      container.insertBefore(draggable, afterElement);
      updateArray(draggable, afterElement);
      reCalculatePositions();
    } else {
      container.appendChild(draggable);
    }
  });
}

function getDragAfterElement(container, y, x) {
  const draggableElements = [
    ...container.querySelectorAll('.draggable:not(.dragging)'),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offsetY = y - box.top - box.height / 2;
      const offsetX = x - box.left - box.width / 2;
      if (
        offsetY < 0 &&
        offsetY > closest.offsetY &&
        offsetX < 0 &&
        offsetX > closest.offsetX
      ) {
        return { offsetY, element: child };
      } else {
        return closest;
      }
    },
    { offsetY: -Infinity, offsetX: -Infinity }
  ).element;
}

function updateArray(draggable, afterElement) {
  const elementIdx = data.findIndex((obj) => obj.id == afterElement.id);
  const draggableIdx = data.findIndex((obj) => obj.id == draggable.id);
  const draggableObj = data.find((obj) => obj.id == draggable.id);
  const copyArray = JSON.parse(JSON.stringify(data));
  copyArray.splice(draggableIdx, 1);
  copyArray.splice(elementIdx - 1, 0, draggableObj);

  if (JSON.stringify(data) === JSON.stringify(copyArray)) {
    return;
  }

  data = JSON.parse(JSON.stringify(copyArray));
}

function reCalculatePositions() {
  data.forEach((obj, idx) => {
    document.getElementById(obj.id.toString()).style.transform =
      getDivPosition(idx);
  });
}

function getDivPosition(idx) {
  const a = (idx + 1) / divsInRow;
  //   const top = getRowPosition(idx
  const position = getColumnPosition(idx);
  const top = getRowPosition(idx, position);
  return `translate(${position * divWidth + position * divMargin}px, ${top}px)`;
}

function getColumnPosition(idx) {
  let position = idx;
  while (position > divsInRow - 1) {
    position -= divsInRow;
  }
  return position;
}

function getRowPosition(idx, position) {
  const divsAboveObjs = data.filter((_, index) => {
    const pos = getColumnPosition(index);
    return pos === position && idx > index;
  });
  const divsAboveHeights = divsAboveObjs.map((obj) => {
    return (
      document.getElementById(obj.id.toString()).getBoundingClientRect()
        .height + divMargin
    );
  });
  if (!divsAboveHeights || !divsAboveHeights.length) {
    return 0;
  }
  return divsAboveHeights.reduce((acc, height) => {
    return acc + height;
  }, 0);
}

function getLoremIpsum(wordCount) {
  const loremIpsumWords =
    'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';
  const words = loremIpsumWords.split(' ');
  let loremIpsum = [];
  for (let i = 0; i < wordCount; i++) {
    // Select a random word from the array
    const randomWord = words[Math.floor(Math.random() * words.length)];

    // Add the word to the array of sentences
    loremIpsum.push(randomWord);
  }

  // join the words together
  return loremIpsum.join(' ');
}

function rndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
