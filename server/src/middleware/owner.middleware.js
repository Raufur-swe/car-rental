import Owner from "../model/owner.model.js"


const verifyOwner = async(req , res , next)=>{
    const owner = await Owner.findOne({
        user : req.user.id
    })

    if(!owner){

        return res.status(404).json({
            message:"Owner profile not found."
        });
    }


      if(owner.verificationStatus!=="approved"){

        return res.status(403).json({
            success:false,
            message:"Please verify your Trade License first."
        });

    }

    next()
}

export default verifyOwner