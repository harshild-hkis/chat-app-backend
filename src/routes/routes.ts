import { Request, Response, Router } from "express";
import { createOrCheck, normalizeError } from "../service/userService";
import Message from "../model/message";
import User from "../model/user";

const router = Router();

router.post("/sign", async (req: Request, res: Response) => {
  return res.json(await createOrCheck(req.body));
});

router.get(
  "/message-list/:userId/:toUser",
  async (req: Request, res: Response) => {
    try {
      if (req.params?.userId) {
        const messages = await Message.find({
          $or: [
            { from: req.params.userId, to: req.params.toUser },
            { to: req.params.userId, from: req.params.toUser },
          ],
        })
          .populate("to", "userName")
          .populate("from");

        return res.json({
          message: "Message details",
          data: messages.map((item) => ({
            from: item.from.userName,
            to: item.to.userName,
            message: item.message,
            sendByYou: item.from._id.toString() === req.params.userId,
          })),
        });
      }

      return res.json({
        message: "Please login",
        data: null,
      });
    } catch (error) {
      return res.json({
        message: normalizeError(error),
        data: null,
      });
    }
  }
);

router.get("/user-list/:userId", async (req: Request, res: Response) => {
  const userList = await User.find({ _id: { $ne: req.params.userId } });
  return res.json({
    message: "User list",
    data: userList,
  });
});

export default router;
