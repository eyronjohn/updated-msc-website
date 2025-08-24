let generalCalendarDate = new Date();

function renderMSCCalendar() {
  const year = generalCalendarDate.getFullYear();
  const month = generalCalendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid = document.getElementById("general-calendar-grid");
  const monthTitle = document.getElementById("general-calendar-month-title");

  if (!grid || !monthTitle) return; // prevent missing element error

  grid.innerHTML = "";
  monthTitle.textContent = generalCalendarDate.toLocaleString("default", { month: "long", year: "numeric" });

  for (let i = 0; i < firstDay; i++) {
    grid.appendChild(document.createElement("div"));
  }

  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];

    const div = document.createElement("div");
    const isToday = date.toDateString() === today.toDateString();

    div.className =
      "border border-white/10 p-2 h-20 relative transition-all bg-[#011538] text-white hover:bg-white/10 flex flex-col items-start";

    const daySpan = document.createElement("span");
    daySpan.textContent = day;
    daySpan.className =
      `text-sm inline-flex items-center justify-center w-8 h-8 mb-1 ${isToday
        ? "bg-[#b9da05] text-[#011538] font-bold rounded-full"
        : "text-white"}`;

    div.appendChild(daySpan);

    const events = calendarEvents.filter(e => e.date === dateStr);
    events.forEach(e => {
      const badge = document.createElement("div");
      badge.className = `w-full text-xs truncate px-1 rounded ${e.color} cursor-pointer`;
      badge.textContent = e.title;
      badge.addEventListener("click", () => openCalendarModal(e));
      div.appendChild(badge);
    });

    grid.appendChild(div);
  }
}

function navigateGeneralCalendar(offset) {
  generalCalendarDate.setMonth(generalCalendarDate.getMonth() + offset);
  renderMSCCalendar;
}

document.addEventListener("DOMContentLoaded", renderMSCCalendar);
