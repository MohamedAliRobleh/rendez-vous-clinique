import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { format, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import Navbar        from '../components/layout/Navbar'
import Footer        from '../components/layout/Footer'
import StepIndicator from '../components/ui/StepIndicator'
import StarRating    from '../components/ui/StarRating'
import SuccessModal  from '../components/ui/SuccessModal'
import PageTransition from '../components/ui/PageTransition'
import { useApp }    from '../context/AppContext'
import { SPECIALITES, CRENEAUX } from '../data/mockData'

const JOURS_COURT = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
const SPECIALITE_COLORS = { 'Médecine générale': '#0A6E74', 'Pédiatrie': '#3B82F6', 'Gynécologie': '#EC4899', 'Cardiologie': '#EF4444' }

function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1))
}

export default function Appointment() {
  const [searchParams] = useSearchParams()
  const { doctors, addAppointment } = useApp()
  const navigate = useNavigate()

  const preSelectedId  = Number(searchParams.get('docteur'))
  const [currentStep,  setCurrentStep]  = useState(preSelectedId ? 2 : 1)
  const [selectedDoc,  setSelectedDoc]  = useState(preSelectedId ? doctors.find(d => d.id === preSelectedId) || null : null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [specialite,   setSpecialite]   = useState('Toutes')
  const [patientInfo,  setPatientInfo]  = useState({ prenom: '', nom: '', telephone: '', email: '', motif: '' })
  const [errors,       setErrors]       = useState({})
  const [successRdv,   setSuccessRdv]   = useState(null)

  const days = useMemo(() => getNext7Days(), [])

  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => d.actif !== false && (specialite === 'Toutes' || d.specialite === specialite))
  }, [doctors, specialite])

  const dayJour = (date) => JOURS_COURT[date.getDay()]

  const isDayAvailable = (date) => {
    if (!selectedDoc) return true
    return selectedDoc.disponibilites.includes(dayJour(date))
  }

  const isSlotAvailable = () => {
    if (!selectedDoc || !selectedDate) return false
    return selectedDoc.disponibilites.includes(dayJour(selectedDate))
  }

  const validate = () => {
    const e = {}
    if (!patientInfo.prenom.trim())    e.prenom    = 'Prénom requis'
    if (!patientInfo.nom.trim())       e.nom       = 'Nom requis'
    if (!patientInfo.telephone.trim()) e.telephone = 'Téléphone requis'
    if (!patientInfo.email.trim() || !/\S+@\S+\.\S+/.test(patientInfo.email)) e.email = 'Email valide requis'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const rdv = {
      id:        uuidv4(),
      ref:       `RDV-2026-${1000 + Math.floor(Math.random() * 9000)}`,
      patient:   `${patientInfo.prenom} ${patientInfo.nom}`,
      telephone: patientInfo.telephone,
      email:     patientInfo.email,
      motif:     patientInfo.motif,
      docteurId: selectedDoc.id,
      docteur:   selectedDoc.nom,
      date:      format(selectedDate, 'yyyy-MM-dd'),
      heure:     selectedTime,
      statut:    'en attente',
      createdAt: format(new Date(), 'yyyy-MM-dd'),
    }
    addAppointment(rdv)
    setSuccessRdv(rdv)
    toast.success(`Rendez-vous créé — ${rdv.ref}`)
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '10px 14px', border: `1.5px solid ${errors[field] ? 'var(--danger)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
    outline: 'none', background: '#fff', color: 'var(--text)', transition: 'var(--transition)',
  })

  return (
    <PageTransition>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 5% 80px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '1.9rem', color: 'var(--text)', textAlign: 'center', marginBottom: 8 }}>
            Prendre un rendez-vous
          </h1>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: 36 }}>
            Remplissez les 3 étapes pour réserver votre consultation.
          </p>

          <StepIndicator currentStep={currentStep} />

          <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>

            {/* ═══ ÉTAPE 1 : Choisir médecin ═══ */}
            {currentStep === 1 && (
              <div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                  {SPECIALITES.map(s => (
                    <button key={s} onClick={() => setSpecialite(s)} style={{
                      padding: '6px 16px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 600,
                      border: 'none', cursor: 'pointer', transition: 'var(--transition)',
                      background: specialite === s ? 'var(--primary)' : '#fff',
                      color: specialite === s ? '#fff' : 'var(--text-muted)',
                      boxShadow: specialite === s ? 'var(--glow-primary)' : '0 1px 4px rgba(0,0,0,0.08)',
                    }}>
                      {s}
                    </button>
                  ))}
                </div>

                <div className="row g-3">
                  {filteredDoctors.map(doctor => {
                    const isSelected = selectedDoc?.id === doctor.id
                    const color = SPECIALITE_COLORS[doctor.specialite] || 'var(--primary)'
                    return (
                      <div key={doctor.id} className="col-12 col-sm-6">
                        <div
                          data-testid={`doctor-card-${doctor.id}`}
                          className={isSelected ? 'selected' : ''}
                          onClick={() => setSelectedDoc(doctor)}
                          style={{
                            border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                            borderRadius: 'var(--radius)', padding: '16px', cursor: 'pointer',
                            background: isSelected ? 'var(--primary-bg)' : '#fff',
                            transition: 'var(--transition)', position: 'relative',
                            boxShadow: isSelected ? 'var(--glow-primary)' : 'none',
                          }}
                        >
                          {isSelected && (
                            <div style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FaCheck size={10} color="#fff" />
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <img src={doctor.photo} alt={doctor.nom} style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${color}` }} />
                            <div>
                              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: 'var(--text)', fontSize: '0.92rem' }}>{doctor.nom}</div>
                              <span style={{ background: `${color}18`, color, fontSize: '0.7rem', fontWeight: 700, padding: '1px 8px', borderRadius: 20 }}>{doctor.specialite}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                                <StarRating rating={doctor.rating} size={10} />
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{doctor.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
                  <button className="btn-primary-custom" disabled={!selectedDoc} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: selectedDoc ? 1 : 0.5 }} onClick={() => { if (selectedDoc) setCurrentStep(2) }}>
                    Suivant <FaArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* ═══ ÉTAPE 2 : Date & créneau ═══ */}
            {currentStep === 2 && (
              <div>
                <div className="card-premium" style={{ padding: '24px', marginBottom: 20 }}>
                  <h5 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, marginBottom: 4 }}>Choisissez une date</h5>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    Disponible les : <strong style={{ color: 'var(--primary)' }}>{selectedDoc?.disponibilites.join(', ')}</strong>
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {days.map((date, i) => {
                      const available = isDayAvailable(date)
                      const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                      return (
                        <button
                          key={i}
                          disabled={!available}
                          onClick={() => { if (available) { setSelectedDate(date); setSelectedTime('') } }}
                          style={{
                            padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${isSelected ? 'var(--primary)' : available ? 'var(--border)' : 'var(--border)'}`,
                            background: isSelected ? 'var(--primary)' : available ? '#fff' : '#f8f9fa',
                            color: isSelected ? '#fff' : available ? 'var(--text)' : 'var(--text-muted)',
                            cursor: available ? 'pointer' : 'not-allowed', opacity: available ? 1 : 0.4,
                            transition: 'var(--transition)', textAlign: 'center', minWidth: 64,
                            fontFamily: 'Nunito, sans-serif', fontWeight: isSelected ? 700 : 500,
                          }}
                        >
                          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{JOURS_COURT[date.getDay()]}</div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{format(date, 'd')}</div>
                          <div style={{ fontSize: '0.68rem', opacity: 0.7 }}>{format(date, 'MMM', { locale: fr })}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div className="card-premium" style={{ padding: '24px' }}>
                    <h5 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, marginBottom: 16 }}>Choisissez un créneau</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
                      {CRENEAUX.map(heure => {
                        const available = isSlotAvailable()
                        const isSelected = selectedTime === heure
                        return (
                          <button
                            key={heure}
                            disabled={!available}
                            onClick={() => { if (available) setSelectedTime(heure) }}
                            style={{
                              padding: '9px 6px', borderRadius: 8,
                              border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                              background: isSelected ? 'var(--primary)' : '#fff',
                              color: isSelected ? '#fff' : available ? 'var(--text)' : 'var(--text-muted)',
                              cursor: available ? 'pointer' : 'not-allowed',
                              opacity: available ? 1 : 0.35,
                              fontSize: '0.82rem', fontWeight: isSelected ? 700 : 500,
                              transition: 'var(--transition)',
                            }}
                          >
                            {heure}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1.5px solid var(--border)', borderRadius: 50, padding: '9px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.88rem' }} onClick={() => setCurrentStep(1)}>
                    <FaArrowLeft size={12} /> Retour
                  </button>
                  <button className="btn-primary-custom" disabled={!selectedDate || !selectedTime} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: (selectedDate && selectedTime) ? 1 : 0.5 }} onClick={() => { if (selectedDate && selectedTime) setCurrentStep(3) }}>
                    Suivant <FaArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* ═══ ÉTAPE 3 : Informations patient ═══ */}
            {currentStep === 3 && (
              <div>
                {/* Récapitulatif */}
                <div style={{ background: 'var(--primary-bg)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 24, border: '1px solid rgba(10,110,116,0.15)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10 }}>Votre réservation</div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <img src={selectedDoc?.photo} alt="" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                    <div>
                      <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: 'var(--text)', fontSize: '0.95rem' }}>{selectedDoc?.nom}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })} à {selectedTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulaire */}
                <div className="card-premium" style={{ padding: '28px' }}>
                  <h5 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, marginBottom: 20 }}>Vos informations</h5>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Prénom *</label>
                      <input data-testid="prenom-input" value={patientInfo.prenom} onChange={e => setPatientInfo(p => ({...p, prenom: e.target.value}))} style={inputStyle('prenom')} placeholder="Hodan" />
                      {errors.prenom && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.prenom}</p>}
                    </div>
                    <div className="col-12 col-sm-6">
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Nom *</label>
                      <input value={patientInfo.nom} onChange={e => setPatientInfo(p => ({...p, nom: e.target.value}))} style={inputStyle('nom')} placeholder="Ali" />
                      {errors.nom && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.nom}</p>}
                    </div>
                    <div className="col-12 col-sm-6">
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Téléphone *</label>
                      <input data-testid="telephone-input" value={patientInfo.telephone} onChange={e => setPatientInfo(p => ({...p, telephone: e.target.value}))} style={inputStyle('telephone')} placeholder="+253 77 00 11 22" />
                      {errors.telephone && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.telephone}</p>}
                    </div>
                    <div className="col-12 col-sm-6">
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Email *</label>
                      <input data-testid="email-input" value={patientInfo.email} onChange={e => setPatientInfo(p => ({...p, email: e.target.value}))} style={inputStyle('email')} placeholder="hodan@gmail.com" type="email" />
                      {errors.email && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.email}</p>}
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Motif de consultation</label>
                      <textarea value={patientInfo.motif} onChange={e => setPatientInfo(p => ({...p, motif: e.target.value}))} rows={3} style={{ ...inputStyle('motif'), resize: 'none' }} placeholder="Décrivez brièvement le motif de votre visite..." />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1.5px solid var(--border)', borderRadius: 50, padding: '9px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.88rem' }} onClick={() => setCurrentStep(2)}>
                    <FaArrowLeft size={12} /> Retour
                  </button>
                  <button className="btn-accent-custom" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px' }} onClick={handleSubmit}>
                    <FaCheck size={13} />
                    Confirmer le rendez-vous
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {successRdv && <SuccessModal rdv={successRdv} onClose={() => { setSuccessRdv(null); navigate('/') }} />}

      <Footer />
    </PageTransition>
  )
}
