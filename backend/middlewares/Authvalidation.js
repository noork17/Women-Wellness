const Joi = require('joi');

const signupvalidation = (req,res,next)=>{
    const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().email().required(),
        specialization: Joi.string().required(),
        hospitalName: Joi.string().required(),
        medicalId: Joi.string().required(),
        yearsOfExperience: Joi.number().integer().min(1).max(100).required(),
        password: Joi.string().required().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#%^~])[A-Za-z\d@$!%*?&_#%^~]{8,}$/),
        recaptcha:Joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)
            .json({message:"Bad request",error})
    }
    next();
}
const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        // Medical ID or email (admin@setv.local is not a public TLD — avoid strict .email() only)
        email: Joi.string().trim().min(3).max(255).required(),
        password: Joi.string().required().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#%^~])[A-Za-z\d@$!%*?&_#%^~]{8,}$/),
        recaptcha: Joi.string().allow(null, "").optional(),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: "Auth failed email or password is wrong", error });
    }
    next();
};
module.exports = {
    signupvalidation,
    loginValidation
}