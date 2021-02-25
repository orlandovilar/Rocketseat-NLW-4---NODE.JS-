import { Repository } from "typeorm";
import { EntityRepository } from "typeorm";
import { Survey } from "../models/Survey";

@EntityRepository(Survey)
class SurveysRepository extends Repository<Survey> {}

export { SurveysRepository };