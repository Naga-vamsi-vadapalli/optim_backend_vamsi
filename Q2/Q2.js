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
      const foodItem1 = row['food_item_1'];
      const foodItem2 = row['food_item_2'];
      const foodItem3 = row['food_item_3'];
      const foodItem4 = row['food_item_4'];
      const foodItem5 = row['food_item_5'];

      

      if (!restaurantData[restaurantId]) {
        restaurantData[restaurantId] = {};
      }


      restaurantData[restaurantId][foodItem1] = price;
      restaurantData[restaurantId][foodItem2] = price;
      restaurantData[restaurantId][foodItem3] = price;
      restaurantData[restaurantId][foodItem4] = price;
      restaurantData[restaurantId][foodItem5] = price;

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

findMinPriceForFoodItems('./data2.csv', ['burger',	'jalapeno_poppers',	'extra_salsa']); 
findMinPriceForFoodItems('./data2.csv', ['extreme_fajita']);  
