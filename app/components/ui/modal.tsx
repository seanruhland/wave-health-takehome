import * as React from "react"
import { X } from "lucide-react"
import { cn } from "~/lib/utils"
import { Button } from "./button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  descriptionId?: string // Optional: id of element describing the modal
}

export function Modal({ isOpen, onClose, children, title, descriptionId }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      {...(descriptionId ? { 'aria-describedby': descriptionId } : {})}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative z-50 w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        role="document"
      >
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}