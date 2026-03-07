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
        .type("a Full-Stack Engineer")
        .pause(900)
        .delete(21)
        .type("a Cloud & Data Platform Engineer")
        .pause(1000)
        .delete(32)
        .type("a Full-Stack & Data Platform Engineer.")
        .go();
    }

    runTyping();
});