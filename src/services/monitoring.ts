// Monitoring & Analytics Service
// YA PEE E-commerce Platform

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

interface ErrorEvent {
  message: string
  stack?: string
  userId?: string
  url: string
  userAgent: string
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class MonitoringService {
  private metrics: PerformanceMetric[] = []
  private errors: ErrorEvent[] = []
  private isEnabled: boolean
  private sampleRate: number

  constructor() {
    // Using Vite's import.meta.env instead of process.env for browser compatibility
    this.isEnabled = (import.meta.env?.PROD || false) &&
                    (import.meta.env?.VITE_ENABLE_PERFORMANCE_MONITORING === 'true' || false)
    this.sampleRate = parseFloat(import.meta.env?.VITE_PERFORMANCE_SAMPLE_RATE || '0.1')
  }

  // Performance Monitoring
  trackPerformance(name: string, value: number, tags?: Record<string, string>) {
    if (!this.isEnabled) return

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags
    }

    this.metrics.push(metric)

    // Send to monitoring service (e.g., DataDog, New Relic, etc.)
    this.sendMetric(metric)
  }

  trackPageLoad() {
    if (!this.isEnabled) return

    // Track page load performance
    if (performance.timing) {
      const timing = performance.timing
      const loadTime = timing.loadEventEnd - timing.navigationStart

      this.trackPerformance('page_load_time', loadTime, {
        page: window.location.pathname,
        userAgent: navigator.userAgent
      })
    }
  }

  trackUserInteraction(action: string, element: string, duration?: number) {
    if (!this.isEnabled) return

    this.trackPerformance(`user_interaction_${action}`, duration || 0, {
      element,
      page: window.location.pathname
    })
  }

  trackAPIRequest(endpoint: string, method: string, duration: number, status: number) {
    if (!this.isEnabled) return

    this.trackPerformance('api_request_duration', duration, {
      endpoint,
      method,
      status: status.toString()
    })
  }

  // Error Tracking
  trackError(error: Error, context?: Record<string, any>) {
    const errorEvent: ErrorEvent = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      severity: this.determineSeverity(error)
    }

    if (context?.userId) {
      errorEvent.userId = context.userId
    }

    this.errors.push(errorEvent)
    this.sendError(errorEvent)
  }

  trackUnhandledError(message: string, source: string, lineno: number, colno: number) {
    const errorEvent: ErrorEvent = {
      message: `${message} at ${source}:${lineno}:${colno}`,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      severity: 'high'
    }

    this.errors.push(errorEvent)
    this.sendError(errorEvent)
  }

  private determineSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    const message = error.message.toLowerCase()

    if (message.includes('network') || message.includes('timeout')) {
      return 'medium'
    }
    if (message.includes('unauthorized') || message.includes('forbidden')) {
      return 'high'
    }
    if (error.stack?.includes('TypeError') || error.stack?.includes('ReferenceError')) {
      return 'high'
    }

    return 'medium'
  }

  // Analytics Integration
  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return

    // Send to analytics service (Google Analytics, Mixpanel, etc.)
    if (window.gtag) {
      window.gtag('event', eventName, properties)
    }

    // Also track internally
    this.trackPerformance(`custom_event_${eventName}`, 1, properties)
  }

  trackConversion(event: string, value?: number, currency?: string) {
    this.trackEvent(event, {
      event_category: 'conversion',
      value,
      currency: currency || 'VND'
    })
  }

  // User Behavior Tracking
  trackUserJourney(page: string, action: string, details?: Record<string, any>) {
    if (!this.isEnabled || Math.random() > this.sampleRate) return

    this.trackEvent('user_journey', {
      page,
      action,
      timestamp: Date.now(),
      ...details
    })
  }

  trackSearch(query: string, resultsCount: number, filters?: Record<string, any>) {
    this.trackEvent('search', {
      query,
      results_count: resultsCount,
      filters: JSON.stringify(filters)
    })
  }

  trackPurchase(orderId: string, total: number, items: any[]) {
    this.trackConversion('purchase', total, 'VND')

    this.trackEvent('ecommerce_purchase', {
      transaction_id: orderId,
      value: total,
      currency: 'VND',
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    })
  }

  // Data Export
  exportMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  exportErrors(): ErrorEvent[] {
    return [...this.errors]
  }

  // Service Communication
  private sendMetric(metric: PerformanceMetric) {
    // In production, send to your monitoring service
    console.log('📊 Metric:', metric)

    // Example: Send to DataDog, New Relic, etc.
    // fetch('/api/metrics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(metric)
    // })
  }

  private sendError(error: ErrorEvent) {
    // In production, send to error tracking service
    console.error('🚨 Error:', error)

    // Example: Send to Sentry, Rollbar, etc.
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(error)
    // })
  }

  // Cleanup old data
  cleanup(retentionHours: number = 24) {
    const cutoff = Date.now() - (retentionHours * 60 * 60 * 1000)

    this.metrics = this.metrics.filter(m => m.timestamp > cutoff)
    this.errors = this.errors.filter(e => e.timestamp > cutoff)
  }
}

// Global monitoring instance
export const monitoring = new MonitoringService()

// React Error Boundary Integration
export class MonitoringErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    monitoring.trackError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    })
  }

  render() {
    return this.props.children
  }
}

// Performance Hook
export function usePerformanceTracking() {
  React.useEffect(() => {
    monitoring.trackPageLoad()
  }, [])

  return {
    trackInteraction: monitoring.trackUserInteraction.bind(monitoring),
    trackEvent: monitoring.trackEvent.bind(monitoring),
    trackError: monitoring.trackError.bind(monitoring)
  }
}
