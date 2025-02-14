"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from '@/lib/utils'
import { Lightbulb } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "./ui/drawer"


type HintProps = {
  secretNumber: string;
  toggleHintVisibility: () => void;
  secretNumLength: number;
}

export default function Hint({
  secretNumber,
  toggleHintVisibility,
  secretNumLength
}: HintProps) {
  const [indexToShow, setIndexToShow] = React.useState<number | null>(null);
  const hint: string[] = Array.from({ length: secretNumLength }).map((_, idx) => {
    if (idx === indexToShow) return secretNumber[indexToShow]
    return "?"
  })
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 640px)")

  useEffect(() => {
    setIndexToShow(Math.floor(Math.random() * secretNumLength));
  }, [secretNumLength]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(o) => {
        setOpen(o)
        if (!o) {
          toggleHintVisibility()
        }
      }}>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={'icon'}
                  className="rounded-full"
                  aria-label='Show hint'
                >
                  <Lightbulb />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show hint</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader >
            <DialogTitle className="text-center">
              HINT
            </DialogTitle>
          </DialogHeader>
          <HintSection
            hint={hint}
            indexToShow={indexToShow}
          />
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={(o) => {
      setOpen(o)
      if (!o) {
        toggleHintVisibility()
      }
    }}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DrawerTrigger asChild>
              <Button
                variant={"ghost"}
                size={'icon'}
                className="rounded-full"
                aria-label='Show hint'
              >
                <Lightbulb />
              </Button>
            </DrawerTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Show hint</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DrawerContent aria-describedby={undefined}>
        <DrawerHeader >
          <DrawerTitle>
            HINT
          </DrawerTitle>
        </DrawerHeader>
        <HintSection
          hint={hint}
          indexToShow={indexToShow}
        />
      </DrawerContent>
    </Drawer >
  )
}


function HintSection({
  hint,
  indexToShow,
}: {
  hint: string[];
  indexToShow: number | null;
}) {
  return (
    <div className="flex space-x-2 justify-center mb-4 p-4">
      {hint.map((number, i) => (
        <div
          key={i}
          className={cn(
            "w-12 h-12 flex items-center justify-center  rounded-md font-semibold text-lg shadow-sm ",
            i === indexToShow ? "bg-[green] text-destructive-foreground" : "bg-foreground text-secondary"
          )}
        >
          {number}
        </div>
      ))}
    </div>
  )
}