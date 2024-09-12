"use client";

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Upload, FileText, User, BarChart } from "lucide-react"
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const useCases = [
  {
    title: "Human Resource",
    context: "Automated system for verifying legal documents. Reduces manual review time by 80%.",
    uploadsCount: 1234,
    lastUploaders: [
      { name: "Alice Johnson", color: "bg-red-500" },
      { name: "Bob Smith", color: "bg-blue-500" },
      { name: "Carol Williams", color: "bg-green-500" },
    ],
    uploadData: [
      { date: '2023-05-01', count: 50 },
      { date: '2023-05-02', count: 80 },
      { date: '2023-05-03', count: 120 },
      { date: '2023-05-04', count: 90 },
      { date: '2023-05-05', count: 110 },
    ],
  },
  {
    title: "Medical Document Analysis",
    context: "AI-powered tool for analyzing X-rays and MRIs. Assists radiologists in quick diagnoses.",
    uploadsCount: 5678,
    lastUploaders: [
      { name: "David Brown", color: "bg-yellow-500" },
      { name: "Eva Davis", color: "bg-purple-500" },
      { name: "Frank Miller", color: "bg-pink-500" },
    ],
    uploadData: [
      { date: '2023-05-01', count: 200 },
      { date: '2023-05-02', count: 180 },
      { date: '2023-05-03', count: 220 },
      { date: '2023-05-04', count: 190 },
      { date: '2023-05-05', count: 210 },
    ],
  },
  {
    title: "Financial Reports",
    context: "Machine learning model to identify suspicious transactions. Protects against financial crimes.",
    uploadsCount: 9012,
    lastUploaders: [
      { name: "Grace Lee", color: "bg-indigo-500" },
      { name: "Henry Wilson", color: "bg-orange-500" },
      { name: "Ivy Chen", color: "bg-teal-500" },
    ],
    uploadData: [
      { date: '2023-05-01', count: 300 },
      { date: '2023-05-02', count: 350 },
      { date: '2023-05-03', count: 320 },
      { date: '2023-05-04', count: 380 },
      { date: '2023-05-05', count: 340 },
    ],
  },
  {
    title: "Customer Sentiment Analysis",
    context: "NLP-based system for analyzing customer feedback. Helps improve product and service quality.",
    uploadsCount: 3456,
    lastUploaders: [
      { name: "Jack Taylor" },
      { name: "Karen White" },
      { name: "Liam Harris"},
    ],
    uploadData: [
      { date: '2023-05-01', count: 150 },
      { date: '2023-05-02', count: 180 },
      { date: '2023-05-03', count: 160 },
      { date: '2023-05-04', count: 200 },
      { date: '2023-05-05', count: 170 },
    ],
  },
]

const iconColors = {
  FileText: "text-blue-500",
  User: "text-green-500",
  BarChart: "text-purple-500",
  Upload: "text-red-500",
}

export default function Dashboard() {
  const [selectedUseCase, setSelectedUseCase] = useState(useCases[0])

  const chartData = {
    labels: selectedUseCase.uploadData.map(data => data.date),
    datasets: [
      {
        label: 'Upload Count',
        data: selectedUseCase.uploadData.map(data => data.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Upload Counts Over Time',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {useCases.map((useCase, index) => (
          <Card key={index} className="w-full overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <FileText className={`w-6 h-6 mr-2 ${iconColors.FileText}`} />
                  <h2 className="text-lg font-semibold">{useCase.title}</h2>
                </div>
                <div className="flex items-center">
                  <BarChart className={`w-5 h-5 mr-1 ${iconColors.BarChart}`} />
                  <span className="text-lg font-bold">{useCase.uploadsCount.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-sm opacity-70 mb-4">{useCase.context}</p>
              <div className="mb-4">
                <h3 className="text-xs opacity-50 mb-2 flex items-center">
                  <User className={`w-4 h-4 mr-1 ${iconColors.User}`} />
                  Last uploaders:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {useCase.lastUploaders.map((uploader, idx) => (
                    <div key={idx} className="flex items-center rounded-full pl-1 pr-2 py-0.5 border border-opacity-20">
                      <Avatar className={`h-5 w-5 mr-1`}>
                        <AvatarFallback>{uploader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{uploader.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs" 
                  onClick={() => setSelectedUseCase(useCase)}
                >
                  View Chart
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8" aria-label="Upload document">
                  <Upload className={`h-4 w-4`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="w-full overflow-hidden">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Upload Trend</h2>
          <Line options={chartOptions} data={chartData} />
        </CardContent>
      </Card>
    </div>
  )
}