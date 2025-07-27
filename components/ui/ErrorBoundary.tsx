'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Логирование ошибки (можно отправить на сервер)
    if (typeof window !== 'undefined') {
      try {
        const errorLog = {
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        }
        
        // Сохраняем в localStorage для отладки
        const existingLogs = JSON.parse(localStorage.getItem('error-logs') || '[]')
        existingLogs.push(errorLog)
        
        // Храним только последние 10 ошибок
        if (existingLogs.length > 10) {
          existingLogs.splice(0, existingLogs.length - 10)
        }
        
        localStorage.setItem('error-logs', JSON.stringify(existingLogs))
      } catch (e) {
        console.error('Failed to log error:', e)
      }
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Кастомный fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-university-background p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-danger" />
              <h1 className="mt-4 text-xl font-semibold text-gray-900">
                Что-то пошло не так
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Произошла ошибка при загрузке карты. Попробуйте обновить страницу или повторить попытку позже.
              </p>
            </div>

            {/* Детали ошибки в режиме разработки */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 rounded bg-gray-50 p-3">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  Детали ошибки (только в разработке)
                </summary>
                <div className="mt-2 text-xs text-gray-600">
                  <p className="font-medium">{this.state.error.name}: {this.state.error.message}</p>
                  {this.state.error.stack && (
                    <pre className="mt-2 overflow-auto whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Действия */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={this.handleReset}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-university-primary px-4 py-2 text-sm font-medium text-white hover:bg-university-primary-dark focus:outline-none focus:ring-2 focus:ring-university-primary focus:ring-offset-2"
              >
                Попробовать снова
              </button>
              <button
                onClick={this.handleReload}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-university-primary focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" />
                Обновить страницу
              </button>
            </div>

            {/* Контактная информация */}
            <div className="mt-4 rounded-md bg-blue-50 p-3">
              <p className="text-xs text-blue-800">
                Если проблема повторяется, пожалуйста, сообщите об этом администраторам.
                Включите информацию о том, что вы делали перед появлением ошибки.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 