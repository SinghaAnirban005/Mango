import { z } from "zod"

const zodSchema = z.object(
    {
        bookName: z.string().min(1, "Book name is required."),
        authorName: z.string().min(1, "Author name is required."),
        yearOfPublication: z.number().int(),
        price: z.number().min(0, "Price must be a positive number."),
        discount: z.number().min(0).max(100).optional(),
        numberOfPages: z.number().min(1, "Must have at least one page."),
        condition: z.enum(['new', 'used'], { required_error: "Condition must be 'new' or 'used'." }),
        description: z.string().optional()
    }
)

export {
    zodSchema
}