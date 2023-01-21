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

function onSearchCard() {
  let cardNumber = document.getElementById("searchCardForm").searchCardText.value;

  // Reset field
  document.getElementById("searchCardForm").searchCardText.value = "";

  // Validate card number
  let validationResult = validateCardNumber(cardNumber);
  if (validationResult['valid'] == false) {
    alert("Type a valid 3-digit card number");
  }
  cardNumber = validationResult['cardNumber'];
  cardText = validationResult['cardText'];

  // Prepare the card text
  let cardTextInnerHTML = [];
  for (let i = 0; i < cardText.length; i++) {
    let par = cardText[i];
    let parClass = "cardTextNormal";
    if (par.startsWith('R:')) {
      parClass = "cardTextRule";
    }
    let parFormatted = '<p class="' + parClass + '">';
    if (par.startsWith('R:')) {
      parFormatted += '<strong>RULE:</strong>' + par.slice(2)
    } else {
      parFormatted += par;
    }
    parFormatted += '</p>';
    cardTextInnerHTML.push(parFormatted);
  }
  cardTextInnerHTML = cardTextInnerHTML.join('\n');

  // Change the card title and text
  document.getElementById("cardName").innerHTML = cardNumber;
  document.getElementById("cardText").innerHTML = cardTextInnerHTML;

  // Update tokens
  updateTokens(cardNumber);

}
