// ─────────────────────────────────────────────
//  firebase.js — HotelStaff
//  Config + helpers Auth & Realtime Database
// ─────────────────────────────────────────────
import { initializeApp }                        from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword,
         signOut, onAuthStateChanged }           from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, get,
         update, onValue, push, remove }         from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCse3b45dUFvI7weTAOogGgJhLvYAHiuUE",
  authDomain:        "hotelstaff-prod.firebaseapp.com",
  databaseURL:       "https://hotelstaff-prod-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "hotelstaff-prod",
  storageBucket:     "hotelstaff-prod.firebasestorage.app",
  messagingSenderId: "546529389568",
  appId:             "1:546529389568:web:6b31bdbc04458387f97ce5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getDatabase(app);

// ── Rôles disponibles ─────────────────────────────────────────────────────────
export const ROLES = {
  DIRECTEUR:        "directeur",
  GOUV_GENERALE:    "gouv_generale",
  GOUV_ETAGE:       "gouv_etage",
  STAFF:            "staff",
  RECEPTION:        "reception",
  MAINTENANCE:      "maintenance"
};

// Redirect par rôle
export const ROLE_PAGES = {
  directeur:      "directeur.html",
  gouv_generale:  "gouvernante-generale.html",
  gouv_etage:     "gouvernante-etage.html",
  staff:          "staff.html",
  reception:      "reception.html",
  maintenance:    "maintenance.html"
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login  = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
export const onAuth = (cb) => onAuthStateChanged(auth, cb);

// Récupère le profil complet de l'user connecté (rôle, nom, hotelId…)
export const getUserProfile = async (uid) => {
  const snap = await get(ref(db, `users/${uid}`));
  if (!snap.exists()) return null;
  return { ...snap.val(), uid }; // on injecte l'uid dans le profil
};

// ── Chambres ──────────────────────────────────────────────────────────────────
// Statuts possibles : "sale" | "en_cours" | "prete" | "validee" | "occupee" | "recalibrage"
export const watchChambres = (hotelId, cb) =>
  onValue(ref(db, `hotels/${hotelId}/chambres`), snap => cb(snap.val() || {}));

export const updateChambre = (hotelId, num, data) =>
  update(ref(db, `hotels/${hotelId}/chambres/${num}`), { ...data, updated_at: Date.now() });

export const assignerChambre = (hotelId, num, staffId, staffNom) =>
  update(ref(db, `hotels/${hotelId}/chambres/${num}`), {
    assignee_id: staffId, assignee_nom: staffNom, updated_at: Date.now()
  });

// ── Zones (couloirs, lingerie, salle de sport…) ───────────────────────────────
export const watchZones = (hotelId, cb) =>
  onValue(ref(db, `hotels/${hotelId}/zones`), snap => cb(snap.val() || {}));

export const updateZone = (hotelId, zoneId, data) =>
  update(ref(db, `hotels/${hotelId}/zones/${zoneId}`), { ...data, updated_at: Date.now() });

// ── Incidents ─────────────────────────────────────────────────────────────────
export const signalerIncident = (hotelId, data) =>
  push(ref(db, `hotels/${hotelId}/incidents`), {
    ...data, statut: "ouvert", created_at: Date.now()
  });

export const updateIncident = (hotelId, incidentId, data) =>
  update(ref(db, `hotels/${hotelId}/incidents/${incidentId}`), { ...data, updated_at: Date.now() });

export const watchIncidents = (hotelId, cb) =>
  onValue(ref(db, `hotels/${hotelId}/incidents`), snap => cb(snap.val() || {}));

// ── Réapprovisionnement ───────────────────────────────────────────────────────
// Statuts : "ouvert" | "traite"
export const demanderReappro = (hotelId, data) =>
  push(ref(db, `hotels/${hotelId}/reappro`), {
    ...data, statut: "ouvert", created_at: Date.now()
  });

export const updateReappro = (hotelId, reapproId, data) =>
  update(ref(db, `hotels/${hotelId}/reappro/${reapproId}`), { ...data, updated_at: Date.now() });

export const watchReappro = (hotelId, cb) =>
  onValue(ref(db, `hotels/${hotelId}/reappro`), snap => cb(snap.val() || {}));

// ── Shifts ────────────────────────────────────────────────────────────────────
export const ouvrirShift = (hotelId, data) =>
  push(ref(db, `hotels/${hotelId}/shifts`), { ...data, ouvert_at: Date.now(), statut: "ouvert" });

export const cloturerShift = (hotelId, shiftId) =>
  update(ref(db, `hotels/${hotelId}/shifts/${shiftId}`), { statut: "cloture", cloture_at: Date.now() });

export const watchShiftActif = (hotelId, cb) =>
  onValue(ref(db, `hotels/${hotelId}/shifts`), snap => {
    const all = snap.val() || {};
    const actif = Object.entries(all).find(([, s]) => s.statut === "ouvert");
    cb(actif ? { id: actif[0], ...actif[1] } : null);
  });

// ── Staff ─────────────────────────────────────────────────────────────────────
export const watchStaff = (hotelId, cb) =>
  onValue(ref(db, `hotels/${hotelId}/staff`), snap => cb(snap.val() || {}));
