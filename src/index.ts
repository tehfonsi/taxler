import Coingecko from './apis/coingecko';

const coingecko = new Coingecko();
const date = new Date();
date.setDate(1);
date.setMonth(7);
date.setFullYear(2021);
coingecko.getPrice('rndr', date).then((id) => console.log(id));
