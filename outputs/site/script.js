const pages = new Set([
  "home",
  "clube",
  "equipe",
  "agenda",
  "patrocinios",
  "seja-parceiro",
  "noticias",
  "noticia-campanha",
  "noticia-capeba",
  "noticia-carrera",
  "noticia-projeto",
  "noticia-futuro",
  "contato",
]);
const pageViews = document.querySelectorAll(".page-view");
const navLinks = document.querySelectorAll("[data-page-link]");

function showPage(pageName) {
  const nextPage = pages.has(pageName) ? pageName : "home";

  pageViews.forEach((view) => {
    view.classList.toggle("active", view.dataset.page === nextPage);
  });

  const activePage = nextPage.startsWith("noticia-") ? "noticias" : nextPage;

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === activePage);
  });

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = link.getAttribute("href").replace("#", "");

    if (!pages.has(target)) {
      event.preventDefault();
      return;
    }

    showPage(target);
  });
});

window.addEventListener("hashchange", () => {
  showPage(window.location.hash.replace("#", ""));
});

showPage(window.location.hash.replace("#", ""));

const agendaEvents = [
  {
    title: "Copão Sudeste de Futsal",
    category: "Competição regional",
    startDate: "2026-06-06",
    endDate: "2026-06-07",
    location: "Taguatinga",
    opponent: "Real B.U, ELEV Futsal e demais equipes",
    status: "Encerrado",
    images: [
      {
        src: "assets/agenda-copao-06-06.png",
        alt: "Tabela de jogos do Copão Sudeste de Futsal em 06/06",
        caption: "06/06 - Sábado",
      },
      {
        src: "assets/agenda-copao-07-06.png",
        alt: "Tabela de jogos do Copão Sudeste de Futsal em 07/06",
        caption: "07/06 - Domingo",
      },
    ],
  },
  {
    title: "075 Futsal x Zendios",
    category: "Desafio Intermunicipal de Futsal",
    startDate: "2026-06-10",
    time: "20h00",
    location: "Ginásio Rui Barbosa - Ruy Barbosa/BA",
    opponent: "Zendios",
    status: "Confirmado",
    image: "assets/agenda-dia-075-chapada.png",
    imageAlt: "Arte Dia de 075 na Chapada, 075 Futsal x Zendios",
  },
  {
    title: "Treino preparatório",
    category: "Preparação",
    startDate: "2026-06-15",
    opponent: "Adversário a confirmar",
    status: "A confirmar",
  },
  {
    title: "Amistoso regional",
    category: "Amistoso",
    startDate: "2026-06-22",
    opponent: "Adversário a confirmar",
    status: "A confirmar",
  },
  {
    title: "Jogo-treino",
    category: "Preparação",
    startDate: "2026-06-29",
    opponent: "Adversário a confirmar",
    status: "A confirmar",
  },
  {
    title: "Próximo desafio",
    category: "Temporada",
    startDate: "2026-07-06",
    opponent: "Adversário a confirmar",
    status: "A confirmar",
  },
];

const agendaTodayContainer = document.querySelector("[data-agenda-today]");
const agendaUpcomingContainer = document.querySelector("[data-agenda-upcoming]");
const agendaPastContainer = document.querySelector("[data-agenda-past]");

function dateKeyToDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatAgendaDate(dateKey) {
  return dateKeyToDate(dateKey).toLocaleDateString("pt-BR");
}

function formatAgendaDateRange(event) {
  if (event.endDate && event.endDate !== event.startDate) {
    return `${formatAgendaDate(event.startDate)} a ${formatAgendaDate(event.endDate)}`;
  }

  return formatAgendaDate(event.startDate);
}

function getEventEndDate(event) {
  return event.endDate || event.startDate;
}

function getAgendaEventState(event, todayKey = getTodayKey()) {
  const today = dateKeyToDate(todayKey).getTime();
  const start = dateKeyToDate(event.startDate).getTime();
  const end = dateKeyToDate(getEventEndDate(event)).getTime();

  if (today >= start && today <= end) return "today";
  if (today > end) return "past";
  return "upcoming";
}

function renderAgendaFeature(event, state) {
  const timeText = event.time ? ` - ${event.time}` : "";
  const image = event.image
    ? `<img class="agenda-card-art" src="${event.image}" alt="${event.imageAlt || event.title}">`
    : "";
  const gallery = event.images
    ? `<div class="agenda-past-gallery" aria-label="Imagens de ${event.title}">
        ${event.images
          .map(
            (imageItem) => `<figure>
              <img src="${imageItem.src}" alt="${imageItem.alt}">
              <figcaption>${imageItem.caption}</figcaption>
            </figure>`
          )
          .join("")}
      </div>`
    : "";

  return `<article class="agenda-feature ${state}">
    ${image}
    <div class="agenda-card-content">
      <span class="agenda-status">${state === "today" ? "Hoje" : "Encerrado"}</span>
      <time datetime="${event.startDate}">${formatAgendaDateRange(event)}${timeText}</time>
      <h3>${event.title}</h3>
      <p>${event.category}</p>
      <strong>${event.location || event.opponent || event.status}</strong>
    </div>
    ${gallery}
  </article>`;
}

function renderAgendaUpcomingItem(event) {
  const timeText = event.time ? ` - ${event.time}` : "";

  return `<article class="upcoming-item">
    <time datetime="${event.startDate}">${formatAgendaDate(event.startDate)}${timeText}</time>
    <div>
      <h4>${event.title}</h4>
      <p>${event.opponent || event.category}</p>
    </div>
    <span>${event.status}</span>
  </article>`;
}

function renderAgendaEmpty(title, text) {
  return `<div class="agenda-empty">
    <strong>${title}</strong>
    <span>${text}</span>
  </div>`;
}

function renderAgenda() {
  if (!agendaTodayContainer || !agendaUpcomingContainer || !agendaPastContainer) return;

  const todayEvents = agendaEvents
    .filter((event) => getAgendaEventState(event) === "today")
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  const upcomingEvents = agendaEvents
    .filter((event) => getAgendaEventState(event) === "upcoming")
    .sort((a, b) => dateKeyToDate(a.startDate) - dateKeyToDate(b.startDate));
  const pastEvents = agendaEvents
    .filter((event) => getAgendaEventState(event) === "past")
    .sort((a, b) => dateKeyToDate(getEventEndDate(b)) - dateKeyToDate(getEventEndDate(a)));

  agendaTodayContainer.innerHTML = todayEvents.length
    ? todayEvents.map((event) => renderAgendaFeature(event, "today")).join("")
    : renderAgendaEmpty("Nenhum evento hoje", "Quando a data de um compromisso chegar, ele aparece automaticamente aqui.");

  agendaUpcomingContainer.innerHTML = upcomingEvents.length
    ? upcomingEvents.map(renderAgendaUpcomingItem).join("")
    : renderAgendaEmpty("Sem próximos compromissos", "Novos jogos e eventos aparecerão aqui assim que forem cadastrados.");

  agendaPastContainer.innerHTML = pastEvents.length
    ? pastEvents.map((event) => renderAgendaFeature(event, "past")).join("")
    : renderAgendaEmpty("Nenhum evento encerrado", "Depois que uma data passar, o compromisso entra automaticamente nesta área.");
}

renderAgenda();

document.querySelectorAll("[data-news-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  let current = 0;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === current);
    });
  }

  previous.addEventListener("click", () => showSlide(current - 1));
  next.addEventListener("click", () => showSlide(current + 1));
});

const teamFilters = document.querySelectorAll("[data-team-filter]");
const playerCards = document.querySelectorAll("[data-player-position]");

teamFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.teamFilter;

    teamFilters.forEach((filterButton) => {
      filterButton.classList.toggle("is-active", filterButton === button);
    });

    playerCards.forEach((card) => {
      const positions = card.dataset.playerPosition.split(" ");
      card.hidden = selected !== "todos" && !positions.includes(selected);
    });
  });
});
