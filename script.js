let zoom = 100;

// =====================
// ZOOM SAFE INIT
// =====================
function updateZoom() {
  const table = document.getElementById("gridTable");
  if (!table) return;

  table.style.transform = `scale(${zoom / 100})`;
  table.style.transformOrigin = "top left";

  const zoomLabel = document.getElementById("zoomLevel");
  if (zoomLabel) zoomLabel.innerText = zoom + "%";
}

function zoomIn() {
  if (zoom < 100) {
    zoom += 10;
    updateZoom();
  }
}

function zoomOut() {
  if (zoom > 50) {
    zoom -= 10;
    updateZoom();
  }
}

// =====================
// ADD ROW
// =====================
function addRow() {
  const table = document.getElementById("gridTable");
  const tbody = table.querySelector("tbody");
  const cols = tbody.rows[0].cells.length;

  const row = document.createElement("tr");

  for (let i = 0; i < cols; i++) {
    const cell = document.createElement("td");
    cell.contentEditable = "true";
    row.appendChild(cell);
  }

  tbody.appendChild(row);
}

// =====================
// ADD COLUMN
// =====================
function addColumn() {
  const rows = document.querySelectorAll("#gridTable tr");

  rows.forEach(row => {
    const cell = document.createElement("td");
    cell.contentEditable = "true";
    row.appendChild(cell);
  });
}

// =====================
// EXPORT PDF
// =====================
function exportPDF() {
  const table = document.getElementById("gridTable");

  html2canvas(table).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF("l", "pt", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("gridfal.pdf");
  });
}

// =====================
// INIT SAFE
// =====================
window.addEventListener("DOMContentLoaded", () => {
  updateZoom();
});
