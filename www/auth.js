// ─────────────────────────────────────────────
//  auth.js — Guard universel HotelStaff
//  À inclure sur chaque page protégée
// ─────────────────────────────────────────────
import { onAuth, getUserProfile, logout, ROLE_PAGES } from './firebase.js';

/**
 * initPage(roleAutorisé | roleAutorisé[])
 * → Vérifie que l'user connecté a le bon rôle
 * → Sinon redirige vers login.html
 * → Retourne le profil complet si OK
 *
 * Usage sur chaque page :
 *   import { initPage } from './auth.js';
 *   const profil = await initPage('staff');
 *   // ou plusieurs rôles :
 *   const profil = await initPage(['gouv_generale', 'gouv_etage']);
 */
export function initPage(rolesAutorises) {
  const roles = Array.isArray(rolesAutorises) ? rolesAutorises : [rolesAutorises];

  return new Promise((resolve) => {
    onAuth(async (user) => {
      if (!user) {
        window.location.href = 'login.html';
        return;
      }
      const profil = await getUserProfile(user.uid);
      if (!profil || !roles.includes(profil.role)) {
        // Accès refusé — montre l'écran guard si présent, sinon redirige
        const guard = document.getElementById('guard-screen');
        if (guard) {
          guard.classList.add('show');
        } else {
          window.location.href = 'login.html';
        }
        return;
      }
      // Injecte le nom et le badge rôle dans le header si présents
      const elNom   = document.getElementById('user-nom');
      const elHotel = document.getElementById('hotel-name');
      const elBadge = document.getElementById('role-badge');
      if (elNom)   elNom.textContent   = profil.nom || user.email;
      if (elHotel) elHotel.textContent = profil.hotel_nom || 'Hôtel';
      if (elBadge) {
        elBadge.textContent = BADGE_LABELS[profil.role] || profil.role;
        elBadge.className   = `hs-badge hs-badge-${BADGE_CLASS[profil.role] || ''}`;
      }
      resolve(profil);
    });
  });
}

const BADGE_LABELS = {
  directeur:     'Directeur',
  gouv_generale: 'Gouvernante Générale',
  gouv_etage:    'Gouvernante d\'étage',
  staff:         'Staff',
  reception:     'Réception',
  maintenance:   'Maintenance'
};

const BADGE_CLASS = {
  directeur:     'directeur',
  gouv_generale: 'gouv-gen',
  gouv_etage:    'gouv-etage',
  staff:         'staff',
  reception:     'reception',
  maintenance:   'maintenance'
};

// Déconnexion universelle
export function setupLogout() {
  const btn = document.getElementById('btn-logout');
  if (btn) btn.addEventListener('click', async () => {
    await logout();
    window.location.href = 'login.html';
  });
}

// Toast helper global
export function showToast(msg, duration = 2500) {
  const t = document.getElementById('hs-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}
