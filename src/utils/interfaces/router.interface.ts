import express from "express";
export interface Router {
    path: string;
    router: express.Router;
}