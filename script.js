(function () {
    // timer class
    var Timer = /** @class */ (function () {
        function Timer() {
            this.running = false;
            this.startTime = 0;
        }
        Timer.prototype.start = function () {
            if (this.running) {
                return console.error("Timer is stopped.");
            }
            this.running = true;
            this.startTime = Date.now();
        };
        Timer.prototype.stop = function () {
            if (!this.running) {
                return console.error('Timer is already stopped');
            }
            this.running = false;
        };
        Timer.prototype.reset = function () {
            if (this.running) {
                this.startTime = Date.now();
                return;
            }
            this.startTime = 0;
        };
        Timer.prototype.getTime = function () {
            if (!this.running) {
                return 0;
            }
            else {
                return Date.now() - this.startTime;
            }
        };
        return Timer;
    }());
    var timerEle = document.getElementById("timer");
    var scoreEle = document.getElementById("score");
    var spdEle = document.getElementById("spd");
    var accEle = document.getElementById("acc");
    var introTxt = document.getElementById("intro");
    var startBtn = document.getElementById("start");
    var eqEle = document.getElementById("equation");
    var ansEle = document.getElementById("inputAns");
    var ansInp = document.getElementById("answer");
    var submitBtn = document.getElementById("submitAns");
    // problem part
    var currentProb;
    // scoreboard / stat
    var pts = 0;
    var amt = 0;
    var timer = new Timer();
    var avgTime = 0;
    // generate random basic math problem
    function problemRandom(mode) {
        var problem = {
            problemStr: "",
            ans: 0,
        };
        var firstNum;
        var secondNum;
        var operator;
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
                var divisor = Math.floor(Math.random() * 14) + 2;
                var dividend = Math.floor(Math.random() * 14 + 1) * divisor;
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
        var firstNumStr = "".concat(firstNum);
        var secondNumStr = "";
        if (secondNum < 0) {
            secondNumStr = "(".concat(secondNum, ")");
        }
        else {
            secondNumStr = "".concat(secondNum);
        }
        problem.problemStr = "".concat(firstNumStr, " ").concat(operator, " ").concat(secondNumStr);
        return problem;
    }
    function startQM() {
        startBtn.style.display = "none";
        eqEle.style.display = "block";
        introTxt.style.display = "none";
        ansEle.style.display = "flex";
        submitBtn.addEventListener("click", function () {
            if (ansInp.value.length !== 0) {
                submitAns();
            }
        });
        setupProblem();
    }
    function randOp() {
        var mode = "";
        // random the operator (25% chance each)
        var randomNumber = Math.random();
        if (randomNumber < 0.25) {
            mode = "add";
        }
        else if (randomNumber < 0.5) {
            mode = "subtract";
        }
        else if (randomNumber < 0.75) {
            mode = "multiply";
        }
        else {
            mode = "divide";
        }
        return mode;
    }
    function setupProblem() {
        currentProb = problemRandom(randOp());
        eqEle.innerHTML = currentProb.problemStr;
        ansInp.addEventListener("keydown", function (event) {
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
        timer.start();
    }
    function submitAns() {
        // handle time and timer
        var timeUsed = timer.getTime() / 1000;
        calculateAvgTime(timeUsed);
        timer.stop();
        timer.reset();
        // get input answer (if answer is blank, use 0)
        var ansVal = (ansInp.value !== "" ? parseInt(ansInp.value) : 0);
        // check anwer
        if (ansVal === currentProb.ans) {
            pts += 1;
        }
        accEle.innerHTML = (pts / amt * 100).toFixed(2);
        spdEle.innerHTML = avgTime.toFixed(2).toString();
        scoreEle.innerHTML = pts.toString();
        accEle.innerHTML = (pts / amt * 100).toFixed(2).toString();
        ansInp.value = "";
        setupProblem();
    }
    function calculateAvgTime(newTime) {
        // calculate average time used
        avgTime = (avgTime + newTime) / 2;
    }
    function run() {
        startBtn.addEventListener("click", startQM);
        setInterval(function () {
            var timeInSec = Math.round(timer.getTime() / 1000);
            timerEle.innerHTML = timeInSec.toString();
        }, 100);
    }
    run();
})();
