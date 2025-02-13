"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChartNoAxesCombined } from "lucide-react"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DifficultyLevel } from '@/app/page'
import { useEffect, useState } from "react"

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
};

type propType = {
  difficultyOptions: DifficultyLevel[];
  currentAttempt: number;
  currentDifficulty: DifficultyLevel;
  isGameWon: boolean;
}

export default function Stts({
  difficultyOptions,
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
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localStats = JSON.parse(localStorage.getItem('stats') || 'null');
      if (localStats) {
        setStats(localStats)
      }
    }
  }, [])

  useEffect(() => {
    updateStats(currentDifficulty, currentAttempt);
  }, [currentAttempt, currentDifficulty]);

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={'icon'}
          className="rounded-full"
          variant={'ghost'}
        >
          <ChartNoAxesCombined />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Game Performance</DialogTitle>
          <DialogDescription>
            Stats
          </DialogDescription>
          <Tabs defaultValue={difficultyOptions[0]}>
            <TabsList className="grid w-full grid-cols-3">
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
                        {stat.value === 0 ? "-" : stat.label === 'Best Game' ? <>{stat.value}  <span className="text-sm ">{stat.value < 2 ? "attempt" : "attempts"}</span></> : stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>

  )
}
