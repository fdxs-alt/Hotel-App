import { PhoneNumberUtil } from 'google-libphonenumber'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { secret } from '../config.json'
import { User } from '../models/User'
import HttpException from './httpExceptions'
import moment from 'moment'
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
export const validateIsHotelOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { authorization } = req.headers
    if (!authorization) return next(new HttpException(401, 'User unauthorized'))
    const token = authorization.split(' ')[1]
    try {
        const decoded = await jwt.verify(token, secret)
        const sub = (decoded as any).sub
        const user = await User.findByPk(sub)
        if (!user) return next(new HttpException(401, 'User unauthorized'))
        if (!user.isOwner) return next(new HttpException(401, 'You are not owner of the hotel'))
        next()
    } catch (error) {
        return next(new HttpException(401, 'User unauthorized'))
    }
}
export const getDates = (dateFrom: string, howManyDays: number): string[] => {
    const today = moment().format('YYYY-MM-DD')
    const fData = moment(dateFrom).format('YYYY-MM-DD')
    const tData = moment(dateFrom).add(howManyDays, 'days').format('YYYY-MM-DD')
    return [today, fData, tData]
}
