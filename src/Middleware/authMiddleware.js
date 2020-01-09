const { AuthenticationError } = require("apollo-server");

const mustbeAuthenticated = async (resolve, root, args, context, info) => {
    if (!context.token || !context.token.active){
        throw new AuthenticationError("Must be authenticaticated");
    }
    return await resolve(root, args, context, info);
};

module.exports={
    mustbeAuthenticated

};
