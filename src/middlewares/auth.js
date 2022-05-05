import { verify } from 'jsonwebtoken'

async function auth(req){
    const { authorization } = req.headers

    try {
        if(!authorization){
            throw Error
        }
        const user = verify(authorization, process.env.SECRET)
        
        return user

    } catch (error) {
        return {message: "Você não tem autorização para este recurso."}
    }
}

function can(permissions){
    return async (req, res, next) => {
        const user = await auth(req, res)
        if(user.message){
            return res.status(401).send({message: user.message})
        }
        const roles = []

        const existPermission = roles.some(({permission}) => 
            permissions.includes(permission.description)
        )

        if(!existPermission){
            return res.status(401).send({message: "Você não tem autorização para este recurso."})
        }
        next()
    }
}

export { can }
