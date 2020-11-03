

$(function(){
    $.getJSON('quiz-play').then(res => {

        const frontPageElements = $("#found-quizzes");

        $(".play-quiz").click(function(){
            let clickedID = $(this).attr("id").replace(/\D+/g,'');
            
            let currentQuestion = 0;

            let userScore = 0;

            for (let i = 0; i < res[clickedID].questions.length; i++){
                res[clickedID].questions[i] = res[clickedID].questions[i].replace("?", "");
            }


            $("body").append(`
            <div class="game-on quiz-card">
                <h3 class="quiz-title">${res[clickedID].title}</h3>
                <h4 class="question-number">Question Number ${currentQuestion +1}</h4>
                <p class="quiz-question">${res[clickedID].questions[currentQuestion]}?</p>
                <input type="text" placeholder="Enter the your guess" class="user-input" id="play-answer">
                <button class="guess-btn submit-btn" id="submit-guess" type="submit">Go!</button>
                <p class="user-score">Current Score: ${userScore}/${res[clickedID].questions.length}</p>                
            </div>`)
                frontPageElements.fadeOut(400, function(){
                $(".game-on").fadeIn(400);
            });
        
            $("#submit-guess").click(function(){
                let userGuess = $("#play-answer").val();

                if (userGuess.toLowerCase().replace(/\s/g,'') === res[clickedID].answers[currentQuestion].toLowerCase().replace(/\s/g,'')){
                    userScore++;
                    alert('You were correct');
                    currentQuestion++;

                } else {
                    alert(`You were incorrect. The answer was ${res[clickedID].answers[currentQuestion]}`);
                    currentQuestion++;
                };

                $("#play-answer").val('');

                if (currentQuestion === res[clickedID].questions.length){
                    $(".game-on").empty().append(`
                    <p class="user-score">You scored: ${userScore}/${res[clickedID].questions.length}!</p>
                    <a href="../index.html" class="completed-btn" id="return-home" type="button">Return Home</button>`)
                };
                $(".question-number").html(`Question Number ${currentQuestion +1}`);
                $(".quiz-question").html(`${res[clickedID].questions[currentQuestion]}?`);
                $(".user-score").html(`Current Score: ${userScore}/${res[clickedID].questions.length}`)
            });

        });
    });

});
