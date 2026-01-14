import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/analyze', async ({ request }) => {
    try {
      const formData = await request.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return HttpResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      // Simulate AI analysis
      await new Promise((r) => setTimeout(r, 2000))

      const hasAnomaly = Math.random() > 0.65
      const severity = hasAnomaly
        ? (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)]
        : 'none'

      return HttpResponse.json({
        success: true,
        analysis: {
          filename: file.name,
          filesize: file.size,
          fileType: file.type,
          anomalyDetected: hasAnomaly,
          confidenceScore: Math.round(Math.random() * 40 + 60),
          findings: hasAnomaly
            ? `Potential structural abnormality detected. ${severity} priority findings requiring clinical correlation.`
            : 'Scan appears normal. No significant anomalies detected.',
          severity,
          recommendations: hasAnomaly
            ? [
                'Obtain additional imaging for correlation',
                'Clinical correlation recommended',
                'Consider specialist consultation',
              ]
            : [
                'Continue routine monitoring',
                'Schedule next routine screening per guidelines',
              ],
        },
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      return HttpResponse.json(
        { error: 'Failed to analyze image' },
        { status: 500 }
      )
    }
  }),

  http.post('/api/chat', async ({ request }) => {
    try {
      const body = (await request.json()) as { message: string }
      const { message } = body

      if (!message) {
        return HttpResponse.json({ error: 'No message provided' }, { status: 400 })
      }

      // Simulate conversational AI response
      await new Promise((r) => setTimeout(r, 1000))

      const responses = [
        'I understand your concern. Your healthcare team is carefully reviewing your imaging to provide you with the best care plan. If you\'d like, we can discuss what to expect next.',
        'It\'s completely normal to feel this way. Many patients experience similar concerns. Remember that early detection often leads to better outcomes.',
        'Thank you for sharing that. Let\'s focus on what we can do moving forward. Your doctor will discuss the findings with you and explain your care options.',
        'I\'m here to support you. If you have specific questions about your results or treatment options, I\'m happy to help clarify things.',
      ]

      const responseText = responses[Math.floor(Math.random() * responses.length)]
      const needsEscalation = [
        'emergency',
        'severe pain',
        'chest pain',
        'cannot breathe',
      ].some((keyword) => message.toLowerCase().includes(keyword))

      return HttpResponse.json({
        success: true,
        response: {
          message: responseText,
          confidence: 0.85,
          needsEscalation,
          timestamp: new Date().toISOString(),
        },
      })
    } catch (error) {
      return HttpResponse.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      )
    }
  }),

  http.post('/api/report', async () => {
    await new Promise((r) => setTimeout(r, 400))
    return HttpResponse.json({ ok: true })
  }),
]
