function updateTokens(currentCard) {
    let tokenStorage = wreckedStorage['tokens'];

    switch (currentCard) {
        case "001":
            tokenStorage['start'] = true;
            break;
        case "022":
            tokenStorage['gyroscope'] = true;
            break;
        case "103":
            tokenStorage['flares'] = true;
            break;
        case "212":
            tokenStorage['fin'] = true;
            break;
        case "212":
            tokenStorage['heliox'] = true;
            break;
        case "222":
            tokenStorage['thermallance'] = true;
            break;
        default:
            if (currentCard.startsWith('L')) {
                tokenStorage['lower'] = true;
            }
            break;
    }
}


function updateParagraphBasedOnTokens(currentCard, paragraph) {
    return paragraph;
}

function validateCardNumber(cardNumber) {
  validationResult = {
    'valid': false,
    'cardNumber': cardNumber,
    'cardText': '',
  }
  if (cardNumber.length == 0) {
      return validationResult;
  } else if (cardNumber.length > 3) {
      return validationResult;
  } else if (cardNumber.length == 1) {
    cardNumber = '00' + cardNumber;
  } else if (cardNumber.length == 2) {
    cardNumber = '0' + cardNumber;
  }

  let cardText = wreckedStorage['text'][cardNumber];
  if (cardText == undefined) {
      return validationResult;
  }
  validationResult['valid'] = true;
  validationResult['cardNumber'] = cardNumber;
  validationResult['cardText'] = cardText;
  return validationResult;
}


function renderCardText(cardParas) {

  // Prepare the card text
  let cardTextInnerHTML = [];
  for (let i = 0; i < cardParas.length; i++) {
    let par = cardParas[i];
    let parClass = "cardTextNormal";
    if (par.startsWith('R:')) {
      parClass = "cardTextRule";
    } else if (par.startsWith('(Q')) {
      parClass = "cardTextQuestion";
    } else if (par.startsWith('(A-Y')) {
      parClass = "cardTextAnswerYes";
    }
    let parFormatted = '<p class="' + parClass + '">';
    if (par.startsWith('R:')) {
      parFormatted += '<strong>RULE:</strong>' + par.slice(2)
    } else if (par.startsWith('(Q):')) {
      parFormatted += '<strong>Question:</strong>' + par.slice(4)
    } else if (par.startsWith('(A')) {
      parFormatted += par.slice(6)  // e.g. (A-Y): bla bla
    } else {
      parFormatted += par;
    }
    parFormatted += '</p>';
    cardTextInnerHTML.push(parFormatted);
  }
  cardTextInnerHTML = cardTextInnerHTML.join('\n');

  return cardTextInnerHTML;
}


function swapCardWithTransition(cardNumber, cardTextInnerHTML) {
  let delay = 0;
  var cardApp = document.getElementById("cardApp");
  let currentCard = document.getElementById("cardName").innerHTML;
  if (currentCard != '') {
    // Randomize delay for some spooky effect, except on first card
    let randomDelay = 1500 * (1.0 - Math.min(20, wreckedStorage['numberCardsSeen']) / 20);
    delay += 500 + randomDelay * Math.random();
    cardApp.style.opacity = '0';
  }

  setTimeout(function() {
    document.getElementById("cardName").innerHTML = cardNumber;
    document.getElementById("cardText").innerHTML = cardTextInnerHTML;
    cardApp.style.opacity = '1';
    // Reduce the randomization over time, to make the experience less
    // frustrating as you go on
    wreckedStorage['numberCardsSeen'] += 1;
  }, delay);
}


function onSearchCard() {
  let cardForm = document.getElementById("searchCardForm")
  let cardNumber = cardForm.searchCardText.value;

  // Reset field
  cardForm.searchCardText.value = "";

  // Validate card number
  let validationResult = validateCardNumber(cardNumber);
  if (validationResult['valid'] == false) {
    alert("Type a valid 3-digit card number");
    return;
  }
  cardNumber = validationResult['cardNumber'];
  let cardParagraphs = validationResult['cardText'];

  // Check if it's the first lower level card
  if (!wreckedStorage['tokens']['lower'] && cardNumber.startsWith('L')) {
      cardParagraphs = wreckedStorage['text']['L00'].concat(cardParagraphs);
  } 

  // Render proper html for the card text paragraphs
  let cardTextInnerHTML = renderCardText(cardParagraphs);

  // Change the card title and text
  swapCardWithTransition(cardNumber, cardTextInnerHTML);

  // Update tokens
  updateTokens(cardNumber);

}

