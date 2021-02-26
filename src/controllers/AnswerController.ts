import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {
    async execute(request: Request, response: Response) {
        // http://localhost:3333/answers/1?u=bd1afae5-bd0b-4d77-be08-fc19a9bcb0e1
        /**
         * 
         */

         const { value } = request.params;
         const { u } = request.query;

         const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
         
         const surveyUser = await surveysUsersRepository.findOne({
            id: String(u),   
         });

         if(!surveyUser) {
             throw new AppError("Survey User does not exists!");
         }

         surveyUser.value = Number(value);

         await surveysUsersRepository.save(surveyUser);

         return response.json(surveyUser);
    }
}

export { AnswerController }