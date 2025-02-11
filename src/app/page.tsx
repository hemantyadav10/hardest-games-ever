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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type DifficultyLevel = 'easy' | 'hard' | 'nightmare'
const difficultyOptions: DifficultyLevel[] = ['easy', 'hard', 'nightmare']

const SECRET_NUM_LENGTH_CONFIG: Record<DifficultyLevel, number> = {
  easy: 4,
  hard: 5,
  nightmare: 5
};


// Generate a number with unique digits
const generateSecretCode = (numLength: number) => {
  const digits = new Set<number>();
  while (digits.size < numLength) {
    digits.add(Math.floor(Math.random() * 10));
  }
  return Array.from(digits).join('');
};

type THistory = {
  guess: string;
  cows?: number;
  bulls?: number;
}


export default function CowsAndBullsGame() {
  const [secretCode, setSecretCode] = useState("");
  const [history, setHistory] = useState<THistory[]>([]);
  const [currentGuess, setCurrentGuess] = useState("")
  const [isGameOver, setIsGameOver] = useState(false)
  const [hasGivenUp, setHasGivenUp] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [hasSeenHint, setHasSeenHint] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('easy')
  const SECRET_NUM_LENGTH: number = SECRET_NUM_LENGTH_CONFIG[difficultyLevel];
  const maxAttempts = difficultyLevel === 'easy' ? 7 : 8;


  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);


  // Generate number on first load
  useEffect(() => {
    const number = generateSecretCode(SECRET_NUM_LENGTH);
    setSecretCode(number);
  }, [difficultyLevel, SECRET_NUM_LENGTH]);


  // Function to check the number of cows and bulls for each guess
  const checkCowsAndBulls = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const guess = new Set<string>(currentGuess)
    if (guess.size < SECRET_NUM_LENGTH) {
      inputRef.current?.focus()
      toast({
        title: "All numbers should be unique."
      })
      return;
    }

    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < SECRET_NUM_LENGTH; i++) {
      if (currentGuess[i] === secretCode[i]) {
        bulls++;
      } else if (secretCode.includes(currentGuess[i])) {
        cows++;
      }
    }

    if (difficultyLevel === 'easy' || difficultyLevel === 'hard') {
      const newAttempt = { guess: currentGuess, cows, bulls };
      setHistory(prev => [...prev, newAttempt]);
    } else if (difficultyLevel === 'nightmare') {
      const clearedHistory = history.map(attempt => ({
        ...attempt,
        cows: undefined,
        bulls: undefined
      }));

      // Add the new guess with bulls and cows
      const newAttempt = { guess: currentGuess, cows, bulls };

      // Update history
      setHistory([...clearedHistory, newAttempt]);
    }

    setCurrentGuess("");  // Reset input for the next attempt

    if (bulls === SECRET_NUM_LENGTH || history.length + 1 >= maxAttempts) {
      setIsGameOver(true);
      setHasGivenUp(true)
    }

    if (bulls === SECRET_NUM_LENGTH) {
      triggerConfetti()
    }
  };


  // Handle OTP change, restrict to numbers only
  const handleOtpChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= SECRET_NUM_LENGTH) {
      setCurrentGuess(value);
    }
  };


  // Handle New Game, reset everything
  const handleStartNewGame = () => {
    const number = generateSecretCode(SECRET_NUM_LENGTH);
    setSecretCode(number);
    setCurrentGuess('')
    setHistory([])
    setIsGameOver(false)
    setHasGivenUp(false)
    setHasSeenHint(false)
    inputRef.current?.focus()
  }


  // On give up , show the secret number
  const handleGiveUp = () => {
    setHasGivenUp(true)
  }


  // function to show confetti like when the game is won
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
          <PopoverTrigger aria-label="Game Info">
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
        {/* <p>Generated number: {secretCode}</p> */}
        <div className="flex items-center gap-4 justify-between">
          <div className="flex space-x-2">
            {
              hasGivenUp
                ? (
                  secretCode.split('').map((number, i) => (
                    <div key={i} className="w-8 h-8 flex items-center justify-center bg-[green]  shadow-sm rounded-md font-semibold text-lg text-destructive-foreground">
                      {number}
                    </div>
                  ))
                ) : (
                  Array.from({ length: SECRET_NUM_LENGTH }).map((_, i) => (
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
          <form hidden={isGameOver} onSubmit={e => checkCowsAndBulls(e)} className="flex items-center gap-4">
            <InputOTP
              ref={inputRef}
              maxLength={SECRET_NUM_LENGTH}
              value={currentGuess}
              onChange={handleOtpChange}
              disabled={hasGivenUp}
              aria-label="Enter your guess"
            >
              <InputOTPGroup className="space-x-[10px]">
                {Array.from({ length: SECRET_NUM_LENGTH }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Button
              type="submit"
              disabled={currentGuess.length !== SECRET_NUM_LENGTH}
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
            {history[history.length - 1]?.bulls === SECRET_NUM_LENGTH
              ? <p className="text-[green]">Congratulations! You guessed it right!</p>
              : <p className="text-red-500">Game Over! The number was {secretCode}.</p>
            }
          </div>
        </>
      )}
      <p className="text-sm">Attempts left: {maxAttempts - history?.length}</p>
      <div className="flex flex-wrap justify-center gap-2" >
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
            secretNumber={secretCode}
            toggleHintVisibility={() => setHasSeenHint(true)}
            secretNumLength={SECRET_NUM_LENGTH}
          />
        )}
        <Select
          value={difficultyLevel}
          onValueChange={(level: DifficultyLevel) => {
            setDifficultyLevel(level)
            handleStartNewGame()
          }}
        >
          <SelectTrigger className="w-max min-w-28 capitalize">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficultyOptions.map(option => (
              <SelectItem key={option} value={option} className="capitalize">{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
