import {query, mutation} from "./_generated/server"
import { captureError } from "./lib/sentry";


export const getMany = query({
    args: {},
    handler: async(ctx)=> {
        try{
            const users = await ctx.db.query("users").collect()
            return users
    } catch (error) {
        captureError(error, { function: "getMany users" });
        throw error;            
    }

    },
});

export const add = mutation({
    args:{},
    handler: async (ctx) =>{
        try {
            const identity = await ctx.auth.getUserIdentity();
            if (identity === null) {
                throw new Error("Not authenticated");
            }
            const orgId = identity.orgId as string;

            if(!orgId){
                throw new Error("Missing Organization");
            }
            throw new Error("Tracking test!");
            
            const userId = await ctx.db.insert("users", {
                name: "feisal",
            })
            return userId;
        } catch (error) {
            const identity = await ctx.auth.getUserIdentity();
            captureError(error, {
                function: "add",
                userId: identity?.subject,
                // orgId: identity?.orgId,
            });
            throw error; // Re-throw so client knows it failed
        }
    }
})

// export const add = mutation({
//     args:{},
//     handler: async (ctx) =>{
//         const identity = await ctx.auth.getUserIdentity();
//         if (identity === null) {
//             throw new Error("Not authenticated");
//     }
//         const orgId = identity.orgId as string;

//         if(!orgId){
//             throw new Error("Missing Organization");
//         }
  
//         const userId = await ctx.db.insert("users", {
//             name: "feisal",
//         })
//         return userId;
//     }
// })

