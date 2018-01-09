/*
* Custom.js This file contains all the necessary logic to run the memory game
*/

$(document).ready(function(){

  // This variable contains all required methods and variables for the memory game
  var memoryGame = {

    // Card figures
    figures: ['bicycle', 'leaf', 'cube', 'anchor', 'bolt', 'diamond', 'bomb', 'empire'],

    moves: 0,

    timer: null,

    // Start the memory game
    startGame: function() {

      // Setup timer for
      timer = new Timer();

      timer.addEventListener('secondsUpdated', function (e) {
        $('.game-timer').html(timer.getTimeValues().toString());
      });

      // Append other set of figures
      this.figures = this.figures.concat(this.figures);

      // Generate memory game cards
      this.generateCards();
    },

    // Shuffle figures (*Updated version from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
    shuffle: function() {

      // Loop through array backwards
      for (var i = this.figures.length - 1; i > 0; i--) {

        // Random number between i and 1
        var rand = Math.floor(Math.random() * (i + 1));

        // Make sure it's not the same card (*updated with if statement to remove redundancy if same index)
        if (i != rand) {
          var temp = this.figures[i];
          this.figures[i] = this.figures[rand];
          this.figures[rand] = temp;
        }
      }
    },

    // Assign figures to card elements within the Memory table
    generateCards: function() {

      // Empty table
      $('.m-table').empty();

      // Shuffle figures
      this.shuffle();

      // Append cards to table
      for (var i = 0; i < this.figures.length; i++) {
        $('.m-table').append($('<li id=" card-' + i + '" class="card wow"></li>'));
      }

      this.flip(this.figures);
    },

    // Flips a card
    flip: function(figures) {

      $('.card').click(function() {

        // Check if player selected a maximum of 2 cards and they are not already matched
        if (!$(this).hasClass('matched') && !$(this).hasClass('selected') && $('.selected').length < 2) {

          $(this).addClass('selected');

          // Retrieve card id index
          var cardId = $(this).attr('id').substr(6);

          // Retrieve figure class
          var figureClass = 'fa-' + figures[cardId];

          // Retrieve icon tag and replace default class with figure class
          $(this).append('<i class="fa ' + figureClass + '"></i>');

          memoryGame.isAMatch();
        }
      });
    },

    // Check if we have a Match
    isAMatch: function() {

      setTimeout(function() {

        // If 2 cards have been selected
        if ($('.selected').length === 2) {

          // Update score panel
          $('.score-panel').find('.moves').html(++memoryGame.moves);

          memoryGame.rating(memoryGame.moves);

          // If the selected cards match
          if ($('.selected').first().find('i').attr('class').substr(6) === $('.selected').last().find('i').attr('class').substr(6)) {

            $('.selected').each(function() {
              $(this).addClass('matched bounce').removeClass('selected');
            });

            memoryGame.winGame();

          } else {

            // Remove icons
            $('.selected').empty();
          }

          // Deselect cards
          $('.selected').each(function() {
            $(this).removeClass('selected');
          });
        }
      }, 1000);
    },

    // Set player rating (stars)
    rating: function(moves) {

      var numCards = memoryGame.figures.length;

      var starRating = [numCards + 6, numCards + 4, numCards + 2];

      if (moves > starRating[2] && moves < starRating[1]) {
        $('.score-panel').find('i').eq(2).removeClass('fa-star').addClass('fa-star-o');

      } else if (moves > starRating[1] && moves < starRating[0]) {

        $('.score-panel').find('i').eq(1).removeClass('fa-star').addClass('fa-star-o');

      }
    },

    // Check if it's a win
    winGame: function() {

      if ($('.matched').length === $('.card').length) {

        timer.stop();

        // Add score panel to win popup
        $('.score-panel').clone().insertBefore('#win-popup .m-btn');

        // Display win popup
        $.magnificPopup.open({
          items: {
            src: '#win-popup',
          },
          type: 'inline'
        });

        memoryGame.generateCards();
      }
    }
  };

  memoryGame.startGame();

  $('.open-popup-link').magnificPopup({
    mainClass: 'mfp-fade',
    removalDelay: 160,
    type:'inline',
    midClick: true,
    overflowY: 'hidden'
  });

  $('#restart').click(function() {
    memoryGame.startGame();
  });

  // Start timer once the first card is clicked
  $('.card').one('click', function() {
    timer.start();
  });
});
