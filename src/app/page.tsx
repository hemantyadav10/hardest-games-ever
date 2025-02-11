"use client";

import { Rules } from "@/components/rules";
import { ModeToggle } from "@/components/themeToggle";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import Confetti from 'react-confetti';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import Hint from "@/components/hint";
import { Info } from "lucide-react";




// Generate a 4-digit number with unique digits
const generate4DigitNumber = () => {
  const digits = new Set<number>();
  while (digits.size < 4) {
    digits.add(Math.floor(Math.random() * 10));
  }
  return Array.from(digits).join('');
};

type THistory = {
  guess: string;
  cows: number;
  bulls: number
}

export default function CowsAndBullsGame() {
  const [generatedNumber, setGeneratedNumber] = useState("");
  const [history, setHistory] = useState<THistory[]>([]);
  const [currentGuess, setCurrentGuess] = useState("")
  const [isGameOver, setIsGameOver] = useState(false)
  const maxAttempts = 7;
  const [hasGivenUp, setHasGivenUp] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [hasSeenHint, setHasSeenHint] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Generate number on first load
  useEffect(() => {
    const number = generate4DigitNumber();
    setGeneratedNumber(number);
    setHasGivenUp(false)
  }, []);



  const checkCowsAndBulls = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const guess = new Set<string>(currentGuess)
    if (guess.size < 4) {
      inputRef.current?.focus()
      toast({
        title: "All numbers should be unique."
      })
      return;
    }

    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < 4; i++) {
      if (currentGuess[i] === generatedNumber[i]) {
        bulls++;
      } else if (generatedNumber.includes(currentGuess[i])) {
        cows++;
      }
    }

    const newAttempt = { guess: currentGuess, cows, bulls };
    setHistory(prev => [...prev, newAttempt]);
    setCurrentGuess("");  // Reset input for the next attempt

    if (bulls === 4 || history.length + 1 >= maxAttempts) {
      setIsGameOver(true);
      setHasGivenUp(true)
    }

    if (bulls === 4) {
      triggerConfetti()
    }
  };

  // Handle OTP change, restrict to numbers only
  const handleOtpChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= 4) {
      setCurrentGuess(value);
    }
  };


  const handleStartNewGame = () => {
    const number = generate4DigitNumber();
    setGeneratedNumber(number);
    setCurrentGuess('')
    setHistory([])
    setIsGameOver(false)
    setHasGivenUp(false)
    setHasSeenHint(false)
    inputRef.current?.focus()
  }

  const handleGiveUp = () => {
    setHasGivenUp(true)
  }

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false)
    }, 4000)
  };

  return (
    <div className="h-svh flex flex-col  items-center space-y-2">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height - 1} />}
      <div className="text-center w-full p-4 flex items-center  justify-between">
        <Rules />
        <h1 className="text-3xl font-bold">Bulls and Cows</h1>
        <ModeToggle />
      </div>
      <div className="text-sm flex items-center gap-2">Guess the secret number withing {maxAttempts} attempts
        <Popover>
          <PopoverTrigger>
            <Info size={16} />
          </PopoverTrigger>
          <PopoverContent side="top" className="text-xs space-y-2 w-max">
            <div>
              <div className="size-6 border-2 rounded-full border-orange-300 items-center justify-center inline-flex">🐂</div> <strong>Bulls</strong> - Correct digit in right position
            </div>
            <div>
              <div className="size-6 border-2 rounded-full border-input items-center justify-center inline-flex">🐄</div> <strong>Cows</strong> - Correct digit in wrong position
            </div>
          </PopoverContent>
        </Popover>

      </div>
      <div className=" space-y-2 border p-4 rounded-md">
        {/* <p>Generated number: {generatedNumber}</p> */}
        <div className="flex items-center gap-4 justify-between">
          <div className="flex space-x-2">
            {
              hasGivenUp
                ? (
                  generatedNumber.split('').map((number, i) => (
                    <div key={i} className="w-8 h-8 flex items-center justify-center bg-[green]  shadow-sm rounded-md font-semibold text-lg text-destructive-foreground">
                      {number}
                    </div>
                  ))
                ) : (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-8 h-8 flex items-center justify-center bg-secondary rounded-md font-semibold text-lg shadow-sm text-secondary-foreground">
                      ?
                    </div>
                  ))
                )
            }
            { }
          </div>
          <div className="text-sm flex gap-2">
            <div className="border-2 border-orange-300 size-8 rounded-full flex items-center justify-center">
              🐂
            </div>
            <div className="border-2 border-input size-8 rounded-full flex items-center justify-center">
              🐄
            </div>
          </div>
        </div>

        {history.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 justify-between">
            <div className="flex space-x-2">
              {item.guess.split('').map((digit, i) => (
                <div key={i} className="w-8 h-8 flex items-center justify-center border border-input text-sm shadow-sm rounded-md">
                  {digit}
                </div>
              ))}
            </div>
            <div className="text-sm flex gap-2">
              <div className="border-2 border-orange-300 size-8 rounded-full flex items-center justify-center">
                {item.bulls}
              </div>
              <div className="border-2 border-input size-8 rounded-full flex items-center justify-center">
                {item.cows}
              </div>
            </div>
          </div>
        ))}

        {!isGameOver && (
          <form onSubmit={e => checkCowsAndBulls(e)} className="flex items-center gap-4">
            <InputOTP
              ref={inputRef}
              maxLength={4}
              value={currentGuess}
              onChange={handleOtpChange}
              disabled={hasGivenUp}
            >
              <InputOTPGroup className="space-x-[10px]">
                {[0, 1, 2, 3].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Button
              type="submit"
              disabled={currentGuess.length !== 4}
              onClick={() => inputRef.current?.focus()}
            >
              Submit
            </Button>
          </form>
        )}
      </div>


      {isGameOver && (
        <>
          <div>
            {history[history.length - 1]?.bulls === 4
              ? <p className="text-[green]">Congratulations! You guessed it right!</p>
              : <p className="text-red-500">Game Over! The number was {generatedNumber}.</p>
            }
          </div>
        </>
      )}
      <p className="text-sm">Attempts left: {maxAttempts - history?.length}</p>
      <div className="space-x-2 flex" >
        <Button
          onClick={handleStartNewGame}
        >
          New Game
        </Button>
        <Button
          onClick={handleGiveUp}
          variant={"secondary"}
        >
          Give up
        </Button>
        {(history?.length > 1 && !hasSeenHint) && (
          <Hint
            secretNumber={generatedNumber}
            toggleHintVisibility={() => setHasSeenHint(true)}
          />
        )}
      </div>
    </div>
  );
}
