/* =========================
   BASE RESET
========================= */
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:Arial, sans-serif;
}

body{
  background:#fff;
  color:#000;
}

/* =========================
   TOPBAR
========================= */
.topbar{
  background:#111827;
  padding:16px;
  display:flex;
  justify-content:space-between;
  flex-wrap:wrap;
  align-items:center;
}

.logo{
  color:#60a5fa;
  font-size:24px;
}

.actions{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}

.group{
  display:flex;
  gap:8px;
  padding:6px;
}

/* =========================
   BUTTON
========================= */
button{
  padding:10px 14px;
  border:none;
  border-radius:10px;
  background:#2563eb;
  color:white;
  cursor:pointer;

  transition:all 0.15s ease;
}

button:hover{
  background:#1d4ed8;
  transform:translateY(-2px);
}

button:active{
  transform:scale(0.97);
}

/* primary buttons */
#addRowBtn,
#addColumnBtn,
#autoNumberBtn{
  background:#16a34a;
}

/* =========================
   TABLE
========================= */
.table-container{
  transform-origin:  top left;
  padding-top:16px;
  overflow:auto;
  transition:all 0.2s ease;
  
}

table{
  border-collapse:collapse;
  table-layout: auto;
}

td, th{
  border:1px solid #333;
  min-width:100px;
  padding:8px;

  white-space: normal;
  word-break: break-word;
}

td:focus{
  outline:2px solid #3b82f6;
  outline-offset:-2px;
}

/* =========================
   EMPTY STATE
========================= */
.empty-state{
  td[contenteditable="true"],
  td[contenteditable="true"]{
  text-align:left;
  padding:30px;
  color:#64748b;
}

/* =========================
   TEXT UI
========================= */
.save-status{
  font-size:12px;
  color:#94a3b8;
  padding:6px;
}

.intro{
  padding:16px;
}

.hint{
  padding:0 16px;
  font-size:13px;
  color:#64748b;
}

/* =========================
   DARK MODE (EXCEL STYLE)
========================= */
body.dark-mode{
  background:#0f172a;
  color:#e2e8f0;
}

/* container */
body.dark-mode .table-container{
  background:#1e293b;
  border-radius:10px;
  box-shadow:0 10px 30px rgba(0,0,0,0.25);
}

/* TABLE = white Excel canvas */
body.dark-mode table{
  background:#ffffff !important;
  border-collapse:collapse !important;
  border:2px solid #000 !important;
}

/* CELL GRID */
body.dark-mode td,
body.dark-mode th{
  background:#ffffff !important;
  color:#111827 !important;
  border:1px solid #000 !important;
  min-width:100px;
  padding:8px;
}

/* hover row */
body.dark-mode tr:hover td{
  background:#f5f7fa !important;
}

/* focus cell */
body.dark-mode td:focus{
  outline:2px solid #2563eb !important;
  outline-offset:-2px;
  position:relative;
  z-index:2;
}

/* =========================
   POLISH EFFECTS
========================= */

/* smooth interaction */
button, td{
  transition:all 0.15s ease;
}

/* hover feel */
body.dark-mode td:hover{
  background:#f5f7fa !important;
  cursor:text;
}

/* click feedback */
body.dark-mode td:active{
  transform:scale(0.99);
}

/* table depth */
body.dark-mode .table-container{
  transition:0.2s ease;
}

/* button active feel */
button:active{
  transform:scale(0.96);
}
/* =========================
   COLUMN RESIZE
========================= */

td,
th{
  position: relative;
}

.resizer{
  position:absolute;
  top:0;
  right:-3px;
  width:6px;
  height:100%;

  cursor:col-resize;
  z-index:9999;

  background:transparent;

  user-select:none;
  -webkit-user-select:none;
  touch-action:none;
}
.resizer::after{
  content:"";
  position:absolute;
  inset:0;
}
.zoom-control{
  display:flex;
  align-items:center;
  gap:10px;
  margin-top:12px;
}

.zoom-control button{
  width:44px;
  height:44px;
  border:none;
  border-radius:12px;
  cursor:pointer;
}

#zoomLevel{
  display:inline-block;
  min-width:70px;
  text-align:center;

  color: red;
  font-size:18px;
  font-weight:700;
}
