'use client'
import { useEffect } from 'react'

export function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem('session_tracked')) return
      sessionStorage.setItem('session_tracked', '1')
      fetch('/api/analytics/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }).catch(() => {})
    } catch {}
  }, [])
  return null
}
