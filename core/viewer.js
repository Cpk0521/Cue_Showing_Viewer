var params = new URLSearchParams(window.location.search)
var key = params.get('key')
var hero_posit_1 = params.get('char1')
var hero_posit_2 = params.get('char2')
var hero_posit_3 = params.get('char3')
var hero_posit_4 = params.get('char4')

let element = document.getElementById('app')

let app = GameApp.create(element, {
    width : 1334,
    height : 750
})

MoviePlayer.setUp(app)
MoviePlayer.load(`./Assets/data/showing${key.toString().padStart(2, 0)}.json`, {
    hero_posit_1 : hero_posit_1,
    hero_posit_2 : hero_posit_2,
    hero_posit_3 : hero_posit_3,
    hero_posit_4 : hero_posit_4,
})