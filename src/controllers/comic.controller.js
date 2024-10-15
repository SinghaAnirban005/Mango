import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

import { zodSchema } from "../validator/comic.validator.js"
import { z } from "zod"
import { Comic } from "../models/Comic.model.js" 

const addComicBook = asyncHandler(async(req, res) => {
    try {
        // Validate request body using Zod schema
        const validatedData = zodSchema.parse(req.body);

        // Creating a comic book collection
        const comicBook = await Comic.create(validatedData);

        if (!comicBook) {
            throw new ApiError(400, "Failed to add comic book in inventory");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    comicBook,
                    "Successfully added comic book"
                )
            );

    } catch (error) {
        if (error instanceof z.ZodError) {
           
            return res
                .status(400)
                .json(
                    {
                    status: 400,
                    message: "Validation error",
                    errors: error.errors 
                }
        );

        }
        
        throw new ApiError(500, "Server error :: " + error?.message);
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
        throw new ApiError(500, "Server error ::" + error?.message)
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
        throw new ApiError(500, "Server error ::" + error?.message)
    }
})

const updateComicBook = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params

        if(!id) {   
            throw new ApiError(400, "No book id found")
        }

        const data = req.body

        // Updates Book with an id using data
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
        throw new ApiError(500, "Something went wrong :: " + error?.message)
    }
})

const getInventory = asyncHandler(async(req, res) => {
    try {
        // Parsing into integer type since by default it is String
        const pages = parseInt(req.query.pages) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (pages - 1) * limit // Handling pagination

        const conditions = {}
        // here we will check for any provided parameters for filtering Books
        // Generally author, price, year and condition
        if(req.query.author){
            const authorSearch = req.query.author.trim().replace(/\s+/g, '\\s+');
            conditions.authorName = new RegExp(`\\b${authorSearch}\\b`, 'i'); // regex to match full words, ignoring case and handling extra spaces
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
        // sorting based on any one of the attributes of comic book model
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
        throw new ApiError(500, "Someting went wriing while fetching inventory ::" + error?.message)
    }
})

export {
    addComicBook,
    deleteBook,
    getBooks,
    updateComicBook,
    getInventory
}