

$(function(){
    $.getJSON('quiz-play').then(res => {
        console.log(res);
        $(".play-quiz").click(function(){
            let clickedID = $(this).attr("id").replace(/\D+/g,'');
            console.log('button clicked');
            console.log(`it's ID was ${clickedID}`);
            console.log(res[clickedID].questions[0]);
        })
    });

    




})
