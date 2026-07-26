/**
 * auth.js
 * Lógica de inicio de sesión del Portal de Notas.
 *
 * Cómo funciona:
 *  - El "usuario" es el correo electrónico del alumno.
 *  - La "contraseña" es su número de DNI.
 *  - El DNI NUNCA se guarda en texto plano en el repositorio: solo se
 *    guarda su huella SHA-256 (dni_hash) en data/estudiantes.json.
 *  - Al iniciar sesión, el navegador calcula el SHA-256 del DNI que la
 *    persona escribió y lo compara con el hash guardado.
 *
 * Importante: esto es un sitio 100% estático (sin servidor propio), así
 * que la validación ocurre en el navegador. Es suficiente para evitar
 * que un DNI quede expuesto directamente en el repositorio, pero no
 * reemplaza un sistema de autenticación real. Ver README.md.
 */

const DATA_URL = "data/estudiantes.json";

async function sha256Hex(texto) {
  const buffer = new TextEncoder().encode(texto);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizaDni(dni) {
  return dni.trim().padStart(8, "0");
}

async function cargarEstudiantes() {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar la base de datos de notas.");
  return res.json();
}

async function intentarLogin(email, dni) {
  if (!crypto.subtle) {
    return {
      ok: false,
      mensaje:
        "Este navegador no permite iniciar sesión de forma segura en esta página (se requiere HTTPS). Abre el sitio publicado en GitHub Pages, no el archivo local.",
    };
  }

  const estudiantes = await cargarEstudiantes();
  const emailNorm = email.trim().toLowerCase();
  const alumno = estudiantes.find((e) => e.email.toLowerCase() === emailNorm);

  if (!alumno) {
    return { ok: false, mensaje: "No encontramos ese correo electrónico." };
  }

  const dniHash = await sha256Hex(normalizaDni(dni));
  if (dniHash !== alumno.dni_hash) {
    return { ok: false, mensaje: "El DNI ingresado no es correcto." };
  }

  sessionStorage.setItem("portal_notas_email", alumno.email);
  return { ok: true };
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  // si ya hay sesión activa, ir directo al dashboard
  if (sessionStorage.getItem("portal_notas_email")) {
    window.location.href = "dashboard.html";
    return;
  }

  const errorBox = document.getElementById("login-error");
  const btn = document.getElementById("login-btn");

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    errorBox.classList.remove("show");
    btn.disabled = true;
    btn.textContent = "Verificando…";

    const email = document.getElementById("email").value;
    const dni = document.getElementById("dni").value;

    try {
      const resultado = await intentarLogin(email, dni);
      if (resultado.ok) {
        window.location.href = "dashboard.html";
        return;
      }
      errorBox.textContent = resultado.mensaje;
      errorBox.classList.add("show");
    } catch (err) {
      errorBox.textContent =
        "Ocurrió un problema al consultar tus notas. Intenta de nuevo en unos segundos.";
      errorBox.classList.add("show");
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.textContent = "Ingresar";
    }
  });
});
