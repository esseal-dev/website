(function () {
  "use strict";

  var SLOTS = (function () {
    var s = [];
    for (var h = 0; h < 24; h++) {
      var ampm = h < 12 ? "AM" : "PM";
      var display = h % 12 === 0 ? 12 : h % 12;
      s.push(display + ":00 " + ampm);
    }
    return s;
  })();

  var MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  var DAYS_SHORT = ["Mo","Tu","We","Th","Fr","Sa","Su"];
  var DAYS_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  var viewYear, viewMonth, selectedDate, selectedSlot;
  var isInlineMode = false;

  /* ── TIMEZONE ── */
  var userTZ = (function () {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return "UTC"; }
  })();

  function escapeHtml(str) {
    var d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function getWidgetMarkup(isModal) {
    return [
      '<div class="booking-modal' + (isModal ? '' : ' booking-modal--inline') + '" id="booking-modal-inner">',
        (isModal ? '<button class="booking-close" id="booking-close-btn" aria-label="Close">&times;</button>' : ''),
        '<div class="booking-layout">',

          '<div class="booking-cal-col">',
            '<h2 id="booking-title">Schedule a Call</h2>',
            '<p class="booking-subtitle" id="booking-subtitle">30 min &middot; ' + userTZ + '</p>',
            '<div class="booking-cal-nav">',
              '<button class="cal-nav-btn" id="cal-prev" aria-label="Previous month" type="button">&#8249;</button>',
              '<span class="cal-month-label" id="cal-month-label"></span>',
              '<button class="cal-nav-btn" id="cal-next" aria-label="Next month" type="button">&#8250;</button>',
            '</div>',
            '<div class="cal-weekdays">',
              DAYS_SHORT.map(function(d){ return '<span>'+d+'</span>'; }).join(''),
            '</div>',
            '<div class="cal-days" id="cal-days"></div>',
          '</div>',

          '<div class="booking-slots-col" id="booking-slots-col">',
            '<button class="slots-back-btn" id="slots-back-btn" type="button">&#8592; <span id="slots-back-label"></span></button>',
            '<div class="booking-slots-empty" id="slots-empty">',
              '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
              '<p>Select a date to<br>see available times</p>',
            '</div>',
            '<div class="booking-slots-list" id="slots-list">',
              '<p class="slots-date-label" id="slots-date-label"></p>',
              '<div class="slots-grid" id="slots-grid"></div>',
            '</div>',
          '</div>',

        '</div>',

        '<div class="booking-footer">',
          '<div class="booking-email-group">',
            '<label for="booking-email">Work Email <span aria-hidden="true">*</span></label>',
            '<input type="email" id="booking-email" name="email" autocomplete="email" placeholder="you@company.com" />',
            '<span class="booking-email-error" id="booking-email-error" aria-live="polite"></span>',
          '</div>',
          '<button class="btn-primary btn-confirm" id="btn-confirm" type="button" disabled>Confirm Booking</button>',
        '</div>',

      '</div>',
    ].join("");
  }

  function bindEvents(isModal) {
    if (isModal) {
      var closeBtn = document.getElementById("booking-close-btn");
      if (closeBtn) closeBtn.addEventListener("click", close);
      var overlay = document.getElementById("booking-modal");
      if (overlay) {
        overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
      }
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && overlay && overlay.classList.contains("is-open")) close();
      });
    }

    var backBtn = document.getElementById("slots-back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        selectedDate = null;
        selectedSlot = null;
        var inner = document.getElementById("booking-modal-inner");
        if (inner) inner.classList.remove("date-selected");
        renderCalendar();
        renderSlots();
      });
    }

    var emailInput = document.getElementById("booking-email");
    if (emailInput) {
      emailInput.addEventListener("input", function () {
        this.classList.remove("is-invalid");
        var err = document.getElementById("booking-email-error");
        if (err) err.textContent = "";
      });
    }

    var prevBtn = document.getElementById("cal-prev");
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        var now = new Date();
        if (viewYear > now.getFullYear() || viewMonth > now.getMonth()) {
          viewMonth--;
          if (viewMonth < 0) { viewMonth = 11; viewYear--; }
          renderCalendar();
        }
      });
    }

    var nextBtn = document.getElementById("cal-next");
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        var now  = new Date();
        var maxM = now.getMonth() + 2;
        var maxY = now.getFullYear() + Math.floor(maxM / 12);
        maxM = maxM % 12;
        if (viewYear < maxY || (viewYear === maxY && viewMonth < maxM)) {
          viewMonth++;
          if (viewMonth > 11) { viewMonth = 0; viewYear++; }
          renderCalendar();
        }
      });
    }

    var confirmBtn = document.getElementById("btn-confirm");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", function () {
        if (!selectedDate || !selectedSlot) return;

        var emailInput = document.getElementById("booking-email");
        var emailError = document.getElementById("booking-email-error");
        var email = emailInput.value.trim();
        var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

        if (!email || !validEmail) {
          emailInput.classList.add("is-invalid");
          emailError.textContent = email ? "Please enter a valid email address." : "Work email is required.";
          emailInput.focus();
          return;
        }
        emailInput.classList.remove("is-invalid");
        emailError.textContent = "";

        var match = selectedSlot.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
        var h = parseInt(match[1], 10);
        var ampm = match[3].toUpperCase();
        if (ampm === "PM" && h !== 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;

        var localDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          h, 0, 0, 0
        );

        confirmBtn.textContent = "Sending…";
        confirmBtn.disabled = true;

        var endDate = new Date(localDate.getTime() + 30 * 60 * 1000);
        var clientTimeString = localDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " at " + selectedSlot + " (" + userTZ + ")";

        fetch("/send-booking.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            clientTime: clientTimeString,
            timezone: userTZ,
            startTimeIso: localDate.toISOString(),
            endTimeIso: endDate.toISOString(),
            sourceUrl: window.location.href,
          }),
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data && data.status === "success") {
              confirmBtn.textContent = "Booked!";
              if (isInlineMode) {
                var inner = document.getElementById("booking-modal-inner");
                if (inner) {
                  inner.innerHTML = [
                    '<div class="booking-success-message">',
                      '<div class="booking-success-icon">',
                        '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#fa6220" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
                      '</div>',
                      '<h3>Consultation Booked</h3>',
                      '<p>We have reserved your 30-minute session and emailed a calendar invitation (.ics) to <strong>' + escapeHtml(email) + '</strong>.</p>',
                      '<div class="booking-success-time">' + escapeHtml(clientTimeString) + '</div>',
                      '<p class="booking-success-note">You will speak directly with senior engineering leadership. If you need to reschedule or share project context beforehand, simply reply to the calendar email.</p>',
                    '</div>'
                  ].join("");
                }
              } else {
                setTimeout(function () { close(); }, 1200);
              }
            } else {
              alert((data && data.message) || "Failed to process booking request.");
              confirmBtn.textContent = "Confirm Booking";
              confirmBtn.disabled = false;
            }
          })
          .catch(function () {
            alert("Network error. Please check your connection and try again.");
            confirmBtn.textContent = "Confirm Booking";
            confirmBtn.disabled = false;
          });
      });
    }
  }

  /* ── INLINE INJECTION ── */
  function injectInline(container) {
    isInlineMode = true;
    container.innerHTML = getWidgetMarkup(false);
    var now = new Date();
    viewYear  = now.getFullYear();
    viewMonth = now.getMonth();
    selectedDate = null;
    selectedSlot = null;
    bindEvents(false);
    renderCalendar();
    renderSlots();
  }

  /* ── MODAL INJECTION ── */
  function injectModal() {
    if (document.getElementById("booking-modal")) return;

    var el = document.createElement("div");
    el.id = "booking-modal";
    el.className = "booking-overlay";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "booking-title");
    el.innerHTML = getWidgetMarkup(true);

    document.body.appendChild(el);
    bindEvents(true);
  }

  /* ── CALENDAR RENDER ── */
  function renderCalendar() {
    var monthLabel = document.getElementById("cal-month-label");
    if (!monthLabel) return;
    monthLabel.textContent = MONTHS[viewMonth] + " " + viewYear;

    var now   = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    var prevBtn = document.getElementById("cal-prev");
    if (prevBtn) {
      var atMin = viewYear === now.getFullYear() && viewMonth === now.getMonth();
      prevBtn.disabled = atMin;
    }

    var container = document.getElementById("cal-days");
    if (!container) return;
    container.innerHTML = "";

    var firstDow = new Date(viewYear, viewMonth, 1).getDay();
    firstDow = (firstDow + 6) % 7;

    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (var i = 0; i < firstDow; i++) {
      var empty = document.createElement("div");
      empty.className = "cal-day cal-day--empty";
      container.appendChild(empty);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var date  = new Date(viewYear, viewMonth, d);
      var dow   = date.getDay();
      var isWkd = dow === 0 || dow === 6;
      var isPast = date < today;
      var isToday    = date.getTime() === today.getTime();
      var isSelected = selectedDate && date.getTime() === selectedDate.getTime();

      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = d;

      var cls = "cal-day";
      if (isWkd || isPast) cls += " cal-day--disabled";
      if (isToday)         cls += " cal-day--today";
      if (isSelected)      cls += " cal-day--selected";
      btn.className = cls;

      if (isWkd || isPast) {
        btn.disabled = true;
      } else {
        (function (capturedDate) {
          btn.addEventListener("click", function () {
            selectedDate = capturedDate;
            selectedSlot = null;
            var inner = document.getElementById("booking-modal-inner");
            if (inner) inner.classList.add("date-selected");
            renderCalendar();
            renderSlots();
          });
        })(date);
      }
      container.appendChild(btn);
    }
  }

  /* ── SLOTS RENDER ── */
  function renderSlots() {
    var emptyEl   = document.getElementById("slots-empty");
    var listEl    = document.getElementById("slots-list");
    var labelEl   = document.getElementById("slots-date-label");
    var gridEl    = document.getElementById("slots-grid");
    var confirmEl = document.getElementById("btn-confirm");

    if (!emptyEl || !listEl || !gridEl) return;

    if (!selectedDate) {
      emptyEl.style.display = "";
      listEl.style.display  = "none";
      if (confirmEl) confirmEl.disabled = true;
      return;
    }

    emptyEl.style.display = "none";
    listEl.style.display  = "";

    var dateStr = DAYS_FULL[selectedDate.getDay()] + ", " +
      MONTHS_SHORT[selectedDate.getMonth()] + " " +
      selectedDate.getDate();
    if (labelEl) labelEl.textContent = dateStr;
    var backLabel = document.getElementById("slots-back-label");
    if (backLabel) backLabel.textContent = dateStr;

    var now     = new Date();
    var isToday = selectedDate.toDateString() === now.toDateString();

    gridEl.innerHTML = "";

    SLOTS.forEach(function (slot) {
      var isPast = false;
      if (isToday) {
        var match = slot.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
        var h = parseInt(match[1], 10);
        var ampm = match[3].toUpperCase();
        if (ampm === "PM" && h !== 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        isPast = now.getHours() >= h;
      }

      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = slot;
      btn.className = "slot-btn" +
        (isPast              ? " slot-btn--disabled"  : "") +
        (selectedSlot===slot ? " slot-btn--selected"  : "");

      if (isPast) {
        btn.disabled = true;
      } else {
        (function (s) {
          btn.addEventListener("click", function () {
            selectedSlot = s;
            renderSlots();
          });
        })(slot);
      }
      gridEl.appendChild(btn);
    });

    if (confirmEl) confirmEl.disabled = !selectedSlot;
  }

  /* ── OPEN / CLOSE ── */
  function open() {
    var inlineContainer = document.getElementById("inline-booking-widget");
    if (inlineContainer) {
      inlineContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    injectModal();
    var now = new Date();
    viewYear  = now.getFullYear();
    viewMonth = now.getMonth();
    selectedDate = null;
    selectedSlot = null;
    var inner = document.getElementById("booking-modal-inner");
    if (inner) inner.classList.remove("date-selected");
    var emailInput = document.getElementById("booking-email");
    if (emailInput) {
      emailInput.value = "";
      emailInput.classList.remove("is-invalid");
    }
    var err = document.getElementById("booking-email-error");
    if (err) err.textContent = "";
    renderCalendar();
    renderSlots();
    var modal = document.getElementById("booking-modal");
    if (modal) modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    var modal = document.getElementById("booking-modal");
    if (modal) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  /* ── AUTO-WIRE ── */
  window.openBookingModal = open;

  document.addEventListener("DOMContentLoaded", function () {
    var inlineContainer = document.getElementById("inline-booking-widget");
    if (inlineContainer) {
      injectInline(inlineContainer);
    }

    document.querySelectorAll("[data-open-booking]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        open();
      });
    });
  });
})();
