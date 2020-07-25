import { Request, Response, NextFunction } from 'express'
import { Hotel } from '../models/Hotel'
import { Room } from '../models/Room'
import HttpException from '../utils/httpExceptions'
import { Op } from 'sequelize'
import fs from 'fs'
import Upload, { dir } from '../utils/ImagesMiddleware'
import { Images } from '../models/Images'
const uploads = Upload.array('photo', 10)

const specificRoom = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { cost, capacity, numberOfBeds } = req.body

    try {
        const rooms = await Room.findAll({
            where: {
                capacity,
                costPerNight: {
                    [Op.lte]: cost,
                },
                numberOfBeds,
            },
        })
        if (rooms.length === 0) return next(new HttpException(400, "Can't find such a room"))
        return res.status(200).json(rooms)
    } catch (error) {
        next(new HttpException(500, 'An error occured'))
    }
}

const getAllPhotos = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { hotelId, roomId } = req.params
    try {
        const roomImages = await Images.findAll({ where: { hotelId, roomId } })
        if (roomImages.length === 0) return res.status(200).json({ message: 'There are no photos yet' })
        return res.status(200).json(roomImages)
    } catch (error) {
        next(new HttpException(500, 'An error occured'))
    }
}

const uploadPhotos = (req: Request, res: Response, next: NextFunction): void => {
    uploads(
        req,
        res,
        async (err: string): Promise<Response | void> => {
            const { hotelId, roomId } = req.params
            if (err) return next(new HttpException(400, err))
            if (req.files.length === 0) return next(new HttpException(400, 'You need to upload files'))
            try {
                const isRoom = await Room.findByPk(roomId)
                if (!isRoom) return next(new HttpException(400, "Can't find such a room"))
                ;(req.files as any).forEach(async (file: Express.Multer.File) => {
                    const image = await Images.create({
                        name: file.originalname,
                        type: file.mimetype,
                        data: fs.readFileSync(dir + file.filename),
                        roomId,
                        hotelId,
                    })
                    await fs.writeFileSync(dir + 'temp/' + image.name, image.data)
                    return res.status(200).json({ message: 'Files has been sent successfully' })
                })
            } catch (error) {
                console.log(error)
                return next(new HttpException(500, 'An error occured'))
            }
        },
    )
}

const addRoom = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { hotelId } = req.params
    const { roomNumber, costPerNight, capacity, numberOfBeds, description } = req.body
    if (!roomNumber || !costPerNight || !capacity || !numberOfBeds || !description)
        return next(new HttpException(400, 'Fill all required gaps'))
    if (capacity > 1000) return next(new HttpException(400, 'Capacity is too big for the room'))
    if (roomNumber > 10000) return next(new HttpException(400, 'Room number is too big'))
    if (numberOfBeds > 10) return next(new HttpException(400, 'Bed number is too big'))
    try {
        const hotel = await Hotel.findByPk(hotelId)
        if (!hotel) return next(new HttpException(400, "Can't verify hotel"))
        const chceckIfRoomExists = await Room.findOne({ where: { roomNumber } })
        if (chceckIfRoomExists) return next(new HttpException(400, 'Such a room already exists'))
        const newRoom = await Room.create({
            roomNumber,
            description,
            costPerNight,
            capacity,
            numberOfBeds,
            hotelId,
        })
        res.status(200).json({ message: 'Room created succesffuly', data: newRoom })
    } catch (error) {
        next(new HttpException(500, 'An error occured'))
    }
}

const getRoomById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { roomId } = req.params
    try {
        const room = await Room.findByPk(roomId)
        if (!room) return next(new HttpException(400, "Can't find such a room"))
        res.status(200).json(room)
    } catch (error) {
        next(new HttpException(500, 'An error occured'))
    }
}

const getAllRooms = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const rooms = await Room.findAll({})
        res.status(200).json(rooms)
    } catch (error) {
        next(new HttpException(500, 'An error occured'))
    }
}
export default { specificRoom, getAllPhotos, uploadPhotos, addRoom, getRoomById, getAllRooms }
