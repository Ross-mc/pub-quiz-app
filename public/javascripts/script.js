
const quizzes = [];

var storedQuizzes = JSON.parse(localStorage.getItem("storedQuizzes"));



$(function(){

    //user can fully make and save quizzes to database
    //to do list includes allowing different types of questions such as true/false or multiple choice

    let currentQuestion = 0;

    let userScore = 0;

    let addBtnClicked = false;

    let clickedID = 0;

    let questionNumber = 1;

    if (storedQuizzes){
        $("#user-created-quizzes").append('<h2 id="user-header">Your Previously Created Quizzes</h2>')
        for (let i = 0; i<storedQuizzes.length; i++){
            $("#user-created-quizzes").append(`
                <form class="quiz-card user-submitted" id="${storedQuizzes[i].title}" method="POST" action="/quizzes" target="uploader_iframe" onsubmit="${i}-btn.disabled = true; return true;">
                    <h3 class="quiz-title">${storedQuizzes[i].title}</h3>
                    <h4 class="num-questions" id="${i}-questions">${storedQuizzes[i].questionArr.length} question</h4>
                    <button class="completed-btn edit-quiz" id="${i}-edit" type="button">Edit Quiz</button>
                    <button class="completed-btn play-quiz" id="${i}-play" type="button">Play Quiz</button>
                    <button class="completed-btn save-quiz" id="${i}-save" name="${i}-btn" type="submit">Save Quiz</button>
                    <input class="hidden-input" id="${i}-title" name="title" value="${storedQuizzes[i].title}">
                    <input class="hidden-input" id="${i}-username" name="username" value="${storedQuizzes[i].name}">
                    <input class="hidden-input" id="${i}-questions" name="questions" value="${storedQuizzes[i].questionArr}">
                    <input class="hidden-input" id="${i}-answers" name="answers" value="${storedQuizzes[i].answerArr}">
                    <iframe id="uploader_iframe" name="uploader_iframe" style="display: none;"></iframe>
                </form>`)
        }
        quizzes.push(...storedQuizzes);
    }

    

    const frontPageElements = $("#home-header, #quiz-starter, #user-created-quizzes, #search");
    const userTitle = $("#user-title");
    const userName = $("#user-name");




    

    //moves the user to the part of the webapp where the quiz is being created
    function createQuiz(quizTitle, quizUser){
        
        //a blank quiz element that takes the user input from the homepage as the title
        class Quiz {
            constructor(title){
                this.answerArr = [];
                this.questionArr = [];
                this.title = title;
                this.name = name;
            };
        };

        //remove any created quizzes from the DOM
        $("#user-created-quizzes").empty();
        
        
        quiz = new Quiz();
        quiz.title = quizTitle;
        quiz.name = quizUser;
        questionNumber = 1;
        
        //the HTML for the quiz builder

        $("body").append(`
            <form class="quiz-card quiz-question-builder">
                <h3 class="quiz-title">${quiz.title}</h3>
                <h4 class="question-number">Question Number ${questionNumber}</h4>
                <input type="text" placeholder="Enter your question" class="user-input" id="user-question" minlength="1">
                <input type="text" placeholder="Enter the correct answer" class="user-input" id="user-answer" minlength="1">
                <button class="submit-btn" id="submit-question" type="button">Submit question</button>                
            </form>`)
            


    };


    //dynamic click listeners

    $("body").on("click", "#submit-question", () => {
        let question = $("#user-question").val();
        question.replace("?", "")
        let answer = $("#user-answer").val();

        if (question.length < 1){
            alert("Please enter a question");
            return
        }

        if (answer.length < 1){
            alert("Please enter an answer")
            return
        }
        quiz.questionArr.push(question);//I need to add form validation here
        quiz.answerArr.push(answer);//and form validation here
        questionNumber++;
        $(".question-number").html(`Question Number ${questionNumber}`);//updates the question number
        $(".user-input").val("");//clears our the inputs

        if (questionNumber === 2){//after at least one question has been submit, add the finish quiz button

            $("#submit-question").after('<button class="finish-btn" id="finish-quiz" type="submit">Finish quiz</button>')
        }

    });


    $("body").on("click", "#finish-quiz", () => {
        if ($("#user-question").val()!=="" && $("#user-answer").val()!==""){
            let question = $("#user-question").val();
            question.replace("?", "")
            let answer = $("#user-answer").val();
            quiz.questionArr.push(question);
            quiz.answerArr.push(answer);

        }
                    

        $("#finish-quiz").remove();//remove the finish button to stop it displaying on home page
        quizzes.unshift(quiz);//save the user created quiz to an array of user created quizzes
        $(".quiz-question-builder").fadeOut(400, function(){

            $(".quiz-question-builder").remove();
            for (let i = 0; i<quizzes.length; i++){

                $("#user-created-quizzes").append(`
                    <form class="quiz-card user-submitted" id="${quizzes[i].title}" method="POST" action="/quizzes" target="uploader_iframe" onsubmit="${i}-btn.disabled = true; return true;">
                        <h3 class="quiz-title">${quizzes[i].title}</h3>
                        <h4 class="num-questions" id="${i}-questions">${quizzes[i].questionArr.length} question</h4>
                        <button class="completed-btn edit-quiz" id="${i}-edit" type="button">Edit Quiz</button>
                        <button class="completed-btn play-quiz" id="${i}-play" type="button">Play Quiz</button>
                        <button class="completed-btn save-quiz" id="${i}-save" name="${i}-btn" type="submit">Save Quiz</button>
                        <input class="hidden-input" id="${i}-title" name="title" value="${quizzes[i].title}">
                        <input class="hidden-input" id="${i}-username" name="username" value="${quizzes[i].name}">
                        <input class="hidden-input" id="${i}-questions" name="questions" value="${quizzes[i].questionArr}">
                        <input class="hidden-input" id="${i}-answers" name="answers" value="${quizzes[i].answerArr}">
                        <iframe id="uploader_iframe" name="uploader_iframe" style="display: none;"></iframe>

                </form>`)//This for loop creates a new quiz card for each user created quiz in the current session.
                if (quizzes[i].questionArr.length > 1){
                    $(".num-questions").text(`${quizzes[i].questionArr.length} questions`)
                }
            };
            localStorage.setItem("storedQuizzes", JSON.stringify(quizzes));
            frontPageElements.fadeIn(400);
        })
    })

    $("body").on("click", ".save-quiz", event => {
        if ($(event.currentTarget).attr("disabled")===true){
            alert('Quiz has already been submitted to the database')
        }


        else {
            setTimeout(function(){
                alert('Quiz submitted');                              
            }, 500);
            
        }

        $(event.currentTarget).css('display', 'none')
    })

    $("body").on('click', ".edit-quiz", event => {
        clickedID = $(event.currentTarget).attr("id").replace(/\D+/g,'');
        currentQuestion = 0;

        addBtnClicked = false;

        const currentQuiz = quizzes[clickedID]

        $("body").append(`
        <div class="game-on quiz-card" id="edit-quiz">
            <h3 class="quiz-title">${currentQuiz.title}</h3>
            <h4 class="question-number">Question Number ${currentQuestion+1}</h4>
            <input type="text" value="${currentQuiz.questionArr[currentQuestion]}" class="user-input" id="edit-question" minlength="1">
            <input type="text" value="${currentQuiz.answerArr[currentQuestion]}" class="user-input" id="edit-answer" minlength="1">
            <button class="move-btn" id="move-right"><i class="fas fa-angle-right"></i></button>
            <button class="move-btn" id="move-left"><i class="fas fa-angle-left"></i></button>
            <button class="submit-btn" id="submit-edited-question" type="button">Save question</button>
            <button class="submit-btn" id="add-new-question" type="button">Add new question</button>
            <button class="finish-btn" id="save-quiz" type="button">Finish Editing</button>                
        </div>`);

        //function for moving between questions in the quiz

        

        frontPageElements.fadeOut(400, function(){
            $(".game-on").fadeIn(400).css('display', '');
        });
    })

    $("body").on('click', '#add-new-question', () => {
        currentQuestion++;
        $(".question-number").html(`Question Number ${currentQuestion+1}`);
        $("#edit-question").val("");                           
        $("#edit-answer").val("");

        addBtnClicked = true;
    })


    $("body").on("click", "#submit-edited-question", () => {
        let question = $("#edit-question").val();
        question.replace("?", "")
        let answer = $("#edit-answer").val();

        const currentQuiz = quizzes[clickedID];
        const questions = currentQuiz.questionArr;
        const answers = currentQuiz.answerArr;

        if (question.length < 1){
            alert("Please enter a question");
            return
        }

        if (answer.length < 1){
            alert("Please enter an answer")
            return
        }
        
        if (addBtnClicked === false){
            questions[currentQuestion] = question;
            answers[currentQuestion] = answer;
            currentQuestion++;
            $(".question-number").html(`Question Number ${currentQuestion+1}`);//updates the question number
            $("#edit-question").val(questions[currentQuestion]);//refreshes the quiz to the next questions                               
            $("#edit-answer").val(answers[currentQuestion]);

            
            if (currentQuestion === questions.length){
                $(".game-on").empty().append(`
                <p class="user-score">You have finished editing the quiz</p>
                <button class="completed-btn" id="return-home" type="submit">Return Home</button>`)
                $("#return-home").click(function(){
                    $(".game-on").fadeOut(400, function(){
                        frontPageElements.fadeIn(400);
                        $(this).remove();
                    })
                });
            }
        } else {
            questions.splice(currentQuestion, 0, question);
            answers.splice(currentQuestion, 0, answer);
            currentQuestion++;
            $(".question-number").html(`Question Number ${currentQuestion+1}`);
            $("#edit-question").val(questions[currentQuestion]);                            
            $("#edit-answer").val(answers[currentQuestion]);
            $(`#${clickedID}-questions`).html(`${questions.length} question(s)`);
            addBtnClicked = false;
        } 
    })


    $("body").on("click", ".move-btn", event => {
        let id = event.currentTarget.id;
        
        const currentQuiz = quizzes[clickedID];
        
        if (id === "move-left"){
            if (currentQuestion===0){
                alert('You are at the beginning of the quiz')
                return;
            } else{
                currentQuestion--;
            }

        } else {
            if (currentQuestion === currentQuiz.questionArr.length-1){
                alert('You are at the end of the quiz')
                return
            } else{
                currentQuestion++;
            }   
        };

        $(".question-number").html(`Question Number ${currentQuestion+1}`);//updates the question number
        $("#edit-question").val(currentQuiz.questionArr[currentQuestion]);//refreshes the quiz to the next questions                               
        $("#edit-answer").val(currentQuiz.answerArr[currentQuestion]);
    })

    



    $("body").on("click", "#save-quiz", ()=> {
        let question = $("#edit-question").val();
        question.replace("?", "")
        let answer = $("#edit-answer").val();

        const currentQuiz = quizzes[clickedID]
        
        if (question.length < 1){
            alert("Please enter a question");
            return
        }

        if (answer.length < 1){
            alert("Please enter an answer")
            return
        }
        
        currentQuiz.questionArr[currentQuestion] = question;//I need to add form validation here
        currentQuiz.answerArr[currentQuestion] = answer;//I need to add form validation here
        currentQuestion++;
        $(".question-number").html(`Question Number ${currentQuestion+1}`);//updates the question number
        $("#edit-question").val(currentQuiz.questionArr[currentQuestion]);                               
        $("#edit-answer").val(currentQuiz.answerArr[currentQuestion]);
        $(`#${clickedID}-questions`).html(`${currentQuiz.questionArr.length} questions`)
        $(".game-on").fadeOut(400, function(){
            $(this).remove();
            frontPageElements.fadeIn(400);

            //come back here
        })
    });



    $("body").on('click', '.play-quiz', event => {
        clickedID = $(event.currentTarget).attr("id").replace(/\D+/g,'');


        currentQuestion = 0;

        userScore = 0;

        const currentQuiz = quizzes[clickedID];
        const quizQuestions = currentQuiz.questionArr;

        for (let i = 0; i < quizQuestions.length; i++){
            quizQuestions[i] = quizQuestions[i].replace("?", "");
        }

        $("body").append(`
            <div class="game-on quiz-card">
                <h3 class="quiz-title">${currentQuiz.title}</h3>
                <h4 class="question-number">Question Number ${currentQuestion +1}</h4>
                <p class="quiz-question">${quizQuestions[currentQuestion]}?</p>
                <input type="text" placeholder="Enter your guess" class="user-input" id="play-answer">
                <button class="guess-btn submit-btn" id="submit-guess" type="submit">Go!</button>
                <p class="user-score">Current Score: ${userScore}/${quizQuestions.length}</p>                
            </div>`)
        frontPageElements.fadeOut(400, () =>{
            $(".game-on").fadeIn(400).css('display', '');
        })
    })

    $("body").on("click", "#submit-guess", () => {
        let userGuess = $("#play-answer").val();

        if (userGuess.toLowerCase().replace(/\s/g,'') === quizzes[clickedID].answerArr[currentQuestion].toLowerCase().replace(/\s/g,'')){
            userScore++;
            alert('You were correct');
            currentQuestion++;
        } else {
            alert(`You were incorrect. The answer was ${quizzes[clickedID].answerArr[currentQuestion]}`);
            currentQuestion++;
        };

        $("#play-answer").val('');

        if (currentQuestion === quizzes[clickedID].questionArr.length){
            $(".game-on").empty().append(`
            <p class="user-score">You scored: ${userScore}/${quizzes[clickedID].questionArr.length}!</p>
            <button class="completed-btn" id="return-home" type="submit">Return Home</button>`)
            
        }


        $(".question-number").html(`Question Number ${currentQuestion +1}`);
        $(".quiz-question").html(`${quizzes[clickedID].questionArr[currentQuestion]}?`);
        $(".user-score").text(`Current Score: ${userScore}/${quizzes[clickedID].questionArr.length}`)
            
    })

    $("body").on('click', '#return-home', event =>{
        $(".game-on").fadeOut(400, () => {
            frontPageElements.fadeIn(400);
            $(".game-on").remove();
        })
        userScore = 0;
    })
   

    $("#start-build-submit").click(function(){

        if (userTitle.val().length < 1){
            alert("Please enter a quiz title");
            return
        };

        if (userName.val().length < 1){
            alert("Please enter your name");
            return
        };
        
        createQuiz(userTitle.val(), userName.val());
        userTitle.val('');
        userName.val('');
        frontPageElements.fadeOut(400, function(){    

            $(".quiz-question-builder").fadeIn(400).css('display', '');
        }); 
    });

});