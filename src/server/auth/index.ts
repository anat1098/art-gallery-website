import NextAuth from "next-auth";
import { authConfig } from "./config";

const nextAuth = NextAuth(authConfig);

export const auth = nextAuth.auth;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export const GET = nextAuth.handlers.GET;
export const POST = nextAuth.handlers.POST;
