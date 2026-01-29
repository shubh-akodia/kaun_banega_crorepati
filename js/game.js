window.onload = function () {

    // variables
    var questionText = document.getElementById("question");
    var timerSpan = document.getElementById("time");
    var startBtn = document.getElementById("start");
    var lockBtn = document.getElementById("lock");
    var optionsBox = document.getElementsByClassName("opt");
    var prizeButtons = document.getElementsByClassName("rupees_class");

    var questions = [];
    var currentQuestionIndex = 0;
    var correctAnswer = "";
    var userAnswered = false;
    var timer;
    var level = 0;

    // lifelines
    var fifty50 = false;
    var poll = false;
    var swap = false;
    var call = false;

    //  START BUTTON
    startBtn.onclick = function () {
        userAnswered = false;
        clearInterval(timer);
        level = 0;
        currentQuestionIndex = 0;
        resetPrizeColors();
        fetchQuestions();

        fifty50 = false;
        poll = false;
        swap = false;
        call = false;
        enableLifelineButtons();

        lockBtn.disabled = true;


    };
    document.getElementById("clickToStart").onclick = function () {
        let audio = document.getElementById("start_audio");
        audio.play();
        this.style.display = "none"; 
    };





    function enableLifelineButtons() {
        document.getElementById("fifty_fifty").disabled = false;
        document.getElementById("audience_poll").disabled = false;
        document.getElementById("swap").disabled = false;
        document.getElementById("call").disabled = false;
    }

    function resetPrizeColors() {
        for (var i = 0; i < prizeButtons.length; i++) {
            prizeButtons[i].style.backgroundColor = "";
        }
    }

    function decodeHTML(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    function fetchQuestions() {
        fetch("https://opentdb.com/api.php?amount=20&category=18&difficulty=easy&type=multiple")
            .then(res => res.json())
            .then(data => {
                questions = data.results;
                loadQuestion();
                startTimer();
            });
    }

    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            alert("You completed all questions!");
            return;
        }

        var result = questions[currentQuestionIndex];

        questionText.innerHTML = decodeHTML(result.question);
        correctAnswer = decodeHTML(result.correct_answer);
        userAnswered = false;

        var mix = [...result.incorrect_answers.map(ans => decodeHTML(ans))];
        mix.push(correctAnswer);

        // shuffle options
        for (var i = mix.length - 1; i > 0; i--) {
            var r = Math.floor(Math.random() * (i + 1));
            var temp = mix[i];
            mix[i] = mix[r];
            mix[r] = temp;
        }

        for (var i = 0; i < optionsBox.length; i++) {
            optionsBox[i].querySelector(".txt").innerHTML = mix[i];
            optionsBox[i].classList.remove("locked", "correct", "wrong");
            optionsBox[i].style.pointerEvents = "auto";
            optionsBox[i].style.visibility = "visible";
            optionsBox[i].style.backgroundColor = "";
        }

        lockBtn.disabled = true;
    }

    function highlightPrize() {
        var index = prizeButtons.length - 1 - level;
        prizeButtons[index].style.backgroundColor = "skyblue";
        level++;
    }

    //  OPTION CLICK
    for (var i = 0; i < optionsBox.length; i++) {
        optionsBox[i].onclick = function () {
            if (userAnswered) return;

            userAnswered = true;
            clearInterval(timer);

            tickAudio.pause();
            tickAudio.currentTime = 0;


            var clickedAns = this.querySelector(".txt").innerHTML;

            if (clickedAns === correctAnswer) {
                this.classList.add("correct");
                let correctAudio = document.getElementById("correct_sound");
                correctAudio.currentTime = 0;
                correctAudio.play().catch(err => console.log("Correct sound blocked", err));
                highlightPrize();
                lockBtn.disabled = false;
            } else {
                this.classList.add("wrong");
                let wrongAudio = document.getElementById("wrong_sound");
                wrongAudio.play().catch(err => console.log("Wrong sound blocked", err));


                showCorrectAnswer();
                lockAllOptions();
                setTimeout(function () {
                    window.location.href = "gameover.html";
                }, 2000);
            }
        };
    }

    function showCorrectAnswer() {
        for (var j = 0; j < optionsBox.length; j++) {
            if (optionsBox[j].querySelector(".txt").innerHTML === correctAnswer) {
                optionsBox[j].classList.add("correct");
            }
        }
    }

    function lockAllOptions() {
        for (var j = 0; j < optionsBox.length; j++) {
            optionsBox[j].classList.add("locked");
            optionsBox[j].style.pointerEvents = "none";
        }
    }

    //  TIMER
    var timer;
    var timeLeft = 60; 
    var tickAudio = document.getElementById("tick_sound");
    var timerRunning = false; 

    function startTimer() {
        clearInterval(timer);
        timerRunning = true; 

        
        timeLeft = 60;
        if (level >= 7) timeLeft = 90;
        if (level >= 12) timeLeft = 120;

        timerSpan.innerHTML = timeLeft;

        timer = setInterval(function () {
            if (!timerRunning); 

            if (timeLeft <= 0) {
                clearInterval(timer);
                timerSpan.innerHTML = "0";

            
                tickAudio.pause();
                tickAudio.currentTime = 0;

                timerRunning = false;

                if (level >= 7) {
                    userAnswered = true;
                    showCorrectAnswer();
                    lockAllOptions();
                    lockBtn.disabled = false;
                };
            }

            timerSpan.innerHTML = timeLeft;
            timeLeft--;

            // Play tick audio only if timer is running
            tickAudio.currentTime = 0;
            tickAudio.play().catch(err => console.log("Tick blocked", err));

        }, 1000);
    }



    // LOCK BUTTON
    lockBtn.onclick = function () {
        if (!userAnswered) ;


        if (currentQuestionIndex === 15) {
            window.location.href = "pass.html"; 
        }

        currentQuestionIndex++;
        loadQuestion();
        startTimer();
        lockBtn.disabled = true;
    };


    //LIFELINES

    // 50-50
    document.getElementById("fifty_fifty").onclick = function () {
        if (fifty50) ;
        fifty50 = true;
        this.disabled = true;
        this.classList.add("used");

        let wrongOptions = [];

        for (var j = 0; j < optionsBox.length; j++) {
            if (optionsBox[j].querySelector(".txt").innerHTML !== correctAnswer) {
                wrongOptions.push(optionsBox[j]);
            }
        }

        wrongOptions.sort(() => Math.random() - 0.5);

        wrongOptions[0].style.visibility = "hidden";
        wrongOptions[1].style.visibility = "hidden";
    };

    // Audience Poll


    document.getElementById("audience_poll").onclick = function () {

        if (poll) return;
        poll = true;
        this.disabled = true;
        this.classList.add("used");

        // Random base percentages
        let pA = Math.floor(Math.random() * 20) + 10;
        let pB = Math.floor(Math.random() * 20) + 10;
        let pC = Math.floor(Math.random() * 20) + 10;
        let pD = Math.floor(Math.random() * 20) + 10;

        // Correct answer should have highest percentage
        for (let i = 0; i < optionsBox.length; i++) {
            let txt = optionsBox[i].querySelector(".txt").innerHTML;

            if (txt === correctAnswer) {
                if (i === 0) pA = 60;
                if (i === 1) pB = 60;
                if (i === 2) pC = 60;
                if (i === 3) pD = 60;
            }
        }

        Swal.fire({
            title: "📊 Audience Poll",
            html: `
            <div style="font-size:18px;text-align:left;">
                <b>A:</b> <div style="background:#1e90ff;width:${pA}%;height:12px;"></div> ${pA}% <br><br>
                <b>B:</b> <div style="background:#1e90ff;width:${pB}%;height:12px;"></div> ${pB}% <br><br>
                <b>C:</b> <div style="background:#1e90ff;width:${pC}%;height:12px;"></div> ${pC}% <br><br>
                <b>D:</b> <div style="background:#1e90ff;width:${pD}%;height:12px;"></div> ${pD}% <br><br>
            </div>
        `,
            confirmButtonText: "OK"
        });

    };



    // CALL A FRIEND
    document.getElementById("call").onclick = function () {
        if (call); 
        call = true;
        this.disabled = true;
        this.classList.add("used");

        // SweetAlert
        Swal.fire({
            title: "📞 Call a Friend",
            text: "Your friend thinks the answer is: " + correctAnswer,
            icon: "person",
            confirmButtonText: "OK"
        });
    };

    // Swap Question
    document.getElementById("swap").onclick = function () {
        if (swap) return;
        swap = true;
        this.disabled = true;
        this.classList.add("used");

        currentQuestionIndex++;
        loadQuestion();
        startTimer();
    };
    document.getElementById("logo").addEventListener("animationend", function () {
        this.classList.add("spinForever");
    });
};
function quit() {
    window.location.href = 'index.html';
}