// customer controller

import redisClient from "../config/redis.js";
import Trycatch from "../middleware/TryCatch.js";
import carModel from "../model/car.model.js";

export const customerController = {

    seeAllcars: Trycatch(async (req, res) => {

        // query pearamiter
        const {
            page = 1,
            limit = 12,
            search = "",
            category,
            brand,
            transmission,
            fuelType,
            minPrice,
            maxPrice,
            sort = "latest"

        } = req.query;

        //page and limit will come as string so we need to make it number
        const currentPage = Number(page)
        const pageLimit = Number(limit);

        // data fetching will start from which page

        const skip = (currentPage - 1) * pageLimit;


        //cache vertions

        const version = (await redisClient.get("cars:version")) || 1;

        // unique cash key

        const cacheKey = `cars:v${version}:${JSON.stringify(
              page,
    limit,
    search,
    category,
    brand,
    transmission,
    fuelType,
    minPrice,
    maxPrice,
    sort,
        )}`;

        // check redis

        const cache = await redisClient.get(cacheKey);


        if (cache) {

            // if cache hit then not to go on db

            return res.status(200).json({
                success: true,
                source: "redis",
                ...JSON.parse(cache)
            })
        }


        // query

        const query = {
            status: "active",
            isAvailable : true,
        }

        if (search) {
            // search title/model/brand

            query.$or = [

                {
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    model: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    brand: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ]
        }

        // filter

        if (category)
            query.category = category;

        if (brand)
            query.brand = brand;

        if (fuelType)
            query.fuelType = fuelType;

        if (transmission)
            query.transmission = transmission

        // price
        if (minPrice || maxPrice) {
            query.rentPerDay = {};

            if (minPrice)
                query.rentPerDay.$gte = Number(minPrice);
            if (maxPrice)
                query.rentPerDay.$lte = Number(maxPrice);
        }

        // sorting

        const sorting = {
            latest: { createdAt: -1 },
            oldest: { createdAt: 1 },

            "price-low": { rentPerDay: 1 },
            "price-high": { rentPerDay: -1 },
        };

        // if invalid sort it will latest use

        const sortBy = sorting[sort] || sorting.latest;


        const [cars, totalCars] = await Promise.all([

            carModel.find(query).populate("owner", "businessName ProfileImage").sort(sortBy).skip(skip).limit(pageLimit).lean(),

            carModel.countDocuments(query)
        ])

        //Final Response

        const response = {
            message: "car fetched successfully.",
            pagination: {
                totalCars,
                currentPage,
                totalPages: Math.ceil(
                    totalCars / pageLimit
                ),
                limit: pageLimit,
            },
            cars
        }

        // 5 minute cache

        await redisClient.set(
            cacheKey,
            JSON.stringify(response),
            {
                EX: 300,
            }
        )

        return res.status(200).json({
            success: true,
            source: "mongodb",
            ...response
        })

    })

}

