import {
    addComicBook,
    deleteBook,
    getBooks,
    updateComicBook
} from "../controllers/comic.controller.js"

import { Router } from "express"

const router = Router()

// Router to add comic book to inventory
router.route('/addComicBook').post(addComicBook)
router.route('/comic-book/:id').delete(deleteBook)
router.route('/comic-book/:id').get(getBooks)
router.route('/update-book/:id').put(updateComicBook)

export default router