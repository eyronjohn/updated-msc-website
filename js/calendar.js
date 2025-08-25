let currentCalendarDate = new Date();
let calendarEvents = [];

function navigateCalendar(monthOffset) {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + monthOffset);
  fetchCalendarEvents();
}

function getColorByType(type) {
  switch (type) {
    case "onsite": return "bg-[#b9da05] text-[#011538]";
    case "online": return "bg-blue-600 text-white";
    case "assembly": return "bg-purple-600 text-white";
    case "seminar": return "bg-green-600 text-white";
    default: return "bg-white/20 text-white";
  }
}

async function fetchCalendarEvents() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const startDate = new Date(year, month, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

  try {
    const res = await fetch(`${API_BASE}/events/calendar?start=${startDate}&end=${endDate}`, {
      credentials: "include"
    });
    const data = await res.json();

    if (data.success && Array.isArray(data.data)) {
      calendarEvents = data.data.map(event => ({
        title: event.event_name,
        date: event.event_date,
        time: event.event_time_start || "00:00",
        type: event.event_type || "",
        location: event.location || "",
        color: getColorByType(event.event_type),
        description: event.description || ""
      }));
    } else {
      calendarEvents = [];
    }

    // 🔑 Refresh both calendars after data is ready
    renderUniversityCalendar();
    renderMSCCalendar();
    // renderGeneralCalendar();

    // // 🔑 Refresh University Calendar always
    // renderUniversityCalendar();

    // // 🔑 Only refresh General Calendar if script is loaded
    // if (typeof renderMSCCalendar === "function") {
    //   renderMSCCalendar;
    // }

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

  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement("div");
    grid.appendChild(cell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const events = calendarEvents.filter(e => e.date === dateStr);

    cell.classList.add(
      "p-2", "border", "border-white/10", "relative",
      "bg-[#011538]", "hover:bg-white/10", "transition-colors",
      "overflow-y-auto", "day-cell"
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





