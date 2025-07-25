
const PASSCODE = "154154";
const clockEl = document.getElementById("clock");

function checkPass() {
  const input = document.getElementById("passcode").value;
  const error = document.getElementById("pass-error");
  if (input === PASSCODE) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-screen").classList.remove("hidden");
    updateClock();
    setInterval(updateClock, 1000);
  } else {
    error.innerText = "❌ Sai mã!";
  }
}

function updateClock() {
  const now = new Date();
  clockEl.innerText = now.toLocaleString("vi-VN");
}

function showNhapDon() {
  alert("💡 Tính năng nhập đơn hàng sẽ được thêm tiếp!");
}

function showDanhSach() {
  alert("📋 Danh sách đơn hôm nay sẽ được hiển thị tại đây!");
}

function showTraCuu() {
  alert("🔍 Tra cứu khách hàng sẽ được tích hợp tại đây!");
}


function exportData() {
  const data = localStorage.getItem("don_data") || "{}";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "don_hang.json";
  a.click();
  URL.revokeObjectURL(url);
}


// ---------------- CN1: Nhập đơn -----------------
let selectedKh = "";

function showNhapDon() {
  document.getElementById("main-screen").classList.add("hidden");
  const orderScreen = document.getElementById("order-screen");
  orderScreen.innerHTML = `
<div id="order-screen-content">
  <button onclick="backToMain()">⬅ Quay lại</button>
  <h2>➕ Nhập đơn hàng</h2>

  <label for="kh-list">📋 Danh sách khách hàng:</label>
  <select id="kh-list" onchange="selectKhach()">
    <option value="">-- Chọn khách hàng --</option>
  </select>

  <button onclick="themKhach()" style="margin-top: 5px">➕ Thêm khách hàng</button>
  <div id="them-status" style="color: red; margin-top: 5px;"></div>
  <button onclick="xoaDon()" style="margin-left: 10px; background-color: #c62828; color: white;">🗑 Xoá đơn hôm nay</button>

  <div id="selected-kh" style="margin: 10px 0; font-weight: bold;"></div>

  <div>
    <label>Chọn loại hàng:</label>
    <select id="loai-hang">
      <option value="Bao 50kg trắng">Bao 50kg trắng</option>
      <option value="Bao 50kg vàng">Bao 50kg vàng</option>
      <option value="Túi vàng">Túi vàng</option>
      <option value="Túi trắng">Túi trắng</option>
    </select>

    <input type="number" id="so-luong" placeholder="Nhập số lượng..." />
    <button onclick="themDon()">📦 Thêm đơn</button>
    <div id="don-status"></div>
  </div>

  <div style="margin-top: 20px;">
    <button onclick="luuVaDong()">💾 Lưu & Đóng</button>
  </div>
</div>
`;
  orderScreen.classList.remove("hidden");
  loadKhachList();
}

function backToMain() {
  document.getElementById("order-screen").classList.add("hidden");
  document.getElementById("main-screen").classList.remove("hidden");
}

function loadKhachList() {
  const select = document.getElementById("kh-list");
  select.innerHTML = '<option value="">-- Chọn khách hàng --</option>';
  const khachData = JSON.parse(localStorage.getItem("khach_list") || "[]");
  khachData.forEach(kh => {
    const option = document.createElement("option");
    option.value = kh;
    option.textContent = kh;
    select.appendChild(option);
  });
}

function selectKhach() {
  const select = document.getElementById("kh-list");
  selectedKh = select.value;
  document.getElementById("selected-kh").textContent = selectedKh ? `Đã chọn: ${selectedKh}` : "";
}

function themKhach() {
  const ten = prompt("Nhập tên khách hàng:");
  if (ten && ten.trim()) {
    const khachData = JSON.parse(localStorage.getItem("khach_list") || "[]");
    const tenKhach = ten.trim().toUpperCase();
    if (khachData.includes(tenKhach)) {
      document.getElementById("them-status").textContent = "❌ Khách hàng đã tồn tại!";
      return;
    }
    khachData.push(tenKhach);
    localStorage.setItem("khach_list", JSON.stringify(khachData));
    loadKhachList();
    document.getElementById("them-status").textContent = "";
    alert("✅ Đã thêm khách hàng!");
  }
}

function themDon() {
  if (!selectedKh) {
    alert("⚠️ Vui lòng chọn khách hàng trước khi thêm đơn!");
    return;
  }
  const hang = document.getElementById("loai-hang").value;
  const sl = document.getElementById("so-luong").value;
  if (!sl || isNaN(sl) || sl <= 0) {
    document.getElementById("don-status").textContent = "⚠️ Số lượng không hợp lệ";
    return;
  }
  const newDon = {
    ngay: new Date().toISOString().slice(0, 10),
    gio: new Date().toLocaleTimeString("vi-VN").slice(0,5),
    hang: hang,
    soluong: parseInt(sl)
  };
  const allData = JSON.parse(localStorage.getItem("don_data") || "{}");
  if (!allData[selectedKh]) allData[selectedKh] = [];
  allData[selectedKh].push(newDon);
  localStorage.setItem("don_data", JSON.stringify(allData));
  document.getElementById("don-status").textContent = `✅ Đã thêm ${hang} x${sl}`;
  document.getElementById("so-luong").value = "";
}

function luuVaDong() {
  backToMain();
}



function showDanhSach() {
  document.getElementById("main-screen").classList.add("hidden");
  const screen = document.getElementById("order-screen");
  screen.innerHTML = `
<div id="ds-don-screen">
  <button onclick="backToMain()">⬅ Quay lại</button>
  <h2>📋 Danh sách đơn hàng hôm nay</h2>
  <div id="ds-summary" style="margin: 10px 0; font-weight: bold;"></div>
  <div id="ds-list"></div>
</div>
`;
  screen.classList.remove("hidden");

  const today = new Date().toISOString().slice(0, 10);
  const data = JSON.parse(localStorage.getItem("don_data") || "{}");
  const allTodayDon = [];

  for (const [kh, donList] of Object.entries(data)) {
    for (const don of donList) {
      if (don.ngay === today) {
        allTodayDon.push({ khach: kh, ...don });
      }
    }
  }

  if (allTodayDon.length === 0) {
    document.getElementById("ds-summary").textContent = "❌ Hôm nay chưa có đơn hàng nào!";
    return;
  }

  allTodayDon.sort((a, b) => a.gio.localeCompare(b.gio));

  let tong_bao = 0;
  let tong_tui = 0;
  for (const d of allTodayDon) {
    const ten = d.hang.toLowerCase();
    if (ten.includes("bao")) tong_bao += d.soluong;
    if (ten.includes("túi") || ten.includes("tui")) tong_tui += d.soluong;
  }

  const summary = `📦 Tổng đơn: ${allTodayDon.length} | Giao: ${tong_bao} bao, ${tong_tui} túi`;
  document.getElementById("ds-summary").textContent = summary;

  const dsList = document.getElementById("ds-list");
  allTodayDon.forEach((don, idx) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div><strong>Đơn ${idx + 1} - ${don.gio}</strong></div>
      <div>👤 KH: ${don.khach}</div>
      <button onclick='xemChiTietDon("${don.khach}", "${don.hang}", "${don.soluong}", "${don.ngay}", "${don.gio}")'>🔍 Xem chi tiết</button>
    `;
    dsList.appendChild(div);
  });
}

function xemChiTietDon(khach, hang, soluong, ngay, gio) {
  const text = `🧾 Chi tiết đơn hàng:\nKH: ${khach}\nHàng: ${hang}\nSố lượng: ${soluong}\nNgày: ${ngay} ${gio}`;
  alert(text);
}
// ---------------- CN3: Tra cứu khách hàng ----------------
function showTraCuu() {
  document.getElementById("main-screen").classList.add("hidden");
  const screen = document.getElementById("order-screen");
  screen.innerHTML = `
<div id="tra-cuu-screen">
  <button onclick="backToMain()">⬅ Quay lại</button>
  <h2>🔍 Tra cứu khách hàng</h2>
  <input type="text" id="search-kh" placeholder="Gõ tên khách hàng..." />
  <div id="khach-list" style="margin-top: 10px;"></div>
</div>
`;
  screen.classList.remove("hidden");

  document.getElementById("search-kh").addEventListener("input", updateKhachList);
  updateKhachList();
}

function updateKhachList() {
  const keyword = document.getElementById("search-kh").value.trim().toLowerCase();
  const khachListDiv = document.getElementById("khach-list");
  khachListDiv.innerHTML = "";

  const data = JSON.parse(localStorage.getItem("don_data") || "{}");
  const khachHang = Object.keys(data).filter(kh => kh.toLowerCase().includes(keyword));

  if (khachHang.length === 0) {
    khachListDiv.textContent = "❌ Không tìm thấy khách hàng.";
    return;
  }

  khachHang.forEach(kh => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<strong>${kh}</strong> <br><button onclick="xemChiTietKhach('${kh}')">📄 Xem chi tiết</button>`;
    khachListDiv.appendChild(div);
  });
}

function xemChiTietKhach(khach) {
  const data = JSON.parse(localStorage.getItem("don_data") || "{}");
  const today = new Date();
  const donList = (data[khach] || []).filter(don => {
    const ngay = new Date(don.ngay);
    const diff = (today - ngay) / (1000 * 60 * 60 * 24);
    return diff <= 30;
  });

  let content = `🧾 Đơn hàng 30 ngày gần nhất của ${khach}:
Tổng số đơn: ${donList.length}

`;
  donList.forEach(d => {
    content += `• ${d.ngay} ${d.gio} - ${d.hang} x${d.soluong}
`;
  });

  alert(content);
}


// ---------------- CN4: Xuất dữ liệu toàn bộ ----------------
function exportData() {
  const data = JSON.parse(localStorage.getItem("don_data") || "{}");
  let content = "🧾 TẤT CẢ ĐƠN HÀNG\n\n";

  for (const [khach, donList] of Object.entries(data)) {
    content += `👤 ${khach}\n`;
    donList.forEach(d => {
      content += `   • ${d.ngay} ${d.gio} - ${d.hang} x${d.soluong}\n`;
    });
    content += "\n";
  }

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tat_ca_don_hang.txt";
  a.click();
  URL.revokeObjectURL(url);
}


// ---------------- Xóa đơn hôm nay của khách đang chọn ----------------
function xoaDon() {
  const khach = selectedKh;
  if (!khach) {
    document.getElementById("order-status").textContent = "⚠️ Vui lòng chọn khách hàng trước!";
    return;
  }

  const data = JSON.parse(localStorage.getItem("don_data") || "{}");
  const list = data[khach] || [];
  const today = new Date().toISOString().slice(0, 10);
  const todayDon = list.filter(d => d.ngay === today);

  if (todayDon.length === 0) {
    alert("❌ Hôm nay chưa có đơn nào của " + khach);
    return;
  }

  // Hiển thị danh sách đơn hôm nay để chọn xoá
  let html = `<h3>Chọn đơn hôm nay của ${khach} để xoá:</h3>`;
  todayDon.forEach((don, index) => {
    html += `
      <div style="margin-bottom: 10px; padding: 8px; border: 1px solid gray; border-radius: 5px;">
        <b>${index + 1}.</b> ${don.gio || "??:??"} - ${don.hang} x${don.soluong}
        <br><button onclick="xoaDonTheoChiSo(${index})">🗑 Xoá đơn này</button>
      </div>
    `;
  });
  html += `<button onclick="backToMain()">🔙 Về menu chính</button>`;
  document.getElementById("order-screen").innerHTML = html;
}

function xoaDonTheoChiSo(indexTrongHomNay) {
  const khach = selectedKh;
  const data = JSON.parse(localStorage.getItem("don_data") || "{}");
  const list = data[khach] || [];
  const today = new Date().toISOString().slice(0, 10);

  // Lấy danh sách đơn hôm nay
  const todayDon = list.filter(d => d.ngay === today);

  // Lấy đơn cần xóa (theo chỉ số hiển thị)
  const donTarget = todayDon[indexTrongHomNay];

  // Tìm vị trí thật trong list đầy đủ
  const viTriThuc = list.findIndex(
    d => d.ngay === donTarget.ngay &&
         d.gio === donTarget.gio &&
         d.hang === donTarget.hang &&
         d.soluong === donTarget.soluong
  );

  if (viTriThuc !== -1) {
    const xacNhan = confirm(`Bạn có chắc muốn xoá đơn:\n${donTarget.hang} x${donTarget.soluong}?`);
    if (xacNhan) {
      list.splice(viTriThuc, 1);
      data[khach] = list;
      localStorage.setItem("don_data", JSON.stringify(data));
      alert("✅ Đã xoá đơn.");
      backToMain();
    }
  }
}

function xacNhanXoa(khach, index) {
  const data = JSON.parse(localStorage.getItem("don_data") || "{}");
  const today = new Date().toISOString().split("T")[0];

  const list = data[khach].filter(d => d.ngay === today);
  const don = list[index];

  if (confirm(`Xoá đơn "${don.hang} x${don.soluong}" của ${khach}?`)) {
    // Xoá đơn hôm nay theo index trong hôm nay
    let gocList = data[khach];
    let iTrongGoc = gocList.findIndex(d => d.ngay === today && d.hang === don.hang && d.soluong === don.soluong && d.gio === don.gio);
    if (iTrongGoc > -1) {
      data[khach].splice(iTrongGoc, 1);
    }
    localStorage.setItem("don_data", JSON.stringify(data));
    alert("✅ Đã xoá đơn!");
    showNhapDon();
  }
}

function henGapLai() {
  const xacNhan = confirm("Bạn có chắc muốn thoát ứng dụng không?");
  if (!xacNhan) return;

  // Nếu chạy trong trình duyệt
  if (navigator.userAgent.includes("Chrome") || navigator.userAgent.includes("Safari")) {
    document.body.innerHTML = "<h2 style='text-align:center; padding-top:100px;'>👋 Hẹn gặp lại!</h2>";
  } else {
    // Trên Android PWA (có thể mở rộng sau)
    alert("Bạn có thể đóng tab hoặc app thủ công. 👋");
  }
}