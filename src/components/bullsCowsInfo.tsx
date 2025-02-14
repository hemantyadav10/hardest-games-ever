import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { Info } from "lucide-react"
import { useState } from "react"

export default function BullsCowsInfo() {
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const [open, setOpen] = useState(false)


  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger aria-label="Game Info">
          <Info size={16} />
        </PopoverTrigger>
        <PopoverContent side="top" className="text-xs space-y-2 w-max">
          <RulesInfo />
        </PopoverContent>
      </Popover>
    )
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Info size={16} />
      </DrawerTrigger>
      <DrawerContent aria-describedby={undefined}>
        <DrawerHeader className="p-0">
          <DrawerTitle hidden>Info</DrawerTitle>
        </DrawerHeader>
        <div className='p-4 space-y-2 text-sm my-2'>
          <RulesInfo className="size-8 " />
        </div>
      </DrawerContent>
    </Drawer>
  )
}


function RulesInfo({ className }: { className?: string }) {
  return (
    <>
      <div>
        <div
          className={cn(
            "size-6 border-2 rounded-full border-orange-300 items-center justify-center inline-flex mr-1",
            className
          )}
        >
          🐂</div> <strong>Bulls</strong> - Correct digit in right position
      </div>
      <div>
        <div className={cn(
          "size-6 border-2 rounded-full border-input items-center justify-center inline-flex mr-1",
          className
        )}
        >
          🐄</div> <strong>Cows</strong> - Correct digit in wrong position
      </div>
    </>
  )
}