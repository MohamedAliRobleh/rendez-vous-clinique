import { useState } from 'react'
import { motion } from 'framer-motion'
import { Modal, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit, FaPowerOff } from 'react-icons/fa'
import StarRating from '../../components/ui/StarRating'
import { useApp }  from '../../context/AppContext'
import { JOURS }   from '../../data/mockData'

const SPECIALITES_OPTIONS = ['Médecine générale', 'Pédiatrie', 'Gynécologie', 'Cardiologie', 'Autre']
const LANGUES_OPTIONS = ['Français', 'Arabe', 'Somali', 'Anglais']

const emptyForm = { nom: '', specialite: 'Médecine générale', experience: '', bio: '', horaires: '', disponibilites: [], langues: [], photo: '' }

export default function AdminDoctors() {
  const { doctors, addDoctor, updateDoctor, toggleDoctorActive } = useApp()
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm]             = useState(emptyForm)

  const openAdd = () => {
    setEditTarget(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (doctor) => {
    setEditTarget(doctor)
    setForm({
      nom:            doctor.nom,
      specialite:     doctor.specialite,
      experience:     doctor.experience,
      bio:            doctor.bio || '',
      horaires:       doctor.horaires || '',
      disponibilites: [...doctor.disponibilites],
      langues:        [...doctor.langues],
      photo:          doctor.photo || '',
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.nom.trim() || !form.specialite) {
      toast.error('Nom et spécialité sont requis')
      return
    }
    if (editTarget) {
      updateDoctor(editTarget.id, form)
      toast.success(`${form.nom} mis à jour`)
    } else {
      addDoctor({ ...form, photo: form.photo || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg` })
      toast.success(`${form.nom} ajouté`)
    }
    setShowModal(false)
  }

  const toggleJour = (j) => setForm(f => ({
    ...f,
    disponibilites: f.disponibilites.includes(j)
      ? f.disponibilites.filter(d => d !== j)
      : [...f.disponibilites, j],
  }))

  const toggleLangue = (l) => setForm(f => ({
    ...f,
    langues: f.langues.includes(l)
      ? f.langues.filter(x => x !== l)
      : [...f.langues, l],
  }))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '1.6rem', color: 'var(--text)', marginBottom: 2 }}>Médecins</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{doctors.length} médecin{doctors.length > 1 ? 's' : ''} enregistré{doctors.length > 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary-custom" style={{ display: 'flex', alignItems: 'center', gap: 7 }} onClick={openAdd}>
          <FaPlus size={12} /> Ajouter un médecin
        </button>
      </div>

      {/* Tableau */}
      <div className="card-premium" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                {['Médecin', 'Spécialité', 'Expérience', 'Disponibilités', 'Rating', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doctors.map((d, i) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--bg)', opacity: d.actif === true ? 1 : 0.5 }}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={d.photo} alt={d.nom} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-bg)', flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>{d.nom}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{d.specialite}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{d.experience}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {d.disponibilites.map(j => (
                        <span key={j} style={{ background: 'var(--primary-bg)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, padding: '1px 7px', borderRadius: 20 }}>{j}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <StarRating rating={d.rating} size={11} />
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>{d.rating}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                      background: d.actif === true ? 'rgba(39,174,96,0.12)' : 'rgba(224,92,92,0.1)',
                      color: d.actif === true ? '#27AE60' : 'var(--danger)',
                    }}>
                      {d.actif === true ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button title="Modifier" onClick={() => openEdit(d)} style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--primary-bg)', border: '1px solid rgba(10,110,116,0.2)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaEdit size={11} />
                      </button>
                      <button title={d.actif === true ? 'Désactiver' : 'Activer'} onClick={() => { toggleDoctorActive(d.id); toast.info(`${d.nom} ${d.actif === true ? 'désactivé' : 'activé'}`) }} style={{ width: 30, height: 30, borderRadius: 8, background: d.actif === true ? 'rgba(244,168,35,0.1)' : 'rgba(39,174,96,0.1)', border: `1px solid ${d.actif === true ? 'rgba(244,168,35,0.3)' : 'rgba(39,174,96,0.3)'}`, color: d.actif === true ? '#C47D00' : '#27AE60', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaPowerOff size={11} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout / Modification */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ borderBottom: '1px solid var(--border)', padding: '18px 24px' }}>
          <Modal.Title style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>
            {editTarget ? `Modifier — ${editTarget.nom}` : 'Ajouter un médecin'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '24px' }}>
          <div className="row g-3">
            <div className="col-12 col-sm-6">
              <Form.Label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Nom complet *</Form.Label>
              <Form.Control value={form.nom} onChange={e => setForm(f => ({...f, nom: e.target.value}))} placeholder="Dr. Prénom Nom" style={{ borderRadius: 8, borderColor: 'var(--border)', fontSize: '0.9rem' }} />
            </div>
            <div className="col-12 col-sm-6">
              <Form.Label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Spécialité *</Form.Label>
              <Form.Select value={form.specialite} onChange={e => setForm(f => ({...f, specialite: e.target.value}))} style={{ borderRadius: 8, borderColor: 'var(--border)', fontSize: '0.9rem' }}>
                {SPECIALITES_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </Form.Select>
            </div>
            <div className="col-12 col-sm-6">
              <Form.Label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Expérience</Form.Label>
              <Form.Control value={form.experience} onChange={e => setForm(f => ({...f, experience: e.target.value}))} placeholder="Ex : 10 ans" style={{ borderRadius: 8, borderColor: 'var(--border)', fontSize: '0.9rem' }} />
            </div>
            <div className="col-12 col-sm-6">
              <Form.Label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Horaires</Form.Label>
              <Form.Control value={form.horaires} onChange={e => setForm(f => ({...f, horaires: e.target.value}))} placeholder="Ex : 08h00 – 17h00" style={{ borderRadius: 8, borderColor: 'var(--border)', fontSize: '0.9rem' }} />
            </div>
            <div className="col-12">
              <Form.Label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Biographie</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))} placeholder="Description courte du médecin..." style={{ borderRadius: 8, borderColor: 'var(--border)', fontSize: '0.9rem', resize: 'none' }} />
            </div>
            <div className="col-12">
              <Form.Label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Jours disponibles</Form.Label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {JOURS.map(j => (
                  <button key={j} type="button" onClick={() => toggleJour(j)} style={{
                    padding: '5px 14px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                    background: form.disponibilites.includes(j) ? 'var(--primary)' : 'var(--bg)',
                    color: form.disponibilites.includes(j) ? '#fff' : 'var(--text-muted)',
                    transition: 'var(--transition)',
                  }}>
                    {j}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-12">
              <Form.Label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Langues parlées</Form.Label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {LANGUES_OPTIONS.map(l => (
                  <button key={l} type="button" onClick={() => toggleLangue(l)} style={{
                    padding: '5px 14px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                    background: form.langues.includes(l) ? 'var(--primary-light)' : 'var(--bg)',
                    color: form.langues.includes(l) ? '#fff' : 'var(--text-muted)',
                    transition: 'var(--transition)',
                  }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid var(--border)', padding: '14px 24px', gap: 10 }}>
          <button style={{ padding: '9px 20px', border: '1.5px solid var(--border)', borderRadius: 50, background: '#fff', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }} onClick={() => setShowModal(false)}>
            Annuler
          </button>
          <button className="btn-primary-custom" onClick={handleSave}>
            {editTarget ? 'Enregistrer les modifications' : 'Ajouter le médecin'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
