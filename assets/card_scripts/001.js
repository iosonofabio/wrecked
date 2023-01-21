import Cookies from '/assets/js.cookie.min.mjs'

Cookies.set('start', 'true',  { sameSite: 'strict' });


// Unset other cookies from the game
Cookies.set('gyroscope', 'false',  { sameSite: 'strict' });
Cookies.set('flares', 'false',  { sameSite: 'strict' });
Cookies.set('thermallance', 'false',  { sameSite: 'strict' });
Cookies.set('fin', 'false',  { sameSite: 'strict' });
Cookies.set('heliox', 'false',  { sameSite: 'strict' });
