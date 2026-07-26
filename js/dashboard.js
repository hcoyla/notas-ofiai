/**
 * dashboard.js
 * Pinta la boleta de notas del alumno que inició sesión.
 */

const DATA_URL = "data/estudiantes.json";

function condicionInfo(condicion) {
  switch ((condicion || "").toUpperCase()) {
    case "APROBADO":
      return { clase: "ok", texto: "Aprobado" };
    case "JALADO":
      return { clase: "fail", texto: "Desaprobado" };
    case "RETIRADO":
      return { clase: "neutral", texto: "Retirado" };
    default:
      return { clase: "neutral", texto: condicion || "Sin estado" };
  }
}

function crearTarjetaNota({ etiqueta, valor, max, peso }) {
  const card = document.createElement("div");
  card.className = "grade-card";

  if (valor === null || valor === undefined) {
    card.innerHTML = `
      <div class="head">
        <span class="label">${etiqueta}</span>
        <span class="weight">Peso: ${peso} pts</span>
      </div>
      <div class="na">No presenta</div>
    `;
    return card;
  }

  const pct = Math.max(0, Math.min(100, (Number(valor) / max) * 100));
  card.innerHTML = `
    <div class="head">
      <span class="label">${etiqueta}</span>
      <span class="weight">Peso: ${peso} pts del promedio final</span>
    </div>
    <div class="score">${formatNum(valor)} <span class="max">/ ${max}</span></div>
    <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
  `;
  return card;
}

function formatNum(n) {
  const num = Number(n);
  return Number.isInteger(num) ? String(num) : num.toFixed(2).replace(/\.?0+$/, "");
}

async function iniciar() {
  const email = sessionStorage.getItem("portal_notas_email");
  if (!email) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem("portal_notas_email");
    window.location.href = "index.html";
  });

  const loading = document.getElementById("loading");
  const contenido = document.getElementById("contenido");
  const errorState = document.getElementById("error-state");

  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("no se pudo cargar la base de datos");
    const estudiantes = await res.json();
    const alumno = estudiantes.find((e) => e.email.toLowerCase() === email.toLowerCase());

    if (!alumno) {
      sessionStorage.removeItem("portal_notas_email");
      window.location.href = "index.html";
      return;
    }

    document.getElementById("saludo").textContent = `Hola, ${alumno.nombres || alumno.nombre_completo}`;

    const cond = condicionInfo(alumno.condicion);

    document.getElementById("nombre-completo").textContent = alumno.nombre_completo || "";
    document.getElementById("meta-curso").textContent = alumno.curso || "—";
    document.getElementById("meta-grupo").textContent = alumno.grupo || "—";
    document.getElementById("meta-periodo").textContent = alumno.periodo || "—";

    const sello = document.getElementById("sello");
    sello.classList.add(cond.clase);
    document.getElementById("sello-num").textContent =
      alumno.promedio_final === null || alumno.promedio_final === undefined
        ? "—"
        : formatNum(alumno.promedio_final);
    document.getElementById("sello-cond").textContent = cond.texto;

    const grid = document.getElementById("grades-grid");
    grid.innerHTML = "";

    if ((alumno.condicion || "").toUpperCase() === "RETIRADO" && alumno.promedio_final === null) {
      const nota = document.createElement("div");
      nota.className = "retirado-note";
      nota.textContent =
        "Este alumno figura como retirado del curso y no cuenta con notas registradas.";
      grid.parentElement.replaceChild(nota, grid);
    } else {
      const items = [
        { etiqueta: "Nota de Asistencia", valor: alumno.asistencia, max: alumno.asistencia_max, peso: alumno.asistencia_max },
        { etiqueta: "Nota del 1er Examen", valor: alumno.examen1, max: alumno.examen1_max, peso: 4 },
        { etiqueta: "Nota del 1er Trabajo", valor: alumno.trabajo1, max: alumno.trabajo1_max, peso: 3 },
        { etiqueta: "Nota del 2do Examen", valor: alumno.examen2, max: alumno.examen2_max, peso: 4 },
        { etiqueta: "Nota del 2do Trabajo", valor: alumno.trabajo2, max: alumno.trabajo2_max, peso: 3 },
      ];
      items.forEach((it) => grid.appendChild(crearTarjetaNota(it)));
    }

    loading.style.display = "none";
    contenido.style.display = "block";
  } catch (err) {
    console.error(err);
    loading.style.display = "none";
    errorState.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", iniciar);
