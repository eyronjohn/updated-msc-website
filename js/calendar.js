let currentCalendarDate = new Date();
let calendarEvents = [];

function navigateCalendar(monthOffset) {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + monthOffset);
  fetchCalendarEvents();
}

/*
function getColorByType(type) {
  switch (type) {
    case 'onsite': return 'bg-blue-500';
    case 'online': return 'bg-green-500';
    default: return 'bg-gray-400';
  }
}
  */
 function getColorByType(type) {
  switch (type) {
    case 'onsite': return 'bg-[#b9da05] text-[#011538]'; // yellow pill
    case 'online': return 'bg-blue-600 text-white';      // navy-blue pill
    default: return 'bg-white/20 text-white';            // neutral
  }
}


async function fetchCalendarEvents() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const startDate = new Date(year, month, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

  try {
    const res = await fetch(`${API_BASE}/${startDate}&end=${endDate}`, {
      credentials: "include"
    });

    const data = await res.json();

    if (data.success && Array.isArray(data.data)) {
      calendarEvents = data.data.map(event => ({
        title: event.event_name,
        date: event.event_date,
        time: event.event_time_start,
        type: event.event_type,
        location: event.location,
        color: getColorByType(event.event_type),
        description: `${event.event_type} at ${event.location}`
      }));
    } else {
      calendarEvents = [];
    }

    renderUniversityCalendar();
  } catch (err) {
    console.error("Calendar fetch error:", err);
  }
}

function renderUniversityCalendar() {
  const grid = document.getElementById("calendar-grid");
  const monthTitle = document.getElementById("calendar-month-title");
  const month = currentCalendarDate.getMonth();
  const year = currentCalendarDate.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthTitle.textContent = currentCalendarDate.toLocaleString("default", { month: "long", year: "numeric" });
  grid.innerHTML = "";

  // Empty cells before the first day
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement("div");
    grid.appendChild(cell);
  }

  // Days
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const events = calendarEvents.filter(e => e.date === dateStr);

    // Dark navy styling
    cell.classList.add(
      "p-2", "border", "border-white/10", "relative", "h-20",
      "bg-[#011538]", "hover:bg-white/10", "transition-colors"
    );

    const dayLabel = document.createElement("div");
    dayLabel.textContent = day;

    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    dayLabel.classList.add(
      "w-7", "h-7", "flex", "items-center", "justify-center",
      "font-semibold", "text-sm", "mx-auto", "rounded-full"
    );

    if (isToday) {
      dayLabel.classList.add("bg-[#b9da05]", "text-[#011538]");
    } else {
      dayLabel.classList.add("text-white");
    }

    cell.appendChild(dayLabel);

    // Event badges
    events.forEach(e => {
      const badge = document.createElement("div");
      badge.className = `mt-1 text-white text-xs px-2 py-1 rounded ${e.color} cursor-pointer truncate`;
      badge.textContent = e.title;

      badge.addEventListener("click", () => openCalendarModal(e));
      cell.appendChild(badge);
    });

    grid.appendChild(cell);
  }
}

/*
function renderUniversityCalendar() {
  const grid = document.getElementById("calendar-grid");
  const monthTitle = document.getElementById("calendar-month-title");
  const month = currentCalendarDate.getMonth();
  const year = currentCalendarDate.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthTitle.textContent = currentCalendarDate.toLocaleString("default", { month: "long", year: "numeric" });
  grid.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement("div");
    grid.appendChild(cell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const events = calendarEvents.filter(e => e.date === dateStr);

    cell.classList.add("p-2", "border", "relative", "h-20", "hover:bg-blue-50");

    const dayLabel = document.createElement("div");
    dayLabel.textContent = day;

    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    dayLabel.classList.add(
      "w-7", "h-7", "flex", "items-center", "justify-center",
      "font-semibold", "text-sm", "mx-auto", "rounded-full"
    );

    if (isToday) {
      dayLabel.classList.add("bg-[#011538]", "text-white");
    } else {
      dayLabel.classList.add("text-gray-700");
    }

    cell.appendChild(dayLabel);


    events.forEach(e => {
      const badge = document.createElement("div");
      badge.className = `mt-1 text-white text-xs px-2 py-1 rounded ${e.color} cursor-pointer truncate`;
      badge.textContent = e.title;

      badge.addEventListener("click", () => openCalendarModal(e));

      cell.appendChild(badge);
    });

    grid.appendChild(cell);
  }
}
  */

/*
function openCalendarModal(event) {
  //const overlay = document.getElementById("calendar-modal-overlay");
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("calendar-modal-content");

  overlay.classList.remove("hidden");

  content.innerHTML = `
    <h2 class="text-xl font-bold">${event.title}</h2>
    <p><strong>Date:</strong> ${event.date}</p>
    <p><strong>Time:</strong> ${event.time || "TBA"}</p>
    <p><strong>Location:</strong> ${event.location || "TBA"}</p>
    <p><strong>Type:</strong> ${event.type || "General"}</p>
    <p class="text-gray-600 text-sm"><strong>Description:</strong> ${event.description || "No description provided."}</p>
  `;
}
  */

// function closeCalendarModal() {
//   document.getElementById("calendar-modal-overlay").classList.add("hidden");
// }

function openCalendarModal(event) {
  document.getElementById("modal-title").textContent = event.title;
  document.getElementById("modal-overlay").classList.remove("hidden");

  const dateTimeString = `${event.date}T${event.time}`; 
  const date = new Date(dateTimeString);

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  document.getElementById("event-day-time").textContent = `${formattedDate} - ${formattedTime}`;
  document.getElementById("event-location").textContent = event.location;
}

function closeCalendarModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
}

function goToToday() {
  currentCalendarDate = new Date();
  fetchCalendarEvents();
}

document.addEventListener("DOMContentLoaded", fetchCalendarEvents);

// GENERAL CALENDAR: Empty"
let generalCalendarDate = new Date();

function renderGeneralCalendar() {
  const year = generalCalendarDate.getFullYear();
  const month = generalCalendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid = document.getElementById("general-calendar-grid");
  const monthTitle = document.getElementById("general-calendar-month-title");

  if (!grid || !monthTitle) return console.error("Missing general calendar elements.");

  grid.innerHTML = "";
  monthTitle.textContent = generalCalendarDate.toLocaleString("default", { month: "long", year: "numeric" });

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    grid.appendChild(blank);
  }

  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const div = document.createElement("div");
    const isToday = date.toDateString() === today.toDateString();

    // Navy background, subtle white border
    div.className = "border border-white/10 p-2 h-20 relative transition-all bg-[#011538] text-white hover:bg-white/10 flex items-start justify-end";

    const daySpan = document.createElement("span");
    daySpan.textContent = day;

    // Default = white text, Today = yellow highlight
    daySpan.className = `text-sm inline-flex items-center justify-center w-8 h-8 ${
      isToday
        ? "bg-[#b9da05] text-[#011538] font-bold rounded-full"
        : "text-white"
    }`;

    div.appendChild(daySpan);
    grid.appendChild(div);
  }
}


function navigateGeneralCalendar(offset) {
  generalCalendarDate.setMonth(generalCalendarDate.getMonth() + offset);
  renderGeneralCalendar();
}

document.addEventListener("DOMContentLoaded", renderGeneralCalendar);


