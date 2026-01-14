import Link from 'next/link'

export default function DoctorSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p className="text-text-secondary mb-4">Settings page placeholder. Configure doctor preferences here.</p>
      <Link href="/doctor/dashboard" className="text-primary">← Back to Dashboard</Link>
    </div>
  )
}
