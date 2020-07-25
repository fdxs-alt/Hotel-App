import express, { Request, Response, NextFunction } from 'express'
import { Hotel } from '../models/Hotel'
import { User } from '../models/User'
import { Images } from '../models/Images'
import HttpException from '../utils/httpExceptions'
import fs from 'fs'
import Upload, { dir } from '../utils/ImagesMiddleware'
import { validateEmail, validateTelephoneNumber, validateAccountNumber } from '../utils/Validation'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'
import { Op } from 'sequelize'
const upload = Upload.single('file')
const uploads = Upload.array('photo', 10)
const router = express.Router()
const phoneUtil = PhoneNumberUtil.getInstance()

const getAllHotels = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const allHotels = await Hotel.findAll()
        res.status(200).json(allHotels)
    } catch (error) {
        return next(new HttpException(500, 'An error occured'))
    }
}
const getHotel = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { hotelName } = req.params
    try {
        const specificHotel = await Hotel.findOne({ where: { hotelName } })
        if (!specificHotel) return next(new HttpException(400, "Hotel, which you are looking for, wasn't found"))
        res.status(200).json(specificHotel)
    } catch (error) {
        return next(new HttpException(500, 'An error occured'))
    }
}
const createHotel = (req: Request, res: Response, next: NextFunction): void => {
    upload(
        req,
        res,
        async (err: string): Promise<Response | void> => {
            if (err) return next(new HttpException(400, err))
            const { userId } = req.params
            const {
                hotelName,
                roomNumber,
                accountNumber,
                city,
                street,
                contactNumber,
                contactEmail,
                stars,
                iso2,
            } = req.body
            if (
                !hotelName ||
                !roomNumber ||
                !accountNumber ||
                !city ||
                !street ||
                !contactNumber ||
                !contactEmail ||
                !stars ||
                !iso2
            )
                return next(new HttpException(400, 'Fill all gaps'))
            if (req.file === undefined) return next(new HttpException(400, 'Select a image file'))
            if (!validateEmail(contactEmail)) return next(new HttpException(400, 'Invalid email'))
            if (!validateAccountNumber(accountNumber)) return next(new HttpException(400, 'Invalid account number'))
            if (!validateTelephoneNumber(contactNumber, iso2))
                return next(new HttpException(400, 'Invalid contact number'))
            if (hotelName.length > 100 || hotelName.length < 3)
                return next(new HttpException(400, 'Invalid hotel name'))
            if (roomNumber > 1000 || roomNumber < 10) return next(new HttpException(400, 'Invalid room number'))
            if (stars < 0 || stars > 5) return next(new HttpException(400, 'Invalid stars number'))
            try {
                const user = await User.findByPk(userId)
                if (!user) return next(new HttpException(400, "Can't verify user"))
                const validateHotel = await Hotel.findAll({
                    where: { [Op.or]: [{ hotelName }, { accountNumber }, { contactEmail }, { contactNumber }] },
                })
                if (validateHotel.length !== 0)
                    return next(new HttpException(400, 'Hotel with given cridentials already exists'))

                const newHotel = await Hotel.create({
                    hotelName,
                    roomNumber,
                    accountNumber,
                    city,
                    street,
                    contactNumber: phoneUtil.format(
                        phoneUtil.parseAndKeepRawInput(contactNumber, iso2),
                        PhoneNumberFormat.E164,
                    ),
                    contactEmail,
                    stars,
                    userId,
                    type: req.file.mimetype,
                    name: req.file.originalname,
                    data: fs.readFileSync(dir + req.file.filename),
                })
                await fs.writeFileSync(dir + 'temp/' + newHotel.name, newHotel.data)
                return res.status(200).json({ message: 'Hotel created succussfully', data: newHotel })
            } catch (error) {
                console.log(error)
                return next(new HttpException(500, 'Something went wrong'))
            }
        },
    )
}
const getAllPhotos = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { hotelId } = req.params
    try {
        const hotelImages = await Images.findAll({ where: { hotelId, roomId: null } })
        if (hotelImages.length === 0) return res.status(200).json({ message: 'There are no photos yet' })
        return res.status(200).json(hotelImages)
    } catch (error) {
        return next(new HttpException(500, 'Something went wrong'))
    }
}

const addPhotos = (req: Request, res: Response, next: NextFunction): void => {
    uploads(
        req,
        res,
        async (err: string): Promise<Response | void> => {
            const { hotelId } = req.params
            if (err) return next(new HttpException(400, err))
            if (req.files.length === 0) return next(new HttpException(400, 'You need to upload files'))

            try {
                const isHotel = Hotel.findByPk(hotelId)
                if (!isHotel) return next(new HttpException(400, "Can't find hotel"))
                ;(req.files as any).forEach(async (file: Express.Multer.File) => {
                    const image = await Images.create({
                        name: file.originalname,
                        type: file.mimetype,
                        data: fs.readFileSync(dir + file.filename),
                        hotelId,
                    })
                    await fs.writeFileSync(dir + 'temp/' + image.name, image.data)
                })
                return res.status(200).json({ message: 'Files has been sent successfully' })
            } catch (error) {
                return next(new HttpException(500, 'An error occured'))
            }
        },
    )
}
const deletePhoto = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { imageId } = req.params
    try {
        await Images.destroy({ where: { id: imageId } })
        res.status(200).json({ message: 'Image has been deleted succesfully' })
    } catch (error) {
        return next(new HttpException(500, 'An error occured'))
    }
}
export default { getAllHotels, getHotel, createHotel, getAllPhotos, addPhotos, deletePhoto }
