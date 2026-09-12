'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const selector = '.home__title--name';

    function runTyping() {
        document.querySelector(selector).innerHTML = '';

        new TypeIt(selector, {
            speed: 85,
            loop: false,
            cursor: true,
            waitUntilVisible: true,
            afterComplete: (instance) => {
                setTimeout(() => {
                instance.destroy();
                runTyping();
                }, 5000);
            }
        })
        .type("I'm Eungchan Kang,")
        .pause(600)
        .break()
        .type("an AI Platform Engineer.")
        .go();
    }

    runTyping();
});
