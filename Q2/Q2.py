import csv

def find_exact_menu_and_min_price(file_path, food_items):
    restaurant_data = {}

    with open(file_path, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            restaurant_id = row['restaurant_id']
            price = float(row['price'])
            food_items_in_row = [
                row['food_item_1'],
                row['food_item_2'],
                row['food_item_3'],
                row['food_item_4'],
                row['food_item_5']
            ]
            food_items_in_row = list(filter(None, food_items_in_row))

            if restaurant_id not in restaurant_data:
                restaurant_data[restaurant_id] = {'prices': {}, 'menus': []}

            for item in food_items_in_row:
                restaurant_data[restaurant_id]['prices'][item] = price

            restaurant_data[restaurant_id]['menus'].append((price, food_items_in_row))

    matching_restaurant_id = None
    matching_price = float('inf')
    total_cost_individual = float('inf')

    for restaurant_id, data in restaurant_data.items():
        # Check for exact menu match first
        for menu_price, menu_items in data['menus']:
            if sorted(menu_items) == sorted(food_items):
                if menu_price < matching_price:
                    matching_price = menu_price
                    matching_restaurant_id = restaurant_id

    if matching_restaurant_id is None:
        # If no exact menu match is found, calculate individual prices
        for restaurant_id, data in restaurant_data.items():
            individual_costs = []

            for item in food_items:
                if item in data['prices']:
                    individual_costs.append(data['prices'][item])
                else:
                    individual_costs.append(float('inf'))

            total_cost_individual = sum(individual_costs)

            if all(item in data['prices'] for item in food_items):
                if total_cost_individual < matching_price:
                    matching_price = total_cost_individual
                    matching_restaurant_id = restaurant_id

    if matching_restaurant_id is not None and matching_price != float('inf'):
        print(f"{matching_restaurant_id}, {matching_price:.2f}")
    else:
        print("No matching restaurant found")

file_path = './data2.csv'
print("Test case 1:")
find_exact_menu_and_min_price(file_path, ['burger', 'extreme_fajita', 'extra_salsa'])
print("Test case 2:")
find_exact_menu_and_min_price(file_path, ['extreme_fajita'])
print("Test case 3:")
find_exact_menu_and_min_price(file_path, ['jalapeno_poppers', 'extra_salsa'])
