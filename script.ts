(() => {
    // timer class
    class Timer {
        private running:Boolean = false;
        private startTime: number = 0;

        private getCurrentTime(): number {
            if (!this.running) {
                return 0;
            }

            return Date.now() - this.startTime;
        }
        
        start() {
            if (this.running) {
                return console.error("Timer is stopped.");
            }

            this.running = true;
            this.startTime = Date.now();
        }

        stop () {
            if (!this.running) {
              return console.error('Timer is already stopped');
            }
        
            this.running = false;
        }
        
        reset () {
            if (this.running) {
                this.startTime = Date.now();
                return;
            }
        
            this.startTime = 0;
        }

        getTime (): any {
            if (!this.running) {
                return 0;
            } else {
                return Date.now() - this.startTime;
            }
        }
    }

    interface Problem {
        problemStr: string;
        ans: number;
    }

    const timerEle = document.getElementById("timer") as HTMLSpanElement;
    const scoreEle = document.getElementById("score") as HTMLSpanElement;
    const spdEle = document.getElementById("spd") as HTMLSpanElement;
    const accEle = document.getElementById("acc") as HTMLSpanElement;

    const introTxt = document.getElementById("intro") as HTMLElement;
    const startBtn = document.getElementById("start") as HTMLButtonElement;
    const eqEle = document.getElementById("equation") as HTMLElement;
    const ansEle = document.getElementById("inputAns") as HTMLDivElement;
    const ansInp = document.getElementById("answer") as HTMLInputElement;
    const submitBtn = document.getElementById("submitAns") as HTMLButtonElement;

    // problem part
    let currentProb: Problem

    // scoreboard / stat
    let pts: number = 0;
    let amt: number = 0;

    let timer: Timer = new Timer();
    let avgTime: number = 0;

    // generate random basic math problem
    function problemRandom(mode: string): Problem {
        let problem: Problem = {
            problemStr: "",
            ans: 0,
        };
    
        let firstNum: number;
        let secondNum: number;
        let operator: string;
    
        // generate random problem based on operation mode
        switch (mode) {
            // +
            case "add":
                firstNum = Math.floor(Math.random() * 100);
                secondNum = Math.floor(Math.random() * (100 - firstNum));
                operator = "+";
                problem.ans = firstNum + secondNum;
                break;
            // -
            case "subtract":
                firstNum = Math.floor(Math.random() * 200) - 100;
                secondNum = Math.floor(Math.random() * (200 - firstNum)) - 100;
                operator = "-";
                problem.ans = firstNum - secondNum;
                break;
            // *
            case "multiply":
                firstNum = Math.floor(Math.random() * 14) + 2;
                secondNum = Math.floor(Math.random() * 14) + 2;
                operator = "x";
                problem.ans = firstNum * secondNum;
                break;
            // /
            case "divide":
                const divisor = Math.floor(Math.random() * 14) + 2;
                const dividend = Math.floor(Math.random() * 14 + 1) * divisor;
                firstNum = dividend;
                secondNum = divisor;
                operator = "/";
                problem.ans = firstNum / secondNum;
                break;
            default:
                return problem;
        }   
    
        // convert to string.
        // enclose the negative number (only second number, for display purpose)
        let firstNumStr = `${firstNum}`;
        let secondNumStr = "";
    
        if (secondNum < 0) {
            secondNumStr = `(${secondNum})`;
        } else {
            secondNumStr = `${secondNum}`;
        }
    
        problem.problemStr = `${firstNumStr} ${operator} ${secondNumStr}`;
        return problem;
    }

    function startQM() {
        startBtn.style.display = "none";
        eqEle.style.display = "block";
        introTxt.style.display = "none"
        ansEle.style.display = "flex";
        submitBtn.addEventListener("click", () => { 
            if (ansInp.value.length !== 0) {
                submitAns();
            }
        });
        setupProblem()
    }

    function randOp(): string {
        let mode: string = "";

        // random the operator (25% chance each)
        const randomNumber: number = Math.random();
        if (randomNumber < 0.25) {
            mode = "add";
        } else if (randomNumber < 0.5) {
            mode = "subtract";
        } else if (randomNumber < 0.75) {
            mode = "multiply";
        } else {
            mode = "divide";    
        }

        return mode;
    }

    function setupProblem() {
        currentProb = problemRandom(randOp());
        eqEle.innerHTML = currentProb.problemStr;
        ansInp.addEventListener("keydown", function(event) {
            if (event.key === "Enter" && ansInp.value.length === 0) {
                event.preventDefault();
            }
            else if (event.key === "Enter") {
                event.preventDefault();
                console.log(ansInp.value);
                submitAns();
            }
        });

        // setup current problem scoreboard
        amt += 1;
        timer.start()
    }

    function submitAns() {
        // handle time and timer
        const timeUsed: number = timer.getTime()/1000;
        calculateAvgTime(timeUsed);
        timer.stop();
        timer.reset();
        
        // get input answer (if answer is blank, use 0)
        const ansVal = (ansInp.value !== "" ? parseInt(ansInp.value) : 0);
        
        // check anwer
        if (ansVal === currentProb.ans) {
            pts += 1;
        }
        accEle.innerHTML = (pts/amt*100).toFixed(2)
        spdEle.innerHTML = avgTime.toFixed(2).toString();
        scoreEle.innerHTML = pts.toString();
        accEle.innerHTML = (pts/amt * 100).toFixed(2).toString();
        ansInp.value = "";
        setupProblem()
    }

    function calculateAvgTime(newTime: number) {
        // calculate average time used
        avgTime =  (avgTime + newTime) / 2;
    }

    function run() {
        startBtn.addEventListener("click", startQM);
        setInterval(() => {
            const timeInSec = Math.round(timer.getTime() / 1000);
            timerEle.innerHTML = timeInSec.toString();
        }, 100)

    }

    run();
})();
