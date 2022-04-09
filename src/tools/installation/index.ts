// Init database
import '@database';
import registerLocations from './cities';

console.log('Install...');

async function main() {
    await registerLocations();
}

main();
