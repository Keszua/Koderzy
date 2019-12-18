function gameRoutes(app) {


    let goodAnswers = 0;
    let isGameOver = false;
    let callToFriendUsed = false;
    let questionToTheCrowdUsed = false;
    let halfOnHalfUsed = false;

    const questions = [
        {
            question: 'Jakiego koloru jest czerwony maluch?',
            answers: ['Zielony', 'Czerwony', 'Zółty','Czarny'],
            correctAnswer: 1,
        },
        {
            question: 'Najlepszy język programowania?',
            answers: ['C++', 'Fortran', 'JavaScript','Java'],
            correctAnswer: 2,
        },
        {
            question: 'Czy chcesz zjeść pizzę?',
            answers: ['Nawet dwie!', 'Jestem na diecie', 'Nie, dziękuje','Wolę brokuły'],
            correctAnswer: 0,
        },
    ]


    app.get('/question', (req, res) => {

        if(goodAnswers === questions.length) {
            res.json({
                winner: true,
            });
        } else if (isGameOver) {
            res.json({
                loser: true,
            });
        } else {
            const nextQuestion = questions[goodAnswers];
            
            const {question, answers} = nextQuestion; //destrukturyzacja
            
            res.json({
                question, answers,
            });
        }

    });

    app.post('/answer/:index', (req, res) => {  // po dwukropku podajemy nazwę dowolnej przyjętej ścieżki

        if(isGameOver) {
            res.json({
                loser: true,
            });
        }


        const {index} = req.params; //destrukturyzacja parametru
        //console.log(index);
        const question = questions[goodAnswers];
        
        const isGoodAnswer = question.correctAnswer === Number(index);

        if(isGoodAnswer) {
            goodAnswers++;
        } else {
            isGameOver = true;
        }

        console.log(goodAnswers);

        // if(question.correctAnswer === Number(index)) {
        //     res.json({
        //         correct: true
        //     });
        // } else {
        //     res.json({
        //         correct: false
        //     });
        // }

        //to samo co wyżej, tylko krócej:
        //res.json({
        //    correct: question.correctAnswer === Number(index) ? true : false,
        //});

        //to samo co wyżej, tylko jeszcze krócej:
        res.json({
            correct: isGoodAnswer,
            goodAnswers,
        });

    });


}

module.exports = gameRoutes;