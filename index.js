
require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() => {

    let opt;
    const busquedas = new Busquedas();
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad');

                //Buscar los lugares
                const lugares = await busquedas.ciudad( termino );

                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if( id === '0' ) continue;
                //guardar en DB
                const lugarSel = lugares.find( l=> l.id === id );
                busquedas.agregarHistorial(lugarSel.nombre);
                //Clima
                const clima = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);
                //Mostrar resultados

                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat );
                console.log('Lng:', lugarSel.lng );
                console.log('Temperatura:',clima.temp);
                console.log('Mínina:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como está el clima:', clima.desc.green);
                break;
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar,i)=>{
                    const idx = `${ i + 1 }.`.green;
                    console.log( `${ idx } ${ lugar }` );
                })
                break;
            default:
                break;
        }
        if(opt !== 0) await pausa();
    } while ( opt !== 0 );

}
main();