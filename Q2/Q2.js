const fs = require('fs');

function findExactMenuAndMinPrice(filePath, foodItems) {
    const restaurantData = {};

    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        const restaurantId = row[0];
        const price = parseFloat(row[1]);
        const foodItemsInRow = [
            row[2],
            row[3],
            row[4],
            row[5],
            row[6]
        ].filter(item => item); 

        if (!restaurantData[restaurantId]) {
            restaurantData[restaurantId] = { prices: {}, menus: [] };
        }

        foodItemsInRow.forEach(item => {
            restaurantData[restaurantId].prices[item] = price;
        });

        restaurantData[restaurantId].menus.push({ price, items: foodItemsInRow });
    }

    let matchingRestaurantId = null;
    let matchingPrice = Infinity;

    for (const [restaurantId, data] of Object.entries(restaurantData)) {
        for (const { price: menuPrice, items: menuItems } of data.menus) {
            if (JSON.stringify(menuItems.sort()) === JSON.stringify(foodItems.sort())) {
                if (menuPrice < matchingPrice) {
                    matchingPrice = menuPrice;
                    matchingRestaurantId = restaurantId;
                }
            }
        }

    }

    if (matchingRestaurantId === null) {
        for (const [restaurantId, data] of Object.entries(restaurantData)) {
            const individualCosts = foodItems.map(item => data.prices[item] || Infinity);
            const totalCostIndividual = individualCosts.reduce((a, b) => a + b, 0);

            if (individualCosts.every(cost => cost < Infinity)) {
                if (totalCostIndividual < matchingPrice) {
                    matchingPrice = totalCostIndividual;
                    matchingRestaurantId = restaurantId;
                }
            }
        }
    }else{
      let matchingPrice = matchingPrice*(foodItems.length)
    }

    if (matchingRestaurantId !== null && matchingPrice !== Infinity) {
        console.log(`${matchingRestaurantId}, ${matchingPrice.toFixed(2)}`);
    } else {
        console.log("No matching restaurant found");
    }
}

const filePath = './data2.csv';
console.log("Test case 1:");
findExactMenuAndMinPrice(filePath, ['burger', 'extreme_fajita', 'extra_salsa']);
console.log("Test case 2:");
findExactMenuAndMinPrice(filePath, ['extreme_fajita']);
console.log("Test case 3:");
findExactMenuAndMinPrice(filePath, ['jalapeno_poppers', 'extra_salsa']);
