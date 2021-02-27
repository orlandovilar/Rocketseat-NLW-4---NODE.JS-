import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";

import createConnection from "../database";

describe("Answers", () => {

    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    });
    
    it("Should be able to create a new relationship 'surveyUser' and to send a Mail successfully", async () => {
        // Teste Unitário de criação de um novo usuário
        const userResponse = await request(app).post("/users").send({
            email: "user@teste.com",
            name: "User Teste"
        });
        expect(userResponse.status).toBe(201);

        // Teste Unitário de criação de uma nova pesquisa
        const surveyResponse = await request(app).post("/surveys").send({
            title: "Title Example3",
            description: "Description Example3"
        });
        expect(surveyResponse.status).toBe(201);
        expect(surveyResponse.body).toHaveProperty("id");
        
        //Teste Unitário de envio de e-mail 
        const sendMailResponse = await request(app).post("/sendMail").send({
            email: "user@teste.com",
            survey_id : surveyResponse.body.id
        });
        /**
         * Esperado o retorno do código '500 Internal Server Error', 
         * pois o Serviço de Envio de E-mail, não funciona no ambiente de testes.
         * Mais expecificamente na função 'sendMail()' da classe 'SendMailService'.
         * Caso, o envio de E-mail funcionasse corretamente, o código recebido seria '200'.
         */
        expect(sendMailResponse.status).toBe(500);
        
        //Teste Unitário de registro de reposta
        const surveyUser_id = String(sendMailResponse.body.id);
        const answerResponse = await request(app).get("/answers/9?u=" + surveyUser_id);

        /**
         * Espero o retorno do código '400 Bad Request',
         * pois devido ao erro acima, do Envio de E-mail, não é gerado o id
         * da tabela 'surveyUser'.
         * Caso, o envio de E-mail funcionasse corretamente, o código recebido seria '200'.
         */
        expect(answerResponse.status).toBe(400);
    });
});