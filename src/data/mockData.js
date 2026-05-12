import { v4 as uuidv4 } from 'uuid'

export const DOCTORS = [
  {
    id: 1,
    nom: 'Dr. Amina Hassan',
    specialite: 'Médecine générale',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    experience: '12 ans',
    langues: ['Français', 'Arabe', 'Somali'],
    disponibilites: ['Lun', 'Mar', 'Jeu'],
    horaires: '08h00 – 17h00',
    bio: "Spécialisée en médecine préventive et suivi des maladies chroniques. Approche bienveillante centrée sur le patient.",
    rating: 4.8,
    consultations: 1240,
    actif: true,
  },
  {
    id: 2,
    nom: 'Dr. Omar Abdillahi',
    specialite: 'Pédiatrie',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    experience: '8 ans',
    langues: ['Français', 'Somali'],
    disponibilites: ['Lun', 'Mer', 'Ven'],
    horaires: '09h00 – 16h00',
    bio: "Expert en santé infantile, suivi de croissance et vaccinations. Reconnu pour sa patience avec les enfants.",
    rating: 4.9,
    consultations: 890,
    actif: true,
  },
  {
    id: 3,
    nom: 'Dr. Fatouma Warsama',
    specialite: 'Gynécologie',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    experience: '15 ans',
    langues: ['Français', 'Arabe'],
    disponibilites: ['Mar', 'Mer', 'Ven'],
    horaires: '08h30 – 15h30',
    bio: "Accompagnement de la femme à chaque étape de sa vie reproductive. Spécialisée en grossesse à risque.",
    rating: 4.7,
    consultations: 2100,
    actif: true,
  },
  {
    id: 4,
    nom: 'Dr. Yusuf Mohamad',
    specialite: 'Cardiologie',
    photo: 'https://randomuser.me/api/portraits/men/55.jpg',
    experience: '20 ans',
    langues: ['Français', 'Anglais', 'Arabe'],
    disponibilites: ['Lun', 'Jeu', 'Ven'],
    horaires: '10h00 – 18h00',
    bio: "Cardiologue interventionnel spécialisé dans les maladies cardiovasculaires et l'insuffisance cardiaque.",
    rating: 4.9,
    consultations: 3200,
    actif: true,
  },
]

export const APPOINTMENTS_INITIAL = [
  { id: uuidv4(), ref: 'RDV-2026-1001', patient: 'Hodan Ali', telephone: '+253 77 81 22 33', email: 'hodan@gmail.com', docteurId: 1, docteur: 'Dr. Amina Hassan', date: '2026-05-13', heure: '09h00', motif: 'Consultation générale', statut: 'confirmé',  createdAt: '2026-05-10' },
  { id: uuidv4(), ref: 'RDV-2026-1002', patient: 'Ibrahim Daud',  telephone: '+253 77 65 44 11', email: 'ibrahim@gmail.com', docteurId: 2, docteur: 'Dr. Omar Abdillahi', date: '2026-05-13', heure: '10h30', motif: 'Suivi pédiatrique',   statut: 'en attente', createdAt: '2026-05-10' },
  { id: uuidv4(), ref: 'RDV-2026-1003', patient: 'Mariam Guedi', telephone: '+253 77 99 00 55', email: 'mariam@gmail.com', docteurId: 3, docteur: 'Dr. Fatouma Warsama', date: '2026-05-14', heure: '08h30', motif: 'Bilan gynécologique', statut: 'confirmé',  createdAt: '2026-05-11' },
  { id: uuidv4(), ref: 'RDV-2026-1004', patient: 'Ahmed Osman',  telephone: '+253 77 12 34 56', email: 'ahmed@gmail.com', docteurId: 4, docteur: 'Dr. Yusuf Mohamad',  date: '2026-05-15', heure: '11h00', motif: 'Douleurs thoraciques', statut: 'annulé',   createdAt: '2026-05-11' },
  { id: uuidv4(), ref: 'RDV-2026-1005', patient: 'Safia Hassan', telephone: '+253 77 55 66 77', email: 'safia@gmail.com', docteurId: 1, docteur: 'Dr. Amina Hassan', date: '2026-05-16', heure: '14h00', motif: 'Renouvellement ordonnance', statut: 'en attente', createdAt: '2026-05-12' },
]

export const SPECIALITES = ['Toutes', 'Médecine générale', 'Pédiatrie', 'Gynécologie', 'Cardiologie']

export const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven']

export const CRENEAUX = ['08h00','08h30','09h00','09h30','10h00','10h30','11h00','11h30','14h00','14h30','15h00','15h30','16h00','16h30']

export const AVIS_MOCK = [
  { nom: 'Khadija A.', note: 5, commentaire: "Médecin très à l'écoute, j'ai été prise en charge rapidement.", date: '2026-04-20' },
  { nom: 'Mohamed I.', note: 4, commentaire: 'Très bon diagnostic, je recommande vivement.', date: '2026-04-15' },
  { nom: 'Hodan M.',   note: 5, commentaire: 'Professionnelle et bienveillante. La meilleure clinique de Djibouti.', date: '2026-03-30' },
]

export const ADMIN_CREDENTIALS = {
  email: 'admin@clinique-albaraka.dj',
  password: 'demo1234',
}

export const DOCTOR_CREDENTIALS = [
  { docteurId: 1, email: 'amina.hassan@clinique-albaraka.dj',    password: 'medecin1234' },
  { docteurId: 2, email: 'omar.abdillahi@clinique-albaraka.dj',  password: 'medecin1234' },
  { docteurId: 3, email: 'fatouma.warsama@clinique-albaraka.dj', password: 'medecin1234' },
  { docteurId: 4, email: 'yusuf.mohamad@clinique-albaraka.dj',   password: 'medecin1234' },
]
