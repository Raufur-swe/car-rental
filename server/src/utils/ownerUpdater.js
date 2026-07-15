import carModel from "../model/car.model.js"
import Owner from "../model/owner.model.js"


export const UpdateOwner = async(userId)=>{

    const [totalCars , activeCars , inactiveCars] = await Promise.all([

        // how many car owner have
        carModel.countDocuments({
            owner : userId
        }),

        //how many active cars
        carModel.countDocuments({
            owner  : userId,
            status: "active"
        }) ,

           carModel.countDocuments({
            owner: userId,
            status: "inactive",
        }),


    ])

    // update db
    await Owner.findOneAndUpdate(

        {user : userId},
        {totalCars , activeCars , inactiveCars},
        {new : true}
    )

}