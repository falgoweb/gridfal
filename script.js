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

  // setiap ada aksi baru, redo dibersihkan
  window.redoStack = [];

  if(window.undoStack.length > 30){
    window.undoStack.shift();
  }
}

function undoAction(){
  const table = document.getElementById("gridTable");
  if(!table) return;

  if(window.undoStack.length === 0) return;

  // simpan kondisi sekarang ke redo
  window.redoStack.push(table.innerHTML);

  table.innerHTML = window.undoStack.pop();

  checkEmptyState();
  initColumnResize();
}

function redoAction(){
  const table = document.getElementById("gridTable");
  if(!table) return;

  if(window.redoStack.length === 0) return;

  // simpan kondisi sekarang ke undo
  window.undoStack.push(table.innerHTML);

  table.innerHTML = window.redoStack.pop();

  checkEmptyState();
  initColumnResize();
}

const table = document.getElementById("gridTable");

if (table) {

  table.addEventListener("focusin", function(e) {

    if (e.target.tagName === "TD") {
      saveState();
    }

  });

}

/* =======================
   SAVE STATUS
======================= */
function setSavedStatus(text){
  const el = document.getElementById("saveStatus");
  if(el) el.innerHTML = text;
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
      rowData.push(cell.innerHTML);
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
      td.innerHTML = cell;
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
td.addEventListener("focus", () => {
  td.textContent = td.textContent; // trigger selection reset
});
  saveGrid();
  initColumnResize();
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
function deleteRow() {
  const table = document.getElementById("gridTable");

  // Jangan hapus header
  if (table.rows.length > 1) {
    table.deleteRow(table.rows.length - 1);
  }
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

  if(e.target.closest("#gridTable td")){
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

const templateBtn = document.getElementById("templateBtn");

templateBtn.addEventListener("click", () => {

  const pilihan = prompt(
`Pilih Template

  1. Daftar Hadir
  2. Jadwal Pelajaran
  3. Inventaris Barang
  4. Laporan Keuangan

 (Mahasiswa)
  5. Jadwal Kulah
  6. Daftar Tugas 
  7. Daftar Nilai
  8. KRS
  9. Absensi Mahasiswa
  10. Praktikum
  11. Skripsi/Penelitian

 (Kantor)
  12. Data Karyawan
  13. Absensi Karyawan
  14. Inventaris Kantor
  15. Jadwal Rapat
  16. Daftar Proyek
  
 (Toko)
  17. Data Produk
  18. Stok Barang
  19. Barang Masuk
  20. Barang Keluar
  21. Penjualan Harian
  22. Pembelian Barang`
  
  );
  if (!pilihan) return;

  const table = document.getElementById("gridTable");
  const headerRow = table.rows[0];

  let headers = [];

  switch (pilihan) {

    case "1":
      headers = ["No", "Nama", "Tanggal", "Keterangan"];
      break;

    case "2":
      headers = ["No", "Hari", "Mata Pelajaran", "Jam"];
      break;

    case "3":
      headers = ["No", "Nama Barang", "Jumlah", "Jenis Penggunaan", "Tahun", "Kondisi"];
      break;

    case "4":
      headers = ["No", "Tanggal", "Pemasukan", "Pengeluaran", "Saldo"];
      break;

    case "5":
      headers = ["No", "Mata Kuliah", "Hari", "Jam", "Ruangan"];
      break; 

    case "6":
      headers = ["No", "Mata Kuliah", "Tugas", "Deadline", "Status"];
      break;

    case "7":
      headers = ["No", "Mata Kuliah", "UTS", "UAS", "Nilai Akhir"];
      break;

    case "8":
      headers = ["No", "Kode MK", "Mata Kuliah", "SKS", "Dosen"];
      break;

    case "9":
      headers = ["No", "Mata Kuliah", "Tanggal", "Kehadiran"];
      break;
  
    case "10":
      headers = ["No", "Praktikum", "Tanggal", "Deadline", "Status"];
      break;

    case "11":
      headers = ["No", "Kegiatan", "Target", "Deadline", "Status"];
      break;

    case "12":
      headers = ["No", "Nama", "Jabatan", "Divisi", "Telepon"];
      break;
  
    case "13":
      headers = ["No", "Nama", "Tanggal", "Jam Masuk", "Keterangan"];
      break;
  
    case "14":
      headers = ["No", "Nama Barang", "Jumlah", "Kondisi", "Lokasi"];
      break;
  
    case "15":
      headers = ["No", "Agenda", "Tanggal", "Waktu", "PIC"];
      break;
  
    case "16":
      headers = ["No", "Nama Proyek", "Deadline", "PIC", "Status"];
      break;

    case "17":
      headers = ["No", "Kode Produk", "Nama Produk", "Kategori", "Harga"];
      break;
  
    case "18":
      headers = ["No", "Nama Barang", "Stok", "Satuan", "Keterangan"];
      break;
  
    case "19":
      headers = ["No", "Tanggal", "Nama Barang", "Jumlah", "Supplier"];
      break;

    case "20":
      headers = ["No", "Tanggal", "Nama Barang", "Jumlah", "Tujuan"];
      break;

    case "21":
      headers = ["No", "Tanggal", "Produk", "Jumlah", "Total"];
      break;

    case "22":
      headers = ["No", "Tanggal", "Nama Barang", "Jumlah", "Biaya"];
      break;
  
    default:
      alert("Template tidak ditemukan");
      return;
  }

  headerRow.innerHTML = "";

  headers.forEach(text => {
    const td = document.createElement("td");
    td.contentEditable = true;
    td.textContent = text;
    headerRow.appendChild(td);
  });

  const totalCols = headers.length;

  for (let r = 1; r < table.rows.length; r++) {

    const row = table.rows[r];

    while (row.cells.length < totalCols) {
      const td = document.createElement("td");
      td.contentEditable = true;
      td.textContent = "";
      row.appendChild(td);
    }

    while (row.cells.length > totalCols) {
      row.deleteCell(-1);
    }
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("gridTable");

  if (!table) return;

  // =========================
  // HITUNG WIDTH
  // =========================
  function getTextWidth(cell) {
    const temp = document.createElement("span");
    temp.style.visibility = "hidden";
    temp.style.whiteSpace = "pre";
    temp.style.position = "absolute";
    temp.style.font = window.getComputedStyle(cell).font;

    temp.innerText = cell.innerText || " ";

    document.body.appendChild(temp);
    const width = temp.offsetWidth + 30;
    document.body.removeChild(temp);

    return width;
  }

  // =========================
  // RESIZE SEMUA KOLOM SEKALIGUS (SAFE MODE)
  // =========================
  function resizeAllColumns() {
    const rows = table.querySelectorAll("tr");
    if (!rows.length) return;

    const colCount = rows[0].children.length;

    for (let i = 0; i < colCount; i++) {
      let maxWidth = 60;

      rows.forEach(row => {
        const cell = row.children[i];
        if (cell) {
          const w = getTextWidth(cell);
          if (w > maxWidth) maxWidth = w;
        }
      });

      rows.forEach(row => {
        if (row.children[i]) {
          row.children[i].style.width = maxWidth + "px";
        }
      });
    }
  }

  // =========================
  // INPUT LISTENER (LIVE RESIZE)
  // =========================
  table.addEventListener("input", function (e) {
    if (e.target && e.target.tagName === "TD") {
      resizeAllColumns();
    }
  });

  // =========================
  // INIT
  // =========================
  resizeAllColumns();

  // =========================
  // DETECT TEMPLATE / COL CHANGE
  // =========================
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      resizeAllColumns();
    }, 50);
  });

  observer.observe(table, {
    childList: true,
    subtree: true
  });

});
function searchCell(){

  const keyword =
    document.getElementById("searchInput")
    .value
    .trim()
    .toLowerCase();

  if(!keyword) return;

  // hapus highlight lama
  document.querySelectorAll(".search-hit")
    .forEach(cell=>{
      cell.classList.remove("search-hit");
    });

  const cells =
    document.querySelectorAll("#gridTable td");

  for(const cell of cells){

    const text =
      cell.innerText.toLowerCase();

    if(text.includes(keyword)){

      cell.classList.add("search-hit");

      cell.scrollIntoView({
        behavior:"smooth",
        block:"center",
        inline:"center"
      });

      cell.focus();

      return;
    }
  }

  alert("Data tidak ditemukan");
}
function exportExcel() {

  const table = document.getElementById("gridTable");

  const wb = XLSX.utils.table_to_book(table, {
    sheet: "GridFal"
  });

  XLSX.writeFile(wb, "GridFal.xlsx");

}
async function exportPDF() {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Judul
  const title = document.getElementById("tableTitle").innerText ||
  "Tabel Baru";

doc.setFontSize(18);

const pageWidth = doc.internal.pageSize.getWidth();
const textWidth = doc.getTextWidth(title);

doc.text(
  title,
  (pageWidth - textWidth) / 2,
  18
);
  // Tanggal
  doc.setFontSize(12);
  doc.text(
    new Date().toLocaleDateString("id-ID"),
    14,
    28
  );

  // Tabel
  doc.autoTable({
    html: "#gridTable",
    startY: 38,
    theme: "grid",

    headStyles: {
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      fontStyle: "bold"
    },

    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },

    styles: {
      fontSize: 12,
      cellPadding: 2,
      halign: "center",
      valign: "middle",
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.4,
    },

    columnStyles: {
      0: { halign: "center" },
      1: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" }
    }
  });

  // Total data
  const totalRowsDOM = document.querySelectorAll("#gridTable tbody tr").length;
const totalRowsPDF = doc.lastAutoTable.body.length - 1;

 const finalY = doc.lastAutoTable.finalY;

doc.text(
  `Generated on ${new Date().toLocaleString("id-ID")} | Total Records: ${totalRowsPDF}`,
  14, finalY + 8
);

doc.save(`${title}.pdf`);
}
