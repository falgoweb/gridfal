let scale = 1;

function zoomIn() {
  scale += 0.1;
  document.body.style.zoom = scale;
}

function zoomOut() {
  scale -= 0.1;
  document.body.style.zoom = scale;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function addData() {
  const col1 = document.getElementById('col1').value;
  const col2 = document.getElementById('col2').value;
  const col3 = document.getElementById('col3').value;

  if (!col1 || !col2 || !col3) {
    showToast('Isi semua kolom terlebih dahulu');
    return;
  }

  const tbody = document.getElementById('tableBody');

  if (tbody.querySelector('.empty')) {
    tbody.innerHTML = '';
  }

  const rowCount = tbody.rows.length + 1;

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${rowCount}</td>
    <td>${col1}</td>
    <td>${col2}</td>
    <td>${col3}</td>
    <td>
      <div class="action-buttons">
        <button class="btn" onclick="editRow(this)">Edit</button>
        <button class="btn-danger" onclick="deleteRow(this)">Hapus</button>
      </div>
    </td>
  `;

  tbody.appendChild(row);

  document.getElementById('col1').value = '';
  document.getElementById('col2').value = '';
  document.getElementById('col3').value = '';

  saveToLocalStorage();
  showToast('✔ Data berhasil ditambahkan');
}

function deleteRow(button) {
  button.closest('tr').remove();
  refreshNumbers();
  saveToLocalStorage();
  showToast('🗑 Data berhasil dihapus');

  const tbody = document.getElementById('tableBody');

  if (tbody.rows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty">
          Belum ada data
        </td>
      </tr>
    `;
  }
}

function editRow(button) {
  const row = button.closest('tr');
  const cells = row.querySelectorAll('td');

  document.getElementById('col1').value = cells[1].innerText;
  document.getElementById('col2').value = cells[2].innerText;
  document.getElementById('col3').value = cells[3].innerText;

  row.remove();
  refreshNumbers();
  saveToLocalStorage();

  showToast('✏ Data siap diedit');
}

function refreshNumbers() {
  const rows = document.querySelectorAll('#tableBody tr');

  rows.forEach((row, index) => {
    if (!row.querySelector('.empty')) {
      row.cells[0].innerText = index + 1;
    }
  });
}

function searchTable() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#tableBody tr');

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();

    row.style.display = text.includes(input)
      ? ''
      : 'none';
  });
}

function saveToLocalStorage() {
  localStorage.setItem('tableData', document.getElementById('tableBody').innerHTML);
}

function loadData() {
  const data = localStorage.getItem('tableData');

  if (data) {
    document.getElementById('tableBody').innerHTML = data;
  }
}

loadData();