/* One small pixel souvenir per city on Darcie's route. The first focus round finished while she is
   in a city puts that city's souvenir on the shelf at the top of the screen. */
(function(){
"use strict";
var PAL = {R:"#c8412f", G:"#4f8a5b", B:"#4f86b8", Y:"#e6b26a", W:"#ffffff", K:"#26242b", D:"#8a8791", O:"#d9772e", P:"#f28b9a", T:"#b98b5a", L:"#f3ead9", V:"#7a5a9a"};
var S = {
jasper:["松果","...G....","..TTT...",".TKTKT..",".TTKTT..",".TKTKT..",".TTKTT..","..TKT...","...T...."],
banff:["雪山","....W...","...WWW..","..WDDW..","..DDDD..",".DDDDDD.",".DDDDDDD","DDDDDDDD","GGGGGGGG"],
vancouver:["枫叶","...R....",".R.R.R..",".RRRRR..","RRRRRRR.",".RRRRR..","..RRR...","...T....","...T...."],
sapporo:["雪人","..KKK...","..WWW...","..WKW...",".OWWW...",".WWWWW..",".WWKWW..",".WWWWW..","..WWW..."],
tokyo:["达摩","..RRRR..",".RRRRRR.","RLLLLLLR","RLKLLKLR","RRLLLLRR","RRRYYRRR",".RRYYRR.","..RRRR.."],
kyoto:["鸟居","RRRRRRRR",".RRRRRR.","..R..R..",".RRRRRR.","..R..R..","..R..R..","..R..R..","..R..R.."],
nara:["石灯笼","...D....","..DDD...",".DDDDD..","..DYD...","..DYD...",".DDDDD..","...D....","..DDD..."],
seoul:["太极","..RRRR..",".RRRRRR.","RRRRRBBR","RRRRBBBB","RRRBBBBB","RBBBBBBB",".BBBBBB.","..BBBB.."],
luohe:["胡辣汤","..L..L..",".L..L...","..L..L..","TTTTTTTT","TOOOOOOT",".TOOOOT.",".TTTTTT.","..TTTT.."],
chengdu:["熊猫","KK....KK","KWWWWWWK",".WKWWKW.",".WKWWKW.",".WWWWWW.",".WWKKWW.","..WWWW..","........"],
singapore:["榴莲","...T....","..GGGG..",".GYGYGG.","GGGGGYG.","GYGGGGG.","GGGYGYG.",".GGGGG..","..GGG..."],
sydney:["回旋镖","TT......","TTT.....",".TTT....","..TTT...","..TTT...",".TTT....","TTT.....","TT......"],
capetown:["企鹅","..KKK...",".KKKKK..",".KWKWK..",".KWOWK..","KKWWWKK.","KKWWWKK.",".KWWWK..",".OO.OO.."],
marrakech:["塔吉锅","...O....","...O....","..OOO...","..OOO...",".OOOOO..",".OOOOO..","TTTTTTT.",".TTTTT.."],
lisbon:["黄色电车","...K....",".YYYYYY.",".YBYBYY.",".YBYBYY.",".YYYYYY.",".WWWWWW.",".YYYYYY.","..K..K.."],
barcelona:["马赛克",".B.Y.O..","BBYYOO..",".BGYRO..","GGBBRR..",".GYBRY..","YYOOGG..",".Y.O.G..","........"],
nice:["遮阳伞","..RRRR..",".RWRWRR.","RWRWRWRR","...T....","...T....","...T....","...T....","YYYYYYYY"],
rome:["披萨","TTTTTTTT",".YYRYYY.",".YRYYRY.","..YYRY..","..YRYY..","...YY...","...YY...","....Y..."],
florence:["冰淇淋","..PPP...",".PPPPP..",".PWPPP..",".PPPPP..",".TTTTT..","..TTT...","..TTT...","...T...."],
venice:["贡多拉","K......K","K......K","KK....KK",".KKKKKK.","..KKKK..","BBBBBBBB",".B.B.B.B","........"],
zermatt:["奶酪","........","......YY","....YYYY","..YYYOYY","YYYYYYYY","YOYYYYOY","YYYYOYYY","YYYYYYYY"],
lyon:["可颂","........","..TTTT..",".TOTOTT.","TTOTOTTT","TOT..TOT","TT....TT","T......T","........"],
paris:["小铁塔","...D....","...D....","..DDD...","..D.D...","..DDD...",".DD.DD..",".D...D..","DD...DD."],
msm:["修道院","...D....","...D....","..DDD...","..DYD...",".TDDDT..",".TTTTTT.","TTTTTTTT","BBBBBBBB"],
amsterdam:["郁金香",".R.R.R..",".RRRRR..",".RRRRR..","..RRR...","...G....",".G.G....","..GG....","...G...."],
london:["红色巴士","RRRRRRRR","RBRBRBRR","RRRRRRRR","RBRBRBRR","RRRRRRRR","RRRRRRRR",".K....K.","........"],
reykjavik:["冰山","...W....","..WWW...","..WLW.W.",".WWLWWW.",".WLLWLW.","BBBBBBBB",".LBLLBL.","..BLLB.."],
newyork:["苹果","....T...","...TG...",".RR.RR..","RRRRRRR.","RRRRRWR.","RRRRRRR.",".RRRRR..","..R.R..."],
montreal:["贝果","..TTTT..",".TTLTTT.","TTT..TLT","TL....TT","TT....LT","TTT..TTT",".TLTTTT.","..TTTT.."],
quebec:["枫糖浆","...KK...","...TT...","..TTTT..","..OOOO..",".OOROOO.",".OOOOOO.",".OOOOOO.","..OOOO.."],
ottawa:["冰刀鞋",".WW.....",".WW.....",".WW.....",".WWW....",".WWWWW..",".WWWWWW.","..D..D..","DDDDDDDD"]
};
window.Souvenirs = {
  keys: Object.keys(S),
  name: function(k){ return S[k] ? S[k][0] : ""; },
  canvas: function(k, scale){
    var rows = S[k] ? S[k].slice(1) : [], c = document.createElement("canvas"), x, y, g;
    c.width = 8; c.height = 8; c.style.width = 8 * scale + "px"; c.style.height = 8 * scale + "px";
    c.style.imageRendering = "pixelated"; g = c.getContext("2d");
    for (y = 0; y < rows.length; y++) for (x = 0; x < 8; x++) if (rows[y][x] && rows[y][x] !== "."){ g.fillStyle = PAL[rows[y][x]]; g.fillRect(x, y, 1, 1); }
    return c;
  }
};
})();
