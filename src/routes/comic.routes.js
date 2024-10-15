import {
    addComicBook,
    deleteBook,
    getBooks,
    updateComicBook,
    getInventory
} from "../controllers/comic.controller.js"

import { Router } from "express"

const router = Router()

router.route('/addComicBook').post(addComicBook) // Router to add comic book to inventory
router.route('/comic-book/:id').delete(deleteBook) // Router to delete a comic book based on ID
router.route('/comic-book/:id').get(getBooks) // Router to get Book details based on ID
router.route('/update-book/:id').put(updateComicBook) // Router to update book details of a particular id
router.route('/inventory').get(getInventory) // Router to get books based on certain conditions

export default router