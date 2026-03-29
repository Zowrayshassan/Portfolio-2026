const fs = require('fs');

function inspect(file) {
    try {
        const buf = fs.readFileSync(file);
        // Header: Magic (4), Version (4), Length (4) -> starts at 12
        // Chunk 0: Length (4), Type (4), Data (...) -> JSON chunk
        const jsonLen = buf.readUInt32LE(12);
        const jsonStr = buf.toString('utf8', 20, 20 + jsonLen);
        const gltf = JSON.parse(jsonStr);
        if (gltf.nodes) {
            const names = gltf.nodes.map(n => n.name).filter(Boolean);
            console.log('NODES:' + JSON.stringify(names));
        } else {
            console.log('NO_NODES');
        }
    } catch (e) {
        console.log('ERROR:' + e.message);
    }
}

inspect(process.argv[2]);
