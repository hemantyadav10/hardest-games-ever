"use client"

import { CircleHelp, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { useEffect, useState } from "react"


const examples = [
  {
    guess: [1, 2, 3, 4],
    feedback: { bulls: 1, cows: 1 },
    explanation: "3 is correct and in the right place, 2 is correct but in the wrong place."
  },
  {
    guess: [5, 8, 2, 1],
    feedback: { bulls: 2, cows: 1 },
    explanation: "5, 8 are correct and in the right place, 2 is correct and in wrong place."
  },
  {
    guess: [5, 8, 3, 2],
    feedback: { bulls: 4, cows: 0 },
    explanation: "All digits are correct and in the correct positions."
  }
];

const gameInstructions = [
  {
    title: "Making guess:",
    steps: [
      "Enter a number with unique digits.",
      "After each guess, you'll get feedback."
    ]
  },
  {
    title: "Bulls & Cows explained:",
    steps: [
      "Bulls - Correct digit in the right position.",
      "Cows - Correct digit in the wrong position."
    ]
  },
  {
    title: "Winning 🎉:",
    steps: [
      "Get 4 bulls to win!",
      "Fail to guess in 7 tries, and the secret number is revealed."
    ]
  }
];


export function Rules() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const rulesShown = JSON.parse(localStorage.getItem('rulesShown') || 'false');
    if (!rulesShown) {
      setOpen(true);
      localStorage.setItem('rulesShown', JSON.stringify(true));
    }
  }, [])

  return (
    <Drawer open={open} onOpenChange={(o) => setOpen(o)}>
      <DrawerTrigger asChild >
        <Button variant="ghost" size="icon" className="rounded-full">
          <CircleHelp />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="">
        <div className="mx-auto w-full relative">
          <DrawerClose asChild className="absolute right-4 top-0">
            <Button size={"icon"} className=" rounded-full" variant={"ghost"}>
              <X />
            </Button>
          </DrawerClose>
          <DrawerHeader className="flex items-center flex-col p-0 mt-4">
            <DrawerTitle className="text-center">Guess the secret number</DrawerTitle>
            <DrawerDescription>
              Use the clues to narrow down the secret number!
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 flex flex-wrap gap-4 mx-auto max-w-5xl justify-between">
            <div className="flex flex-col gap-4">
              {gameInstructions.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="font-semibold">{section.title}</h3>
                  <ol className="text-sm list-disc list-inside space-y-1">
                    {section.steps.map((step, index) => (
                      <li key={index}>
                        {step.includes("Bulls") || step.includes("Cows") ? (
                          <>
                            <strong>{step.split(" - ")[0]} - </strong>
                            {step.split(" - ")[1]}
                          </>
                        ) : (
                          step
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">
                Examples:
              </h3>
              <p>Secret: 5832</p>
              {examples.map((example, idx) => (
                <div key={idx} className="space-y-1 text-sm">
                  <div className="flex items-center gap-8">
                    {/* Displaying the guess */}
                    <div className="flex space-x-2">
                      {example.guess.map((digit, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 flex items-center justify-center border border-input text-sm shadow-sm rounded-md"
                        >
                          {digit}
                        </div>
                      ))}
                    </div>

                    {/* Displaying feedback */}
                    <div className="text-sm flex gap-2">
                      <div className="border-2 border-orange-300 size-8 rounded-full flex items-center justify-center">
                        {example.feedback.bulls}
                      </div>
                      <div className="border-2 border-input size-8 rounded-full flex items-center justify-center">
                        {example.feedback.cows}
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <p>{example.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
