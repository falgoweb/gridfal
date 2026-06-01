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
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
    </tr>
  `;

  saveGrid();
  checkEmptyState();
}

/* =======================
   INIT
======================= */
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("addRowBtn").onclick = addRow;
  document.getElementById("addColumnBtn").onclick = addColumn;
  document.getElementById("autoNumberBtn").onclick = autoNumber;

  loadGrid();
  checkEmptyState();
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

/* TOGGLE BUTTON */
function toggleTheme(){
  const isDark = document.body.classList.contains("dark-mode");

  if(isDark){
    applyTheme("light");
    localStorage.setItem("theme", "light");
  } else {
    applyTheme("dark");
    localStorage.setItem("theme", "dark");
  }
}

/* AUTO LOAD THEME */
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
});
