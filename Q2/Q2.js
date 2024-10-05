const fs = require('fs');
const csv = require('csv-parser'); 

function findMinPriceForFoodItems(filePath, foodItems) {
  const restaurantData = {};  

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const restaurantId = row['restaurant_id'];
      const price = parseFloat(row['price']);
      const foodItem = row['food_item_name'];

      if (!restaurantData[restaurantId]) {
        restaurantData[restaurantId] = {};
      }

      restaurantData[restaurantId][foodItem] = price;
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
      } else {
        console.log('No matching restaurant found');
      }
    });
}

findMinPriceForFoodItems('data.csv', ['burger', 'tofu_log']); 
findMinPriceForFoodItems('data.csv', ['chef_salad', 'wine_spritzer']);  
