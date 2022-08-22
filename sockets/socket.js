const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band('Queen') );
bands.addBand( new Band('Bon Jovi') );
bands.addBand( new Band('Héroes del Silencio') );
bands.addBand( new Band('Metallica') );



io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands() );

    client.on('disconnect', () => {
        console.log('Cliente desconectado')
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje!!!', payload);
        io.emit('mensaje', { admin: 'Nuevo Mensaje' });
    });

    client.on('emitir-mensaje', (payload) => {
        console.log(payload);
        // io.emit('nuevo-mensaje', payload);
        client.broadcast.emit('nuevo-mensaje', payload);
    });
    client.on('vote-band', (payload) => {
        console.log(payload);
        // io.emit('nuevo-mensaje', payload);
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
    client.on('add-band', (payload) => {
        console.log(payload);
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });
    client.on('del-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
});
