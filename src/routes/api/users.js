const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

router
  .route("/")
  .get(userController.getAll)
  .post(userController.create)
  .put(userController.update)
  .delete(userController.delete);

router.route("/:id").get(userController.getById);

module.exports = router;
