//-------------------------1. osa Ostukorv ---------------suurendaArtikkel

"use strict";

//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);

        if (!onKorvis) {
            lisaArtikkel(toode); // selle funktsiooni loome allpool
            korv.push(toode);
            nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
            fn_arvutaSumma(); //fn aruvtab ja kuvab makstava summa;
        }
    });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);
    lisaKorviJalus(); // selle funktsiooni lisame allpool
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => decreaseItem(toode, korvArtikkelD, lisaKorviNupp));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

//fn toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;
        }
    });
    fn_arvutaSumma(); //fn aruvtab ümber ja kuvab makstava summa;
}

//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks. 
// decreaseItem: kui kogus 0, siis enam ei vähenda (miinusesse)
function decreaseItem(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi && korvArtikkel.kogus >= 1) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = --korvArtikkel.kogus;
        }
    });
    fn_arvutaSumma(); //fn aruvtab ümber ja kuvab makstava summa;
}


//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;
    if (korv.length < 1) {
        document.querySelector('.korv-jalus').remove();
    }
    if (korv.length > 0) {
        fn_arvutaSumma(); //kui korv ei jäänud tühjaks siis arvuta Summa ringi;
    }
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => kassa()); //kui vajutab Maksma nuppu, käivitun fn kassa().
        document.querySelector('[data-action="kassa"]').addEventListener('click', fn_kassa_time); // mr: katsetus
    }
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    document.querySelector('.korv-jalus').remove();

    lisaKorviNupud.forEach(lisaOstukorviNupp => {
        lisaKorviNupp.innerText = 'Lisa ostukorvi';
        lisaKorviNupp.disabled = false;
    });
}

//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.
/*korv = [{nimi: "Kummikud", hind: "29", kogus: 2},{nimi: "Saapad", hind: "109",kogus: 1} ];*/

function fn_arvutaSumma(){
    let summa = 0;
    korv.forEach(function (korvArtikkel) {  //käib kõik ostukorvis olevad tooted läbi
        let hind = Number(korvArtikkel.hind); //text numbriks
        summa = summa + hind * korvArtikkel.kogus;
    });

    // Minu kood (lisaülesanne):
    // tarneviisi hinna lisamine makstavale lõppsummale

    //leia valitud radio nupp
    const valitudTarne = document.querySelector('input[name="tarneviis"]:checked');
    let tarneHind = 0;


    if (valitudTarne) { //kui tarneviis on valitud, siis võta selle value
        tarneHind = Number(valitudTarne.value);
    }

    // Toodete Summa + tarne hind
    let fn_loppSumma = summa + tarneHind; //

    //HTML/DOM-ist Maksma nupp, kui olmas, siis muudab nupu teksti
    const maksmaNupp = document.querySelector('[data-action="kassa"]');
    if (maksmaNupp) {
        maksmaNupp.innerText = "Maksma " + fn_loppSumma + " €";
    }
}


// Minu kood (lisaülesanne):
// tarneviisi muutmisel arvutatakse summa uuesti
const tarneviisid = document.querySelectorAll('input[name="tarneviis"]');
tarneviisid.forEach(function (tarneviis) {
    tarneviis.addEventListener("change", fn_arvutaSumma);
});



//-------------------------2. osa Taimer ------------------------

//taimer
function alustaTaimer(kestvus, kuva) { //kestvus on taimeriAeg=60*2=120min
    let start = Date.now(),
        vahe,
        minutid,
        sekundid;

    function taimer() {
        let vahe = kestvus - Math.floor((Date.now() - start) / 1000);
        let minutid = Math.floor(vahe / 60);
        let sekundid = Math.floor(vahe % 60);

        if (minutid < 10) {
            minutid = "0" + minutid;
        }
        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuva.textContent = minutid + ":" + sekundid;

        if (vahe < 0) {
            clearInterval(vahe);
            document.getElementById("time").innerHTML = "alusta uuesti";
        };
    };
    taimer();
    setInterval(taimer, 1000);
};


/*window.onload = function () {
    let taimeriAeg = 60 * 2,
    kuva = document.getElementById("time");
    alustaTaimer(taimeriAeg, kuva); //fn käivitamine
};*/


// katsetus: Taimer käivitub kui vajutatakse "Maksma" nuppu:
function fn_kassa_time() {
    let taimeriAeg = 60 * 2;
    let kuva = document.getElementById("time");

    alustaTaimer(taimeriAeg, kuva);
}


//-------------------------3. osa Tarne vorm ------------------------
const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const kinnitus = document.getElementById("kinnitus");
const telefon = document.getElementById("telefon");
const makseviis = document.getElementById("makseviis"); //minukood: yl 5.3.4
const errorMessage = document.getElementById("errorMessage");


form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    if (eesnimi.value.trim() === "") {
        errors.push("Sisesta eesnimi")
    }
  
    if (perenimi.value.trim() === "") {
        errors.push("Sisesta perenimi")
    }
    
    //minukood: yl 5.3.1
    if (/[0-9]/.test(eesnimi.value)) { //.test() regulaaravaldise meetod
        errors.push("Eesnimi ei tohi sisaldada numbreid");
    }
    if (/[0-9]/.test(perenimi.value)) {
        errors.push("Perenimi ei tohi sisaldada numbreid");
    }

    //minu kood: yl 5.3.2: 
    if (telefon.value.length < 6) { //telefon peab olema vähemalt 6 sümbolit.
        errors.push("Telefoni number peab olema vähemalt 6 numbrit pikk");
    }
    if (!/^[0-9]+$/.test(telefon.value)) {//peab sisaldama ainult numbreid
        errors.push("Telefoninumber tohib sisaldada ainult numbreid");
    }


    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    //minukood:yl 5.3.3: tarneviis peab olema valitud
    const tarneviis = document.querySelector('input[name="tarneviis"]:checked'); // ainult ühe kindla tarneviisi valiku jaoks;
    if (!tarneviis) {
        errors.push("Palun vali tarneviis");
    }

    // minu kood (yl 5.3.4): makseviis peab olema valitud
    if (makseviis.value === "") {
        errors.push("Palun vali makseviis");
    }

    if (errors.length > 0) {
        e.preventDefault();
        errorMessage.innerHTML = errors.join(', ');
    }
    else {
        errorMessage.innerHTML = "";
    }

})

/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
+ eesnime ja perenime väljal ei tohi olla numbreid;
+ telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
+ üks raadionuppudest peab olema valitud;
+ lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */



