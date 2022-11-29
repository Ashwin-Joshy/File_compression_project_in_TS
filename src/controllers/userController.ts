import { Request, Response } from 'express';
class UserController {
  constructor() {}
  public static getAllUsers = (req: Request, res: Response) => {
    res.send('Hello World!');
  };
}
export default UserController;