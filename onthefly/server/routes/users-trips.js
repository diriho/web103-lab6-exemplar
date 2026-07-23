import express from 'express'
import {createTripUser, getTripUsers, getUserTrips} from '../controllers/users-trips.js'


const router = express.Router()

// routers
router.post('/create/:trip_id', createTripUser)
router.get('/users/:trip_id', getTripUsers)
router.get('/trips/:username', getUserTrips)

export default router