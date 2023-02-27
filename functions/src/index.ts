import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import express = require('express')
import cors = require('cors')

const serviceAccount: any = {
  type: 'service_account',
  project_id: 'prjfood-dc319',
  private_key_id: 'f25fb3ca92944c37f6fac1ad6c0446936386614c',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDg7C1Q7YbAmfg\n/vWrbwThDXMcfxi36C16uZlA+Zb+TA+ZZ0ii+RIJXWI0YK0O+uZq0kwaTnt85NXL\nL0fMqWvruPqc6JfKESuEma4wl70aXu1wGVDZNTDiiUF6a7ACrDG8aK8enh7HsLMU\ngB+yDfs+Am0CyEuMzyc+89DSlslQeS5UgXaZmiW9y/+26kNT63uqLrw2rKptNyk/\nppIsjIBLa5/3V+32HVB2eIxJX7SNek/d9e0KKHsScutnpW1UdjB7Mbcc7X1F1V6r\nmWxSqRjqtDP0uYkV3K8ZFU+M4hKkxhbJ4TBSfpY1gF5iesPFfkxDz4sc/JfwayLK\n2EsJFgRvAgMBAAECggEAOvBdml9FrAG/J/wkOiB3I5MG4w3LeVFUOH1v3j7/jjyG\nrVON+ZdFIS6WFr0YHn5zbLtltr53CpD/hEeGCQP/5Sk334pci80+RbSAZuSvXJ5G\nTLdNAJXA3WHMK+f/wOaA/c+/DudS1xcE/Uach3Qgi7J2g1K3N8URCzC8AGf1Wz0M\nqvZRlITMqfVGtbJWFODUsf4BGFghiaDek5AKBfs8bAzK9yoA/Rgv3oRJhaFLEO7N\n6qhT1abtRcrhMPAvGGyFyB4nvMuZCJCWXwcUAGMCkZlQIMg9fLpes03txDGP+rYf\nVEbVk7vj45A1+ONfLRfIiAqvAlm5A6RrtLNsMLhKhQKBgQD/t6EAWs/B6NffiFyp\n/1UHPfcnr5NwuQ1NM4MWEoU733uvxBcVUIZE6VxHEPpAH5iSOiQpfQlB8QKHTdUV\nKtg2ZUz4MVua6tzhaBKtSbYHoAif3rsCyTenCongdGFe4pW+Q/fyU26PceJIkcJ0\nOtcJRym8vGre7DcrEErn+rFKJQKBgQDDuwXxEUjUVZK4VQzO43e0fqJMlpSDeAwU\neQ228U4lwN2518w+b2yfM8cQ7innpY52lH5hew/bMmy3u4qRABlRtD6iuYkdMB4m\n4R6KH1V4J8vDOZqXQvKXUMh2z3tDoAFFDIOiwvBjcfMvUkYPsVUy1LI0wYxwDZKC\nbVDefxmuAwKBgGV144Czh2lFzJlZjoK413DXKkBpzpNUKS3veVyBnrGB256CrDH9\n0Dh5au6bkt9saeni/cQkY07xpHIw9JHAfScgDGkRlGokM92PoJF3BK2D1sgv5H2X\nfuhdKxWOt6+hMY7bgv54Eg8CPalThBb/3aBFxw6mp7Spfr4sabwfYMatAoGALgXh\n5cc8qsDcWP+WnWcbFJPaMcwOa8Nkg8PbF7MxvurUuAgn/F5S2jRgkHiP3eotz3An\nL2CyX8ZBjgpJEMNHMNEDEVwzA2v3CwlQFwY7IJ+q5+K5mOujAzV5jYZH46TR55yD\nr1fLEncOyYe89Z+q+uLMbF8+WHK4inaN12NndGUCgYEA7bONoywHM1guq+MtpknT\ntBftgQlYTTbdpe1E2P4JUK1wT/ELPtYd1N/+FAYLQwBADZ5Vvoo4WmngsFitRrfc\ndiBEMeXm/J6c6Pk6yzJs26EqQUdu5qgpa5SkktKjA+qF+dzgyjJuAsD0tCB3y8vL\nVgeWo/yXVuZQZNqOv0klkKs=\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-y9j0n@prjfood-dc319.iam.gserviceaccount.com',
  client_id: '115841239232355199812',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-y9j0n%40prjfood-dc319.iam.gserviceaccount.com',
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
const app = express()

app.use(cors({ origin: true }))

// users
// all users
app.get('/users', (req, res) => {
  db.collection('users').onSnapshot((querySnapshot) => {
    const users: any = []
    querySnapshot.forEach((doc) => {
      users.push({
        userId: doc.data().userId,
        email: doc.data().email,
        firstname: doc.data().firstname,
        lastname: doc.data().lastname,
        phone: doc.data().phone,
        address: doc.data().address,
        role: doc.data().role,
      })
    })
    return res.json(users)
  },
  )
})

exports.app = functions.https.onRequest(app)

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
