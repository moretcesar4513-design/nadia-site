export default function Legal() {
  return (
    <div style={{
      background: '#0d0608',
      color: '#fff',
      fontFamily: 'DM Sans, sans-serif',
      minHeight: '100vh',
      padding: '80px 24px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(232,50,30,0.1)',
          border: '1px solid rgba(232,50,30,0.25)',
          borderRadius: 20,
          padding: '4px 14px',
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#E8321E',
          marginBottom: 24,
        }}>Légal</div>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Politique de confidentialité</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 48 }}>Dernière mise à jour : juin 2026</p>
        {[
          { title: '1. Responsable du traitement', content: 'César Moret — NADIA, Bordeaux, France.' },
          { title: '2. Données collectées', content: "Données de navigation (adresse IP, pages visitées, durée de visite via Meta Pixel) ; données de formulaire (nom, prénom, email, téléphone, rôle professionnel) lors de la prise de rendez-vous ; données de réservation via Cal.com." },
          { title: '3. Finalités du traitement', content: "Gérer les demandes de rendez-vous, vous recontacter dans le cadre de notre service commercial, mesurer les performances de nos campagnes publicitaires via Meta Pixel." },
          { title: '4. Base légale', content: "Votre consentement lors de la soumission d'un formulaire, notre intérêt légitime à améliorer nos services." },
          { title: '5. Outils tiers', content: 'Meta Pixel (Facebook) pour le suivi publicitaire. Cal.com pour la gestion des rendez-vous.' },
          { title: '6. Durée de conservation', content: 'Données commerciales conservées 3 ans. Données de navigation via Meta Pixel conservées 13 mois.' },
          { title: '7. Vos droits', content: "Conformément au RGPD, vous disposez des droits d'accès, rectification, effacement, limitation, portabilité et opposition. Réclamation possible auprès de la CNIL (cnil.fr)." },
          { title: '8. Cookies', content: "Notre site utilise des cookies techniques et publicitaires. Gérez vos préférences via les paramètres de votre navigateur." },
          { title: '9. Modifications', content: "Nous nous réservons le droit de modifier cette politique à tout moment." },
        ].map((s) => (
          <div key={s.title}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 40, marginBottom: 12, color: '#fff' }}>{s.title}</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
