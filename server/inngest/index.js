import { Inngest } from "inngest";
import { prisma } from "../src/db.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "OrgFlow" });

//Inngest Function to save user data to the database
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

    //Innngest Function to delete user data from the database
    const syncUserDeletion = inngest.createFunction(
        {id: 'delete-user-with-clerk'},
        {event: 'clerk/user.deleted'},
        async ({ event }) => {
            const {data} = event;
            await prisma.user.delete({
                where: {
                    id: data.id,
                }
            })
        }
    );

    //Innngest Function to update user data in the database
    const syncUserUpdation = inngest.createFunction(
        {id: 'update-user-from-clerk'},
        {event: 'clerk/user.updated'},
        async ({ event }) => {
            const {data} = event;
            await prisma.user.update({
                where: {
                    id: data.id,
                },
                data: {
                    email: data?.email_addresses[0]?.email_address,
                    name: data?.first_name + " " + data?.last_name,
                    image_url: data?.image_url,
                }
            })
        }
    );



// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation
];
