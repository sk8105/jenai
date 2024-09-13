"use client";

import React, { useState, useRef, useEffect } from 'react'
import { Upload, FileSpreadsheet, FileText, FileType, X, Edit, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { uploadFiles, fetchFiles, deleteFile } from '@/services/file';

type FileTypes = 'excel' | 'csv' | 'pdf'

interface FileTypeInfo {
  icon: React.ElementType;
  color: string;
  extension: string;
  description: string;
  acceptedFormats: string[];
}

const fileTypeInfo: Record<FileTypes, FileTypeInfo> = {
  excel: {
    icon: FileSpreadsheet,
    color: 'text-green-500',
    extension: 'xlsx',
    description: 'Microsoft Excel Spreadsheet',
    acceptedFormats: ['.xlsx', '.xls']
  },
  csv: {
    icon: FileText,
    color: 'text-blue-500',
    extension: 'csv',
    description: 'Comma-Separated Values',
    acceptedFormats: ['.csv']
  },
  pdf: {
    icon: FileType,
    color: 'text-red-500',
    extension: 'pdf',
    description: 'Portable Document Format',
    acceptedFormats: ['.pdf']
  },
}

interface RecentUpload {
  id: string;
  name: string;
  type: FileTypes;
  date: string;
}

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileTypes>('excel');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  };

  const simulateUpload = async () => {
    if (file) {
      setIsUploading(true)
      setUploadProgress(0)
      setUploadSpeed(0)

      const totalSize = file?.size || 1
      let uploadedSize = 0
      const startTime = Date.now()
      const response = await uploadFiles(file)

      const interval = setInterval(() => {
        uploadedSize += 1024 * 1024 // Simulate 1MB per interval
        const progress = Math.min((uploadedSize / totalSize) * 100, 100)
        setUploadProgress(progress)

        const elapsedTime = (Date.now() - startTime) / 1000 // in seconds
        const speed = uploadedSize / elapsedTime / 1024 / 1024 // in MB/s
        setUploadSpeed(speed)

        if (progress === 100) {
          clearInterval(interval)
          setIsUploading(false)
          toast({
            title: "Upload Complete",
            description: "Your file has been successfully uploaded.",
          })
          if (file) {
            const newUpload: RecentUpload = {
              id: Date.now().toString(),
              name: file.name,
              type: fileType,
              date: new Date().toISOString().split('T')[0]
            }
            setRecentUploads(prev => [newUpload, ...prev])
          }
        }
      }, 100)
    }
  };

  const handleUpload = () => {
    if (file) {
      simulateUpload()
    } else {
      toast({
        title: "No File Selected",
        description: "Please select a file before uploading.",
        variant: "destructive",
      })
    }
  };

  const clearFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Call the deleteFile API
      await deleteFile(id);
  
      // Update the state to remove the file from the list
      setRecentUploads(prev => prev.filter(upload => upload.id !== id));
  
      // Show success toast
      toast({
        title: "File Deleted",
        description: "The file has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
  
      // Show error toast
      toast({
        title: "Delete Failed",
        description: "An error occurred while trying to delete the file.",
        variant: "destructive",
      });
    }
  };

  const FileIcon = fileTypeInfo[fileType].icon

  // Fetch file details from API
  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await fetchFiles();

        if (response.success) {
          const formattedData = response.data.map((file: any) => {
            return {
              id: file.id,
              name: file.file_name,
              date: new Date(file.uploaded_at * 1000).toISOString().split('T')[0],
              type: 'pdf',
            };
          });
          setRecentUploads(formattedData);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    getFiles();
  }, []);


  return (
    <div className="w-full max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select value={fileType} onValueChange={(value: FileTypes) => setFileType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>

          <div
            className="border-2 border-dashed border-primary/50 rounded-lg p-6 text-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={fileTypeInfo[fileType].acceptedFormats.join(',')}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileIcon className={`h-10 w-10 ${fileTypeInfo[fileType].color}`} />
                  <div className="text-left">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); clearFile(); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag and drop your file here or click to select</p>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{uploadProgress.toFixed(2)}% Complete</span>
                <span>{uploadSpeed.toFixed(2)} MB/s</span>
              </div>
            </div>
          )}

          <Button className="w-full" onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUploads.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell className="font-medium">{upload.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {React.createElement(fileTypeInfo[upload.type].icon, {
                        className: `h-5 w-5 mr-2 ${fileTypeInfo[upload.type].color}`
                      })}
                      {upload.type.toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell>{upload.date}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleDelete(upload.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}