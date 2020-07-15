import { PhoneNumberUtil } from 'google-libphonenumber'
export const validateTelephoneNumber = (contactNumber: string, iso2: string): boolean => {
    const phoneUtil = PhoneNumberUtil.getInstance()
    const number = phoneUtil.parseAndKeepRawInput(contactNumber, iso2)
    if (!phoneUtil.isPossibleNumber(number) || !phoneUtil.isValidNumber(number)) return false
    return true
}
export const validateEmail = (email: string): boolean => {
    const emailValidator = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
    return emailValidator.test(email)
}
export const validateAccountNumber = (accountNumber: string): boolean => {
    const accountNumberValidator = new RegExp(/[0-9]{4}[0-9]{4}[0-9]{2}[0-9]{10}/)
    return accountNumberValidator.test(accountNumber)
}
