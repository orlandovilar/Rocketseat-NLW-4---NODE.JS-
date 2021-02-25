import { Repository } from "typeorm";
import { EntityRepository } from "typeorm";
import { User } from "../models/User";

@EntityRepository(User)
class UsersRepository extends Repository<User> {}

export { UsersRepository };