"use client"

import { MonitorCog, Moon, Sun, Check } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const [open, setOpen] = React.useState(false)

  if (isDesktop) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Sun className="h-[1.2rem]  w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            className={cn(
              "cursor-pointer",
            )}
            onClick={() => setTheme("light")}
          >
            <Sun />  Light {theme === 'light' && <Check className="ml-auto" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              "cursor-pointer",
            )}
            onClick={() => setTheme("dark")}
          >
            <Moon /> Dark {theme === 'dark' && <Check className="ml-auto" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              "cursor-pointer",
            )}
            onClick={() => setTheme("system")}
          >
            <MonitorCog /> System {theme === 'system' && <Check className="ml-auto" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Sun className="h-[1.2rem]  w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent aria-describedby={undefined} >
        <DrawerHeader className="text-left p-0">
          <DrawerTitle className="px-2" hidden>Theme</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 flex-col flex">
          <Button
            variant={'ghost'}
            onClick={() => setTheme("light")}
            className={cn(
              "cursor-pointer flex justify-start py-5",
            )}
          >
            <Sun />  Light {theme === 'light' && <Check className="ml-auto" />}
          </Button>
          <Button
            variant={'ghost'}
            onClick={() => setTheme("dark")}
            className={cn(
              "cursor-pointer flex justify-start py-5",
            )}
          >
            <Moon /> Dark {theme === 'dark' && <Check className="ml-auto" />}
          </Button>
          <Button
            variant={'ghost'}
            onClick={() => setTheme("system")}
            className={cn(
              "cursor-pointer flex justify-start py-5",
            )}
          >
            <MonitorCog /> System {theme === 'system' && <Check className="ml-auto" />}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
