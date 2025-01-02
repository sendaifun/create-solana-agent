'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal, Send } from 'lucide-react'
import Link from 'next/link'

export default function Chat() {
  const [messages, setMessages] = useState<Array<{ role: string, content: string }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white font-mono flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Card className="w-full max-w-4xl mx-auto bg-[#1A1A1A] border-[#333] shadow-2xl">
          <CardHeader className="border-b border-[#333]">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <CardTitle className="text-[#1BE1FF] flex items-center gap-2">
                <Terminal size={18} />
                Solana Agent Terminal
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
              {messages.map((m, index) => (
                <div key={index} className={`${m.role === 'user' ? 'ml-auto' : ''} max-w-[80%]`}>
                  <div className={`
                    p-3 rounded 
                    ${m.role === 'user' 
                      ? 'bg-[#1BE1FF] text-black' 
                      : 'bg-[#2A2A2A] border border-[#333] text-[#19FFCE]'
                    }
                    font-mono text-sm
                  `}>
                    <div className="text-xs opacity-70 mb-1">
                      {m.role === 'user' ? '> user' : '> agent'}
                    </div>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="max-w-[80%]">
                  <div className="bg-[#2A2A2A] border border-[#333] p-3 rounded font-mono text-sm">
                    <div className="text-xs text-[#19FFCE] opacity-70 mb-1">
                      {'>'} agent
                    </div>
                    <div className="text-[#19FFCE] animate-pulse">
                      Computing response...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#333] p-4">
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your command..."
                className="flex-grow bg-[#2A2A2A] border-[#333] text-white font-mono placeholder:text-gray-500 focus:border-[#1BE1FF] focus:ring-1 focus:ring-[#1BE1FF]"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#1BE1FF] text-black hover:bg-[#19FFCE] transition-colors"
              >
                <Send size={18} />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
      <footer className="bg-[#1A1A1A] border-t border-[#333] py-4 text-center text-sm text-[#787B7E]">
        powered by{' '}
        <Link href="https://www.solanaagentkit.xyz/" className="text-[#1BE1FF] hover:underline" target="_blank" rel="noopener noreferrer">
          Solana Agent Kit
        </Link>
        {' '}by{' '}
        <Link href="https://x.com/sendaifun" className="text-[#1BE1FF] hover:underline" target="_blank" rel="noopener noreferrer">
          SEND AI
        </Link>
      </footer>
    </div>
  )
}

