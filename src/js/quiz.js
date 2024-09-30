//quiz
(function(){
    document.addEventListener('DOMContentLoaded',function () {
        
        var data = window.quizData || null;

        if(!data || !document.getElementById('quiz')){
            return;
        }
        var explanation, overlay, backBtn ;
        var question = data.questions[Math.floor(Math.random()*data.questions.length)]
        buildQuiz(question);
        enableUi();
        
        function buttonClicked(event){
            var id = parseInt(event.target.dataset.id);
            explanation.innerHTML = question.answers[id].explanation;
            overlay.classList.add('active');
        }

        function enableUi(){
             explanation = document.getElementById('explanation');
             overlay = document.getElementById('quiz-overlay');
             backBtn = document.getElementById('back');
            
            var btns = document.querySelectorAll('.quiz button');
            btns.forEach(function (btn) {
            btn.addEventListener('click', buttonClicked);
            
            backBtn.addEventListener('click',function (event) {
                overlay.classList.remove('active');
                explanation.innerHTML = '';
            });
        });

    }

    function buildQuiz(question){
        var html = '<div class="quiz">' + 
            (question.headline ? '<h3>'+question.headline+'</h3>' : '' ) + 
            '<p class="quiz-question text-center">'+question.question+'</p>';
            question.answers.forEach(function(el,index){
                html += '<button data-id="'+index+'" class="quiz-choice">'+el.label+'</button>'
            });
        html += '</div>';
        html += '<div id="quiz-overlay">'+
                '<div id="explanation"></div>'+
                '<button id="back">Back</button>'+
            '</div>';

        document.getElementById('quiz').innerHTML = html;
    }
    });
})()