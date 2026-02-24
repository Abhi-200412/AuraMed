import React from 'react'

const AnalysisPanel: React.FC = () => {
  const predictions = [
    { name: 'Condition A', p: 0.68 },
    { name: 'Condition B', p: 0.22 },
    { name: 'Condition C', p: 0.1 },
  ]

  return (
    <div className="mt-4 glass p-4 rounded">
      <h3 className="mb-2">AI Medical Analysis Panel</h3>
      <div className="space-y-3">
        {predictions.map((pred) => (
          <div key={pred.name} className="">
            <div className="flex justify-between text-sm text-slate-300">
              <div>{pred.name}</div>
              <div>{Math.round(pred.p * 100)}%</div>
            </div>
            <div className="w-full bg-white/5 h-2 rounded mt-1">
              <div style={{ width: `${pred.p * 100}%` }} className="h-2 bg-cyan-500 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h4 className="text-sm">Annotations</h4>
        <div className="mt-2 text-slate-300 text-sm">Add anatomical annotations and notes here (UI only).</div>
      </div>
    </div>
  )
}

export default AnalysisPanel

