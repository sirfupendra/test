const express = require('express');
const app = express();

const axios = require('axios');
const cors = require('cors');

const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Define a window size
const WINDOW_SIZE = 10;

// Function to fetch numbers from the 3rd party API
const fetchNumbersFromAPI = async (type) => {
    try {
        let url = '';
        if (type === 'e') {
            url = 'http://20.244.56.144/evalutation-service/even';
        } else if (type === 'p') {
            url = 'http://20.244.56.144/evalutation-service/primes';
        } else if (type === 'r') {
            url = 'http://20.244.56.144/evalutation-service/rand';
        } else if (type === 'f') {
            url = 'http://20.244.56.144/evalutation-service/fibo';
        } else {
            throw new Error('Invalid type');
        }

        const response = await axios.get(url);
        return response.data.numbers || []; // Extract numbers from the response
    } catch (error) {
        console.error(`Error fetching numbers for type ${type}:`, error.message);
        return [];
    }
};

// Helper function to calculate the average
const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return (sum / numbers.length).toFixed(2);
};

// Route to handle numbers/:id
app.get('/numbers/:id', async (req, res) => {
    const { id } = req.params;

    // Simulate previous and current window states
    let windowPrevState = [];
    let windowCurrState = [];

    try {
        // Fetch numbers from the 3rd party API based on the type
        const numbers = await fetchNumbersFromAPI(id);

        // Add numbers to the current window
        windowCurrState = [...numbers];

        // If the current window size is less than the defined window size, fetch more numbers
        while (windowCurrState.length < WINDOW_SIZE) {
            const moreNumbers = await fetchNumbersFromAPI(id);

            // Break the loop if no new numbers are returned
            if (moreNumbers.length === 0) {
                console.warn(`No more numbers available from the API for type ${id}`);
                break;
            }

            windowCurrState = [...windowCurrState, ...moreNumbers];
        }

        // Trim the current window to match the window size
        windowCurrState = windowCurrState.slice(0, WINDOW_SIZE);

        // Calculate the average
        const avg = calculateAverage(windowCurrState);

        // Prepare the response
        const response = {
            windowPrevState,
            windowCurrState,
            numbers,
            avg
        };

        // Update the previous window state for the next request
        windowPrevState = [...windowCurrState];

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});