/**
 * Calculates the percentage change between the previous close price and the current close price.
 *
 * @param {Object} data - Data received from Yahoo Finance API.
 * @returns {string|null} The percentage change as a formatted string (e.g., "2.50" for +2.50%) or null if calculation fails.
 */
export function CalculatePercentChange(data) {
    try {
        // Extract the previous close price from meta
        if (data["chart"] && data["chart"]["result"] && data["chart"]["result"].length > 0) {
            const result = data["chart"]["result"][0];
            const meta = result["meta"];

            if (meta && meta["previousClose"] !== undefined) {
                const previousClose = meta["previousClose"];
                const priceData = result["indicators"]["quote"][0];

                if (priceData && priceData["close"]) {
                    const closePrices = priceData["close"];
                    const currentClose = closePrices[closePrices.length - 1]; // Close price of the current trading day

                    if (currentClose !== undefined) {
                        const percentageChange = ((currentClose - previousClose) / previousClose) * 100;
                        return percentageChange.toFixed(2);
                    }
                }
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}
