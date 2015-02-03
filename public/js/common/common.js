window.Snake = window.Snake || {};
(function ($) {
    Snake.Common = Snake.Common || {
        /**
        * Show game Page
        */
        showGameRoom: function () {
            $('.game-screen').show();
            $('.main-screen').hide();
        },
        
        /**
        * Hide game Page
        */
        hideGameRoom: function () {
            $('.game-screen').hide();
            $('.main-screen').show();
        }
    }
}($));