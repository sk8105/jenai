"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Send, Upload, X } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

type Conversation = {
  id: number
  title: string
  messages: Message[]
}

export default function ChatUI() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      title: "React Hooks Discussion",
      messages: [
        { role: "assistant", content: "Hello! How can I assist you today?" },
        { role: "user", content: "Hi there! I have a question about React hooks." },
        { role: "assistant", content: "Sure, I'd be happy to help with React hooks. What specific question do you have?" },
      ],
    },
  ])
  const [selectedConversation, setSelectedConversation] = useState<number>(1)
  const [inputMessage, setInputMessage] = useState("")
  const [selectedModel, setSelectedModel] = useState("llama-6.7b")
  const [accuracy, setAccuracy] = useState(0.7)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (conv.id === selectedConversation) {
            const updatedMessages = [...conv.messages, { role: "user", content: inputMessage }]
            const updatedTitle = conv.messages.length === 0 ? getConversationTitle(inputMessage) : conv.title
            return { ...conv, messages: updatedMessages, title: updatedTitle }
          }
          return conv
        })
      })
      setInputMessage("")
      // Here you would typically send the message to your AI backend and handle the response
    }
  }

  const getConversationTitle = (message: string): string => {
    const words = message.split(' ').slice(0, 3).join(' ')
    return words.length > 20 ? words.substring(0, 20) + '...' : words
  }

  const handleNewConversation = () => {
    const newId = Math.max(...conversations.map(c => c.id), 0) + 1
    const newConversation: Conversation = {
      id: newId,
      title: "New Conversation",
      messages: [],
    }
    setConversations([...conversations, newConversation])
    setSelectedConversation(newId)
  }

  const handleRemoveConversation = (id: number) => {
    setConversations(prevConversations => prevConversations.filter(conv => conv.id !== id))
    if (selectedConversation === id) {
      setSelectedConversation(conversations[conversations.length - 2]?.id || 0)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Here you would typically handle the file upload to your backend
    }
  }

  return (
    <div className="flex flex-col h-full rounded-lg shadow-lg">
      {/* Chat Header with Settings and New Conversation Button */}
      <div className="border-b border-gray-200 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="model-select" className="text-sm font-medium">
                Model:
              </Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger id="model-select" className="w-[140px]">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama-6.7b">LLaMA 6.7B</SelectItem>
                  <SelectItem value="llama-13b">LLaMA 13B</SelectItem>
                  <SelectItem value="llama-32.5b">LLaMA 32.5B</SelectItem>
                  <SelectItem value="llama-65.7b">LLaMA 65.2B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="accuracy" className="text-sm font-medium">
                Accuracy:
              </Label>
              <Slider
                id="accuracy"
                min={0}
                max={1}
                step={0.1}
                value={[accuracy]}
                onValueChange={(value) => setAccuracy(value[0])}
                className="w-[100px]"
              />
              <span className="text-sm font-medium">{accuracy.toFixed(1)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="file-upload" className="text-sm font-medium cursor-pointer">
                <Upload className="w-4 h-4 mr-2 inline-block" />
                Upload
              </Label>
              <Input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
              {uploadedFile && <span className="text-sm text-gray-600">{uploadedFile.name}</span>}
            </div>
          </div>
          <Button onClick={handleNewConversation} variant="outline" size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Conversation
          </Button>
        </div>
      </div>

      {/* Conversation History */}
      <ScrollArea className="border-b border-gray-200 p-2 h-16">
        <div className="flex space-x-2">
          {conversations.map((conv) => (
            <div key={conv.id} className="flex items-center">
              <Button
                variant={selectedConversation === conv.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedConversation(conv.id)}
                className="text-left truncate max-w-[150px]"
              >
                {conv.title}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveConversation(conv.id)}
                className="ml-1 p-0 h-6 w-6"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove conversation</span>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Chat Messages */}
      <ScrollArea className="flex-grow p-4 space-y-4">
        {conversations
          .find((conv) => conv.id === selectedConversation)
          ?.messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-start space-x-2 max-w-[70%]">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={
                      msg.role === "user"
                        ? "/placeholder-user.jpg"
                        : "https://api.dicebear.com/6.x/bottts/svg?seed=assistant"
                    }
                  />
                  <AvatarFallback>{msg.role === "user" ? "CA" : "A"}</AvatarFallback>
                </Avatar>
                <div
                  className={`p-3 rounded-lg ${
                    msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="relative">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="pr-12 resize-none"
            rows={3}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="absolute right-2 bottom-2"
            disabled={!inputMessage.trim()}
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}