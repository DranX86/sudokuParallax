"use strict";

function Model() {
    
    let self = this,
        myView = null,
        myController = null,
        w,   //переменная для стартового судоку
        numberDifficult = 50, // сложность (кол-во стартовых заполненнных ячеек судоку)
        score = 0,
        timer = 0,
        cellWidthHeight;   //размер ячейки
       

    self.resize = function () {    //запускаем функцию изменения размера
        cellWidthHeight = myView.buildScreen();  //пересчитываем размеры   
    }

    self.init = function (view, controller) {
        myView = view;
        myController = controller;  
    }

    self.start = function () {    // начало игры 
        score = 500;

        if (timer) {
            clearInterval(timer);
        }
        timer = 0;
        myView.deleteField();
        cellWidthHeight = myView.buildScreen();  //расчитать размеры элементов и поля
    
        timer = setInterval(animateScore, 1000);

        function animateScore() {               //таймер
            myView.updateScore(score);
            score--
            if(score===0){
                 clearInterval(timer);
                myView.updateTableHighScore(score)
            }
            console.log(score)
        }
        
        myView.updateScore(score);  //обновить шаги и счет
       
        w = Sudoku.generate(numberDifficult);  //запускаем судоку 
        document.querySelector('.game').append(w.getHTML(100));

    }
   
    self.finish = function () {           // конец игры
       if(w.isSolved ){
        myView.updateTableHighScore(score) }
       else(alert('судоку не решен') )
    }

    self.soundOnOff = function () {
        myView.soundOnOff();
    }

    self.spaState = {}
    let flag = false;

    self.spaStateChanged = function () {       //изменение состояния в зависимости от хэша
        switch (self.spaState.pagename) {
            case 'rules':
                if (flag === 2 || flag === 1 || !flag) {
                    myView.showPage('rules');
                } else if (flag === 3) {
                    myView.hidePage();
                    setTimeout(timeOutRules, 500);
                }
                flag = 1
                break
            case '':
                if (flag === 1 || flag === 3) {
                    myView.hidePage();
                }
                flag = 2
                break
            case 'highScore':
                if (flag === 2 || flag === 3 || !flag) {
                    myView.showPage('highScore');
                } else if (flag === 1) {
                    myView.hidePage();
                    setTimeout(timeOutHighScore, 500);
                }
                flag = 3
                break
        }

        function timeOutRules() {
            myView.showPage('rules');
        }

        function timeOutHighScore() {
            myView.showPage('highScore');
        }
    }

    self.gameOver = function () {
        score = 0;
        if (timer) {
            clearInterval(timer);
        }
        timer = 0;
        myView.updateScore(score);
        myView.deleteField();
    }
}