"use client"

import React, { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from './ui/button'
import { Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'


type HintProps = {
  secretNumber: string;
  toggleHintVisibility: () => void
}

export default function Hint({ secretNumber, toggleHintVisibility }: HintProps) {
  const indexToShow = useMemo(() => Math.floor(Math.random() * 4), [])
  const hint: string[] = Array.from({ length: 4 }).map((_, idx) => {
    if (idx === indexToShow) return secretNumber[indexToShow]
    return "?"
  })

  return (
    <Dialog onOpenChange={(open) => {
      if (!open) toggleHintVisibility()
    }}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant={"outline"}
                size={'icon'}
                className="rounded-full"
                aria-label='Show hint'
              >
                <Lightbulb />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hint</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            HINT
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex space-x-2 justify-center my-4">
              {hint.map((number, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center  rounded-md font-semibold text-lg shadow-sm ",
                    i === indexToShow ? "bg-[green] text-destructive-foreground" : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {number}
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
