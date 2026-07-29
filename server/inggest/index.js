import { Inngest } from "inngest";
import { prisma } from "../src/db.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "OrgFlow" });

//Inggest Function to save user data to the database
const syncUserCreation = inngest.createFunction(
        {id: 'sync-user-from-clerk'},
        {event: 'clerk/user.created'},
        async ({ event }) => {
            const {data} = event;
            await prisma.user.create({
                data: {
                    id: data.id,
                    email: data?.email_addresses[0]?.email_address,
                    name: data?.first_name + " " + data?.last_name,
                    image_url: data?.image_url,
                }
            })
        }
    );

    

// Create an empty array where we'll export future Inngest functions
export const functions = [];
