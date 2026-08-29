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
const supabaseClient = window.attractSupabaseClient;
let requestsCache = [];
let realtimeChannel = null;

const safeLocalStorage = {
  get(key, fallback = null) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { console.warn('localStorage write failed:', error); }
  }
};

function normalizeRequest(booking) {
  const firstName = booking.first_name || booking.firstname || booking.firstName || '';
  const lastName = booking.last_name || booking.lastname || booking.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();

  const serviceType = booking.service_type || booking.serviceType || '';
  const customServiceType = booking.custom_service_type || booking.customServiceType || booking.customService || '';
  const hasBaggage = booking.has_baggage || booking.hasBaggage || 'No';

  return {
    id: booking.id,
    created: booking.created_at || booking.created || '',
    created_at: booking.created_at || booking.created || '',
    name: booking.name || fullName || '',
    email: booking.email || booking.Email || '',
    phone: booking.phone || '',
    pickup: booking.pickup || booking['pick up'] || '',
    destination: booking.destination || booking.destinatio || '',
    date: booking.date || booking.Date || '',
    time: booking.time || booking.Time || '',
    passengers: Number(booking.passengers ?? booking.passangers ?? booking.Passangers ?? 0),
    vehicle: booking.vehicle || '',
    assignedBusId: booking.vehicle || booking.assigned_bus_id || '',
    message: booking.message || '',
    status: booking.status || 'New',
    first_name: firstName,
    last_name: lastName,
    firstName,
    lastName,
    service_type: serviceType,
    serviceType,
    custom_service_type: customServiceType,
    customServiceType,
    customService: customServiceType,
    airport_airline: booking.airport_airline || booking.airline || '',
    airport_flight_number: booking.airport_flight_number || booking.flightNumber || '',
    airport_baggage_amount: booking.airport_baggage_amount || booking.airportBaggageAmount || '',
    has_baggage: hasBaggage,
    hasBaggage,
    baggage_type: booking.baggage_type || booking.baggageType || '',
    baggage_amount: booking.baggage_amount || booking.baggageAmount || '',
    baggage_items: booking.baggage_items || booking.baggageItems || '',
    details: booking.details || booking.message || '',
    airportBaggageAmount: booking.airport_baggage_amount || booking.airportBaggageAmount || '',
    baggageType: booking.baggage_type || booking.baggageType || '',
    baggageAmount: booking.baggage_amount || booking.baggageAmount || '',
    baggageItems: booking.baggage_items || booking.baggageItems || '',
    airline: booking.airport_airline || booking.airline || '',
    flightNumber: booking.airport_flight_number || booking.flightNumber || ''
  };
}

async function loadRequests({ renderAfter = true } = {}) {
  if (!supabaseClient) {
    console.error('Supabase client is unavailable.');
    alert('Supabase could not be initialized. Check the Supabase script configuration.');
    requestsCache = [];
    if (renderAfter) render();
    return requestsCache;
  }

  const { data, error } = await supabaseClient
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase request loading error:', error);
    alert('Could not load booking requests. Check the browser console.');
    return requestsCache;
  }

  requestsCache = (data || []).map(normalizeRequest);
  safeLocalStorage.set(REQUESTS_KEY, requestsCache);
  if (renderAfter) render();
  return requestsCache;
}

function getRequests() {
  return requestsCache;
}

function getFleet() {
  const saved = safeLocalStorage.get(FLEET_KEY, null);
  if (Array.isArray(saved) && saved.length) {
    return saved.map((vehicle) => ({
      regId: vehicle.regId || `REG-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: vehicle.type || 'Custom',
      seats: Number(vehicle.seats || 0),
      status: vehicle.status || 'Available',
      assignedRequest: vehicle.assignedRequest || null
    }));
  }
  safeLocalStorage.set(FLEET_KEY, DEFAULT_FLEET);
  return JSON.parse(JSON.stringify(DEFAULT_FLEET));
}

function saveFleet(data) {
  safeLocalStorage.set(FLEET_KEY, data);
}

function syncFleetAssignments() {
  const fleet = getFleet();
  let changed = false;
  fleet.forEach((vehicle) => {
    const assigned = requestsCache.find((request) =>
      !['Completed', 'Cancelled'].includes(request.status) &&
      String(request.assignedBusId || '') === String(vehicle.regId)
    );
    const assignedId = assigned ? assigned.id : null;
    if (vehicle.assignedRequest !== assignedId && (vehicle.assignedRequest || assignedId)) {
      vehicle.assignedRequest = assignedId;
      changed = true;
    }
  });
  if (changed) saveFleet(fleet);
}

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const date = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const getDisplayName = (request = {}) => {
  const firstName = request.first_name || request.firstName || '';
  const lastName = request.last_name || request.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || request.name || 'Customer';
};
const getVehicleById = (regId) => getFleet().find((item) => String(item.regId) === String(regId));
const getVehicleByRequestId = (requestId) => getFleet().find((item) => String(item.assignedRequest) === String(requestId));
const getBusNameById = (regId) => {
  const vehicle = getVehicleById(regId);
  return vehicle ? `${vehicle.type} (${vehicle.regId})` : 'Unassigned';
};

function getActiveAssignedBusIds(excludeRequestId = null) {
  return new Set(
    requestsCache
      .filter((request) => String(request.id) !== String(excludeRequestId) && !['Completed', 'Cancelled'].includes(request.status) && request.assignedBusId)
      .map((request) => String(request.assignedBusId))
  );
}

async function updateRequestStatus(id, status) {
  const current = requestsCache.find((item) => String(item.id) === String(id));
  if (!current || !supabaseClient) return;

  const { data, error } = await supabaseClient
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Supabase status update error:', error);
    alert('Could not update the request status.');
    return;
  }

  const updated = normalizeRequest(data);
  requestsCache = requestsCache.map((request) => String(request.id) === String(id) ? updated : request);
  safeLocalStorage.set(REQUESTS_KEY, requestsCache);
  syncFleetAssignments();
  render();
}

async function updateRequestVehicle(id, regId) {
  const current = requestsCache.find((item) => String(item.id) === String(id));
  if (!current || !supabaseClient) return;

  const vehicle = regId ? getVehicleById(regId) : null;
  const activeAssignments = getActiveAssignedBusIds(id);
  if (vehicle && activeAssignments.has(String(vehicle.regId))) {
    alert('That bus is already assigned to another active request.');
    renderRequests();
    return;
  }
  if (vehicle && vehicle.status !== 'Available') {
    alert('That bus is not currently available.');
    renderRequests();
    return;
  }

  const { data, error } = await supabaseClient
    .from('bookings')
    .update({ vehicle: vehicle ? vehicle.regId : null })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Supabase fleet assignment error:', error);
    alert('Could not save the bus assignment.');
    return;
  }

  const updated = normalizeRequest(data);
  requestsCache = requestsCache.map((request) => String(request.id) === String(id) ? updated : request);
  safeLocalStorage.set(REQUESTS_KEY, requestsCache);
  syncFleetAssignments();
  render();
}

async function deleteRequest(id) {
  const request = requestsCache.find((item) => String(item.id) === String(id));
  if (!request || !['Completed', 'Cancelled'].includes(request.status)) return;
  if (!confirm('Remove this completed or cancelled request?')) return;
  if (!supabaseClient) return;

  const { error } = await supabaseClient.from('bookings').delete().eq('id', id);
  if (error) {
    console.error('Supabase request delete error:', error);
    alert('Could not remove the request.');
    return;
  }
  requestsCache = requestsCache.filter((item) => String(item.id) !== String(id));
  safeLocalStorage.set(REQUESTS_KEY, requestsCache);
  syncFleetAssignments();
  render();
}

function nav(view) {
  document.querySelectorAll('.view').forEach((section) => section.classList.toggle('active', section.id === view));
  document.querySelectorAll('nav button').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
  if ($('title')) $('title').textContent = view === 'requests' ? 'Ride Requests' : view.charAt(0).toUpperCase() + view.slice(1);
  render();
}

document.querySelectorAll('nav button').forEach((button) => button.onclick = () => nav(button.dataset.view));
document.querySelectorAll('[data-go]').forEach((button) => button.onclick = () => nav(button.dataset.go));

function renderFleetSummary() {
  const list = getFleet();
  const available = list.filter((v) => v.status === 'Available').length;
  const maintenance = list.filter((v) => v.status === 'Maintenance').length;
  const daily = list.filter((v) => v.status === 'For Daily Transport').length;
  if (!$('fleetSummaryList')) return;
  $('fleetSummaryList').innerHTML = list.length ? `
    <div class="fleet-summary-item"><strong>Total Vehicles</strong><span>${list.length}</span></div>
    <div class="fleet-summary-item available"><strong>Available</strong><span>${available}</span></div>
    <div class="fleet-summary-item maintenance"><strong>Maintenance</strong><span>${maintenance}</span></div>
    <div class="fleet-summary-item daily"><strong>Daily Transport</strong><span>${daily}</span></div>
  ` : '<div class="empty-state">No vehicles in fleet.</div>';
}

function renderRequests() {
  if (!$('rows')) return;
  const query = ($('search')?.value || '').toLowerCase();
  const filter = $('filter')?.value || 'All';
  const fleetItems = getFleet();
  const requests = getRequests().filter((request) => {
    const matchesFilter = filter === 'All' || request.status === filter;
    return matchesFilter && JSON.stringify(request).toLowerCase().includes(query);
  });
  const activeAssigned = getActiveAssignedBusIds();

  $('rows').innerHTML = requests.map((request) => {
    const assignedVehicleId = request.assignedBusId || '';
    const busOptions = fleetItems
      .filter((vehicle) => vehicle.status === 'Available' && (!activeAssigned.has(String(vehicle.regId)) || String(vehicle.regId) === String(assignedVehicleId)))
      .map((vehicle) => `<option value="${esc(vehicle.regId)}" ${String(vehicle.regId) === String(assignedVehicleId) ? 'selected' : ''}>${esc(vehicle.type)} - ${esc(vehicle.regId)} (${vehicle.seats} seats)</option>`)
      .join('');

    return `
      <tr>
        <td><strong>${esc(getDisplayName(request))}</strong><br>${esc(request.phone || '')}</td>
        <td>${esc(request.pickup || '')} → ${esc(request.destination || '')}<br>${esc(request.serviceType || '—')}</td>
        <td>${date(request.date)}<br>${esc(request.time || '')}</td>
        <td>${esc(request.passengers || 0)}</td>
        <td>
          <select class="assignedBusSelect" data-id="${esc(request.id)}">
            <option value="">Select an available bus</option>
            ${busOptions || '<option value="" disabled>No available buses</option>'}
          </select>
        </td>
        <td>
          <select class="statusSelect" data-id="${esc(request.id)}">
            ${['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'].map((status) => `<option value="${status}" ${status === request.status ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
        </td>
        <td>
          <button class="action" data-id="${esc(request.id)}">View</button>
          ${['Completed', 'Cancelled'].includes(request.status) ? `<button class="action danger" data-delete-request="${esc(request.id)}">Remove</button>` : ''}
        </td>
      </tr>`;
  }).join('') || '<tr><td colspan="7">No requests found.</td></tr>';

  document.querySelectorAll('.statusSelect').forEach((select) => {
    select.onchange = () => updateRequestStatus(select.dataset.id, select.value);
  });
  document.querySelectorAll('.assignedBusSelect').forEach((select) => {
    select.onchange = () => updateRequestVehicle(select.dataset.id, select.value || null);
  });
  document.querySelectorAll('.action').forEach((button) => {
    if (button.dataset.deleteRequest) return;
    button.onclick = () => open(button.dataset.id);
  });
  document.querySelectorAll('[data-delete-request]').forEach((button) => {
    button.onclick = () => deleteRequest(button.dataset.deleteRequest);
  });
}

function renderSchedule() {
  if (!$('scheduleList')) return;
  const requests = getRequests().filter((request) => request.status === 'Confirmed').sort((a, b) => `${a.date || ''} ${a.time || ''}`.localeCompare(`${b.date || ''} ${b.time || ''}`));
  $('scheduleList').innerHTML = requests.map((request) => `
    <div class="item">
      <div>
        <strong>${date(request.date)} · ${esc(getDisplayName(request))}</strong>
        <small>${esc(request.pickup || '')} → ${esc(request.destination || '')} · ${esc(request.time || '')} · ${esc(request.passengers || 0)} passengers · Bus: ${esc(getBusNameById(request.assignedBusId))}</small>
      </div>
      <span class="status Confirmed">Confirmed</span>
    </div>`).join('') || '<div>No confirmed trips.</div>';
}

function renderFleet() {
  if (!$('fleetContainer')) return;
  const list = getFleet();
  syncFleetAssignments();
  const requests = getRequests();
  const filterType = document.querySelector('.filter-btn.active')?.dataset.type || 'all';
  const filtered = filterType === 'all' ? list : list.filter((v) => v.type === filterType);
  const grouped = {};
  filtered.forEach((vehicle) => { (grouped[vehicle.type] ||= []).push(vehicle); });
  let html = '';
  const types = ['Airport Shuttle', 'Toyota Coaster', 'Hi-Ace', '4-Wheel Drive', ...Object.keys(grouped)];
  [...new Set(types)].forEach((type) => {
    const vehicles = grouped[type];
    if (!vehicles?.length) return;
    html += `<div class="fleet-type-section"><h3>${esc(type)}</h3><div class="fleet-cards">`;
    vehicles.forEach((vehicle) => {
      const assignedRequest = requests.find((r) => String(r.assignedBusId) === String(vehicle.regId) && !['Completed', 'Cancelled'].includes(r.status));
      const statusClass = vehicle.status.toLowerCase().replace(/\s+/g, '-');
      html += `<div class="fleet-card ${statusClass}">
        <div class="card-header"><div class="reg-id">${esc(vehicle.regId)}</div><div class="status-badge ${statusClass}">${esc(vehicle.status)}</div></div>
        <div class="card-body"><div class="vehicle-type">${esc(vehicle.type)}</div><div class="seats-info"><span class="seat-icon">🪑</span><strong>${vehicle.seats}</strong> seats</div>
        ${assignedRequest ? `<div class="assigned-to">📍 ${esc(getDisplayName(assignedRequest))}</div>` : '<div class="no-assignment">No assignment</div>'}</div>
        <div class="card-actions"><select class="status-select" data-reg-id="${esc(vehicle.regId)}">
          <option value="Available" ${vehicle.status === 'Available' ? 'selected' : ''}>Available</option>
          <option value="Maintenance" ${vehicle.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
          <option value="For Daily Transport" ${vehicle.status === 'For Daily Transport' ? 'selected' : ''}>Daily Transport</option>
        </select><button class="mini-btn danger" data-delete-vehicle="${esc(vehicle.regId)}">Remove</button></div>
      </div>`;
    });
    html += '</div></div>';
  });
  $('fleetContainer').innerHTML = html || '<div class="empty-state">No vehicles in fleet.</div>';
  document.querySelectorAll('.status-select').forEach((select) => select.onchange = () => updateVehicleStatus(select.dataset.regId, select.value));
  document.querySelectorAll('[data-delete-vehicle]').forEach((button) => button.onclick = () => deleteVehicle(button.dataset.deleteVehicle));
  document.querySelectorAll('.filter-btn').forEach((btn) => btn.onclick = () => {
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderFleet();
  });
}

function renderCustomers() {
  if (!$('customersList')) return;
  const map = {};
  getRequests().forEach((request) => {
    const key = request.email || request.phone || getDisplayName(request);
    if (!map[key]) map[key] = { name: getDisplayName(request), phone: request.phone || '', email: request.email || '', trips: 0, destination: request.destination || '' };
    map[key].trips += 1;
    map[key].destination = request.destination || map[key].destination;
  });
  $('customersList').innerHTML = Object.values(map).map((customer) => `
    <tr><td>${esc(customer.name)}</td><td>${esc(customer.phone)}</td><td>${esc(customer.email)}</td><td>${customer.trips}</td><td>${esc(customer.destination)}</td></tr>`
  ).join('') || '<tr><td colspan="5">No customers yet.</td></tr>';
}

function render() {
  const requests = getRequests();
  const fleetItems = getFleet();
  const newCount = requests.filter((request) => request.status === 'New').length;
  const confirmedCount = requests.filter((request) => request.status === 'Confirmed').length;
  const activeBuses = fleetItems.filter((v) => v.status === 'Available').length;
  const currentMonth = new Date().toISOString().slice(0, 7);

  if ($('badge')) $('badge').textContent = newCount;
  if ($('new')) $('new').textContent = newCount;
  if ($('confirmed')) $('confirmed').textContent = confirmedCount;
  if ($('activeBuses')) $('activeBuses').textContent = activeBuses;
  if ($('month')) $('month').textContent = requests.filter((request) => String(request.created || '').slice(0, 7) === currentMonth).length;
  if ($('recent')) $('recent').innerHTML = requests.slice(0, 5).map((request) => `
    <div class="item"><div><strong>${esc(getDisplayName(request))}</strong><small>${esc(request.pickup || '')} → ${esc(request.destination || '')}</small></div><span class="status ${esc(request.status)}">${esc(request.status)}</span></div>`
  ).join('') || '<div class="item">No requests yet.</div>';
  if ($('upcoming')) $('upcoming').innerHTML = requests.filter((request) => request.status === 'Confirmed').sort((a, b) => `${a.date || ''} ${a.time || ''}`.localeCompare(`${b.date || ''} ${b.time || ''}`)).slice(0, 5).map((request) => `
    <div class="item"><div><strong>${esc(getDisplayName(request))}</strong><small>${date(request.date)} · ${esc(request.destination || '')}</small></div><span>${esc(request.passengers || 0)} pax</span></div>`
  ).join('') || '<div class="item">No confirmed trips.</div>';

  if ($('rows')) renderRequests();
  if ($('scheduleList')) renderSchedule();
  if ($('fleetContainer')) renderFleet();
  if ($('customersList')) renderCustomers();
  if ($('fleetSummaryList')) renderFleetSummary();
}

function open(id) {
  const request = getRequests().find((item) => String(item.id) === String(id));
  if (!request || !$('detail')) return;
  $('detail').innerHTML = `
    <label>RIDE REQUEST</label><h2>${esc(getDisplayName(request))}</h2><div class="details">
      <div><small>Phone / WhatsApp</small><strong>${esc(request.phone || '')}</strong></div><div><small>Email</small><strong>${esc(request.email || '')}</strong></div>
      <div><small>Pickup</small><strong>${esc(request.pickup || '')}</strong></div><div><small>Destination</small><strong>${esc(request.destination || '')}</strong></div>
      <div><small>Date / Time</small><strong>${date(request.date)} · ${esc(request.time || '')}</strong></div><div><small>Passengers</small><strong>${esc(request.passengers || 0)}</strong></div>
      <div><small>Trip Type</small><strong>${esc(request.serviceType || '—')}</strong></div><div><small>Assigned Bus</small><strong>${esc(getBusNameById(request.assignedBusId))}</strong></div>
      <div style="grid-column:1 / -1"><small>Details</small><strong>${esc(request.details || request.customService || 'None')}</strong></div>
    </div><div class="request-actions"><a class="hero button" href="mailto:${encodeURIComponent(request.email || '')}">EMAIL CUSTOMER</a><a class="hero button secondary" href="tel:${encodeURIComponent(request.phone || '')}">CALL CUSTOMER</a></div>`;
  $('modal').classList.add('open');
}

function updateVehicleStatus(regId, status) {
  const list = getFleet();
  const vehicle = list.find((item) => String(item.regId) === String(regId));
  if (!vehicle) return;
  if (status !== 'Available' && requestsCache.some((request) => String(request.assignedBusId) === String(regId) && !['Completed', 'Cancelled'].includes(request.status))) {
    alert('This vehicle is assigned to an active request. Complete or cancel that request before changing the vehicle status.');
    renderFleet();
    return;
  }
  vehicle.status = status;
  saveFleet(list);
  render();
}

function deleteVehicle(regId) {
  if (!confirm('Are you sure you want to remove this vehicle?')) return;
  if (requestsCache.some((request) => String(request.assignedBusId) === String(regId) && !['Completed', 'Cancelled'].includes(request.status))) {
    alert('This vehicle is assigned to an active request and cannot be removed.');
    return;
  }
  saveFleet(getFleet().filter((vehicle) => String(vehicle.regId) !== String(regId)));
  render();
}

document.getElementById('addFleetForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const type = $('fleetType').value;
  const regId = $('fleetRegId').value.trim().toUpperCase();
  const seats = Number($('fleetSeats').value || 0);
  const status = $('fleetStatus').value;
  if (!type || !regId || !seats) return;
  const list = getFleet();
  if (list.find((v) => v.regId === regId)) { alert('Registration ID already exists!'); return; }
  list.push({ regId, type, seats, status, assignedRequest: null });
  saveFleet(list);
  $('addFleetForm').reset();
  render();
});

if ($('search')) $('search').oninput = renderRequests;
if ($('filter')) $('filter').onchange = renderRequests;
if ($('close')) $('close').onclick = () => $('modal').classList.remove('open');
if ($('modal')) $('modal').onclick = (event) => { if (event.target.id === 'modal') $('modal').classList.remove('open'); };
if ($('export')) $('export').onclick = () => {
  const requests = getRequests();
  const head = ['first_name', 'last_name', 'phone', 'email', 'passengers', 'pickup', 'destination', 'date', 'time', 'service_type', 'status', 'assignedBusId'];
  const csv = [head, ...requests.map((request) => head.map((field) => JSON.stringify(request[field] ?? request[field.replace(/_([a-z])/g, (_, char) => char.toUpperCase())] ?? '')))].map((row) => row.join(',')).join('\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  link.download = 'attract-ride-requests.csv';
  link.click();
};

function subscribeToBookings() {
  if (!supabaseClient || realtimeChannel) return;
  realtimeChannel = supabaseClient
    .channel('attract-admin-bookings')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, async () => {
      await loadRequests({ renderAfter: false });
      syncFleetAssignments();
      render();
    })
    .subscribe((status) => console.log('Supabase bookings realtime:', status));
}

(async () => {
  if (!supabaseClient) {
    alert('Supabase could not be initialized.');
    render();
    return;
  }
  await loadRequests({ renderAfter: false });
  syncFleetAssignments();
  render();
  subscribeToBookings();
})();
