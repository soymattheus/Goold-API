const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const CustomerController = require("../controllers/customer.controller");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const customerList = await CustomerController.getCustomerList();

  res.json(customerList);
});

router.put("/", authMiddleware, CustomerController.updateProfile);

module.exports = router;
