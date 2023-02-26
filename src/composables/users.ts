export default function UserData() {
  return {
    async getAllUsers() {
      const result = await fetch('https://asia-southeast1-prjfood-dc319.cloudfunctions.net/app/users')
      const data = result.json()
      return data
    },
    async createUser(userId: string, email: string, firstname: string, lastname: string, phone: string, address: string[]) {
      try {
        const docRef = {
          userId,
          email,
          firstname,
          lastname,
          phone,
          address,
        }
        await fetch('https://asia-southeast1-prjfood-dc319.cloudfunctions.net/app/create/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(docRef),
        })
      }
      catch (e) {
        return e
      }
    },

    async updateUser(userId: string, firstname: string, lastname: string, phone: string) {
      try {
        const userRef = {
          firstname,
          lastname,
          phone,
        }
        await fetch(`https://asia-southeast1-prjfood-dc319.cloudfunctions.net/app/update/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userRef),
        })
      }
      catch (e) {
        return e
      }
    },

    // create address by user id
    async createAddressByUserId(userId: string, address: string[]) {
      try {
        await fetch(`https://asia-southeast1-prjfood-dc319.cloudfunctions.net/app/create/users/${userId}/address`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(address),
        })
      }
      catch (e) {
        return e
      }
    },

  }
}
