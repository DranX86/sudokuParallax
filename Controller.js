"use strict";

function Controller() {
    let self = this,
        myModel = null,
        myView = null,
        windowStartMoveX,  //переменные координат начала и конца движения для обработки свайпа
        windowEndMoveX;

   

    self.init = function (model, view) {
        myModel = model
        myView = view

        self.switchToStateFromURLHash();


        const startButton = document.getElementById('startButton'),
             finishButton = document.getElementById('finishButton'),
            rulesButton = document.getElementById('rulesButton'),
            soundOnOffButton = document.getElementById('soundOnOffButton'),
            tableHighScoreButton = document.getElementById('tableHighScoreButton'),
            closeButton = document.getElementById('close-button'),
            closeMessage = document.getElementById('close-message'),
            toggle = document.getElementById('mobile-menu-toggle');

            
        self.header = document.getElementById('header');

        window.addEventListener('resize', self.resize);     //изменение размера

        window.addEventListener('hashchange', self.switchToStateFromURLHash);   //изменение хэша урла

        window.addEventListener('beforeunload', self.beforeUnload);  //перезагрузка или закрытие страницы

        toggle.addEventListener('click', self.onMobileMenuClick);   //клик на мобильное меню

        startButton.addEventListener('click', self.start);                 //старт-кнопка
        startButton.addEventListener('tap', self.start, {passive: false});

        finishButton.addEventListener('click', self.finish);                 //финиш-кнопка
        finishButton.addEventListener('tap', self.finish, {passive: false});

        rulesButton.addEventListener('click', self.showRules);             //правила

        tableHighScoreButton.addEventListener('click', self.showHighScore);  //таблица рекордов

        soundOnOffButton.addEventListener('click', self.soundOnOff);             //кнопка музыки

        window.addEventListener('touchstart', self.windowTouchStart, {passive: false});    //обработка свайпа
        window.addEventListener('touchend', self.windowTouchEnd, {passive: false});

        closeButton.addEventListener('click', self.showMain);   //главная страница

        closeMessage.addEventListener('click', myView.hideMessageBox);  //кнопка "закрыть сообщение"
    }

    self.resize = function () {
        myModel.resize();
    }

    self.beforeUnload = function(EO) {
        EO = EO || window.event;
        EO.returnValue='Несохраненные данные будут утеряны'
    }

    self.onMobileMenuClick = function () {
        const header = self.header,
            method = header.classList.contains('is-visible') ? 'remove' : 'add';

        header.classList[method]('is-visible');
    }

    self.start = function () {
        myModel.start();
    }

    self.finish = function () {
        myModel.finish();
    }

    self.soundOnOff = function () {
        myModel.soundOnOff();
    }

    
    self.windowTouchStart = function (EO) {       //обрабатываем свайп
        EO = EO || window.event

        let touches = EO.changedTouches;
        windowStartMoveX = touches[0].pageX;
    }

    self.windowTouchEnd = function (EO) {
        EO = EO || window.event

        let touches = EO.changedTouches;
        windowEndMoveX = touches[0].pageX;

        if ((Math.abs(windowEndMoveX - windowStartMoveX) > 200)) {
            if (Math.abs(windowEndMoveX - windowStartMoveX) > 200) {
                if (windowEndMoveX - windowStartMoveX > 0) {
                    self.showRules();
                } else {
                    self.showHighScore();
                }
            }
        }
    }

    self.switchToStateFromURLHash = function () {     //Переключение на УРЛ из Хэша
        let URLHash = window.location.hash,
            stateStr = URLHash.substr(1)    // убираем из закладки УРЛа решётку
        if (stateStr != "") { // если закладка непустая, читаем из неё состояние и отображаем
            myModel.spaState = {pagename: stateStr} // первая часть закладки - номер страницы
        } else {
            myModel.spaState = {pagename: ''}  // иначе показываем главную страницу
        }
        myModel.spaStateChanged();
    }

    self.switchToState = function (newState) {   //Изменение хэша страницы
        let stateStr = newState.pagename;
        location.hash = stateStr;
    }

    self.showRules = function () {                  //Переключение на страницы SPA
        self.switchToState({pagename: 'rules'});
    }

    self.showMain = function () {
        self.switchToState({pagename: ''});
    }

    self.showHighScore = function () {
        self.switchToState({pagename: 'highScore'});
    }
}