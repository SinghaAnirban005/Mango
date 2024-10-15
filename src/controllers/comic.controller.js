import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

import { Comic } from "../models/Comic.model.js" 

const addComicBook = asyncHandler(async(req, res) => {
    try {
        const { bookName, authorName, yearOfPublication, price, discount, numberOfPages, condition, description } = req.body;

        if (!bookName || !authorName || !yearOfPublication || !price || !numberOfPages || !condition) {
            throw new ApiError(400, "Please provide the required fields")
        }

        const comicBook = await Comic.create(
            {
                bookName,
                authorName,
                yearOfPublication,
                price,
                discount: discount || 0,
                numberOfPages,
                condition,
                description
            }
        )

        if(!comicBook) {
            throw new ApiError(400, "Failed to add comic book in inventory")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                comicBook,
                "Succesfully added comic book"
            )
        )
    } catch (error) {
        throw new ApiError(500, error?.message)
    }
})

const deleteBook = asyncHandler(async(req, res) => {
    try {
        
    const { id } = req.params

    if(!id) {
        throw new ApiError(400, "id not available")
    }

    const trashBook = await Comic.findByIdAndDelete(id)

    if(!trashBook) {
        throw new ApiError('Book does not exist')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Comic book has been successfully deleted !"
        )
    )
    } catch (error) {
        throw new ApiError(500, error?.message)
    }
})


const getBooks = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params

        if(!id) {
            throw new ApiError(400, "id not available")
        }

        const comicBook = await Comic.findById(id)

        if(!comicBook) {
            throw new ApiError(400, "Comic Book does not exist")
        }


        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                comicBook,
                "Fetched details of comic Book"
            )
        )
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const updateComicBook = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params

        if(!id) {   
            throw new ApiError(400, "No book id found")
        }

        const data = req.body

        const updatedBook = await Comic.findByIdAndUpdate(
            id,
            data,
            {
                new: true
            }
        )

        if(!updatedBook) {
            throw new ApiError(400, "Comic book not found")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedBook,
                "Comic book has been successfully updated !!"
            )
        )

    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong !!")
    }
})

const getInventory = asyncHandler(async(req, res) => {
    try {
        const pages = parseInt(req.query.pages) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (pages - 1) * limit

        const conditions = {}

        if(req.query.author){
            const authorSearch = req.query.author.trim().replace(/\s+/g, '\\s+');
            conditions.authorName = new RegExp(`\\b${authorSearch}\\b`, 'i');
        }

        if(req.query.year){
            conditions.yearOfPublication = req.query.year
        }

        if(req.query.minPrice && req.query.maxPrice) {
            conditions.price = {
                $gte: req.query.minPrice,
                $lte: req.query.maxPrice
            }
        }   

        if(req.query.condition) {
            conditions.condition = req.query.condition
        }

        let sort={}

        if(req.query.sortBy) {
            const sortParameter = req.query.sortBy
            const sortOrder = req.query.order === 'desc' ? -1 : 1 // By default sort in ascending order

            sort[sortParameter] = sortOrder
        }
        else{
            sort = {
                bookName: 1 // by default we wil sort by bookName in ascending order 
            }
        }

        const book = await Comic.find(conditions)
                                .sort(sort)
                                .limit(limit) 
                                .skip(skip)

        const total = await Comic.countDocuments(conditions)

        return res
               .status(200)
               .json(
                new ApiResponse(
                    200,
                    {
                        pages,
                        total,
                        limit,
                        totalPages: Math.ceil(total / limit),
                        book
                    },
                    "Successfully fetched inventory"
                )
               )

    } catch (error) {
        console.log(error?.message)
        throw new ApiError(500, "Failed to get comics from inventory ")
    }
})

export {
    addComicBook,
    deleteBook,
    getBooks,
    updateComicBook,
    getInventory
}