
//json onporteren

let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if(this.readyState==4 && this.status == 200) {
        
       sorteerBoekObject.data = JSON.parse(this.responseText); 
       sorteerBoekObject.voegJSdatumIn();
       //de data moeten ook een eigeschap hebben waarbij de titels in kapitalen staan
       sorteerBoekObject.data.forEach(boek => {
           boek.titelUpper = boek.titel.toUpperCase();
           boek.sortAuteur = boek.auteur[0];
        
       });
       sorteerBoekObject.sorteren();
    }
}
xmlhttp.open('GET', "boeken.json", true);
xmlhttp.send();


// die van een maand string een nummer maakt
// waarbij januari een 0 geeft 
// en december een 11.
const geefMaandNummer = (maand) => {
    let nummer;
    switch (maand) {
        case "januari" : nummer : 0; break;
        case "feburuari" : nummer : 1; break;
        case "maart" : nummer : 2; break;
        case "april" : nummer : 3; break;
        case "mei" : nummer : 4; break;
        case "juni" : nummer : 5; break;
        case "juli" : nummer : 6; break;
        case "augustus" : nummer : 7; break;
        case "september" : nummer : 8; break;
        case "oktober" : nummer : 9; break;
        case "november" : nummer : 10; break;
        case "december" : nummer : 11; break;
    
        default: nummer: 0
           
    }
    return nummer;
}

//functie die een string van maand jaar omzet in een date-opject
const maakJSdatum = (maandJaar) => {
    let mjArray = maandJaar.split(" ");
    let datum = new Date(mjArray[1], geefMaandNummer(mjArray[0]));
    return datum;
}

//  funcite maakt van een array een opsomming met ,'s en 'en'
const maakOpsomming = (array) => {
    let string = "";
    for(let i=0; i<array.length; i++){
        switch (i) {
            case array.length-1 : string += array[i]; break;
            case array.length-2 : string += array[i] + " en "; break;
        
            default: string += array[i] + ", ";
            
        }
    }
    return string;
}

const keerTeksOm = (string) => {
    if(string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }
    return string;
}

// boject dat de boeken uitvoert ,
// eigen schappen : data, sorteer kenemrk
// methods: sorteren en uitvoeren
let sorteerBoekObject = {
    data : "",    //komt van de xmlttp.onreadeychNGE

    kenmerk: "titelUpper",

    // sorteer volorde en factor
    oplopend: 1,

    // method een datum opject toevoegen uit de string uitgave
    voegJSdatumIn: function() {
        this.data.forEach((item) => {
            item.jsDatum = maakJSdatum(item.uitgave)
        });
    },
    
    
    //data sorteren
    sorteren: function() {
        this.data.sort( (a,b) => a[this.kenmerk] > b[this.kenmerk] ? 1*this.oplopend : -1*this.oplopend );
        this.uitvoeren(this.data);
    },


    // de data in  tabel uitvoeren
    uitvoeren: function(data) {
        document.getElementById('uitvoer').innerHTML = "";
        data.forEach(boek => {
            let sectie = document.createElement('section');
            sectie.className = 'boekSelectie';

            let main = document.createElement('main');
            main.className = 'boekSelectie__main';
    
            // cover maken img
            let afbeelding = document.createElement('img');
            afbeelding.className = 'boek__cover';
            afbeelding.setAttribute('src', boek.cover);
            afbeelding.setAttribute('alt', keerTeksOm(boek.titel));

            let titel = document.createElement('h3');
            titel.className = 'boekSelectie__titel';
            titel.textContent = keerTeksOm(boek.titel);

            let auteurs = document.createElement('p');
            auteurs.className = 'boekSelectie__auteurs';

            boek.auteur[0]= keerTeksOm(boek.auteur[0]);

            auteurs.textContent = maakOpsomming(boek.auteur);
            let overig = document.createElement('p');
            overig.className = 'boekSelectie__overig';
    
            overig.textContent = boek.uitgave + ' | aantal paginas: ' + boek.paginas + ' | ' + boek.taal + ' | EAN: ' + boek.ean;

            // prijs
            let prijs = document.createElement('div');
            prijs.className = 'boekSelectie__prijs';
            prijs.textContent = boek.prijs.toLocaleString('nl-NL' , {currency: 'EUR', style: 'currency'});

            sectie.appendChild(afbeelding);
            main.appendChild(titel);
            main.appendChild(auteurs);
            main.appendChild(overig);
            sectie.appendChild(main);
            sectie.appendChild(prijs);
            document.getElementById('uitvoer').appendChild(sectie);

        });
    }

}
//keuze voor sorteer opties
let kenmerk = document.getElementById('kenmerk').addEventListener('change', (e) => {
    sorteerBoekObject.kenmerk = e.target.value;
    sorteerBoekObject.sorteren();
});

document.getElementsByName('oplopend').forEach((item) => {
item.addEventListener('click', (e)=>{
    sorteerBoekObject.oplopend = parseInt(e.target.value);
    sorteerBoekObject.sorteren();
})
})
