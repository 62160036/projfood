<template>
  <Header />
  <div>
    <Dialog v-model:visible="showMessage" :breakpoints="{ '960px': '80vw' }" :style="{ width: '40%' }" position="top">
      <div class="d-flex align-items-center flex-column pt-6 px-3">
        <i class="pi pi-check-circle" :style="{ fontSize: '5rem', color: 'var(--green-500)' }" />
        <h5>Registration Successful!</h5>
        <div class="d-flex align-items-center flex-column pt-6 px-3" :style="{ lineHeight: 1.5, textIndent: '1rem' }">
          Your account is registered under username <b>{{ state.username }}</b>it'll be valid next 30 days without activation. Please check <b>{{ state.email }}</b> for activation instructions.
        </div>
      </div>
      <template v-slot:footer>
        <div class="flex justify-content-center">
          <Button label="OK" class="p-button-text" @click="toggleDialog" />
        </div>
      </template>
    </Dialog>

    <Card class="card-custom mt-5">
      <template v-slot:title>
        <div class="card-custom-title">
          Register
        </div>
      </template>
      <template v-slot:content>
        <form class="p-fluid" @submit.prevent="handleSubmit(!v$.$invalid)">
          <div class="row">
            <div class="col mb-4">
              <div class="p-float-label">
                <InputText id="username" v-model="v$.username.$model" :class="{ 'p-invalid': v$.username.$invalid && submitted }" />
                <label for="username" :class="{ 'p-error': v$.username.$invalid && submitted }">Username<span class="text-danger">*</span></label>
              </div>
              <small v-if="(v$.username.$invalid && submitted)" class="p-error">{{ v$.username.required.$message.replace('Value', 'Username') }}</small>
            </div>
            <div class="col mb-4">
              <div class="p-float-label p-input-icon-right">
                <i class="pi pi-envelope" />
                <InputText id="email" v-model="v$.email.$model" :class="{ 'p-invalid': v$.email.$invalid && submitted }" aria-describedby="email-error" />
                <label for="email" :class="{ 'p-error': v$.email.$invalid && submitted }">Email<span class="text-danger">*</span></label>
              </div>
              <span v-if="v$.email.$error && submitted">
                <span v-for="(error, index) of v$.email.$errors" id="email-error" :key="index">
                  <small class="p-error">{{ error.$message.replace('Value', 'Email') }}</small>
                </span>
              </span>
              <small v-else-if="(v$.email.$invalid && submitted) || v$.email.$pending.$response" class="p-error">{{ v$.email.required.$message.replace('Value', 'Email') }}</small>
            </div>
          </div>
          <div class="row">
            <div class="col mb-4">
              <div class="p-float-label">
                <Password id="password" v-model="v$.password.$model" :class="{ 'p-invalid': v$.password.$invalid && submitted }" toggleMask>
                  <template v-slot:footer>
                    <p class="mt-2">
                      Suggestions
                    </p>
                    <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                      <li>Minimum 8 characters</li>
                    </ul>
                  </template>
                </Password>
                <label for="password" :class="{ 'p-error': v$.password.$invalid && submitted }">Password<span class="text-danger">*</span></label>
              </div>
              <span v-if="v$.password.$error && submitted">
                <span v-for="(error, index) of v$.password.$errors" id="email-error" :key="index">
                  <small class="p-error">{{ error.$message.replace('Value', 'Password') }}</small>
                </span>
              </span>
              <small v-else-if="(v$.password.$invalid && submitted) || v$.password.$pending.$response" class="p-error">{{ v$.password.required.$message.replace('Value', 'Password') }}</small>
            </div>
            <div class="col mb-4">
              <div class="p-float-label">
                <Password id="confirmPassword" v-model="v$.confirmPassword.$model" :class="{ 'p-invalid': v$.confirmPassword.$invalid && submitted }" toggleMask :feedback="false" />
                <label for="confirmPassword" :class="{ 'p-error': v$.confirmPassword.$invalid && submitted }">Confirm Password<span class="text-danger">*</span></label>
              </div>
              <span v-if="v$.confirmPassword.$error && submitted">
                <span v-for="(error, index) of v$.confirmPassword.$errors" id="email-error" :key="index">
                  <small class="p-error">{{ error.$message.replace('Value', 'Confirm Password').replace('value', 'Confirm Password').replace('value', 'Password') }}</small>
                </span>
              </span>
              <small v-else-if="(v$.confirmPassword.$invalid && submitted) || v$.confirmPassword.$pending.$response" class="p-error">{{ v$.confirmPassword.required.$message.replace('Value', 'Confirm Password') }}</small>
            </div>
          </div>
          <div class="row">
            <div class="col mb-4">
              <div class="p-float-label">
                <InputText id="firstname" v-model="v$.firstname.$model" :class="{ 'p-invalid': v$.firstname.$invalid && submitted }" />
                <label for="firstname" :class="{ 'p-error': v$.firstname.$invalid && submitted }">Firstname<span class="text-danger">*</span></label>
              </div>
              <small v-if="(v$.firstname.$invalid && submitted)" class="p-error">{{ v$.firstname.required.$message.replace('Value', 'Firstname') }}</small>
            </div>
            <div class="col mb-4">
              <div class="p-float-label">
                <InputText id="lastname" v-model="v$.lastname.$model" :class="{ 'p-invalid': v$.lastname.$invalid && submitted }" />
                <label for="lastname" :class="{ 'p-error': v$.lastname.$invalid && submitted }">Lastname<span class="text-danger">*</span></label>
              </div>
              <small v-if="(v$.lastname.$invalid && submitted)" class="p-error">{{ v$.lastname.required.$message.replace('Value', 'Lastname') }}</small>
            </div>
          </div>
          <div class="row">
            <div class="col mb-4">
              <div class="p-float-label">
                <InputMask id="phone" v-model="v$.phone.$model" mask="999-999-9999" :class="{ 'p-invalid': v$.phone.$invalid && submitted }" />
                <label for="phone" :class="{ 'p-error': v$.phone.$invalid && submitted }">Phone<span class="text-danger">*</span></label>
              </div>
              <span v-if="v$.phone.$error && submitted">
                <span v-for="(error, index) of v$.phone.$errors" id="email-error" :key="index">
                  <small class="p-error">{{ error.$message.replace('Value', 'Phone') }}</small>
                </span>
              </span>
              <small v-else-if="(v$.phone.$invalid && submitted) || v$.phone.$pending.$response" class="p-error">{{ v$.phone.required.$message.replace('Value', 'Phone') }}</small>
            </div>
            <div class="col mb-4" />
          </div>
          <div class="row">
            <div class="col mb-4">
              <div class="p-float-label">
                <InputText id="address" v-model="v$.address.$model" :class="{ 'p-invalid': v$.address.$invalid && submitted }" />
                <label for="address" :class="{ 'p-error': v$.address.$invalid && submitted }">Address<span class="text-danger">*</span></label>
              </div>
              <small v-if="(v$.address.$invalid && submitted) || v$.address.$pending.$response" class="p-error">{{ v$.address.required.$message.replace('Value', 'Address') }}</small>
            </div>
          </div>
          <div class="row">
            <div class="col mb-4">
              <div class="p-float-label">
                <InputText id="sub_district" v-model="v$.sub_district.$model" :class="{ 'p-invalid': v$.sub_district.$invalid && submitted }" />
                <label for="sub_district" :class="{ 'p-error': v$.sub_district.$invalid && submitted }">Sub District<span class="text-danger">*</span></label>
              </div>
              <small v-if="(v$.sub_district.$invalid && submitted)" class="p-error">{{ v$.sub_district.required.$message.replace('Value', 'Sub District') }}</small>
            </div>
            <div class="col mb-4">
              <div class="p-float-label">
                <InputText id="district" v-model="v$.district.$model" :class="{ 'p-invalid': v$.district.$invalid && submitted }" />
                <label for="district" :class="{ 'p-error': v$.district.$invalid && submitted }">District<span class="text-danger">*</span></label>
              </div>
              <small v-if="(v$.district.$invalid && submitted)" class="p-error">{{ v$.district.required.$message.replace('Value', 'District') }}</small>
            </div>
          </div>
          <div class="row">
            <div class="col mb-4">
              <div class="p-float-label">
                <InputText id="province" v-model="v$.province.$model" :class="{ 'p-invalid': v$.province.$invalid && submitted }" />
                <label for="province" :class="{ 'p-error': v$.province.$invalid && submitted }">Province<span class="text-danger">*</span></label>
              </div>
              <small v-if="(v$.province.$invalid && submitted)" class="p-error">{{ v$.province.required.$message.replace('Value', 'Province') }}</small>
            </div>
            <div class="col mb-4">
              <div class="p-float-label">
                <InputText id="zip" v-model="v$.zip.$model" :class="{ 'p-invalid': v$.zip.$invalid && submitted }" />
                <label for="zip" :class="{ 'p-error': v$.zip.$invalid && submitted }">Zip<span class="text-danger">*</span></label>
              </div>
              <small v-if="(v$.zip.$invalid && submitted)" class="p-error">{{ v$.zip.required.$message.replace('Value', 'Zip') }}</small>
            </div>
          </div>

          <Button type="submit" label="Sign Up" class="mt-2 p-button-secondary" />
        </form>
      </template>
    </Card>
  </div>
  <Toast position="bottom-left" />
</template>

<script setup lang="ts">
import { email, minLength, numeric, required, sameAs } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, reactive, ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import InputMask from 'primevue/inputmask'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import Header from '../../components/Header/Header.vue'

interface RegisterState {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstname: string
  lastname: string
  phone: string
  address: string
  sub_district: string
  district: string
  province: string
  zip: string
}

const state = reactive<RegisterState>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstname: '',
  lastname: '',
  phone: '',
  address: '',
  sub_district: '',
  district: '',
  province: '',
  zip: '',
})

const rules = computed(() => {
  return {
    username: { required },
    email: { required, email },
    password: { required, minLength: minLength(8) },
    confirmPassword: { required, sameAsPassword: sameAs(state.password) },
    firstname: { required },
    lastname: { required },
    phone: { required },
    address: { required },
    sub_district: { required },
    district: { required },
    province: { required },
    zip: { required, numeric },
  }
})

const submitted = ref(false)
const showMessage = ref(false)

const v$ = useVuelidate(rules, state)
const resetForm = () => {
  state.username = ''
  state.email = ''
  state.password = ''
  state.confirmPassword = ''
  state.firstname = ''
  state.lastname = ''
  state.phone = ''
  state.address = ''
  state.sub_district = ''
  state.district = ''
  state.province = ''
  state.zip = ''
  submitted.value = false
}
const toast = useToast()
const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Success Message', detail: 'Successful registration', life: 3000 })
}
const showError = () => {
  toast.add({ severity: 'error', summary: 'Error Message', detail: 'Please fill in the required fields', life: 3000 })
}

const toggleDialog = () => {
  showMessage.value = !showMessage.value

  if (!showMessage.value)
    resetForm()
}

const handleSubmit = (isFormValid: any) => {
  submitted.value = true

  if (!isFormValid)
    return showError()
  showSuccess()
  toggleDialog()
}
</script>

<style lang="scss" scoped>
.card-custom {
  max-width: 1000px;
  margin: 0 auto;
  .card-custom-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 500;
  }
}
</style>
