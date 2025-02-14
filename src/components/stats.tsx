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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ChartNoAxesCombined } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { DifficultyLevel, difficultyOptions } from "@/types"

type GameStat = {
  label: string;
  value: number;
}

const gameStats: Record<DifficultyLevel, GameStat[]> = {
  easy: [
    { label: 'Games Played', value: 0 },
    { label: 'Games Won', value: 0 },
    { label: 'Win %', value: 0 },
    { label: 'Best Game', value: 0 },
  ],
  hard: [
    { label: 'Games Played', value: 0 },
    { label: 'Games Won', value: 0 },
    { label: 'Win %', value: 0 },
    { label: 'Best Game', value: 0 },
  ],
  nightmare: [
    { label: 'Games Played', value: 0 },
    { label: 'Games Won', value: 0 },
    { label: 'Win %', value: 0 },
    { label: 'Best Game', value: 0 },
  ]
} as const;

type propType = {
  currentAttempt: number;
  currentDifficulty: DifficultyLevel;
  isGameWon: boolean;
}

export default function Stats({
  currentAttempt,
  currentDifficulty,
  isGameWon,
}: propType) {
  const [stats, setStats] = useState<Record<DifficultyLevel, GameStat[]>>(() => {
    if (typeof window !== 'undefined') {
      const localStats = JSON.parse(localStorage.getItem('stats') || 'null');
      return localStats || gameStats;
    }
    return gameStats;
  });
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 640px)")

  const updateStats = (difficulty: DifficultyLevel, attempt: number) => {
    const currentStats = stats[difficulty];
    let gamesPlayed = currentStats[0].value
    let gamesWon = currentStats[1].value;
    let winPercentage = currentStats[2].value
    let bestGame = currentStats[3].value
    if (attempt === 1) {
      gamesPlayed++
    }

    if (isGameWon) {
      gamesWon++
      bestGame = bestGame === 0 ? attempt : Math.min(bestGame, attempt);
    }

    if (gamesWon > 0) {
      winPercentage = parseFloat(((gamesWon / gamesPlayed) * 100).toFixed(2))
    }

    const updatedStats: GameStat[] = [
      { label: 'Games Played', value: gamesPlayed },
      { label: 'Games Won', value: gamesWon },
      { label: 'Win %', value: winPercentage },
      { label: 'Best Game', value: bestGame },
    ]

    const newStats = { ...stats, [difficulty]: updatedStats };
    setStats(newStats);
    localStorage.setItem('stats', JSON.stringify(newStats));
  };

  useEffect(() => {
    updateStats(currentDifficulty, currentAttempt);
  }, [currentAttempt, currentDifficulty]);


  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  size={'icon'}
                  className="rounded-full"
                  variant={'ghost'}
                >
                  <ChartNoAxesCombined />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Game Stats</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Game Performance</DialogTitle>
            <DialogDescription>
              Stats
            </DialogDescription>
          </DialogHeader>
          <StatsSection
            difficultyOptions={difficultyOptions}
            stats={stats}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DrawerTrigger asChild>
              <Button
                size={'icon'}
                className="rounded-full"
                variant={'ghost'}
              >
                <ChartNoAxesCombined />
              </Button>
            </DrawerTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Game Stats</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Game Performance</DrawerTitle>
          <DrawerDescription>
            Stats
          </DrawerDescription>
        </DrawerHeader>
        <div className='p-4 pt-0'>
          <StatsSection
            difficultyOptions={difficultyOptions}
            stats={stats}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function StatsSection({ difficultyOptions, stats }: {
  difficultyOptions: DifficultyLevel[],
  stats: Record<DifficultyLevel, GameStat[]>
}) {
  return (
    <Tabs defaultValue={difficultyOptions[0]}>
      <TabsList className="grid w-full grid-cols-3 mt-2">
        {difficultyOptions.map(level => (
          <TabsTrigger value={level} className="capitalize"
            key={level}
          >
            {level}
          </TabsTrigger>
        ))}
      </TabsList>
      {difficultyOptions.map(level => (
        <TabsContent value={level} key={level} className="pt-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {stats[level]?.map((stat: GameStat, index: number) => (
              <div key={index} className="text-center space-y-2">
                <div className="bg-primary rounded-md p-1 text-center text-primary-foreground">
                  {stat.label}
                </div>
                <p className="text-lg">
                  {stat.value === 0
                    ? "-"
                    : stat.label === 'Best Game'
                      ? <>
                        {stat.value}  <span className="text-sm ">
                          {stat.value < 2
                            ? "attempt"
                            : "attempts"
                          }
                        </span>
                      </>
                      : stat.value
                  }
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}