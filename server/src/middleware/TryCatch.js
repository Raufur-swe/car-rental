
const Trycatch = (handlar)=>{
    return async (req , res ,next)=>{
        try {
            await handlar(req , res , next)
        } catch (error) {
            console.error("========== ERROR ==========");
            console.error(error);
            console.error(error.stack);
            console.error("===========================");
            return res.status(500).json({
                message : error.message
            })
        }
    }
}

export default Trycatch