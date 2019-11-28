const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("./carwashtogo_firebase.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://carwashtogo-454b2.firebaseio.com"
});

let db = admin.database();

exports.paqueteCreated = functions.database
    .ref("/paquetes/{pushId}")
    .onCreate(async evento => {
        const text = evento.val();
        const payload = {
            notification: {
                title: "notificacion de carwash to go",
                body: "te espera un nuevo paquete "
            }
        };
        var optios = {
            priority: "high"
        };

        var tokens = await getTokens();
        var toks = [];
        tokens.forEach(r => {
            toks.push(r.tokenDevice);
        });
        //envia notificacion a cada token de dispositivo
        // await admin.messaging().sendToDevice(toks, payload, optios).catch(err => console.log(err))
        return await admin
            .messaging()
            .sendToTopic("paquete")
            .catch(err => console.log(err));
    });

exports.promocionesCreated = functions.database
    .ref("promociones/{pushId}")
    .onCreate(async evt => {
        var m = evt.val();
        var tokens = await getTokens();
        var tks = [];
        tokens.forEach(r => {
            tks.push(r.tokenDevice);
        });
        let payload = {
            notification: {
                title: m.titulo,
                body: m.descripcion
            }
        };
        let priority = {
            priority: "high"
        };
        return await admin
            .messaging()
            .sendToTopic("promocion")
            .catch(error => {
                console.log(error);
            });
        // return await admin.messaging().sendToDevice(tks, payload, priority).catch(err => console.log(`error ${err}`));
    });

exports.compraRealizada = functions.database
    .ref("compras/{pushId}")
    .onCreate(async evt => {
        var m = evt.val();

        admin
            .messaging()
            .send(m)
            .catch(err => {
                console.log(err);
            });
    });

exports.paquetes = functions.https.onRequest((req, res) => {
    if (req.method === "POST") {
        const paquetes = db.ref("/paquetes");
        const paquete = req.body;
        paquetes
            .push(paquete)
            .then(res.json(paquete))
            .catch(err => res.json(err));
    }
});

async function getTokens() {
    var ref = db.ref("/tokens");
    let tokens = [];
    await ref.once("value", snapshot => {
        snapshot.forEach(snap => {
            tokens.push(snap.val());
        });
    });

    return tokens;
}