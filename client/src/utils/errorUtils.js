/**
 * Extract a human-readable error message from an Axios error object
 * @param {Object} err - The error object from a catch block
 * @param {string} fallback - A fallback message if no specific message is found
 * @returns {string} The error message
 */
export const getErrorMessage = (err, fallback = 'An unexpected error occurred') => {
    return (
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        fallback
    );
};

export default getErrorMessage;
