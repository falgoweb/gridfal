console.log("JS Loaded");
console.log("GRIDFAL READY ✔");

window.undoStack = [];

/* =======================
   UNDO SYSTEM
======================= */
function saveState(){
  const table = document.getElementById("gridTable");
  if(!table) return;

  window.undoStack.push(table.innerHTML);

  if(window.undoStack.length > 30){
    window.undoStack.shift();
  }
}

function undoAction(){
  const table = document.getElementById("gridTable");
  if(!table) return;

  if(window.undoStack.length === 0) return;

  table.innerHTML = window.undoStack.pop();

  checkEmptyState();
  initColumnResize();
}

/* =======================
   SAVE STATUS
======================= */
function setSavedStatus(text){
  const el = document.getElementById("saveStatus");
  if(el) el.textContent = text;
}

/* =======================
   SAVE GRID (LOCALSTORAGE)
======================= */
function saveGrid(){
  const rows = document.querySelectorAll("#gridTable tbody tr");
  const data = [];

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const rowData = [];

    cells.forEach(cell => {
      rowData.push(cell.textContent);
    });

    data.push(rowData);
  });

  localStorage.setItem("gridfal_data", JSON.stringify(data));
  setSavedStatus("Tersimpan ✔");
}

/* =======================
   LOAD GRID
======================= */
function loadGrid(){
  const table = document.querySelector("#gridTable tbody");
  const saved = localStorage.getItem("gridfal_data");

  if(!saved) return;

  const data = JSON.parse(saved);
  table.innerHTML = "";

  data.forEach(row => {
    const tr = document.createElement("tr");

    row.forEach(cell => {
      const td = document.createElement("td");
      td.contentEditable = "true";
      td.textContent = cell;
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });
}

/* =======================
   EMPTY STATE
======================= */
function checkEmptyState(){
  const rows = document.querySelectorAll("#gridTable tbody tr");
  const empty = document.getElementById("emptyState");

  if(!empty) return;

  empty.style.display = rows.length === 0 ? "block" : "none";
}

/* =======================
   ADD ROW
======================= */
function addRow(){
  const table = document.querySelector("#gridTable tbody");
  if(!table || table.rows.length === 0) return;

  saveState();

  const cols = table.rows[0].cells.length;
  const tr = document.createElement("tr");

  for(let i=0;i<cols;i++){
    const td = document.createElement("td");
    td.contentEditable = "true";
    tr.appendChild(td);
  }

  table.appendChild(tr);

  // 🔥 AUTO NUMBER JALAN DI SINI
  autoNumber();

  saveGrid();
  checkEmptyState();
}

/* =======================
   ADD COLUMN
======================= */
function addColumn(){
  const rows = document.querySelectorAll("#gridTable tbody tr");
  if(rows.length === 0) return;

  saveState();

  rows.forEach(row => {
    const td = document.createElement("td");
    td.contentEditable = "true";
    row.appendChild(td);
  });

  saveGrid();
  initColumnResize();
}

/* =======================
   DELETE ROW (FIXED)
======================= */
function deleteRow(){
  const table = document.querySelector("#gridTable tbody");
  if(!table) return;

  if(table.rows.length <= 1){
    alert("Minimal harus ada 1 row!");
    return;
  }

  saveState();

  table.deleteRow(table.rows.length - 1);

  saveGrid();
  checkEmptyState();
}

/* =======================
   DELETE COLUMN (FIXED)
======================= */
function deleteColumn(){
  const rows = document.querySelectorAll("#gridTable tbody tr");
  if(rows.length === 0) return;

  const colCount = rows[0].cells.length;

  if(colCount <= 1){
    alert("Minimal harus ada 1 column!");
    return;
  }

  saveState();

  rows.forEach(row => {
    row.deleteCell(colCount - 1);
  });

  saveGrid();
}

/* =======================
   RESET GRID
======================= */
function resetGrid(){
  const tbody = document.querySelector("#gridTable tbody");

  saveState();

  tbody.innerHTML = `
    <tr>
      <td contenteditable="true">No</td>
      <td contenteditable="true">isi</td>
      <td contenteditable="true">isi</td>
    </tr>

    <tr>
     <td contenteditable="true">1</td>
     <td contenteditable="true">isi</td>
     <td contenteditable="true">isi</td>
   </tr>
   `;
zoomLevel = 150;
applyZoom();
  saveGrid();
  checkEmptyState();
}

/* =======================
   INIT
======================= */
document.addEventListener("DOMContentLoaded", () => {

  const addRowBtn = document.getElementById("addRowBtn");
  const addColumnBtn = document.getElementById("addColumnBtn");
  const autoNumberBtn = document.getElementById("autoNumberBtn");

  if(addRowBtn){
    addRowBtn.onclick = addRow;
  }

  if(addColumnBtn){
    addColumnBtn.onclick = addColumn;
  }

  if(autoNumberBtn){
    autoNumberBtn.onclick = autoNumber;
  }

  loadGrid();
  checkEmptyState();
  initColumnResize();

});

/* =======================
   AUTO SAVE INPUT
======================= */
document.addEventListener("input", function(e){
  if(e.target.tagName === "TD"){
    saveGrid();
  }
});
function autoNumber(){
  const table = document.querySelector("#gridTable");
  if(!table) return;

  let current = 1;

  for(let i = 1; i < table.rows.length; i++){
    const firstCell = table.rows[i].cells[0];

    if(firstCell){
      firstCell.textContent = current;
      firstCell.contentEditable = "false";
      current++;
    }
  }
}
function applyTheme(theme){
  if(theme === "dark"){
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

/* AUTO LOAD THEME */
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
});
/* =======================
   COLUMN RESIZE
======================= */

function initColumnResize(){
console.log("Resize aktif");
  const firstRow = document.querySelector("#gridTable tr");
  if(!firstRow) return;

  const cells = firstRow.querySelectorAll("td, th");

  cells.forEach((cell, index) => {

    if(cell.querySelector(".resizer")) return;

    const resizer = document.createElement("div");
    resizer.className = "resizer";

    let startX;
    let startWidth;

    function startResize(e){

      startX = e.touches
        ? e.touches[0].clientX
        : e.clientX;

      startWidth = cell.offsetWidth;

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);

      document.addEventListener("touchmove", resize);
      document.addEventListener("touchend", stopResize);
    }

    function resize(e){
e.preventDefault();
      const currentX = e.touches
        ? e.touches[0].clientX
        : e.clientX;

      const width = startWidth + (currentX - startX);
console.log(width);
      if(width < 50) return;

      document.querySelectorAll("#gridTable tr").forEach(row => {

        if(row.cells[index]){
          row.cells[index].style.width = width + "px";
        }

      });
    }

    function stopResize(){

      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);

      document.removeEventListener("touchmove", resize);
      document.removeEventListener("touchend", stopResize);

      saveGrid();
    }

    resizer.addEventListener("mousedown", startResize);
    resizer.addEventListener("touchstart", function(e){
  e.preventDefault();
  startResize(e);
}, { passive: false });

    cell.appendChild(resizer);

  });

}
/* =======================
   ZOOM
======================= */
const tableContainer = document.querySelector(".table-container");
let zoomLevel = 150;

function zoomIn() {
  if (zoomLevel < 200) {
    zoomLevel += 10;
    applyZoom();
  }
  
}

function zoomOut() {
  if (zoomLevel > 150) {
    zoomLevel -= 10;
    applyZoom();
  }
  
}

function applyZoom() {
  tableContainer.style.transform = `scale(${zoomLevel / 150})`;
  tableContainer.style.transformOrigin = "top left";
  document.getElementById("zoomLevel").textContent = 
   zoomLevel + "%";

}
applyZoom();
document.getElementById("zoomBtnIn").addEventListener("click", zoomIn);
document.getElementById("zoomBtnOut").addEventListener("click", zoomOut);

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
});
