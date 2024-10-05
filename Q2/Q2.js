const fs = require('fs');
const csv = require('csv-parser');

function findMinPriceForFoodItems(filePath, foodItems) {
  const restaurantData = {};  

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const restaurantId = row['restaurant_id'];
      const price = parseFloat(row['price']);
      const foodItemsInRow = [
        row['food_item_1'],
        row['food_item_2'],
        row['food_item_3'],
        row['food_item_4'],
        row['food_item_5']
      ].filter(item => item);  

      if (!restaurantData[restaurantId]) {
        restaurantData[restaurantId] = {};
      }

      for (let foodItem of foodItemsInRow) {
        if (!restaurantData[restaurantId][foodItem] || restaurantData[restaurantId][foodItem] > price) {
          restaurantData[restaurantId][foodItem] = price;
        }
      }
    })
    .on('end', () => {
      let minPrice = null;
      let matchingRestaurantId = null;

      for (let restaurantId in restaurantData) {
        const foodAvailable = restaurantData[restaurantId];

        let allItemsPresent = true;
        let totalCost = 0;

        for (let item of foodItems) {
          if (foodAvailable[item] === undefined) {
            allItemsPresent = false;
            break;
          } else {
            totalCost += foodAvailable[item];
          }
        }

        if (allItemsPresent) {
          if (minPrice === null || totalCost < minPrice) {
            minPrice = totalCost;
            matchingRestaurantId = restaurantId;
          }
        }
      }

      if (matchingRestaurantId !== null) {
        console.log(`${matchingRestaurantId}, ${minPrice.toFixed(2)}`);
        console.log(restaurantData)
      } else {
        console.log('No matching restaurant found');
      }
    });
}

findMinPriceForFoodItems('./data2.csv', ['burger', 'jalapeno_poppers', 'extra_salsa']);
findMinPriceForFoodItems('./data2.csv', ['extreme_fajita']);
