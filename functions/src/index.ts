import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

exports.addUserRole = functions.auth.user().onCreate(
  async (authUser) => {
    if (authUser.email) {
      const customClaims = {
        admin: false,
      }
      try {
        await admin.auth().setCustomUserClaims(authUser.uid, customClaims)

        return db.collection('users').doc(authUser.uid).update({
          role: customClaims,
        })
      }
      catch (error) {
        console.log(error)
      }
    }
    return true
  })

exports.setUserRole = functions.https.onCall(
  async (data, context) => {
    if (!context.auth?.token.admin)
      return { error: 'Only admins can add other admins' }

    try {
      await admin.auth().setCustomUserClaims(data.uid, data.role)

      return db.collection('users').doc(data.uid).update({
        role: data.role,
      })
    }
    catch (error) {
      console.log(error)
    }
    return true
  })
