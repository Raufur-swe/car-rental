import Trycatch from "../middleware/TryCatch";
import Owner from "../model/owner.model.js";


export const verificationController = {

    // driving upload
    uploadLicence: Trycatch(async (req, res) => {
        const { drivingLicense } = req.body

        // find owner

        const owner = await Owner.findOne({
            user: req.user.id
        })

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner not found"
            });
        }

        owner.drivingLicense.number = drivingLicenseNumber

        //  driving licence file upload

        owner.drivingLicense.document = req.file.path;

        owner.drivingLicense.submittedAt = new Data()

        owner.verificationStatus = 'pending'
        
        await owner.save()

        res.json({
            success : true ,
            message : "licence upload successfully"
        })
    }),

    adminApprove:Trycatch(async(req ,res)=>{
        const owner = await Owner.findById(req.params.id)

         if(!owner){
        return res.status(404).json({
            message:"Owner not found"
        });
    }

    owner.verificationStatus="approved";


    owner.verifiedAt =  new Date();

    

    await owner.save();

    res.json({
        success:true,
        message:"Owner verified."
    });



    }),

    rejectOwner:Trycatch(async(req ,res)=>{
            

    const owner=await Owner.findById(req.params.id);

    owner.verificationStatus="rejected";

    await owner.save();

    res.json({
        success:true
    });
    })
}