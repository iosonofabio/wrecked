import Cookies from '/assets/js.cookie.min.mjs'

let flaresTaken = Cookies.get('flares')

if (flaresTaken == 'true') {
    let paragraphs = document.getElementsByTagName('p');
    
    for(let i = 0; i < paragraphs.length; i++) {
        let paragraph = paragraphs[i];
        if (paragraph.innerHTML.startsWith("R: ")) {
            let sentences = paragraph.innerHTML.split('.');
            sentences[0] = 'R: Flares were already taken';
            paragraph.innerHTML = sentences.join('.');

        }
    }
} else {
    Cookies.set('flares', 'true',  { sameSite: 'strict' });
}
