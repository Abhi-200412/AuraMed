import React from 'react'

const ReportBuilder: React.FC = () => {
  return (
    <div className="mt-4 glass p-4 rounded">
      <h3>Report Builder</h3>
      <p className="text-slate-300">Auto-filled AI findings (placeholder). Export to PDF and sign digitally (UI only).</p>
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 glass rounded">Export to PDF</button>
        <button className="px-4 py-2 glass rounded">Sign</button>
      </div>
    </div>
  )
}

export default ReportBuilder
