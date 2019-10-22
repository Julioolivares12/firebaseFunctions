const functions = require('firebase-functions');
const admin = require('firebase-admin');


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
var serviceAccount = require("./carwashtogo_firebase.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://carwashtogo-454b2.firebaseio.com"
});
/*
admin.messaging().send(mensaje).then((result) => {
    console.log(result)
}).catch((err) => console.Console())
*/

let db = admin.database()
let ref = db.ref('/tokens');
let toks = [];
//admin.messaging().sendToDevice("dHL33z7h7iA:APA91bHCDQN7sm89kHX_oBFQMkM1NqL9KxAI-yqv8fR0mfm4wEqOrblzYLMgnohxQdV3DTE3_y38SyhRnPYNeBGCKM9XpHPbxKucJQRtkhmDNwxwLN8BcM5bWP9oUhyzbyisJKe--NFg", payload, optios).catch(e => { console.log(e) })
/**
 * exports.paqueteCreated = functions.database.ref("/paquetes/{pushId}").onCreate(
    async (evento) => {
        var response = {
            text: evento.val(),
            payload: {
                notification: {
                    title: 'notificacion de carwash to go',
                    body: this.text
                }
            },
            optios: {
                priority: "high"
            },
            db: db,
            ref: ref,
            returndata: function (snapshot) {
                if (snapshot.exists()) {
                    snapshot.forEach(function (childSnapshot) {
                        var itm = childSnapshot.val();
                        itm.key = childSnapshot.key;
                        toks.push(itm)
                    });
                }
            }
        }

        response.ref.on("value", response.returndata);
        return await admin.messaging().sendToDevice(response.toks, response.payload, response.optios).catch(err => { console.log(err) })
    });
 */

exports.paqueteCreated = functions.database.ref("/paquetes/{pushId}").onCreate(
    async (evento) => {

        const text = evento.val()
        const payload = {
            notification: {
                title: "notificacion de carwash to go",
                body: "te espera un nuevo paquete "
            }
        }
        var optios = {
            priority: "high"
        }

        //var tokens = getToken();

        //var db = admin.database();
        //var ref = db.ref('/tokens');
        //var toks = [];


        //ref.on("value", function (snapshot) {if (snapshot.exists()) {toks = snapshotToArray(snapshot)}});
        return await admin.messaging().send(text).catch(err => { console.log("error" + " " + err) })

    });

function snapshotToArray(snapshot) {
    var array = [];
    snapshot.forEach(function (childSnapshot) {
        var itm = childSnapshot.val();
        itm.key = childSnapshot.key;
        array.push(itm)
    });
    return array;
}

exports.promocionesCreated = functions.database.ref('promociones/{pushId}').onCreate((evt) => {
    var m = evt.val()
    admin.messaging().sendToTopic('/promociones', m).then(r => { return r }).catch(err => { return err });
});

exports.compraRealizada = functions.database.ref('compras/{pushId}').onCreate((evt) => {
    var m = evt.val();

    admin.messaging().send(m).catch(err => { console.log(err) })
})

