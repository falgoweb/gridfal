function autoNumber() {
  const table = document.getElementById("gridTable");

  if (!table) return;

  let startNumber = null;
  let anchorColumn = null;

  for (let i = 1; i < table.rows.length; i++) {
    const cells = table.rows[i].cells;

    for (let j = 0; j < cells.length; j++) {
      const val = parseInt(cells[j].textContent);

      if (!isNaN(val)) {
        startNumber = val;
        anchorColumn = j;
        break;
      }
    }

    if (startNumber !== null) break;
  }

  if (startNumber === null || anchorColumn === null) return;

  let current = startNumber;

  for (let i = 1; i < table.rows.length; i++) {
    const cell = table.rows[i].cells[anchorColumn];

    if (cell) {
      cell.textContent = current;
      cell.contentEditable = "false";
      current++;
    }
  }
}
function autoNumber() {
  const table = document.getElementById("gridTable");

  let startRow = null;
  let colIndex = null;
  let startValue = null;

  for (let i = 0; i < table.rows.length; i++) {
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      const val = parseInt(table.rows[i].cells[j].textContent);

      if (!isNaN(val)) {
        startRow = i;
        colIndex = j;
        startValue = val;
        break;
      }
    }
    if (startValue !== null) break;
  }

  if (startValue === null) return;

  let current = startValue;

  for (let i = startRow; i < table.rows.length; i++) {
    const cell = table.rows[i].cells[colIndex];

    if (cell) {
      cell.textContent = current;
      current++;
    }
  }
}
function autoNumber() {
  const table = document.getElementById("gridTable");

  if (!table) return;

  let startNumber = null;

  // 🔍 cari angka pertama di seluruh tabel
  for (let i = 1; i < table.rows.length; i++) {
    const cells = table.rows[i].cells;

    for (let j = 0; j < cells.length; j++) {
      const val = parseInt(cells[j].textContent);

      if (!isNaN(val)) {
        startNumber = val;
        break;
      }
    }

    if (startNumber !== null) break;
  }

  // ❌ kalau tidak ada angka → stop
  if (startNumber === null) return;

  // 🔢 update SEMUA kolom yang berisi angka awal itu
  for (let i = 1; i < table.rows.length; i++) {
    const cells = table.rows[i].cells;

    for (let j = 0; j < cells.length; j++) {
      const val = parseInt(cells[j].textContent);

      if (!isNaN(val)) {
        let current = startNumber;

        for (let k = i; k < table.rows.length; k++) {
          const target = table.rows[k].cells[j];
          if (target) {
            target.textContent = current;
            target.contentEditable = "false";
            current++;
          }
        }
saveTable();
        return; // cukup 1 series saja
      }
    }
  }
}
console.log("GRIDFAL READY ✔");
function saveTable() {
  const table = document.getElementById("gridTable");
  localStorage.setItem("gridfalData", table.innerHTML);
}

function loadTable() {
  const table = document.getElementById("gridTable");
  const saved = localStorage.getItem("gridfalData");

  if (saved) {
    table.innerHTML = saved;
  }
}
// anti double load (INI FIX ERROR kamu sebelumnya)
if (window.__GRIDFAL_LOADED__) {
  console.log("⚠ Script sudah pernah jalan, stop duplicate");
} else {
  window.__GRIDFAL_LOADED__ = true;

  window.undoStack = window.undoStack || [];

  function saveState(table) {
    window.undoStack.push(table.innerHTML);
    if (window.undoStack.length > 20) window.undoStack.shift();
  }

  window.undoAction = function () {
    const table = document.getElementById("gridTable");
    if (!table) return;

    if (window.undoStack.length === 0) return;

    table.innerHTML = window.undoStack.pop();
    console.log("↩ UNDO OK");
  };

  document.addEventListener("DOMContentLoaded", function () {
loadTable();
    const table = document.getElementById("gridTable");
    const addRowBtn = document.getElementById("addRowBtn");
    const addColumnBtn = document.getElementById("addColumnBtn");

    if (!table || !addRowBtn || !addColumnBtn) {
      console.error("❌ HTML ID tidak ditemukan");
      return;
    }

    // ROW
    addRowBtn.onclick = function () {
      saveState(table);
autoNumber();
      const cols = table.rows[0].cells.length;
      const row = table.insertRow();
saveGrid();
      for (let i = 0; i < cols; i++) {
        const cell = row.insertCell();
        cell.contentEditable = "true";
      }
autoNumber();
      console.log("✔ ROW OK");
      saveTable();
    };
checkEmptyState();
    // COLUMN
    addColumnBtn.onclick = function () {
      saveState(table);

      const rows = table.rows;

      for (let i = 0; i < rows.length; i++) {
        const cell = rows[i].insertCell();
        cell.contentEditable = "true";
      }
autoNumber();
      console.log("✔ COLUMN OK");
      saveTable();
    };

  });
}
window.deleteRow = function () {
  const table = document.getElementById("gridTable");
autoNumber();
  if (!table) return;
saveGrid();
  if (table.rows.length <= 1) {
    alert("Minimal harus ada 1 row!");
    return;
  }
checkEmptyState();
  window.undoStack.push(table.innerHTML);

  table.deleteRow(table.rows.length - 1);
saveTable();
  console.log("🗑 Row dihapus");
};
window.deleteColumn = function () {
  const table = document.getElementById("gridTable");
autoNumber();
  if (!table || table.rows.length === 0) return;

  const colCount = table.rows[0].cells.length;

  if (colCount <= 1) {
    alert("Minimal harus ada 1 column!");
    return;
  }

  window.undoStack.push(table.innerHTML);

  for (let i = 0; i < table.rows.length; i++) {
    table.rows[i].deleteCell(colCount - 1);
  }
saveTable();
  console.log("🗑 Column dihapus");
};
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("autoNumberBtn");

  if (!btn) {
    console.error("Tombol Auto Number tidak ditemukan");
    return;
  }

  btn.addEventListener("click", function () {
    autoNumber();
  });

  console.log("✔ Auto Number button aktif");
});
// Dark Mode & Light Mode Toggle
const themeToggle = document.getElementById("theme-toggle"); // sesuaikan dengan id tombol lu

// Load theme yang terakhir dipilih
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
} else {
    document.body.classList.remove("dark-mode");
}

// Klik tombol
function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// Load tema saat halaman dibuka
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
});
document.addEventListener("input", function (e) {
  if (e.target.tagName === "TD") {
    saveTable();
  }
});
window.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("gridTable");

  const sampleData = [
    ["No", "Nama Item", "Nama Item"],
    ["1", "Contoh", "Contoh"],
    ["2", "Contoh", "Contoh"]
  ];

  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";

  sampleData.forEach(row => {
    const tr = document.createElement("tr");

    row.forEach(cell => {
      const td = document.createElement("td");
      td.contentEditable = "true";
      td.textContent = cell;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
});
function checkEmptyState(){
  const table = document.getElementById("gridTable");
  const emptyState = document.getElementById("emptyState");

  const rows = table.querySelectorAll("tbody tr");

  if(rows.length === 0){
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}
function resetGrid(){
  const tbody = document.querySelector("#gridTable tbody");

  tbody.innerHTML = `
    <tr>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
    </tr>
    <tr>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
    </tr>
  `;

  if(typeof checkEmptyState === "function"){
    checkEmptyState();
  }
}
function checkEmptyState(){
  const table = document.getElementById("gridTable");
  const emptyState = document.getElementById("emptyState");
  const rows = table.querySelectorAll("tbody tr");
checkEmptyState();
  if(rows.length === 0){
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}
function closeOnboarding(){
  document.getElementById("onboarding").style.display = "none";
  localStorage.setItem("gridfal_seen", "true");
}

window.addEventListener("DOMContentLoaded", () => {
  const seen = localStorage.getItem("gridfal_seen");

  if(seen){
    document.getElementById("onboarding").style.display = "none";
  }
});
function checkEmptyState(){
  const table = document.getElementById("gridTable");
  const emptyState = document.getElementById("emptyState");

  if(!table || !emptyState) return;

  const rows = table.querySelectorAll("tbody tr");

  emptyState.style.display = rows.length === 0 ? "block" : "none";
}
function setSavedStatus(text){
  const el = document.getElementById("saveStatus");
  if(el) el.textContent = text;
}
function saveGrid(){
  const table = document.getElementById("gridTable");
  const rows = table.querySelectorAll("tbody tr");

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
}
function loadGrid(){
  const table = document.getElementById("gridTable");
  const tbody = table.querySelector("tbody");

  const saved = localStorage.getItem("gridfal_data");

  if(!saved) return;

  const data = JSON.parse(saved);

  tbody.innerHTML = "";

  data.forEach(row => {
    const tr = document.createElement("tr");

    row.forEach(cell => {
      const td = document.createElement("td");
      td.contentEditable = "true";
      td.textContent = cell;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}
window.addEventListener("DOMContentLoaded", () => {
  loadGrid();
});
