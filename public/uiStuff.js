let wHeight = $(window).height();
let wWidth = $(window).width();

// Will handle all name values entered
let player = {};

let orbs = [];

let canvas = document.querySelector('#the-canvas');
// Can be set to either 2d or Webgl\2
let context = canvas.getContext('2d');
canvas.width = wWidth;
canvas.height = wHeight;

$(window).load(() => {
    $('#loginModal').modal('show')
});

// For adding a name while playing as a guest
$('.name-form').submit((event) => {
    event.preventDefault();
    // console.log('Submitted');

    player.name = document.querySelector('#name-input').value;
    $('#loginModal').modal('hide');
    $('#spawnModal').modal('show');

    // Grabs the player name for the greeting
    document.querySelector('.player-name').innerHTML = player.name;
});

// Event is not compulsory here as there is not default behaviour
$('.start-game').click((event) => {
    $('.modal').modal('hide');
    $('.hiddenOnStart').removeAttr('hidden');
    init();
});
