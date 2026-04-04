// ============================================================
// api.js  —  Place this file in your React project's /src folder
// Import and use these functions in App.js to replace all
// hardcoded data (initialAnimals, initialCases, volunteers, etc.)
// ============================================================

const BASE_URL = "http://localhost:8080/api";

// ─── Token helpers ───────────────────────────────────────────
const getToken = () => localStorage.getItem("jwt_token");
const setToken = (t) => localStorage.setItem("jwt_token", t);
const clearToken = () => localStorage.removeItem("jwt_token");

// ─── Base fetch wrapper ──────────────────────────────────────
async function apiFetch(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Request failed");
  }
  return json.data;
}

// ════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════

export async function login(email, password, role) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  });
  setToken(data.token);
  return data; // { token, email, name, role, userId }
}

export async function register(name, email, password, phone, role) {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone, role }),
  });
  setToken(data.token);
  return data;
}

export function logout() {
  clearToken();
}

// ════════════════════════════════════════════════════════════
// ANIMALS
// ════════════════════════════════════════════════════════════

export const fetchAnimals = (search, type) => {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (type && type !== "All") params.set("type", type);
  return apiFetch(`/animals?${params.toString()}`);
};

export const fetchAnimal = (animalId) =>
  apiFetch(`/animals/${animalId}`);

export const createAnimal = (animalData) =>
  apiFetch("/animals", {
    method: "POST",
    body: JSON.stringify(animalData),
  });

export const updateAnimal = (animalId, animalData) =>
  apiFetch(`/animals/${animalId}`, {
    method: "PUT",
    body: JSON.stringify(animalData),
  });

export const deleteAnimal = (animalId) =>
  apiFetch(`/animals/${animalId}`, { method: "DELETE" });

export const addMedicalHistory = (animalId, event, performedBy, eventDate) =>
  apiFetch(`/animals/${animalId}/history`, {
    method: "POST",
    body: JSON.stringify({ event, performedBy, eventDate }),
  });

export async function uploadAnimalPhoto(animalId, file) {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/animals/${animalId}/photo`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Upload failed");
  return json.data; // photo URL
}

// ════════════════════════════════════════════════════════════
// RESCUE CASES
// ════════════════════════════════════════════════════════════

export const fetchCases = (urgency) => {
  const params = urgency && urgency !== "All" ? `?urgency=${urgency}` : "";
  return apiFetch(`/rescue-cases${params}`);
};

export const createCase = (caseData) =>
  apiFetch("/rescue-cases", {
    method: "POST",
    body: JSON.stringify(caseData),
  });

export const advanceCase = (caseId) =>
  apiFetch(`/rescue-cases/${caseId}/advance`, { method: "PATCH" });

export const deleteCase = (caseId) =>
  apiFetch(`/rescue-cases/${caseId}`, { method: "DELETE" });

// ════════════════════════════════════════════════════════════
// VOLUNTEERS
// ════════════════════════════════════════════════════════════

export const fetchVolunteers = (activeOnly = false) =>
  apiFetch(`/volunteers${activeOnly ? "?activeOnly=true" : ""}`);

export const createVolunteer = (data) =>
  apiFetch("/volunteers", { method: "POST", body: JSON.stringify(data) });

export const updateVolunteer = (id, data) =>
  apiFetch(`/volunteers/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteVolunteer = (id) =>
  apiFetch(`/volunteers/${id}`, { method: "DELETE" });

// ════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════════════════════════

export const fetchNotifications = () => apiFetch("/notifications");

export const fetchUnreadCount = () => apiFetch("/notifications/unread-count");

export const markNotificationRead = (id) =>
  apiFetch(`/notifications/${id}/read`, { method: "PATCH" });

export const markAllNotificationsRead = () =>
  apiFetch("/notifications/mark-all-read", { method: "PATCH" });

// ════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════

export const fetchDashboardStats = () => apiFetch("/dashboard/stats");

// ════════════════════════════════════════════════════════════
// HOW TO USE IN App.js  —  Replace hardcoded data like this:
// ════════════════════════════════════════════════════════════
//
// 1. LOAD ANIMALS on mount:
//    useEffect(() => {
//      fetchAnimals().then(setAnimals).catch(console.error);
//    }, []);
//
// 2. REGISTER ANIMAL (replace handleRegister):
//    const handleRegister = async () => {
//      if (!form.name || !form.area) { showToast("Fill Name and Area","error"); return; }
//      try {
//        const entry = await createAnimal({
//          name: form.name, type: form.type, breed: form.breed,
//          area: form.area, contact: form.contact, notes: form.notes,
//          status: urgency, registeredBy: user || "Guest"
//        });
//        setAnimals(prev => [entry, ...prev]);
//        showToast(`Animal ${entry.animalId} registered!`, "success");
//        setForm({ name:"", type:"Dog", breed:"", area:"", contact:"", notes:"" });
//        nav("animals");
//      } catch(e) { showToast(e.message, "error"); }
//    };
//
// 3. LOGIN (replace LoginModal dummy logic):
//    const handleLogin = async () => {
//      try {
//        const res = await login(email, password, role);
//        onLogin(res.role);  // sets user in parent
//      } catch(e) { setError(e.message); }
//    };
//
// 4. ADVANCE CASE (replace handleCaseAdvance):
//    const handleCaseAdvance = async (caseId) => {
//      try {
//        const updated = await advanceCase(caseId);
//        setCases(prev => prev.map(c => c.caseId === caseId ? updated : c));
//        showToast(`Case ${caseId} advanced!`);
//      } catch(e) { showToast(e.message, "error"); }
//    };
//
// 5. LOAD DASHBOARD STATS:
//    useEffect(() => {
//      fetchDashboardStats().then(stats => {
//        // stats.totalAnimals, stats.vaccinationPercent, etc.
//      });
//    }, []);
