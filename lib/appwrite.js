import { Client, Databases, Account, Avatars } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") 
  .setProject("69b6ca23000cfd8a5e56");
  

export const databases = new Databases(client);
export const account = new Account(client);
export const avatars = new Avatars(client);