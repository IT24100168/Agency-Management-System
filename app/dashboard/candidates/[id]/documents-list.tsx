
'use client'

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadDocument, deleteDocument } from "./document-actions"
import { FileText, Upload, Eye, Download, Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Document = {
    id: string
    name: string
    type: string
    created_at: string
    url?: string
}

export function DocumentsList({ candidateId, documents }: { candidateId: string, documents: Document[] }) {
    const [isPending, startTransition] = useTransition()

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Documents Vault</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {documents.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                                No documents uploaded yet.
                            </div>
                        ) : (
                            documents.map((doc) => (
                                <div key={doc.id} className="flex items-center p-3 border rounded-lg space-x-4">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{doc.name}</p>
                                        <p className="text-xs text-muted-foreground">{doc.type} • {new Date(doc.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex space-x-1">
                                        {doc.url && (
                                            <Button variant="ghost" size="icon" asChild>
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                                    <Eye className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete "{doc.name}". This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => {
                                                        deleteDocument(doc.id)
                                                    }} className="bg-red-600 hover:bg-red-700">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Upload Document</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={(formData) => {
                        startTransition(async () => {
                            await uploadDocument(formData)
                        })
                    }} className="flex flex-col md:flex-row gap-4 items-end">
                        <input type="hidden" name="candidate_id" value={candidateId} />

                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="type">Document Type</Label>
                            <Select name="type" defaultValue="Passport">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Passport">Passport</SelectItem>
                                    <SelectItem value="Medical">Medical Report</SelectItem>
                                    <SelectItem value="Visa">Visa Copy</SelectItem>
                                    <SelectItem value="Photo">Photo</SelectItem>
                                    <SelectItem value="Ticket">Ticket</SelectItem>
                                    <SelectItem value="Contract">Employment Contract</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="file">File</Label>
                            <Input id="file" name="file" type="file" required disabled={isPending} />
                        </div>

                        <Button type="submit" disabled={isPending}>
                            <Upload className="mr-2 h-4 w-4" />
                            {isPending ? 'Uploading...' : 'Upload'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
