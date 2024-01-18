'use strict';

new TypeIt('.home__title--strong', {
    loop: true,
    speed: 100,
}) // Eungchan
.move(-9) // |
.type('front-end engineer, ') // front-end engineer|
.pause(1000)
.move(-10)  // front-end| engineer
.delete(10)  // | engineer
.type('back-end ')  // back-end| engineer
.pause(1000)
.delete(10) //| engineer
.type('full-stack ') //full-stack| engineer
.pause(1000)
.move(19)
.delete()
.go();