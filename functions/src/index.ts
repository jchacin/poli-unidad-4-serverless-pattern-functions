import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();
setGlobalOptions({maxInstances: 1});

export const getAuto = onRequest(async (request, response) => {
  try {
    const autoId = request.query.id;

    if (!autoId) {
      // Si no hay ID, enviamos un error 400 (Bad Request)
      response
        .status(400)
        .send("Error: Se requiere un 'id' para consultar un auto.");
      return;
    }

    const db = admin.firestore();
    const docRef = db.collection("vehiculos").doc(String(autoId));
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      // Si no existe, enviamos un error 404 (Not Found)
      response.status(404).send(`No se encontró el auto con ID: ${autoId}`);
    } else {
      response.status(200).json(docSnapshot.data());
    }
  } catch (error: any) {
    console.error("Error al consultar Firestore:", error);
    response.status(500).send("Error interno del servidor: " + error.message);
  }
});

export const getAllAutos = onRequest(async (request, response) => {
  try {
    const db = admin.firestore();
    const documents = db.collection("vehiculos");
    const documentsSnapshot = await documents.get();

    const autos = documentsSnapshot.docs.map((doc) => {
      return {...doc.data(), id: doc.id};
    });

    response.status(200).json(autos);
  } catch (error: any) {
    console.error("Error al consultar Firestore:", error);
    response.status(500).send("Error interno del servidor: " + error.message);
  }
});
