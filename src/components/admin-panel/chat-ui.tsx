'use client'

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Send, Upload, X, Edit, Trash, Copy, Check, Loader2 } from "lucide-react"
import { sendChatQuery } from '@/services/chat'
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { SunSnow, UserSearch } from "lucide-react";

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type Conversation = {
  id: number
  title: string
  messages: Message[]
  inputMessage: string
  uploadedFile: File | null
}

export default function ChatUI() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      title: "How can I assist you today",
      messages: [
        { id: "1", role: "assistant", content: "Hello! How can I assist you today?" },
      ],
      inputMessage: "",
      uploadedFile: null
    }
  ])
  const [selectedConversation, setSelectedConversation] = useState<number>(1)
  const [selectedModel, setSelectedModel] = useState("llama-3")
  const [accuracy, setAccuracy] = useState(0.7)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatScrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTop = chatScrollAreaRef.current.scrollHeight
    }
  }, [conversations])

  const handleSendMessage = async () => {
    const currentConversation = conversations.find(conv => conv.id === selectedConversation)
    if (!currentConversation) return

    if (currentConversation.inputMessage.trim() || currentConversation.uploadedFile) {
      setIsLoading(true)
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (conv.id === selectedConversation) {
            const newMessage: Message = { id: Date.now().toString(), role: "user", content: conv.inputMessage };
            const updatedMessages = [...conv.messages, newMessage];
            const updatedTitle = conv.messages.length === 0 ? getConversationTitle(conv.inputMessage) : conv.title;
            return { ...conv, messages: updatedMessages, title: updatedTitle, inputMessage: "", uploadedFile: null };
          }
          return conv;
        });
      });

      try {
        const response = await sendChatQuery(currentConversation.inputMessage);
        if (response.success) {
          const assistantMessage: Message = { id: Date.now().toString(), role: "assistant", content: response.data };
          setConversations(prevConversations => {
            return prevConversations.map(conv => {
              if (conv.id === selectedConversation) {
                return { ...conv, messages: [...conv.messages, assistantMessage] };
              }
              return conv;
            });
          });
        } else {
          console.error("API response was not successful:", response);
        }
      } catch (error) {
        console.error("Error fetching assistant response:", error);
      } finally {
        setIsLoading(false)
      }
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
      inputMessage: "",
      uploadedFile: null
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
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (conv.id === selectedConversation) {
            return { ...conv, uploadedFile: file };
          }
          return conv;
        });
      });
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      })
    }
  }

  const handleClearFile = () => {
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === selectedConversation) {
          return { ...conv, uploadedFile: null };
        }
        return conv;
      });
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEditMessage = (messageId: string) => {
    console.log("Edit message:", messageId)
  }

  const handleDeleteMessage = (messageId: string) => {
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            messages: conv.messages.filter(msg => msg.id !== messageId)
          }
        }
        return conv
      })
    })
  }

  const handleCopyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedMessageId(messageId)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  const handleInputChange = (value: string) => {
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === selectedConversation) {
          return { ...conv, inputMessage: value };
        }
        return conv;
      });
    });
  }

  const currentConversation = conversations.find(conv => conv.id === selectedConversation)

  return (
    <div className="flex flex-col h-screen rounded-lg overflow-hidden">
      <div className="border-b p-4 backdrop-blur-sm z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button onClick={handleNewConversation} variant="outline" size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Conversation
          </Button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="model-select" className="text-sm font-medium">
                Model:
              </Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger id="model-select" className="w-[140px]">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama-3">Llama 3</SelectItem>
                  <SelectItem value="llama-3-1">Llama 3.1</SelectItem>
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
          </div>
        </div>
      </div>

      <ScrollArea className="border-b p-2 backdrop-blur-sm">
        <div className="flex space-x-2 pb-2">
          {conversations.map((conv) => (
            <Button
              key={conv.id}
              variant={selectedConversation === conv.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedConversation(conv.id)}
              className="whitespace-nowrap"
            >
              {conv.title}
              {conversations.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveConversation(conv.id)
                  }}
                  className="ml-2 h-5 w-5 p-0 rounded-full"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove conversation</span>
                </Button>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="flex-grow overflow-hidden relative max-h-[50vh]">
        <ScrollArea className="h-full p-4 space-y-6" ref={chatScrollAreaRef}>
          {currentConversation?.messages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-4 group">
              <Avatar className="w-10 h-10 mt-1 flex-shrink-0">
                {isLoading && msg.role === "assistant" ? (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="flex items-center">
                    {msg.role === "user" ? (
                      <UserSearch className="w-6 h-6 mr-1"/>
                    ) : (
                      <SunSnow className="w-6 h-6 mr-1" />
                    )}
                  </div>
                )}
              </Avatar> 
              <div className="flex-grow">
                <div className="rounded-lg backdrop-blur-sm p-4">
                  {msg.content}
                </div>
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {msg.role === "user" && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => handleEditMessage(msg.id)} className="h-8 w-8 p-0 rounded-full">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteMessage(msg.id)} className="h-8 w-8 p-0 rounded-full">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyMessage(msg.id, msg.content)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  {copiedMessageId === msg.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-grow space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="border-t p-4 backdrop-blur-sm">
        <div className="relative flex items-center">
          <textarea
            value={currentConversation?.inputMessage || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow pr-24 py-3 px-4 resize-none border rounded-md"
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute right-2 bottom-2 flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8 p-0 rounded-full"
              disabled={isLoading}
            >
              {currentConversation?.uploadedFile ? <Check className="h-4 w-4 text-green-500" /> : <Upload className="h-4 w-4" />}
              <span className="sr-only">Upload file</span>
            </Button>
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="h-8 w-8 p-0 rounded-full"
              disabled={isLoading || (!currentConversation?.inputMessage.trim() && !currentConversation?.uploadedFile)}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
        {currentConversation?.uploadedFile && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Uploaded: {currentConversation.uploadedFile.name}
            </span>
            <div className="space-x-2">
              <Button onClick={handleSendMessage} size="sm" variant="outline">
                Submit
              </Button>
              <Button onClick={handleClearFile} size="sm" variant="outline">
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}