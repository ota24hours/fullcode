/**
 * Calculates pagination values for a given page number.
 * @param pageNumber The current page number.
 * @returns An object containing skip and limit values for pagination.
 * @throws {Error} If the page number is invalid (less than 1 or not a number).
 */
export const getPaginationValues = (
    pageNumber: string,
  ): {
    [x: string]: number; skip: number; limit: number 
} => {
    // Convert the page number to an integer.
    const page = parseInt(pageNumber);
  
    // Check if the page number is invalid.
    if (isNaN(page) || page < 1) {
      throw new Error("Invalid page number, start with 1");
    }
  
    // Get the pagination limit from the environment variable, defaulting to 0.
    const limit = parseInt(process.env.PAGINATION_LIMIT ?? "20");
  
    // Calculate the number of items to skip based on the page and limit.
    const skip = (page - 1) * limit;
  
    // Return an object with skip and limit values.
    return { skip, limit };
  };
  