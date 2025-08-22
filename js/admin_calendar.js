let currentCalendarDate = new Date();
let calendarEvents = [];

function navigateCalendar(monthOffset) {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + monthOffset);
  fetchCalendarEvents();
}

function getColorByType(type) {
  switch (type) {
    case 'onsite': return 'bg-[#b9da05] text-gray-700';
    case 'online': return 'bg-[#044cd1] text-gray-400';
    default: return 'bg-white/20 text-white';
  }
}

async function fetchCalendarEvents() {
  try {
    const res = await fetch(`${API_BASE}`, {
      credentials: "include"
    });

    const data = await res.json();

    if (data.success && Array.isArray(data.data.events)) {
      calendarEvents = data.data.events.map(event => ({
        id: event.id || event.event_id,
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


    renderUniversityCalendar();
  } catch (err) {
    //console.error("Calendar fetch error:", err);
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
  document.getElementById("modal-title").textContent = `${event.title}`; //(ID: ${event.id})
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

  const participantsBtn = document.querySelector("#modal-content button");

  const newBtn = participantsBtn.cloneNode(true);
  participantsBtn.parentNode.replaceChild(newBtn, participantsBtn);

  newBtn.addEventListener("click", () => {
    //console.log("Event ID:", event.id); 
    sessionStorage.setItem("selectedEventId", event.id);
    closeCalendarModal();
    window.location.href = "event_participants.html";
  });
}


function closeCalendarModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
  //sessionStorage.removeItem("selectedEventId");
}

function goToToday() {
  currentCalendarDate = new Date();
  fetchCalendarEvents();
}

document.addEventListener("DOMContentLoaded", fetchCalendarEvents);

document.getElementById("new-event-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newEvent = {
    event_name: document.getElementById("event-name").value,
    event_date: document.getElementById("event-date").value,
    event_time_start: document.getElementById("event-time-start").value,
    event_time_end: document.getElementById("event-time-end").value,
    location: document.getElementById("location").value,
    event_type: document.getElementById("event-type").value,
    description: document.getElementById("event-description").value,
    registration_required: 0,
    event_status: "upcoming",
    event_restriction: "public"
  };

  try {
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    const result = await res.json();
    if (result.success) {
      showToast("Event created successfully!", "success");
      document.getElementById("new-event-modal").classList.add("hidden");
      document.getElementById("new-event-form").reset();
      fetchCalendarEvents(); 
    } else {
      showToast("Failed: " + result.message, "error");
      console.error(result.errors || result);
    }
  } catch (err) {
    showToast("Error creating event.", "error");
    //console.error("Error creating event:", err);
  }
});

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const toastContent = document.getElementById("toast-content");

  toastMessage.textContent = message;

  if (type === "success") {
    toastContent.className = "flex items-center max-w-xs p-4 text-sm text-white bg-green-600 rounded-lg shadow-lg animate-slide-in";
    toastContent.querySelector("i").className = "fas fa-check-circle mr-2 text-white";
  } else if (type === "error") {
    toastContent.className = "flex items-center max-w-xs p-4 text-sm text-white bg-red-600 rounded-lg shadow-lg animate-slide-in";
    toastContent.querySelector("i").className = "fas fa-times-circle mr-2 text-white";
  }

  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 1000);
}

document.getElementById("cancel-event").addEventListener("click", () => {
  document.getElementById("new-event-modal").classList.add("hidden");
});

function openNewEventModal(dateStr) {
  document.getElementById("new-event-modal").classList.remove("hidden");
  document.getElementById("event-date").value = dateStr;
}

function closeNewEventModal() {
  document.getElementById("new-event-modal").classList.add("hidden");
}