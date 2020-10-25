const {MongoClient} = require('mongodb');

const uri = "mongodb://joe:doe@localhost:27017/masterclass_project";
const client = new MongoClient(uri, {useUnifiedTopology: true});
const ObjectId = require('mongodb').ObjectID;

async function main() {
    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    }
}

async function getRestaurantById(restaurant_id) {
    return await client.db("masterclass_project").collection("restaurants")
        .findOne({_id: ObjectId(restaurant_id)})
}

async function createRestaurant(query) {
    const result = await client.db("masterclass_project").collection("restaurants")
        .insertOne(
            {name: query.name, long_coordinates: query.long_coordinates, lat_coordinates: query.lat_coordinates}
        );

    return `Insert new restaurant #${result.insertedId}`;

}

async function updateRestaurant(restaurant_id, query) {
    await client.db("masterclass_project").collection("restaurants")
        .updateOne(
            {_id: ObjectId(restaurant_id)},
            {
                $set: {
                    name: query.name,
                    long_coordinates: query.long_coordinates,
                    lat_coordinates: query.lat_coordinates
                }
            }
        );

    return `Edited restaurant #${restaurant_id}`;

}

async function deleteRestaurant(restaurant_id) {
    await client.db("masterclass_project").collection("restaurants")
        .deleteOne({_id: ObjectId(restaurant_id)});

    return `Deleted restaurant #${restaurant_id} successful.`;
}

async function findRestaurantsWithLocation(long_coordinates, lat_coordinates, max_distance) {
    await client.db("masterclass_project").collection("restaurants").createIndex({"location": "2dsphere"});

    result = await client.db("masterclass_project").collection("restaurants")
        .find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(long_coordinates), parseFloat(lat_coordinates)]
                    },
                    $maxDistance: parseInt(max_distance ? max_distance : 5000),
                    $minDistance: 0
                }
            }
        }).toArray();

    return result;
}

async function getAveragePrice() {
    const result = await client.db("masterclass_project").collection("restaurants")
        .aggregate(
            [
                {
                    $group:
                        {_id: "", avg_price: {$avg: "$price"}}
                }
            ]
        ).toArray();

    return `Average price for all the restaurants is ${result[0].avg_price}`;
}

async function getRestaurantRating() {
    return await client.db("masterclass_project").collection("restaurants")
        .aggregate(
            [{$project: {_id: "$_id", name: "$name", avg_stars: {$avg: "$reviews"}}}]
        ).toArray();
}

main().catch(console.error);

module.exports = {
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getAveragePrice,
    getRestaurantRating,
    findRestaurantsWithLocation
};