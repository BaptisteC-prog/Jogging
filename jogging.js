
//verobse
//RATIOS
//alert()
let planning = [];
let current = "COURIR"
//quel type de module est au temps time ?
function moduleAt(time) {
    //console.log(planning)
    for (let m in planning) {
        let mod_ = planning[m]
        if (mod_.start + mod_.lasts > time) {
            return mod_
        }
    }
}

if (false) {
    /*
0: defaut legacyyyy  18° ou plus
1: promenade 1:1 21° ou plus
2: ratio 3:1 12-15°
3: ratio 5:1 9-12°
4: ratio 7:1 6-9°
5: ratio 10:1 (classicos) 3-6°
6: One Shot 30:1 3° ou -
7: random 15° ou plus
*/
}
function prepa() {
    //setup
    let BASE = 500; //base de temps des modules 30= 1min40 (x3.333)
    let pp = 5000; //points au total pour la session
    let easy = 0; //temps de repos extra qui rapporte rien (en secondes)
    let mode = 5; //ratio course/repos
    planning = [];
    let pauseDiv = 4; //en combien de fois est fragmentée la pause
    let warmUp = 0;
    //assimilation depuis le formulaire
    BASE = Number(document.getElementById('BASE').value);
    pp = Number(document.getElementById('pp').value);
    easy = Number(document.getElementById('easy').value); //Temps de pause
    mode = Number(document.getElementById('mode').value);
    warmUp = Number(document.getElementById('warmup').value);
    //pas toucher
    let modeText = ["Legacy", "Gentille promenade", "Ratio 3:1", "Ratio 5:1",
        "Ratio 7:1", "Ratio 10:1", "One Shot", "Random"]
    let purple = 0; //purokle , les precieux points purple
    let titre = "Jogging - " + modeText[mode]
    let p = 0; //points courants
    let t = 0 //duree totale
    let ez = 0 //pauses a inserer (compteur du easy courant)
    let wut = 0 //phase 0:marcher 1:courir 2: a fond
    let maxitruc = ""
    let last_d = 0; //recup le module d'avant, pour avoir du repos approprié
    let [mult, mult2, mult3] = [1.2, 1.0, 1.0]
    let quarter = 0; //progression en quarts
    let d = 0; //durée du module
    let texto = ""; //texte du module
    let usePause = false
    let div = document.getElementById("main");
    let divb = document.getElementById("buttons");
    let module = 0; //num modules
    let audioland = document.getElementById("audioland");
    /*for (let i = 1; i < 16; i++) {
        audioland.innerHTML += `<audio id="motiv${i}">
        <source src="motiv${i}.mp3" type="audio/mpeg">
      </audio>`
    }*/

    div.innerHTML = `<div id='titre'>${titre}<p id='timing'>${formatTime(0)}</p></div>`
    // div.innerHTML += ``
    div.innerHTML += `<div id='container-haut'>`
    div.innerHTML += `<div id='textos'>`
    let divTextos = document.getElementById("textos");
    //divTextos.innerHTML = "aaa"
    divTextos.innerHTML += `<ul>`

    while (p < pp) {
        wut++
        module++
        //p += 50// a virer !
        //MULT : basé sur les points, on ralentit sur la fin (sauf si on déborde)
        if (p > pp / 3 && p < pp) { mult = 1.0 }
        if (p > 2 * pp / 3 && p < pp) { mult = 0.8 }
        if (p > pp) { mult = 1.0 }

        //MULT2 : basé sur le temps, quand la session prend trop de temps
        if (t > 10 * BASE) { mult2 = 1.5 }
        if (t > 20 * BASE) { mult2 = 2 }

        //MULT3 : raccourcit les pauses trop longues
        mult3 = 1.0;

        switch (wut % 3) {
            case 0: //MARCHER

                if (rnd() > 0.333 && mode === 0) { mult3 = 0.1 }
                if (rnd() > 0.666 && mode > 0) { mult3 = 0.666 * rnd() }
                // d = la duréee d'un module
                d = 10 * int(rnd() * mult / mult2 * mult3 * BASE)//defaut 1:3 environ
                if (mode === 1) { d = 10 * int(rnd() * mult / mult2 * mult3 * BASE / 3) }//1:1
                if (mode === 2) { d = 10 * int(rnd() * mult / mult2 * mult3 * BASE / 10) }//3:1
                if (mode === 3) { d = 10 * int(rnd() * mult / mult2 * mult3 * BASE / 15) }//5:1
                if (mode === 4) { d = 10 * int(rnd() * mult / mult2 * mult3 * BASE / 21) }//7:1
                if (mode === 5) { d = 10 * int(rnd(0.5) * mult / mult2 * mult3 * BASE / 30) }//10:1
                if (mode === 6) { d = 10 * int(rnd(0.5) * mult / mult2 * mult3 * BASE / 100) }//30:1
                if (mode === 7) { d = 10 * int(rnd(3) * mult / mult2 * mult3 * BASE) }//random

                //le repos est au moins 1/10 du module precedent (avec le bon ratio pour les autres modes)
                if (last_d > 0 && d < 0.1 * last_d && mode === 0) { d = 10 * Math.floor(0.01 * last_d) }
                if (last_d > 0 && d < last_d && mode === 1) { d = 10 * Math.floor(0.1 * last_d) }
                if (last_d > 0 && d < last_d / 3 && mode === 2) { d = 10 * Math.floor(0.0333 * last_d) }
                if (last_d > 0 && d < 0.2 * last_d && mode === 3) { d = 10 * Math.floor(0.02 * last_d) }
                if (last_d > 0 && d < 0.142 * last_d && mode === 4) { d = 10 * Math.floor(0.0142 * last_d) }
                if (last_d > 0 && d < 0.1 * last_d && mode === 5) { d = 10 * Math.floor(0.01 * last_d) }
                if (last_d > 0 && d < 0.03 * last_d && mode === 6) { d = 10 * Math.floor(0.003 * last_d) }

                //bornes universelles
                if (d < 20) { d = 20 }
                if (d > 3600) { d = 3600 + 10 * int((0.1 * d - 360) / 2.0) }
                if (d > 1800) { d = 1800 + 10 * int((0.1 * d - 180) / 2.0) }

                //bornes repos pour le mode 0
                if (mode === 0) {
                    if (d < 60) { d = 60 }
                    if (d > 900) { d = 900 }

                }
                //PAUSE 1ERE PARTIE-------------------------------

                //insertion repos extra (easy stuff)
                let usePause = false
                let add = rint(easy / (20 * pauseDiv))
                if (easy > 0 && ez < easy) {
                    if (0.9 * p / pp > ez / easy) { //le ratio easy doit suivre le ratio de l'avancement en points
                        d += 10 * add; ez += 10 * add;
                        //p -= 2 * add / 3;
                        quarter++;
                        usePause = true
                    }
                }

                //-------------------------------------------------
                //calcul temps duree totale et purple
                let mmm = usePause ? 6 : 3
                planning.push({ ID: module, type: 0, start: t + warmUp, lasts: d, points: int(d / mmm) })

                p += d / mmm
                t += d
                purple -= d / 10
                if (usePause) { purple -= d / 20 }

                texto = `<span class='speed'>MARCHER pendant ${convert(int(d))}</span> ${formatTime(t)}`
                divTextos.innerHTML += `<li class="marcherli" id="module${module}">${texto} (+${int(d / mmm)}/${int(p)}points)</li>`;
                maxitruc += `<div class="marcher" style="width:${int(1000 * d / pp)}px">${texto}</div>`
                if (usePause) {
                    texto = `<span class='speed'>PAUSE pendant ${convert(int(10 * add))}</span> ${formatTime(t + int(10 * add))}`
                    divTextos.innerHTML += `<li class="pauseli" id="module${module}">${texto}</li>`;
                    maxitruc += `<div class="pause" style="width:${int(1000 * d / pp)}px">${texto}</div>`
                    t += int(10 * add)
                }
                /*else {
                   texto = `<span class='speed'>MARCHER pendant ${convert(int(d - 10 * add))}+${convert(10 * add)} de pause</span> t ${formatTime(t)}`
                   maxitruc += `<div class="pause" style="width:${int(1000 * d / pp)}px">${texto}</div>`
               }*/


                //special gentille promenade (mode 1)
                if (rnd() < 0.333 && mode === 1) { wut++ }
                if (rnd() < 0.1 && mode === 1) { wut++ }
                break;

            case 1: //COURIR
                d = 10 * int(rnd() * mult * mult2 * BASE / 3)
                if (mode === 5 || mode === 6) { d = 10 * int(rnd(0.5) * mult * mult2 * BASE / 3) }
                if (mode === 7) { d = 10 * int(rnd(2) * mult * mult2 * BASE / 3) }
                //bornes classicos
                if (d < 30) { d = 30 }
                if (d > 3600) { d = 3600 + 10 * int((0.1 * d - 360) / 4.0) }
                if (d > 1800) { d = 1800 + 10 * int((0.1 * d - 180) / 4.0) }
                //les comptes de la fin
                planning.push({ ID: module, type: 1, start: t + warmUp, lasts: d, points: d })
                p += d
                t += d
                last_d = d
                purple += d / 3

                texto = `<span class='speed'>COURIR pendant ${convert(int(d))}</span> ${formatTime(t)}`
                divTextos.innerHTML += `<li class="courirli" id="module${module}">${texto} (+${int(d)}/${int(p)}points)</li>`;
                maxitruc += `<div class="courir" style="width:${int(1000 * d / pp)}px">${texto}</div>`

                if (rnd() < 0.666) { wut++ } //1 chance sur 3 d'avoir un sprint apres
                break;

            case 2://A FOND
                d = 10 * int(rnd() * mult * mult2 * BASE / 10)
                if (mode < 5 && mode > 0) { d = 10 * int(rnd() * mult * mult2 * BASE / 30) }
                if (mode === 1) { d = 10 * int(rnd(2.0) * mult * mult2 * BASE / 50) }
                if (mode === 5) { d = 10 * int(rnd(0.5) * mult * mult2 * BASE / 30) }
                if (mode === 6) { d = 10 * int(rnd(0.5) * mult * mult2 * BASE / 20) }
                //bornes
                if (d < 10) { d = 10 }
                if (d > 360) { d = 360 + 10 * int((0.1 * d - 36) / 8.0) }
                if (d > 180) { d = 180 + 10 * int((0.1 * d - 36) / 8.0) }
                //les comptes de la fin
                planning.push({ ID: module, type: 2, start: t + warmUp, lasts: d, points: d * 3 })
                p += d * 3.0
                t += d
                last_d += 3 * d
                purple += d

                texto = `<span class='speed'>A FOND pendant ${convert(int(d))}</span> ${formatTime(t)}`
                divTextos.innerHTML += `<li class="afondli" id="module${module}">${texto} (+${int(d * 3)}/${int(p)}points)</li>`;
                maxitruc += `<div class="afond" style="width:${int(1000 * d / pp)}px">${texto}</div>`

                if (rnd() < 0.333 && mode === 6) { wut++ } //one shot, il n'y a pas de pause pour les braves
                break;

            default:
                break;
        }//switch

    }//while

    purple = 1.1 * purple * pp / 4000 //le 1.1 c'est pour normaliser 1000p = 100 purple environ
    divTextos.innerHTML += `</ul><span class="speed">Total : ${int(p)}</span><br><br><br>`
    divTextos.innerHTML += `<span class="speed">Durée : ${convert(int(t))}</span><br><br><br>`
    divTextos.innerHTML += `<span class="speed purple">♦purple : ${int(purple)}</span><br><br><br>`
    divTextos.innerHTML += `</div>` //textos
    divTextos.innerHTML += `</div>` //container haut
    divTextos.innerHTML += `<div id="container">`
    let divCont = document.getElementById("container");
    divCont.innerHTML += `${maxitruc}`
    divTextos.innerHTML += `</div>`
    divTextos.innerHTML += `<div id="container2">`
    divTextos.innerHTML += `</div>`
    divTextos.innerHTML += `<div id="container3">`
    divTextos.innerHTML += `</div>`
    divb.innerHTML = `<button onclick="prepa()" id="button">Ok</button><button onclick="launch(${t})" id="buttonlaunch">Go !</button>`
    //console.log(moduleIs(500))
    console.log(planning)
}//prepa____________________________________________________________________________________________________________________________________________


//{ type: 0, start: t, lasts: d, points: int(d / 3) }
function launch(t) {
    let xmarcher = document.getElementById("marchez");
    let xcourez = document.getElementById("courez");
    let xafond = document.getElementById("afond");

    let warmUp = 0; // temps avant de lancer
    warmUp = Number(document.getElementById('warmup').value);
    let easy = Number(document.getElementById('easy').value);
    let z = -warmUp;
    let ps = [0.25 * t, 0.5 * t, 0.75 * t]

    /*
        for (let bleep = 1; bleep < t / 180; bleep++) {
            setTimeout(function () {
                let m = document.getElementById(`motiv${rint(1 + rnd() * 14)}`);
                m.play()
                //let bbb = document.getElementById("coucou");
                // bbb.play();
                console.log("bleepo ! ", bleep, bleep * 180 * 1000 + warmUp * 1000)
            }, bleep * 180 * 1000 + warmUp * 1000);
        }
    
        for (let zzz = 1; zzz < t / 60; zzz++) {
            setTimeout(function () {
                let div3 = document.getElementById("container3");
                div3.innerHTML += "X"
            }, zzz * 60 * 1000 + warmUp * 1000);
        }
    */
    //console.log(ps)
    function pauseStuff() {
        if (easy > 60) {
            for (let i = 0; i < 3; i++) {
                let pauseTime = ps[i]
                if (moduleAt(pauseTime).type === 0) {//si c'est une pause on va a la moitié du module d'apres
                    pauseTime = moduleAt(pauseTime).start + moduleAt(pauseTime).lasts//recup debut du module d'apres
                    pauseTime += moduleAt(pauseTime).lasts / 2 //plus la moitié 
                }
                console.log(`PAUSE ${i + 1} @`, pauseTime, convert(pauseTime))
                setTimeout(function () {
                    let x000 = document.getElementById("marchez");
                    x000.play();
                }, pauseTime * 1000);
                setTimeout(function () {
                    let x000 = document.getElementById("courez");
                    x000.play();
                    //console.log((pauseTime + easy / 6) * 1000 + 1000 * warmUp)
                }, (pauseTime + easy / 6) * 1000);
            }
        }
    }

    //pauseStuff()

    let chronoStuff = setInterval(function () {
        z++;
        if (z >= t + 1000) { clearInterval(chronoStuff) }
        document.getElementById("timing").innerHTML = formatTime(z)
    }, 1000);

    document.getElementById("buttonlaunch").hidden = true;
    let divCont = document.getElementById("container2");
    for (let num in planning) {
        let module = planning[num]

        if (module.type === 0) {
            setTimeout(function () {

                xmarcher.play();
                divCont.innerHTML += `<b>Marcher ${convert(module.lasts)} lancé</b><br><br>`
                updateModule(num)
                current = "MARCHER"
            }, 1000 * (module.start));
            if (module.lasts >= 180) {
                setTimeout(function () {
                    let xx = document.getElementById("PSSH1min.mp3");
                    xx.play();
                }, 1000 * (module.start + module.lasts - 60) - 100);
            }
        }
        if (module.type === 1) {
            setTimeout(function () {

                xcourez.play();
                divCont.innerHTML += `<b>Courez ${convert(module.lasts)} lancé</b><br><br>`
                updateModule(num)
                current = "COURIR"
            }, 1000 * (module.start));
            if (module.lasts >= 600 && module.lasts < 1500) {
                setTimeout(function () {
                    let xx = document.getElementById("Happening3min");
                    xx.play();
                }, 1000 * (module.start + module.lasts - 180) - 100);
            }
            if (module.lasts >= 1500) {
                setTimeout(function () {
                    let xxx = document.getElementById("Happening10min");
                    xxx.play();
                }, 1000 * (module.start + module.lasts - 600) - 100);
            }
        }
        if (module.type === 2) {
            setTimeout(function () {

                divCont.innerHTML += `<b>A Fond ${convert(module.lasts)} lancé</b><br><br>`
                updateModule(num)
                xafond.play();
                current = "AFOND"
            }, 1000 * (module.start));
            if (module.lasts >= 60) {
                setTimeout(function () {
                    let xx = document.getElementById("Happening1min");
                    xx.play();
                }, 1000 * (module.start + module.lasts - 60) - 100);
            }
        }
        //console.log(module.lasts, module.points)
    }
    //mettre le 25% etc ici

    setTimeout(function () {
        let x25 = document.getElementById("25pc");
        x25.play();

    }, 250 * (t) + 1000 * warmUp);

    setTimeout(function () {
        let x50 = document.getElementById("50pc");
        x50.play();

    }, 500 * (t) + 1000 * warmUp);

    setTimeout(function () {
        let x75 = document.getElementById("75pc");
        x75.play();

    }, 750 * (t) + 1000 * warmUp);

    setTimeout(function () {
        let xfin = document.getElementById("GG");
        xfin.play();
        divCont.innerHTML += `<b>Gagné !</b><br><br>`
    }, 1000 * (warmUp + t));

} //launch

function updateModule(num) {
    let element = document.getElementById(`module${1 * num + 1 * 1}`);
    let prevElement = document.getElementById(`module${1 * num}`);
    //console.log(`module${1 * num + 1 * 1}`)
    if (num >= 1) {
        prevElement.classList.remove("current")
    }

    element.classList.add("finished");
    element.classList.add("current");
}

function int(n) {
    return Math.floor(n);
}

function abs(n) {
    return Math.abs(n);
}

function rrr(p = 1) {
    return Math.pow(Math.random(), p);
}

function signrand() {
    if (rrr() >= 0.5) { return 1; } else { return -1; }
}

function rnd(p = 1) {
    let seed;
    if (typeof (p) !== "string") { seed = Math.pow(Math.random(), p); }
    switch (p) {
        case 'Gauss':
            seed = .5 + .5 * (rrr(3) - rrr(3));
            break;
        case 'Anti-Gauss':
            let base = signrand();
            seed = 0.5 * (base + 1) - base * rrr(3);
            break;
        case 'Twisted':
            seed = (rrr() - rrr(1.5)) * (rrr() / rrr(2));
            break;
        case 'Dice':
            let base2 = Math.floor(rnd() * 6) + 1;
            seed = (base2 + signrand() * rrr(3)) / 7.0;
            break;
        case 'Time':
            let d = new Date();
            let h = d.getHours();
            let pow = 8 / (1 + h);
            seed = rrr(pow);
            break;
        default:
            break;
    }
    return seed;
}

function formatTime(timer) {
    let wup = timer < 0 ? "warm up !" : ""
    let getSeconds = `0${(Math.abs(timer) % 60)}`.slice(-2)
    let minutes = `${Math.floor(Math.abs(timer) / 60)}`
    let getMinutes = `0${minutes % 60}`.slice(-2)
    let getHours = `0${Math.floor(Math.abs(timer) / 3600)}`.slice(-2)
    Number(getSeconds) < 0 ? 0 : getSeconds
    Number(getMinutes) < 0 ? 0 : getMinutes
    Number(getHours) < 0 ? 0 : getHours
    return `${getHours} h ${getMinutes} m ${getSeconds} ${wup}`
}

function convert(t) {
    let r = t
    if (t < 60) {
        r = t + " secondes"
    }
    if (t >= 60) {
        r = int(t / 60) + " min " + (t % 60) + " sec"
    }
    if (t >= 3600) {
        r = int(t / 3600) + " h " + int((t / 60) % 60) + " min " + int((t % 60) % 60) + " sec"
    }
    return r
}

function rint(n) {
    let wat = n;
    let num = n - Math.floor(n);
    if (Math.random() < num) { wat++; }
    return Math.floor(wat);
}
