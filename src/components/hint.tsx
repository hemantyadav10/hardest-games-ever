"use client"

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
import { cn } from '@/lib/utils'
import { Lightbulb } from 'lucide-react'
import React, { useEffect } from 'react'
import { Button } from './ui/button'


type HintProps = {
  secretNumber: string;
  toggleHintVisibility: () => void,
  secretNumLength: number;
}

export default function Hint({ secretNumber, toggleHintVisibility, secretNumLength }: HintProps) {
  const [indexToShow, setIndexToShow] = React.useState<number | null>(null);
  const hint: string[] = Array.from({ length: secretNumLength }).map((_, idx) => {
    if (idx === indexToShow) return secretNumber[indexToShow]
    return "?"
  })

  useEffect(() => {
    setIndexToShow(Math.floor(Math.random() * secretNumLength));
  }, []);


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
