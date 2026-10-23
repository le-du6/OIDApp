import { describe, it, expect } from 'vite-plus/test'
import { render, screen, cleanup } from '@testing-library/react'
import { HttpRequestView } from './HttpRequestView'
import { wireRequest } from '../../lib/http-view'
describe('HTTP brut et explications', () => {
  it('conserve le corps brut quand des annotations sont présentes', () => {
    cleanup()
    render(
      <HttpRequestView
        exchange={{
          channel: 'back',
          request: {
            method: 'POST',
            url: 'https://as.example/token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: {
              type: 'form',
              content: 'client_id=app&code=a%2Bb',
              params: [{ name: 'code', value: 'a+b', description: 'Le code reçu au callback' }],
            },
          },
        }}
      />,
    )
    expect(screen.getByText(/client_id=app&code=a%2Bb/)).toBeTruthy()
    expect(screen.getByText('Le code reçu au callback')).toBeTruthy()
  })
  it('encode la query sans ajouter un faux GET à une invocation', () => {
    expect(
      wireRequest({
        channel: 'front',
        request: {
          method: 'INVOKE',
          url: 'openid4vp://',
          params: [{ name: 'nonce', value: 'a+b&c' }],
        },
      }),
    ).toBe('openid4vp://?nonce=a%2Bb%26c')
  })
})
