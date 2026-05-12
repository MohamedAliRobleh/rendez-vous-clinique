export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { type, rdv, docteur, statut } = req.body

  if (!type || !rdv) {
    return res.status(400).json({ error: 'Missing type or rdv' })
  }

  const apiKey      = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@clinique-albaraka.dj'
  const adminEmail  = process.env.ADMIN_EMAIL || 'admin@clinique-albaraka.dj'

  const emails = buildEmails({ type, rdv, docteur, statut, senderEmail, adminEmail })

  const results = await Promise.allSettled(
    emails.map(email =>
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(email),
      })
    )
  )

  const failed = results.filter(r => r.status === 'rejected')
  if (failed.length > 0) {
    console.error('Brevo errors:', failed)
  }

  return res.status(200).json({ ok: true, sent: results.length - failed.length })
}

function buildEmails({ type, rdv, docteur, statut, senderEmail, adminEmail }) {
  const sender = { name: 'Clinique Al-Baraka', email: senderEmail }

  if (type === 'nouveau_rdv') {
    return [
      // Email au médecin (adminEmail en démo)
      {
        sender,
        to: [{ email: adminEmail, name: docteur?.nom || 'Médecin' }],
        subject: `Nouveau rendez-vous — ${rdv.ref}`,
        htmlContent: emailMedecinNouveauRdv(rdv, docteur),
      },
      // Email de confirmation au patient
      {
        sender,
        to: [{ email: rdv.email, name: rdv.patient }],
        subject: `Votre rendez-vous ${rdv.ref} est enregistré ✓`,
        htmlContent: emailPatientConfirmation(rdv, docteur),
      },
    ]
  }

  if (type === 'statut_change') {
    return [
      {
        sender,
        to: [{ email: rdv.email, name: rdv.patient }],
        subject: `Votre RDV ${rdv.ref} a été ${statut === 'confirmé' ? 'confirmé ✅' : 'annulé ❌'}`,
        htmlContent: emailPatientStatutChange(rdv, statut),
      },
    ]
  }

  return []
}

function emailMedecinNouveauRdv(rdv, docteur) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0A6E74,#12A8B0);padding:28px 32px;text-align:center;">
      <h1 style="color:#fff;font-size:20px;margin:0;font-weight:900;">🏥 Clinique Al-Baraka</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Nouveau rendez-vous enregistré</p>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#0A6E74;font-size:15px;font-weight:bold;margin-bottom:6px;">${docteur?.nom || 'Docteur'},</p>
      <p style="color:#475569;font-size:14px;margin-bottom:20px;">Un nouveau rendez-vous a été pris pour vous :</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:18px 22px;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;width:130px;font-weight:600;">Référence</td><td style="padding:5px 0;font-weight:700;color:#0A6E74;font-size:13px;">${rdv.ref}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Patient</td><td style="padding:5px 0;font-weight:700;color:#1e293b;font-size:13px;">${rdv.patient}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Téléphone</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.telephone}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Date & heure</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.date} à ${rdv.heure}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Motif</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.motif || 'Non précisé'}</td></tr>
        </table>
      </div>
      <p style="color:#94a3b8;font-size:11px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:8px;">
        Clinique Al-Baraka · Djibouti · admin@clinique-albaraka.dj
      </p>
    </div>
  </div>
</body>
</html>`
}

function emailPatientConfirmation(rdv, docteur) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0A6E74,#12A8B0);padding:28px 32px;text-align:center;">
      <h1 style="color:#fff;font-size:20px;margin:0;font-weight:900;">🏥 Clinique Al-Baraka</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Confirmation de rendez-vous</p>
      </div>
    <div style="padding:28px 32px;">
      <p style="color:#0A6E74;font-size:15px;font-weight:bold;margin-bottom:6px;">Bonjour ${rdv.patient},</p>
      <p style="color:#475569;font-size:14px;margin-bottom:20px;">Votre rendez-vous a bien été enregistré. Voici votre récapitulatif :</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:18px 22px;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;width:130px;font-weight:600;">Référence</td><td style="padding:5px 0;font-weight:700;color:#0A6E74;font-size:13px;">${rdv.ref}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Médecin</td><td style="padding:5px 0;font-weight:700;color:#1e293b;font-size:13px;">${docteur?.nom || rdv.docteur}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Spécialité</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${docteur?.specialite || ''}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Date & heure</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.date} à ${rdv.heure}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Motif</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.motif || 'Non précisé'}</td></tr>
        </table>
      </div>
      <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
        <p style="color:#92400e;font-size:12px;margin:0;">⏳ Votre rendez-vous est <strong>en attente de confirmation</strong> par l'équipe médicale. Vous recevrez un email dès que le statut change.</p>
      </div>
      <p style="color:#94a3b8;font-size:11px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:8px;">
        Clinique Al-Baraka · Djibouti · Pour toute question : admin@clinique-albaraka.dj
      </p>
    </div>
  </div>
</body>
</html>`
}

function emailPatientStatutChange(rdv, statut) {
  const isConfirme = statut === 'confirmé'
  const couleur   = isConfirme ? '#0A6E74' : '#dc2626'
  const bgCouleur = isConfirme ? '#f0fdf4' : '#fef2f2'
  const borderCouleur = isConfirme ? '#bbf7d0' : '#fecaca'
  const emoji = isConfirme ? '✅' : '❌'

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,${couleur},${isConfirme ? '#12A8B0' : '#ef4444'});padding:28px 32px;text-align:center;">
      <h1 style="color:#fff;font-size:20px;margin:0;font-weight:900;">🏥 Clinique Al-Baraka</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Mise à jour de votre rendez-vous</p>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:${couleur};font-size:15px;font-weight:bold;margin-bottom:6px;">Bonjour ${rdv.patient},</p>
      <p style="color:#475569;font-size:14px;margin-bottom:20px;">
        Votre rendez-vous <strong>${rdv.ref}</strong> a été <strong>${statut}</strong> ${emoji}
      </p>
      <div style="background:${bgCouleur};border:1px solid ${borderCouleur};border-radius:10px;padding:18px 22px;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;width:130px;font-weight:600;">Référence</td><td style="padding:5px 0;font-weight:700;color:${couleur};font-size:13px;">${rdv.ref}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Médecin</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.docteur}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Date & heure</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.date} à ${rdv.heure}</td></tr>
        </table>
      </div>
      ${isConfirme
        ? '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;margin-bottom:20px;"><p style="color:#065f46;font-size:12px;margin:0;">✅ Votre rendez-vous est confirmé. Présentez-vous à la clinique à l\'heure indiquée. Pensez à apporter votre carte de santé.</p></div>'
        : '<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;margin-bottom:20px;"><p style="color:#991b1b;font-size:12px;margin:0;">❌ Votre rendez-vous a été annulé. Vous pouvez en prendre un nouveau sur notre site ou nous contacter.</p></div>'
      }
      <p style="color:#94a3b8;font-size:11px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:8px;">
        Clinique Al-Baraka · Djibouti · admin@clinique-albaraka.dj
      </p>
    </div>
  </div>
</body>
</html>`
}
