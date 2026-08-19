const REQUESTS_KEY = 'attract_ride_requests';
const FLEET_KEY = 'attract_fleet_inventory';

const DEFAULT_FLEET = [
  { regId: 'ATC-001', type: 'Airport Shuttle', seats: 25, status: 'Available', assignedRequest: null },
  { regId: 'ATC-002', type: 'Airport Shuttle', seats: 25, status: 'Available', assignedRequest: null },
  { regId: 'TC-001', type: 'Toyota Coaster', seats: 30, status: 'Available', assignedRequest: null },
  { regId: 'TC-002', type: 'Toyota Coaster', seats: 30, status: 'Available', assignedRequest: null },
  { regId: 'HA-001', type: 'Hi-Ace', seats: 15, status: 'Available', assignedRequest: null },
  { regId: 'HA-002', type: 'Hi-Ace', seats: 15, status: 'Maintenance', assignedRequest: null },
  { regId: '4WD-001', type: '4-Wheel Drive', seats: 14, status: 'Available', assignedRequest: null },
  { regId: '4WD-002', type: '4-Wheel Drive', seats: 14, status: 'Available', assignedRequest: null }
];

const $ = (id) => document.getElementById(id);
const getRequests = () => JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
const saveRequests = (data) => localStorage.setItem(REQUESTS_KEY, JSON.stringify(data));

const getFleet = () => {
  const saved = JSON.parse(localStorage.getItem(FLEET_KEY) || 'null');
  if (Array.isArray(saved) && saved.length) {
    return saved.map((vehicle) => ({
      regId: vehicle.regId || `REG-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: vehicle.type || 'Custom',
      seats: Number(vehicle.seats || 0),
      status: vehicle.status || 'Available',
      assignedRequest: vehicle.assignedRequest || null
    }));
  }
  localStorage.setItem(FLEET_KEY, JSON.stringify(DEFAULT_FLEET));
  return JSON.parse(JSON.stringify(DEFAULT_FLEET));
};
const saveFleet = (data) => localStorage.setItem(FLEET_KEY, JSON.stringify(data));
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const date = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const getDisplayName = (request = {}) => {
  const firstName = request.first_name || request.firstName || '';
  const lastName = request.last_name || request.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || request.name || 'Customer';
};

const getVehicleById = (regId) => {
  return getFleet().find((item) => String(item.regId) === String(regId));
};

const getVehicleByRequestId = (requestId) => {
  return getFleet().find((item) => String(item.assignedRequest) === String(requestId));
};

const getBusNameById = (regId) => {
  const vehicle = getVehicleById(regId);
  return vehicle ? `${vehicle.type} (${vehicle.regId})` : 'Unassigned';
};

function nav(view) {
  document.querySelectorAll('.view').forEach((section) => section.classList.toggle('active', section.id === view));
  document.querySelectorAll('nav button').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
  $('title').textContent = view === 'requests' ? 'Ride Requests' : view.charAt(0).toUpperCase() + view.slice(1);
  render();
}

document.querySelectorAll('nav button').forEach((button) => button.onclick = () => nav(button.dataset.view));
document.querySelectorAll('[data-go]').forEach((button) => button.onclick = () => nav(button.dataset.go));

function renderFleetSummary() {
  const list = getFleet();
  const available = list.filter((v) => v.status === 'Available').length;
  const maintenance = list.filter((v) => v.status === 'Maintenance').length;
  const daily = list.filter((v) => v.status === 'For Daily Transport').length;
  
  $('fleetSummaryList').innerHTML = list.length
    ? `
      <div class="fleet-summary-item"><strong>Total Vehicles</strong><span>${list.length}</span></div>
      <div class="fleet-summary-item available"><strong>Available</strong><span>${available}</span></div>
      <div class="fleet-summary-item maintenance"><strong>Maintenance</strong><span>${maintenance}</span></div>
      <div class="fleet-summary-item daily"><strong>Daily Transport</strong><span>${daily}</span></div>
    `
    : '<div class="empty-state">No vehicles in fleet.</div>';
}

function renderRequests() {
  const query = ($('search')?.value || '').toLowerCase();
  const filter = $('filter')?.value || 'All';
  const fleetItems = getFleet();
  const requests = getRequests().filter((request) => {
    const matchesFilter = filter === 'All' || request.status === filter;
    const text = JSON.stringify(request).toLowerCase();
    return matchesFilter && text.includes(query);
  });

  $('rows').innerHTML = requests.map((request) => {
    const assignedVehicleId = request.assignedBusId || '';
    const busOptions = fleetItems.filter((vehicle) => vehicle.status === 'Available')
      .map((vehicle) => `<option value="${vehicle.regId}" ${String(vehicle.regId) === String(assignedVehicleId) ? 'selected' : ''}>${esc(vehicle.type)} - ${esc(vehicle.regId)} (${vehicle.seats} seats)</option>`)
      .join('');

    return `
      <tr>
        <td><strong>${esc(getDisplayName(request))}</strong><br>${esc(request.phone || '')}</td>
        <td>${esc(request.pickup || '')} → ${esc(request.destination || '')}<br>${esc(request.serviceType || request.trip_type || '—')}</td>
        <td>${date(request.date)}<br>${esc(request.time || '')}</td>
        <td>${esc(request.passengers || 0)}</td>
        <td>
          <select class="assignedBusSelect" data-id="${request.id}">
            <option value="">Unassigned</option>
            ${busOptions}
          </select>
        </td>
        <td>
          <select class="statusSelect" data-id="${request.id}">
            ${['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'].map((status) => `<option value="${status}" ${status === request.status ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
        </td>
        <td><button class="action" data-id="${request.id}">View</button></td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="7">No requests found.</td></tr>';

  document.querySelectorAll('.statusSelect').forEach((select) => {
    select.onchange = () => {
      const all = getRequests();
      const match = all.find((item) => String(item.id) === String(select.dataset.id));
      if (!match) return;
      match.status = select.value;
      saveRequests(all);
      render();
    };
  });

  document.querySelectorAll('.assignedBusSelect').forEach((select) => {
    select.onchange = () => {
      const all = getRequests();
      const match = all.find((item) => String(item.id) === String(select.dataset.id));
      if (!match) return;
      match.assignedBusId = select.value || null;
      saveRequests(all);
      render();
    };
  });

  document.querySelectorAll('.action').forEach((button) => {
    button.onclick = () => open(button.dataset.id);
  });
}

function renderSchedule() {
  const requests = getRequests().filter((request) => request.status === 'Confirmed').sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  $('scheduleList').innerHTML = requests.map((request) => `
    <div class="item">
      <div>
        <strong>${date(request.date)} · ${esc(getDisplayName(request))}</strong>
        <small>${esc(request.pickup || '')} → ${esc(request.destination || '')} · ${esc(request.time || '')} · ${esc(request.passengers || 0)} passengers · Bus: ${esc(getBusNameById(request.assignedBusId))}</small>
      </div>
      <span class="status Confirmed">Confirmed</span>
    </div>
  `).join('') || '<div>No confirmed trips.</div>';
}

function renderFleet() {
  const list = getFleet();
  const requests = getRequests();
  const filterType = document.querySelector('.filter-btn.active')?.dataset.type || 'all';
  
  const filtered = filterType === 'all' ? list : list.filter((v) => v.type === filterType);
  
  // Group by type
  const grouped = {};
  filtered.forEach((vehicle) => {
    if (!grouped[vehicle.type]) grouped[vehicle.type] = [];
    grouped[vehicle.type].push(vehicle);
  });

  let html = '';
  const types = ['Airport Shuttle', 'Toyota Coaster', 'Hi-Ace', '4-Wheel Drive'];
  
  types.forEach((type) => {
    const vehicles = grouped[type] || [];
    if (vehicles.length === 0 && filterType !== 'all') return;
    if (vehicles.length === 0 && filterType === 'all') {
      html += `<div class="fleet-type-section"><h3>${esc(type)}</h3><div class="fleet-cards"><div class="empty-state">No vehicles</div></div></div>`;
      return;
    }

    html += `<div class="fleet-type-section"><h3>${esc(type)}</h3><div class="fleet-cards">`;
    
    vehicles.forEach((vehicle) => {
      const assignedRequest = requests.find((r) => String(r.assignedBusId) === String(vehicle.regId));
      const statusClass = vehicle.status.toLowerCase().replace(/\s+/g, '-');
      
      html += `
        <div class="fleet-card ${statusClass}">
          <div class="card-header">
            <div class="reg-id">${esc(vehicle.regId)}</div>
            <div class="status-badge ${statusClass}">${esc(vehicle.status)}</div>
          </div>
          <div class="card-body">
            <div class="vehicle-type">${esc(vehicle.type)}</div>
            <div class="seats-info">
              <span class="seat-icon">🪑</span>
              <strong>${vehicle.seats}</strong> seats
            </div>
            ${assignedRequest ? `<div class="assigned-to">📍 ${esc(getDisplayName(assignedRequest))}</div>` : '<div class="no-assignment">No assignment</div>'}
          </div>
          <div class="card-actions">
            <select class="status-select" data-reg-id="${vehicle.regId}">
              <option value="Available" ${vehicle.status === 'Available' ? 'selected' : ''}>Available</option>
              <option value="Maintenance" ${vehicle.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
              <option value="For Daily Transport" ${vehicle.status === 'For Daily Transport' ? 'selected' : ''}>Daily Transport</option>
            </select>
            <button class="mini-btn danger" data-delete-vehicle="${vehicle.regId}">Remove</button>
          </div>
        </div>
      `;
    });
    
    html += `</div></div>`;
  });

  $('fleetContainer').innerHTML = html;

  // Attach event listeners
  document.querySelectorAll('.status-select').forEach((select) => {
    select.onchange = () => updateVehicleStatus(select.dataset.regId, select.value);
  });

  document.querySelectorAll('[data-delete-vehicle]').forEach((button) => {
    button.onclick = () => deleteVehicle(button.dataset.deleteVehicle);
  });

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderFleet();
    };
  });
}

function renderCustomers() {
  const map = {};
  getRequests().forEach((request) => {
    const key = request.email || request.phone || getDisplayName(request);
    if (!map[key]) {
      map[key] = {
        name: getDisplayName(request),
        phone: request.phone || '',
        email: request.email || '',
        trips: 0,
        destination: request.destination || ''
      };
    }
    map[key].trips += 1;
    map[key].destination = request.destination || map[key].destination;
  });

  $('customersList').innerHTML = Object.values(map).map((customer) => `
    <tr>
      <td>${esc(customer.name)}</td>
      <td>${esc(customer.phone)}</td>
      <td>${esc(customer.email)}</td>
      <td>${customer.trips}</td>
      <td>${esc(customer.destination)}</td>
    </tr>
  `).join('') || '<tr><td colspan="5">No customers yet.</td></tr>';
}

function render() {
  const requests = getRequests();
  const fleetItems = getFleet();
  const newCount = requests.filter((request) => request.status === 'New').length;
  const confirmedCount = requests.filter((request) => request.status === 'Confirmed').length;
  const totalBuses = fleetItems.filter((v) => v.status === 'Available').length;

  $('badge').textContent = newCount;
  $('new').textContent = newCount;
  $('confirmed').textContent = confirmedCount;
  $('activeBuses').textContent = totalBuses;
  $('month').textContent = requests.filter((request) => (request.created || '').slice(0, 7) === new Date().toISOString().slice(0, 7)).length;

  $('recent').innerHTML = requests.slice().reverse().slice(0, 5).map((request) => `
    <div class="item">
      <div>
        <strong>${esc(getDisplayName(request))}</strong>
        <small>${esc(request.pickup || '')} → ${esc(request.destination || '')}</small>
      </div>
      <span class="status ${esc(request.status)}">${esc(request.status)}</span>
    </div>
  `).join('') || '<div class="item">No requests yet.</div>';

  $('upcoming').innerHTML = requests.filter((request) => request.status === 'Confirmed').sort((a, b) => (a.date || '').localeCompare(b.date || '')).slice(0, 5).map((request) => `
    <div class="item">
      <div>
        <strong>${esc(getDisplayName(request))}</strong>
        <small>${date(request.date)} · ${esc(request.destination || '')}</small>
      </div>
      <span>${esc(request.passengers || 0)} pax</span>
    </div>
  `).join('') || '<div class="item">No confirmed trips.</div>';

  renderRequests();
  renderSchedule();
  renderFleet();
  renderCustomers();
  renderFleetSummary();
}

function open(id) {
  const request = getRequests().find((item) => String(item.id) === String(id));
  if (!request) return;

  $('detail').innerHTML = `
    <label>RIDE REQUEST</label>
    <h2>${esc(getDisplayName(request))}</h2>
    <div class="details">
      <div><small>Phone / WhatsApp</small><strong>${esc(request.phone || '')}</strong></div>
      <div><small>Email</small><strong>${esc(request.email || '')}</strong></div>
      <div><small>Pickup</small><strong>${esc(request.pickup || '')}</strong></div>
      <div><small>Destination</small><strong>${esc(request.destination || '')}</strong></div>
      <div><small>Date / Time</small><strong>${date(request.date)} · ${esc(request.time || '')}</strong></div>
      <div><small>Passengers</small><strong>${esc(request.passengers || 0)}</strong></div>
      <div><small>Trip Type</small><strong>${esc(request.serviceType || request.trip_type || '—')}</strong></div>
      <div><small>Assigned Bus</small><strong>${esc(getBusNameById(request.assignedBusId))}</strong></div>
      <div style="grid-column:1 / -1"><small>Details</small><strong>${esc(request.details || request.customService || 'None')}</strong></div>
    </div>
    <a class="hero button" style="display:inline-block;background:#e10600;color:white;padding:12px;text-decoration:none" href="mailto:${encodeURIComponent(request.email || 'ariefdoebrie@hotmail.com')}">EMAIL CUSTOMER</a>
  `;
  $('modal').classList.add('open');
}

function updateVehicleStatus(regId, status) {
  const list = getFleet();
  const vehicle = list.find((item) => String(item.regId) === String(regId));
  if (!vehicle) return;
  vehicle.status = status;
  saveFleet(list);
  render();
}

function deleteVehicle(regId) {
  if (!confirm('Are you sure you want to remove this vehicle?')) return;
  saveFleet(getFleet().filter((vehicle) => String(vehicle.regId) !== String(regId)));
  render();
}

document.getElementById('addFleetForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const regId = $('fleetRegId').value.trim().toUpperCase();
  const seats = Number($('fleetSeats').value || 0);
  const status = $('fleetStatus').value;

  if (!regId || !seats) return;

  // Auto-detect vehicle type from registration ID prefix
  let type = '4-Wheel Drive';
  if (regId.startsWith('ATC')) type = 'Airport Shuttle';
  else if (regId.startsWith('TC')) type = 'Toyota Coaster';
  else if (regId.startsWith('HA')) type = 'Hi-Ace';
  else if (regId.startsWith('4WD')) type = '4-Wheel Drive';

  const list = getFleet();
  
  // Check if regId already exists
  if (list.find((v) => v.regId === regId)) {
    alert('Registration ID already exists!');
    return;
  }

  list.push({
    regId,
    type,
    seats,
    status,
    assignedRequest: null
  });

  saveFleet(list);
  $('addFleetForm').reset();
  render();
});

$('search').oninput = renderRequests;
$('filter').onchange = renderRequests;
$('close').onclick = () => $('modal').classList.remove('open');
$('modal').onclick = (event) => {
  if (event.target.id === 'modal') $('modal').classList.remove('open');
};

$('export').onclick = () => {
  const requests = getRequests();
  const head = ['name', 'phone', 'email', 'passengers', 'pickup', 'destination', 'date', 'time', 'serviceType', 'status', 'assignedBusId'];
  const csv = [head, ...requests.map((request) => head.map((field) => JSON.stringify(request[field] ?? '')))].map((row) => row.join(',')).join('\n');

  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  link.download = 'attract-ride-requests.csv';
  link.click();
};

render();
