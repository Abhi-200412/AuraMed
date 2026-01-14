import { redirect } from 'next/navigation'

export default function DoctorIndexPage() {
  // Redirect /doctor to the dashboard
  redirect('/doctor/dashboard')
}
